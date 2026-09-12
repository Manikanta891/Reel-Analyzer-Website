/**
 * InstaReel Multi-AI Summarizer - Background Service Worker
 * Coordinates Instagram tab scraping, unsaving, Multi-AI automation (Gemini Web, ChatGPT Web, Meta AI Web), batch loops, and storage.
 */

console.log("[InstaReel-AI] Service Worker initialized.");

// Enable Chrome Side Panel to open when extension action icon is clicked
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error("[InstaReel-AI] Error setting side panel behavior:", error));
}

// Global Batch State
let batchState = {
  isRunning: false,
  mode: "summary", // "summary" | "unsave"
  provider: "meta", // "meta" | "gemini" | "chatgpt" (Meta AI is recommended default)
  targetCount: 5,
  processedCount: 0,
  currentStep: "idle", // "idle" | "skipping" | "scraping" | "generating" | "unsaving" | "saving" | "delay" | "done" | "error"
  statusMessage: "Idle",
  elapsedAISeconds: 0,
  lastProcessedUrl: ""
};

function broadcastState() {
  chrome.runtime.sendMessage({
    action: "BATCH_STATE_UPDATED",
    state: batchState
  }).catch(() => {
    // Side panel / popup may be closed
  });
}

function updateBatchState(partial) {
  batchState = { ...batchState, ...partial };
  broadcastState();
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_BATCH_STATE") {
    sendResponse({ success: true, state: batchState });
    return true;
  }

  // Start Batch Summarizer Loop
  if (request.action === "START_BATCH") {
    const target = parseInt(request.targetCount, 10) || 1;
    const autoUnsave = !!request.autoUnsave;
    const provider = request.provider || "meta";
    const customPrompt = request.customPrompt || "";
    startBatchLoop(target, autoUnsave, provider, customPrompt).then(res => sendResponse(res));
    return true;
  }

  // Start Simplified Batch Unsaver Loop (Count only, 1s delay)
  if (request.action === "START_BATCH_UNSAVE") {
    const count = parseInt(request.count, 10) || 10;
    startBatchUnsaveLoop(count).then(res => sendResponse(res));
    return true;
  }

  if (request.action === "STOP_BATCH") {
    stopBatchLoop();
    sendResponse({ success: true, message: "Batch loop stopping..." });
    return true;
  }

  if (request.action === "SCRAPE_IG") {
    handleScrapeIG().then(res => sendResponse(res));
    return true;
  }

  if (request.action === "UNSAVE_IG") {
    handleUnsaveIG().then(res => sendResponse(res));
    return true;
  }

  if (request.action === "SEND_AI") {
    handleSendAI(request.reelData, request.provider).then(res => sendResponse(res));
    return true;
  }

  if (request.action === "CHECK_AI_RESPONSE") {
    handleCheckAIResponse(request.provider).then(res => sendResponse(res));
    return true;
  }

  if (request.action === "NEXT_IG") {
    handleNextIG().then(res => sendResponse(res));
    return true;
  }

  if (request.action === "STEP_ONCE") {
    handleStepOnce(request.autoUnsave, request.provider).then(res => sendResponse(res));
    return true;
  }

  if (request.action === "SAVE_DATA") {
    saveReelData(request.data).then(res => sendResponse(res));
    return true;
  }

  if (request.action === "EXPORT_DATA") {
    exportData(request.format).then(res => sendResponse(res));
    return true;
  }

  if (request.action === "CLEAR_DATA") {
    chrome.storage.local.set({ reelsData: [] }, () => {
      sendResponse({ success: true, message: "Storage cleared." });
    });
    return true;
  }
});

/**
 * Starts the Batch Summarizer Loop
 */
async function startBatchLoop(targetCount, autoUnsave, provider = "meta", customPrompt = "") {
  if (batchState.isRunning) {
    return { success: false, error: "A batch process is already running!" };
  }

  updateBatchState({
    isRunning: true,
    mode: "summary",
    provider: provider,
    targetCount: targetCount,
    processedCount: 0,
    currentStep: "scraping",
    statusMessage: `Starting batch summary via ${getProviderDisplayName(provider)} (0/${targetCount})...`,
    lastProcessedUrl: ""
  });

  runSummaryBatchEngine(targetCount, autoUnsave, provider, customPrompt);
  return { success: true, message: `Batch summary started via ${getProviderDisplayName(provider)}.` };
}

/**
 * Starts the Simplified Batch Unsaver Loop (Count only, 1s cooldown)
 */
async function startBatchUnsaveLoop(count) {
  if (batchState.isRunning) {
    return { success: false, error: "A batch process is already running!" };
  }

  updateBatchState({
    isRunning: true,
    mode: "unsave",
    targetCount: count,
    processedCount: 0,
    currentStep: "unsaving",
    statusMessage: `Starting unsave (0/${count})...`,
    lastProcessedUrl: ""
  });

  runUnsaveBatchEngine(count);
  return { success: true, message: "Batch unsave started." };
}

/**
 * Stops any active batch loop
 */
function stopBatchLoop() {
  updateBatchState({
    isRunning: false,
    currentStep: "idle",
    statusMessage: "Batch process stopped by user."
  });
}

/**
 * Summary Batch Engine Loop (Random 1-3s adaptive delay)
 */
async function runSummaryBatchEngine(targetCount, autoUnsave, provider = "meta", customPrompt = "") {
  console.log(`[InstaReel-AI] Running summary batch (${getProviderDisplayName(provider)}) for ${targetCount} reels (Auto-Unsave: ${autoUnsave})...`);
  let consecutiveErrors = 0;

  while (batchState.isRunning && batchState.processedCount < targetCount) {
    const currentNum = batchState.processedCount + 1;

    try {
      // 1. Scrape Current Reel
      updateBatchState({
        currentStep: "scraping",
        statusMessage: `Reading reel ${currentNum} of ${targetCount}...`
      });

      let scrapeRes = await handleScrapeIG();
      
      // If same URL as previous reel, wait and retry navigation
      if (scrapeRes?.success && scrapeRes.data.url === batchState.lastProcessedUrl) {
        console.log("[InstaReel-AI] Same URL detected. Re-triggering Next navigation...");
        await handleNextIG();
        await sleep(1500);
        scrapeRes = await handleScrapeIG();
      }

      if (!scrapeRes || !scrapeRes.success) {
        throw new Error(scrapeRes?.error || "Please open any Reel in Instagram first.");
      }

      const reelData = scrapeRes.data;

      // 2. Submit to Selected AI Provider & Await Dynamic Completion
      updateBatchState({
        currentStep: "generating",
        elapsedAISeconds: 0,
        statusMessage: `Sending to ${getProviderDisplayName(provider)}...`
      });

      const sendRes = await handleSendAI(reelData, provider, customPrompt);
      if (!sendRes || !sendRes.success) {
        throw new Error(sendRes?.error || `Failed to send to ${getProviderDisplayName(provider)}.`);
      }

      const summaryText = await waitForAIWebResponse(provider, currentNum, targetCount);

      if (!batchState.isRunning) break;

      // 3. Save Processed Reel
      updateBatchState({
        currentStep: "saving",
        statusMessage: `Saving summary...`
      });

      const fullItem = {
        ...reelData,
        aiProvider: provider,
        geminiResponse: summaryText, // keeping field backwards-compatible for exports
        summary: summaryText,
        unsaved: autoUnsave
      };

      await saveReelData(fullItem);
      batchState.lastProcessedUrl = reelData.url;

      // 4. Optionally Unsave Reel
      if (autoUnsave) {
        updateBatchState({
          currentStep: "unsaving",
          statusMessage: `Unsaving reel...`
        });
        await handleUnsaveIG();
        await sleep(1000);
      }

      batchState.processedCount++;
      consecutiveErrors = 0;

      updateBatchState({
        processedCount: batchState.processedCount,
        statusMessage: `Saved! Moving to next...`
      });

      if (batchState.processedCount >= targetCount) break;

      // 5. Navigate to Next Reel with Random 1-3s Delay
      const randomDelaySec = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 seconds
      updateBatchState({
        currentStep: "delay",
        statusMessage: `Opening next reel...`
      });

      await advanceToNextReelVerified(reelData.url, randomDelaySec);

    } catch (err) {
      console.error(`[InstaReel-AI] Error on reel ${currentNum}:`, err);
      consecutiveErrors++;

      if (consecutiveErrors >= 3) {
        updateBatchState({
          isRunning: false,
          currentStep: "error",
          statusMessage: `Stopped: 3 consecutive errors (${err.message})`
        });
        return;
      } else {
        updateBatchState({
          statusMessage: `${err.message}. Retrying...`
        });
        await sleep(2000);
      }
    }
  }

  if (batchState.processedCount >= targetCount) {
    updateBatchState({
      isRunning: false,
      currentStep: "done",
      statusMessage: `🎉 Done! Summarized ${batchState.processedCount} reels via ${getProviderDisplayName(provider)}.`
    });
  } else if (batchState.isRunning) {
    updateBatchState({
      isRunning: false,
      currentStep: "idle",
      statusMessage: "Completed."
    });
  }
}

/**
 * Simplified Unsave Engine Loop (Count only, 1s delay)
 */
async function runUnsaveBatchEngine(count) {
  console.log(`[InstaReel-AI] Running unsave for ${count} reels...`);

  while (batchState.isRunning && batchState.processedCount < count) {
    const currentNum = batchState.processedCount + 1;

    try {
      updateBatchState({
        currentStep: "unsaving",
        statusMessage: `Unsaving reel ${currentNum} of ${count}...`
      });

      const scrapeRes = await handleScrapeIG();
      const currentUrl = scrapeRes?.data?.url || "";

      // Click Unsave
      const unsaveRes = await handleUnsaveIG();
      console.log(`[InstaReel-AI] Unsave Reel (${currentNum}/${count}):`, unsaveRes);

      batchState.processedCount++;
      updateBatchState({
        processedCount: batchState.processedCount,
        statusMessage: `Unsaved ${batchState.processedCount} of ${count}`
      });

      if (batchState.processedCount >= count) break;

      // Advance to next reel with fixed 1s delay
      await advanceToNextReelVerified(currentUrl, 1);

    } catch (err) {
      console.error(`[InstaReel-AI] Unsave error on reel #${currentNum}:`, err);
      updateBatchState({
        statusMessage: `Error unsaving: ${err.message}. Moving to next...`
      });
      await handleNextIG();
      await sleep(1000);
    }
  }

  if (batchState.processedCount >= count) {
    updateBatchState({
      isRunning: false,
      currentStep: "done",
      statusMessage: `🎉 Done! Unsaved ${batchState.processedCount} reels.`
    });
  }
}

/**
 * Advances Instagram to next reel and verifies DOM/URL has transitioned
 */
async function advanceToNextReelVerified(previousUrl, delaySeconds = 1) {
  await handleNextIG();

  // Wait configured delay
  for (let s = delaySeconds; s > 0; s--) {
    if (!batchState.isRunning) break;
    await sleep(1000);
  }

  // Verify transition
  if (previousUrl) {
    const checkScrape = await handleScrapeIG();
    if (checkScrape?.success && checkScrape.data.url === previousUrl) {
      console.log("[InstaReel-AI] Still on same reel after delay, dispatching navigation again...");
      await handleNextIG();
      await sleep(1000);
    }
  }
}

/**
 * Dynamically waits for Selected AI Web Tab (Gemini, ChatGPT, or Meta AI) to finish generating response.
 */
async function waitForAIWebResponse(provider, currentNum, targetCount, maxTimeoutSeconds = 120) {
  let elapsed = 0;
  let lastTextLength = 0;
  let stableCount = 0;
  const pollIntervalMs = 1500;
  const providerName = getProviderDisplayName(provider);

  // Initial wait of 2s to allow browser tab to receive message and start processing
  await sleep(2000);
  elapsed += 2;

  while (batchState.isRunning && elapsed < maxTimeoutSeconds) {
    await sleep(pollIntervalMs);
    elapsed += pollIntervalMs / 1000;

    updateBatchState({
      elapsedAISeconds: Math.round(elapsed),
      statusMessage: `[Reel ${currentNum}/${targetCount}] ${providerName} generating... (${Math.round(elapsed)}s)`
    });

    const checkRes = await handleCheckAIResponse(provider);
    
    if (checkRes && checkRes.success) {
      const currentLength = checkRes.textLength || (checkRes.text ? checkRes.text.length : 0);

      // Must not be currently generating, must have content > 30 chars, and must have waited at least 3.5s total
      if (!checkRes.isGenerating && currentLength > 30 && checkRes.completed) {
        if (currentLength === lastTextLength) {
          stableCount++;
        } else {
          stableCount = 0;
          lastTextLength = currentLength;
        }

        // Require 1 stable check after completion flag is true
        if (stableCount >= 1 && elapsed >= 3.5) {
          console.log(`[InstaReel-AI] ${providerName} finished in ${elapsed.toFixed(1)}s (Length: ${currentLength} chars).`);
          return checkRes.text;
        }
      } else {
        stableCount = 0;
        lastTextLength = currentLength;
      }
    }
  }

  if (elapsed >= maxTimeoutSeconds) {
    throw new Error(`${providerName} response generation timed out after ${maxTimeoutSeconds} seconds.`);
  }

  return "";
}

/**
 * Dynamically sends message to Instagram tab or re-injects content_ig.js if disconnected
 */
async function sendOrInjectIg(tabId, message) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (err) {
    console.log("[InstaReel-AI] Instagram content script disconnected. Dynamically re-injecting content_ig.js...");
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content_ig.js"]
      });
      await sleep(350);
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (injectErr) {
      console.error("[InstaReel-AI] Injection error:", injectErr);
      throw new Error("Could not connect to Instagram tab. Please refresh your Instagram page once.");
    }
  }
}

/**
 * Finds active Instagram tab and sends SCRAPE_REEL message
 */
async function handleScrapeIG() {
  const tabs = await chrome.tabs.query({ url: "*://*.instagram.com/*" });
  if (tabs.length === 0) {
    return { success: false, error: "No open Instagram tab found. Please open Instagram reels first." };
  }

  const activeIgTab = tabs.find(t => t.active) || tabs[0];
  try {
    const response = await sendOrInjectIg(activeIgTab.id, { action: "SCRAPE_REEL" });
    return response;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Finds active Instagram tab and sends UNSAVE_REEL message
 */
async function handleUnsaveIG() {
  const tabs = await chrome.tabs.query({ url: "*://*.instagram.com/*" });
  if (tabs.length === 0) {
    return { success: false, error: "No Instagram tab found." };
  }

  const activeIgTab = tabs.find(t => t.active) || tabs[0];
  try {
    const response = await sendOrInjectIg(activeIgTab.id, { action: "UNSAVE_REEL" });
    return response;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Sends CLICK_NEXT to Instagram tab
 */
async function handleNextIG() {
  const tabs = await chrome.tabs.query({ url: "*://*.instagram.com/*" });
  if (tabs.length === 0) {
    return { success: false, error: "No Instagram tab found." };
  }

  const activeIgTab = tabs.find(t => t.active) || tabs[0];
  try {
    const response = await sendOrInjectIg(activeIgTab.id, { action: "CLICK_NEXT" });
    return response;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Builds either custom or redesigned high-impact prompt for the given reel
 */
function buildPromptForReel(reelData, provider = "meta", customPrompt = "") {
  // If user provided a custom prompt
  if (customPrompt && customPrompt.trim()) {
    let userPrompt = customPrompt.trim();
    if (userPrompt.includes("{url}") || userPrompt.includes("{caption}") || userPrompt.includes("{author}") || userPrompt.includes("{audio}")) {
      return userPrompt
        .replace(/\{url\}/g, () => reelData.url || "")
        .replace(/\{author\}/g, () => reelData.author || "Unknown")
        .replace(/\{audio\}/g, () => reelData.audioTitle || "Original Audio")
        .replace(/\{caption\}/g, () => reelData.caption || "");
    } else {
      return `${userPrompt}

📌 Reel URL: ${reelData.url}
👤 Author: @${reelData.author}
🎵 Audio: ${reelData.audioTitle || 'Original Audio'}

--- REEL CONTENT & CAPTION ---
${reelData.caption}
------------------------------`;
    }
  }

  // Redesigned Default Prompts
  if (provider === "meta") {
    const captionSnippet = reelData.caption ? reelData.caption.substring(0, 350) : "";
    return `Summarize and extract key actionable insights from this Instagram Reel: ${reelData.url}

🎯 INSTRUCTIONS:
1. Core Breakdown: Summarize what this Reel is teaching/demonstrating in 2-3 concise sentences.
2. Tools & Tech Mentioned: List all libraries, tools, repositories, extensions, prompts, or methods with exact names.
3. Step-by-Step Actionables: Extract the exact workflow, code snippet, or implementation steps shown.
4. Key Takeaway: Why is this valuable and how can a developer/creator apply it immediately?

Format with clean markdown bullet points, bold keywords, and section headers.${captionSnippet ? `\n\n(Post context: ${captionSnippet})` : ''}`;
  } else {
    // Gemini & ChatGPT Prompt
    return `Analyze and extract actionable knowledge from the following Instagram Reel:

📌 Author: @${reelData.author}
🎵 Audio Track: ${reelData.audioTitle || 'Original Audio'}
🔗 Reel URL: ${reelData.url}

--- EXTRACTED POST SCRIPT, CAPTION & TEXT ---
${reelData.caption}
----------------------------------------------

🎯 INSTRUCTIONS:
1. Core Summary: Explain what is being demonstrated or taught in 2-3 concise sentences.
2. Tools, Tech & Resources: List every library, tool, extension, repository, prompt, or technique referenced.
3. Actionable Breakdown: Detail the step-by-step method, architecture, or code shown in the reel.
4. Key Takeaways: Provide high-yield bullet points for immediate practical application.

Format cleanly with markdown section headers, bold terms, and structured lists.`;
  }
}

/**
 * Formats prompt and dispatches to the selected AI Web Tab (Meta AI, Gemini, or ChatGPT)
 */
async function handleSendAI(reelData, provider = "meta", customPrompt = "") {
  const promptText = buildPromptForReel(reelData, provider, customPrompt);

  // Dispatch to specific provider tab
  if (provider === "chatgpt") {
    return await sendToChatGPTTab(promptText);
  } else if (provider === "meta") {
    return await sendToMetaAITab(promptText);
  } else {
    return await sendToGeminiTab(promptText);
  }
}

/**
 * Helper to communicate with AI tab or dynamically re-inject its content script if disconnected
 */
async function sendOrInjectAI(tabId, message, scriptFile) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (err) {
    console.log(`[InstaReel-AI] Re-injecting ${scriptFile} into tab ${tabId}...`);
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: [scriptFile]
      });
      await sleep(400);
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (injectErr) {
      return { success: false, error: `Could not connect to AI tab: ${injectErr.message}` };
    }
  }
}

/**
 * Gemini Web Tab Dispatcher
 */
async function sendToGeminiTab(promptText) {
  let tabs = await chrome.tabs.query({ url: "*://gemini.google.com/*" });
  let geminiTab;

  if (tabs.length === 0) {
    geminiTab = await chrome.tabs.create({ url: "https://gemini.google.com/app", active: false });
    await sleep(3500);
  } else {
    geminiTab = tabs.find(t => t.active) || tabs[0];
  }

  return await sendOrInjectAI(geminiTab.id, {
    action: "INJECT_PROMPT",
    promptText: promptText
  }, "content_gemini.js");
}

/**
 * ChatGPT Web Tab Dispatcher
 */
async function sendToChatGPTTab(promptText) {
  let tabs = await chrome.tabs.query({ url: ["*://chatgpt.com/*", "*://chat.openai.com/*"] });
  let chatgptTab;

  if (tabs.length === 0) {
    chatgptTab = await chrome.tabs.create({ url: "https://chatgpt.com/", active: false });
    await sleep(3500);
  } else {
    chatgptTab = tabs.find(t => t.active) || tabs[0];
  }

  return await sendOrInjectAI(chatgptTab.id, {
    action: "INJECT_PROMPT",
    promptText: promptText
  }, "content_chatgpt.js");
}

/**
 * Meta AI Web Tab Dispatcher
 */
async function sendToMetaAITab(promptText) {
  let tabs = await chrome.tabs.query({ url: ["*://www.meta.ai/*", "*://meta.ai/*"] });
  let metaTab;

  if (tabs.length === 0) {
    metaTab = await chrome.tabs.create({ url: "https://www.meta.ai/", active: false });
    await sleep(3500);
  } else {
    metaTab = tabs.find(t => t.active) || tabs[0];
  }

  return await sendOrInjectAI(metaTab.id, {
    action: "INJECT_PROMPT",
    promptText: promptText
  }, "content_meta.js");
}

/**
 * Checks AI Web Tab for completed response
 */
async function handleCheckAIResponse(provider = "gemini") {
  if (provider === "chatgpt") {
    const tabs = await chrome.tabs.query({ url: ["*://chatgpt.com/*", "*://chat.openai.com/*"] });
    if (tabs.length === 0) return { success: false, error: "ChatGPT tab not found." };
    const tab = tabs.find(t => t.active) || tabs[0];
    return await sendOrInjectAI(tab.id, { action: "EXTRACT_RESPONSE" }, "content_chatgpt.js");
  } else if (provider === "meta") {
    const tabs = await chrome.tabs.query({ url: ["*://www.meta.ai/*", "*://meta.ai/*"] });
    if (tabs.length === 0) return { success: false, error: "Meta AI tab not found." };
    const tab = tabs.find(t => t.active) || tabs[0];
    return await sendOrInjectAI(tab.id, { action: "EXTRACT_RESPONSE" }, "content_meta.js");
  } else {
    const tabs = await chrome.tabs.query({ url: "*://gemini.google.com/*" });
    if (tabs.length === 0) return { success: false, error: "Gemini tab not found." };
    const tab = tabs.find(t => t.active) || tabs[0];
    return await sendOrInjectAI(tab.id, { action: "EXTRACT_RESPONSE" }, "content_gemini.js");
  }
}

/**
 * Performs 1 full cycle step
 */
async function handleStepOnce(autoUnsave = false, provider = "gemini") {
  const scrapeRes = await handleScrapeIG();
  if (!scrapeRes || !scrapeRes.success) {
    return { success: false, step: "Scrape IG", error: scrapeRes?.error || "Failed to scrape reel" };
  }

  const reelData = scrapeRes.data;
  const sendRes = await handleSendAI(reelData, provider);
  if (!sendRes || !sendRes.success) {
    return { success: false, step: "Send AI", data: reelData, error: sendRes?.error || `Failed to send prompt to ${getProviderDisplayName(provider)}` };
  }

  if (autoUnsave) {
    await handleUnsaveIG();
  }

  return {
    success: true,
    step: `Prompt Submitted to ${getProviderDisplayName(provider)}`,
    provider: provider,
    reelData: reelData
  };
}

/**
 * Saves item to chrome.storage.local
 */
async function saveReelData(data) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ reelsData: [] }, (result) => {
      const reelsData = result.reelsData || [];
      const existingIdx = reelsData.findIndex(item => item.url === data.url);
      if (existingIdx >= 0) {
        reelsData[existingIdx] = data;
      } else {
        reelsData.push(data);
      }
      chrome.storage.local.set({ reelsData }, () => {
        resolve({ success: true, totalCount: reelsData.length });
      });
    });
  });
}

/**
 * Exports saved data as CSV or Markdown string
 */
async function exportData(format) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ reelsData: [] }, (result) => {
      const data = result.reelsData;
      if (!data || data.length === 0) {
        resolve({ success: false, error: "No data saved yet." });
        return;
      }

      if (format === "csv") {
        let csvContent = "Timestamp,AI Provider,Author,Reel URL,Caption,Summary & Transcript,Unsaved\n";
        data.forEach(item => {
          const row = [
            `"${item.timestamp || ''}"`,
            `"${item.aiProvider || 'gemini'}"`,
            `"${(item.author || '').replace(/"/g, '""')}"`,
            `"${(item.url || '').replace(/"/g, '""')}"`,
            `"${(item.caption || '').replace(/"/g, '""')}"`,
            `"${(item.geminiResponse || item.summary || '').replace(/"/g, '""')}"`,
            `"${item.unsaved ? 'Yes' : 'No'}"`
          ].join(",");
          csvContent += row + "\n";
        });
        resolve({ success: true, content: csvContent, filename: "instagram_reels_ai_summaries.csv" });
      } else {
        let mdContent = `# Instagram Reels Multi-AI Summaries Export\n\nExported on: ${new Date().toLocaleString()}\nTotal Reels: ${data.length}\n\n---\n\n`;
        data.forEach((item, idx) => {
          mdContent += `## Reel #${idx + 1}: @${item.author} ${item.unsaved ? '*(Unsaved)*' : ''}\n`;
          mdContent += `- **AI Provider**: ${item.aiProvider ? item.aiProvider.toUpperCase() : 'GEMINI'}\n`;
          mdContent += `- **URL**: [${item.url}](${item.url})\n`;
          mdContent += `- **Date**: ${item.timestamp}\n\n`;
          mdContent += `### Caption\n> ${item.caption.replace(/\n/g, '\n> ')}\n\n`;
          mdContent += `### AI Transcript & Summary\n${item.geminiResponse || item.summary || '_No summary extracted_'}\n\n`;
          mdContent += `---\n\n`;
        });
        resolve({ success: true, content: mdContent, filename: "instagram_reels_ai_summaries.md" });
      }
    });
  });
}

function getProviderDisplayName(provider) {
  if (provider === "chatgpt") return "ChatGPT";
  if (provider === "meta") return "Meta AI";
  return "Gemini";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

