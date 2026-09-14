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

// Set offboarding feedback survey URL when user removes extension
if (chrome.runtime && chrome.runtime.setUninstallURL) {
  chrome.runtime.setUninstallURL("https://reelanalyzer.manikanta.co.in/uninstall");
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
    chrome.storage.local.set({ reelsData: [], categoriesRegistry: [], knowledgeTaxonomy: {} }, () => {
      sendResponse({ success: true, message: "Storage cleared." });
    });
    return true;
  }

  if (request.action === "GET_CATEGORIES" || request.action === "GET_TAXONOMY") {
    getLivingTaxonomy().then(taxonomy => {
      sendResponse({ success: true, taxonomy: taxonomy, categories: Object.keys(taxonomy) });
    });
    return true;
  }

  if (request.action === "EXPORT_CATEGORY_PLAYBOOK") {
    exportCategoryPlaybook(request.category, request.subdomain).then(res => sendResponse(res));
    return true;
  }

  if (request.action === "EXPORT_ALL_PLAYBOOKS_ZIP") {
    exportAllPlaybooksAsZip().then(res => sendResponse(res));
    return true;
  }

  if (request.action === "OPEN_WEB_DASHBOARD") {
    const VAULT_URL = "https://reelanalyzer.manikanta.co.in/vault";
    chrome.tabs.create({ url: VAULT_URL, active: true }, () => {
      sendResponse({ success: true, url: VAULT_URL });
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
      
      // If same URL as previous reel, retry navigation up to 3 times
      let navRetries = 0;
      while (scrapeRes?.success && scrapeRes.data.url === batchState.lastProcessedUrl && navRetries < 3) {
        navRetries++;
        console.log(`[InstaReel-AI] Same URL detected. Retrying navigation (attempt ${navRetries}/3)...`);
        updateBatchState({
          statusMessage: `Advancing to next reel (attempt ${navRetries}/3)...`
        });
        await handleNextIG();
        await sleep(1800);
        scrapeRes = await handleScrapeIG();
      }

      // If STILL the same reel after 3 attempts, we have reached the end of the feed or are on a standalone reel page
      if (scrapeRes?.success && scrapeRes.data.url === batchState.lastProcessedUrl) {
        console.log("[InstaReel-AI] Unable to advance to a new reel. Ending batch cleanly.");
        updateBatchState({
          isRunning: false,
          currentStep: "done",
          statusMessage: `🎉 Done! Summarized ${batchState.processedCount} reels. (No further reels found.)`
        });
        break;
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

      const sendRes = await handleSendAI(reelData, provider, customPrompt, batchState.processedCount);
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
          // Check for AI safety refusal canned messages
          if (isAIRefusalMessage(checkRes.text)) {
            console.warn(`[InstaReel-AI] AI Provider returned a refusal response: "${checkRes.text.substring(0, 80)}..."`);
            throw new Error(`${providerName} declined to process this reel: "${checkRes.text.trim()}"`);
          }

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
 * Checks if the AI output is a canned safety / refusal response
 */
function isAIRefusalMessage(text) {
  if (!text) return false;
  const lower = text.toLowerCase().trim();
  const refusalPhrases = [
    "sorry, i can't help you with this",
    "sorry, i cannot help you with this",
    "sorry, i can't help with",
    "sorry, i cannot help with",
    "i am unable to help",
    "i'm unable to help",
    "i cannot assist with this request",
    "i am unable to fulfill this request",
    "i'm unable to fulfill this request",
    "i can't fulfill this request",
    "i cannot generate a response for this",
    "as an ai, i cannot"
  ];
  return refusalPhrases.some(phrase => lower.includes(phrase)) && text.length < 250;
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
 * Loads the Living Knowledge Taxonomy Tree from storage.
 * 100% Dynamic & Emergent: Starts empty and grows exclusively from the user's actual reels.
 * Zero hardcoded domains or subdomains.
 */
async function getLivingTaxonomy() {
  return new Promise((resolve) => {
    chrome.storage.local.get({ knowledgeTaxonomy: {}, reelsData: [] }, (res) => {
      let tax = res.knowledgeTaxonomy;
      if (!tax || typeof tax !== "object") {
        tax = {};
      }

      // Ensure any saved reels' domains and subdomains are included
      (res.reelsData || []).forEach((r) => {
        const d = r.domain || (r.category && r.category.includes(" - ") ? r.category.split(" - ")[0].trim() : r.category);
        const s = r.subdomain || (r.category && r.category.includes(" - ") ? r.category.split(" - ")[1].trim() : null);
        if (d) {
          if (!tax[d]) tax[d] = [];
          if (s && !tax[d].includes(s)) {
            tax[d].push(s);
          }
        }
      });

      resolve(tax);
    });
  });
}

/**
 * Dynamic Fuzzy Snapper: snaps raw domain & subdomain against living taxonomy.
 * If new, registers them dynamically.
 */
function snapToTaxonomy(rawDomain, rawSubdomain, taxonomy) {
  let domain = (rawDomain || "").replace(/^\[|\]$/g, "").trim();
  let subdomain = (rawSubdomain || "").replace(/^\[|\]$/g, "").trim();

  if (!domain) domain = "General Insights";
  if (!subdomain) subdomain = "Overview";

  const domainKeys = Object.keys(taxonomy);

  // 1. Match Domain (exact or case-insensitive)
  let matchedDomain = domainKeys.find(
    (d) => d.toLowerCase() === domain.toLowerCase()
  );

  // 2. Token overlap match for Domain
  if (!matchedDomain) {
    const domainTokens = domain.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((t) => t.length > 2);
    if (domainTokens.length > 0) {
      matchedDomain = domainKeys.find((d) => {
        const dTokens = d.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
        return domainTokens.some((t) => dTokens.includes(t));
      });
    }
  }

  // If brand new domain, format cleanly
  if (!matchedDomain) {
    matchedDomain = domain.replace(/^\w/, (c) => c.toUpperCase());
    if (!taxonomy[matchedDomain]) {
      taxonomy[matchedDomain] = [];
    }
  }

  const existingSubdomains = taxonomy[matchedDomain] || [];

  // 3. Match Subdomain (exact or case-insensitive)
  let matchedSubdomain = existingSubdomains.find(
    (s) => s.toLowerCase() === subdomain.toLowerCase()
  );

  // 4. Token overlap match for Subdomain within this specific Domain
  if (!matchedSubdomain) {
    const subTokens = subdomain.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((t) => t.length > 2);
    if (subTokens.length > 0) {
      matchedSubdomain = existingSubdomains.find((s) => {
        const sTokens = s.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
        return subTokens.some((t) => sTokens.includes(t));
      });
    }
  }

  // If brand new subdomain, format cleanly and add to domain
  if (!matchedSubdomain) {
    // Sanitize: ensure subdomain is a clean 2-5 word label, not a full sentence
    let cleanSub = subdomain.split(/[.\n;]/)[0].trim();
    if (cleanSub.length > 35) {
      cleanSub = cleanSub.split(/\s+/).slice(0, 4).join(" ");
    }
    matchedSubdomain = cleanSub.replace(/^\w/, (c) => c.toUpperCase());
    if (matchedSubdomain && !existingSubdomains.includes(matchedSubdomain)) {
      existingSubdomains.push(matchedSubdomain);
    }
  }

  return { domain: matchedDomain, subdomain: matchedSubdomain || "Overview" };
}

/**
 * Normalizes creator handles by extracting @username or cleaning names
 */
function normalizeCreatorHandle(str) {
  if (!str) return "";
  let clean = str.trim();
  // Extract handle if format is "Bobby Gana (@thebobbygana)" or "@thebobbygana"
  const handleMatch = clean.match(/@([a-zA-Z0-9._]+)/);
  if (handleMatch && handleMatch[1]) {
    return handleMatch[1];
  }
  // Strip Markdown, quotes, brackets
  clean = clean.replace(/[*_~`"\[\]()]/g, "").trim();
  clean = clean.replace(/^(?:instagram|creator|by|author)\s*:\s*/i, "").trim();
  if (clean.toLowerCase() === "unknown" || clean.toLowerCase() === "none") return "";
  return clean;
}

/**
 * /**
 * Super-Robust Metadata Parser:
 * Extracts Creator, Domain, Subdomain, Subject, Personal Utility, Entities, and Tags.
 * Handles both multi-line AND single-line inline responses,
 * YAML lowercase keys (personal_utility, entities, creator, domain, etc.),
 * markdown bold (**domain:**), italics (*domain:*), headers (### domain:), and raw text.
 */
function parseMetadataFromResponse(responseText) {
  const meta = {
    creator: null,
    domain: null,
    subdomain: null,
    subject: null,
    personalUtility: null,
    entities: null,
    tags: null
  };

  if (!responseText) return meta;

  // Extracts field value stopping at the next known field header, newline, or separator
  const extractField = (aliases) => {
    for (const alias of aliases) {
      // Regex looks for Alias followed by colon/space, then non-greedy capture until next known field keyword, newline, pipe, or end of text
      const pattern = new RegExp(
        `(?:^|[\\n#*\\s|,-])\\*?\\*?${alias}\\*?\\*?:?\\s*\\*?\\*?` +
        `([^\\n|]+?)` +
        `(?=(?:\\s+\\*?\\*?(?:creator|author|domain|subdomain|sub-domain|topic|subcategory|subject|title|personal_utility|personal\\s+utility|utility|entities|tools|tech|tags|hashtags)\\*?\\*?:)|\\n|---|$)`,
        "i"
      );

      const m = responseText.match(pattern);
      if (m && m[1]) {
        let clean = m[1].trim();
        // Strip surrounding quotes
        clean = clean.replace(/^["']|["']$/g, "").trim();
        // If it's a JSON array representation like ["tag1", "tag2"] or ["[tools]"]
        if (clean.startsWith("[") && clean.endsWith("]")) {
          try {
            const parsed = JSON.parse(clean);
            if (Array.isArray(parsed)) {
              clean = parsed.join(", ");
            }
          } catch (e) {
            clean = clean.replace(/^\[|\]$/g, "").replace(/["']/g, "").trim();
          }
        }
        clean = clean.replace(/^\[|\]$/g, "").trim();
        clean = clean.replace(/^\*+|\*+$/g, "").trim();
        clean = clean.replace(/^[|:-]+\s*/, "").trim();
        if (clean && clean.toLowerCase() !== "none" && !clean.includes("---") && clean.length > 0) {
          return clean;
        }
      }
    }
    return null;
  };

  meta.creator = extractField(["creator", "Creator", "Author", "Creator Name", "Account", "Username", "Instagram User"]);
  
  // Fallback: if creator was not in top block, scan response text for "Creator: Name (@handle)" or "By: @handle"
  if (!meta.creator) {
    const creatorFallback = responseText.match(/(?:^|\n)\s*(?:[*_~`#\s]*)(?:creator|Creator|Author|By|Instagram)\s*:\s*([^\n\r]+)/i);
    if (creatorFallback && creatorFallback[1]) {
      const candidate = creatorFallback[1].trim().replace(/^["']|["']$/g, "");
      if (!candidate.toLowerCase().includes("unknown") && !candidate.toLowerCase().includes("none") && candidate.length < 80) {
        meta.creator = candidate;
      }
    }
  }

  meta.domain = extractField(["domain", "Domain", "Super-Category", "Category"]);
  meta.subdomain = extractField(["subdomain", "Subdomain", "Sub-domain", "Topic", "Subcategory", "Specialization"]);
  meta.subject = extractField(["subject", "Subject", "Title", "Topic Title"]);
  meta.personalUtility = extractField(["personal_utility", "personalUtility", "Personal Utility", "Utility", "Why it matters", "Key Value"]);
  meta.entities = extractField(["entities", "Entities", "Tools & Resources", "Tools & Tech", "Tools", "Tech"]);
  meta.tags = extractField(["tags", "Tags", "Hashtags"]);

  return meta;
}

/**
 * Super-clean metadata stripper:
 * Safely removes fenced (`--- ... ---`), unfenced multi-line, and single-line inline
 * metadata blocks from the summary body so only the pure summary content is saved.
 */
function stripMetadataBlock(text) {
  if (!text) return "";
  let clean = text.trim();

  // Strip prompt preamble echoes if included in the turn
  const promptPreamblePatterns = [
    /I will be sending you Instagram Reels[\s\S]*?Never invent information[^\n]*\n?/i,
    /Extract this Reel into a (?:permanent )?knowledge note[\s\S]*?YOUR CURRENT KNOWLEDGE TAXONOMY[^\n]*\n?/i,
    /Analyze the attached Instagram Reel[\s\S]*?Never invent information[^\n]*\n?/i,
    /YOUR CURRENT KNOWLEDGE TAXONOMY[\s\S]*?Never invent information[^\n]*\n?/i,
    /CLASSIFICATION RULES[\s\S]*?Never invent information[^\n]*\n?/i,
    /At the very top, ALWAYS output this exact YAML[\s\S]*?---\n?/i,
    /Analyze and extract 100% of the permanent, high-yield value[^\n]*\n?/i
  ];

  for (const pat of promptPreamblePatterns) {
    clean = clean.replace(pat, "").trim();
  }

  // Remove leading "Today" header if Meta AI added it
  clean = clean.replace(/^Today\s*\n+/i, "").trim();

  // 1. Strip standard YAML fenced block: --- ... ---
  clean = clean.replace(/^---[\s\S]*?---\n?/, "");

  // 2. Strip leading unfenced metadata block (lines starting with creator:, domain:, subdomain:, etc.)
  clean = clean.replace(/^(?:(?:\*?\*?(?:creator|author|domain|subdomain|sub-domain|topic|subcategory|subject|title|personal_utility|personal\s+utility|utility|entities|tools|tech|tags|hashtags)\*?\*?:[^\n]*\n?)+\s*)+/i, "");

  // 3. Strip single-line inline metadata block at start if any
  clean = clean.replace(/^(?:\*?\*?(?:creator|domain)\*?\*?:[^\n]+?(?:tags|hashtags)\*?\*?:[^\n]+(?:\n|$))\s*/i, "");

  return clean.trim();
}

/**
 * Fallback categorizer when AI completely skips all metadata headers
 */
function fallbackCategorizer(caption, summaryText) {
  const combined = `${caption} ${summaryText}`.toLowerCase();
  
  if (/code|coding|devops|docker|kubernetes|python|javascript|react|api|backend|frontend|ai|llm|software|github/.test(combined)) {
    return { domain: "Technology", subdomain: "Software & Tools" };
  }
  if (/fitness|workout|gym|diet|nutrition|health|exercise|muscle|training|yoga/.test(combined)) {
    return { domain: "Fitness & Health", subdomain: "Workouts & Nutrition" };
  }
  if (/money|invest|stock|crypto|finance|business|revenue|profit|startup|sales/.test(combined)) {
    return { domain: "Finance & Business", subdomain: "Business & Growth" };
  }
  if (/career|job|interview|resume|study|learn|degree|college|salary/.test(combined)) {
    return { domain: "Career & Education", subdomain: "Career & Learning" };
  }
  if (/design|ui|ux|figma|css|animation|video|photo|creative|art|logo/.test(combined)) {
    return { domain: "Design & Creative", subdomain: "Visual & UI Design" };
  }
  if (/habit|focus|routine|mindset|productivity|goal|time management|discipline/.test(combined)) {
    return { domain: "Productivity & Habits", subdomain: "Habits & Systems" };
  }

  return { domain: "General Insights", subdomain: "Insights" };
}

/**
 * Builds high-impact prompt with Living Taxonomy Knowledge Tree injection.
 * Turn 0 / every 5th turn: Master Prompt (Sets full rules, YAML schema, quality expectations).
 * Turns 1..4: Lean Prompt (URL + Live Taxonomy ONLY, zero repeated instructions).
 */
async function buildPromptForReel(reelData, provider = "meta", customPrompt = "", turnIndex = 0) {
  const taxonomy = await getLivingTaxonomy();
  const domainKeys = Object.keys(taxonomy).filter((d) => taxonomy[d] && taxonomy[d].length > 0);

  let treeStr = "";
  if (domainKeys.length > 0) {
    const treeLines = [];
    for (const dom of domainKeys) {
      const subs = taxonomy[dom];
      treeLines.push(`- ${dom}: [${subs.map((s) => `"${s}"`).join(", ")}]`);
    }

    treeStr = `YOUR CURRENT KNOWLEDGE TAXONOMY (FROM PREVIOUS REELS):\n${treeLines.join("\n")}`;
  }

  // Custom prompt override if user explicitly enabled custom prompt
  if (customPrompt && customPrompt.trim()) {
    let userPrompt = customPrompt.trim()
      .replace(/\{url\}/g, reelData.url || "")
      .replace(/\{author\}/g, reelData.author || "Unknown")
      .replace(/\{audio\}/g, reelData.audioTitle || "Original Audio")
      .replace(/\{caption\}/g, reelData.caption || "");

    return treeStr ? `${treeStr}\n\n${userPrompt}` : userPrompt;
  }

  // Lean Follow-Up Prompt for turns 2, 3, 4, 5 (turns 1..4 in 0-indexed loop)
  // Sends ONLY the URL and the live taxonomy tree — ZERO repeated rule blocks.
  const isContinuationTurn = turnIndex > 0 && turnIndex % 5 !== 0;

  if (isContinuationTurn) {
    let continuationText = `Extract this Reel into a permanent knowledge note following the exact same rules and YAML format: ${reelData.url}`;
    if (treeStr) {
      continuationText += `\n\n${treeStr}`;
    }
    return continuationText;
  }

  // Master Setup Prompt (Turn 0, 5, 10, etc.)
  let classificationRules = `CLASSIFICATION RULES:
1. Reuse an existing Domain/Subdomain when applicable.
2. If the Domain exists but the topic is new, create a concise 2–3 word Subdomain.
3. Create a new Domain only for a genuinely new field.`;

  if (!treeStr) {
    classificationRules = `CLASSIFICATION RULES:
- Domain: Identify the broad field (e.g., Technology, Fitness, Finance, Culinary, Design, Career, etc.).
- Subdomain: Identify the specific specialization or topic (e.g. under Technology: "DevOps & Cloud", "Frontend & UI", "AI & LLMs"; under Fitness: "Strength Training", "Nutrition").`;
  }

  let masterHeader = `Analyze the attached Instagram Reel and convert it into a reusable knowledge note: ${reelData.url}\n\n`;
  if (treeStr) {
    masterHeader += `${treeStr}\n\n`;
  }
  masterHeader += `${classificationRules}\n\n`;

  return `${masterHeader}At the very top, ALWAYS output this exact YAML:

---
creator: "[creator name or Unknown]"
domain: "[Domain]"
subdomain: "[Subdomain]"
subject: "[3–7 word title]"
personal_utility: "[Why this could be useful to me]"
entities: ["[tools/resources/etc]"]
tags: ["#tag1", "#tag2", "#tag3"]
---

Then extract the Reel's knowledge.

Do NOT use a fixed structure. Choose the best structure based on the Reel.

Preserve all high-value information: exact names, numbers, steps, examples, code, commands, tools, frameworks, and important details.

Remove hooks, filler, repetition, and hype.

Separate facts from opinions or recommendations.

The goal is not to summarize the Reel. The goal is to create a permanent knowledge note that I can search and reuse later without watching the Reel again.

Never invent information that is not present in the Reel.`;
}

/**
 * Formats prompt and dispatches to the selected AI Web Tab (Meta AI, Gemini, or ChatGPT)
 */
async function handleSendAI(reelData, provider = "meta", customPrompt = "", turnIndex = 0) {
  const promptText = await buildPromptForReel(reelData, provider, customPrompt, turnIndex);

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
 * Saves reel item to chrome.storage.local with enriched Domain & Subdomain metadata
 */
async function saveReelData(data) {
  const summaryText = data.summary || data.geminiResponse || "";
  const meta = parseMetadataFromResponse(summaryText);
  const taxonomy = await getLivingTaxonomy();

  let domain = meta.domain;
  let subdomain = meta.subdomain;

  if (!domain || !subdomain) {
    const fallback = fallbackCategorizer(data.caption || "", summaryText);
    domain = domain || fallback.domain;
    subdomain = subdomain || fallback.subdomain;
  }

  // Snap to taxonomy or dynamically register
  const snapped = snapToTaxonomy(domain, subdomain, taxonomy);
  domain = snapped.domain;
  subdomain = snapped.subdomain;

  // Persist updated living taxonomy to storage
  await new Promise((resolve) => {
    chrome.storage.local.set({ knowledgeTaxonomy: taxonomy }, resolve);
  });

  // Strip metadata block from summary body for clean display
  const cleanSummary = stripMetadataBlock(summaryText);

    let extractedAuthor = normalizeCreatorHandle(meta.creator);
    if (!extractedAuthor) {
      extractedAuthor = normalizeCreatorHandle(data.author);
    }
    const cleanAuthor = extractedAuthor || "Unknown";
    const finalDate = data.postedDate || data.timestamp || new Date().toISOString();

    const enrichedItem = {
      ...data,
      author: cleanAuthor,
      date: finalDate,
      postedDate: finalDate,
      domain: domain,
      subdomain: subdomain,
      category: `${domain} - ${subdomain}`,
      subject: meta.subject || (cleanAuthor && cleanAuthor !== "Unknown" ? `Reel by @${cleanAuthor}` : "Untitled Reel"),
      personalUtility: meta.personalUtility || "",
      entities: meta.entities && meta.entities.toLowerCase() !== "none" ? meta.entities : "",
      tags: meta.tags || "",
      summary: cleanSummary,
      geminiResponse: cleanSummary
    };

  return new Promise((resolve) => {
    chrome.storage.local.get({ reelsData: [] }, (result) => {
      const reelsData = result.reelsData || [];
      const existingIdx = reelsData.findIndex((item) => item.url === data.url);
      if (existingIdx >= 0) {
        reelsData[existingIdx] = enrichedItem;
      } else {
        reelsData.push(enrichedItem);
      }
      chrome.storage.local.set({ reelsData }, () => {
        resolve({
          success: true,
          totalCount: reelsData.length,
          domain: domain,
          subdomain: subdomain,
          category: enrichedItem.category
        });
      });
    });
  });
}

/**
 * Exports a consolidated Markdown Playbook for a specific Domain or Subdomain
 */
async function exportCategoryPlaybook(domainOrCategory, optionalSubdomain = null) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ reelsData: [] }, (result) => {
      const all = result.reelsData || [];
      
      let reels = all;
      let title = "Complete Knowledge Base";
      let safeFilename = "All_Reels_Playbook";

      if (domainOrCategory && domainOrCategory !== "All") {
        if (optionalSubdomain) {
          reels = all.filter(r => (r.domain === domainOrCategory || r.category === domainOrCategory) && r.subdomain === optionalSubdomain);
          title = `${domainOrCategory} - ${optionalSubdomain} Playbook`;
          safeFilename = `${domainOrCategory}_${optionalSubdomain}`.replace(/[^a-zA-Z0-9]/g, "_");
        } else {
          reels = all.filter(r => (r.domain === domainOrCategory || r.category === domainOrCategory || (r.category && r.category.startsWith(domainOrCategory))));
          title = `${domainOrCategory} Playbook`;
          safeFilename = `${domainOrCategory}`.replace(/[^a-zA-Z0-9]/g, "_");
        }
      }

      if (!reels.length) {
        resolve({ success: false, error: `No reels found for ${domainOrCategory}` });
        return;
      }

      const dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      
      // Group reels by Subdomain
      const grouped = {};
      reels.forEach(r => {
        const sub = r.subdomain || "General";
        if (!grouped[sub]) grouped[sub] = [];
        grouped[sub].push(r);
      });

      let md = `# ${title}\n`;
      md += `> Total Reels: ${reels.length} | Subdomains: ${Object.keys(grouped).join(", ")} | Exported: ${dateStr}\n\n`;

      // Table of Contents Grouped by Subdomain
      md += `## Table of Contents\n`;
      for (const [sub, subReels] of Object.entries(grouped)) {
        md += `### ${sub} (${subReels.length})\n`;
        subReels.forEach((r, i) => {
          const anchor = (r.subject || `Reel ${i + 1}`).toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
          md += `- [${r.subject || `Reel by @${r.author}`}](#${anchor}) — @${r.author}\n`;
        });
      }
      md += `\n---\n\n`;

      // Content grouped by Subdomain
      for (const [sub, subReels] of Object.entries(grouped)) {
        md += `## 📁 Subdomain: ${sub}\n\n`;
        subReels.forEach((r, i) => {
          md += `### ${r.subject || `Reel by @${r.author}`}\n\n`;
          if (r.personalUtility) md += `> **Why it matters:** ${r.personalUtility}\n\n`;
          md += `- **Domain:** ${r.domain || "General"}\n`;
          md += `- **Subdomain:** ${r.subdomain || "General"}\n`;
          md += `- **Author:** [@${r.author}](https://www.instagram.com/${r.author}/)\n`;
          md += `- **Source:** [Original Reel](${r.url})\n`;
          if (r.entities && r.entities.toLowerCase() !== "none") md += `- **Entities & Tools:** ${r.entities}\n`;
          if (r.tags) md += `- **Tags:** ${r.tags}\n`;
          md += `- **Date:** ${r.timestamp ? new Date(r.timestamp).toLocaleDateString() : "Unknown"}\n\n`;
          if (r.caption && r.caption !== "No text caption found in reel post.") {
            md += `#### Caption\n> ${r.caption.replace(/\n/g, "\n> ").substring(0, 500)}${r.caption.length > 500 ? "..." : ""}\n\n`;
          }
          md += `#### Summary & Key Takeaways\n${r.summary || r.geminiResponse || "_No summary extracted_"}\n\n`;
          md += `---\n\n`;
        });
      }

      resolve({ success: true, content: md, filename: `${safeFilename}_Playbook.md`, count: reels.length });
    });
  });
}

/**
 * Exports all Domain playbooks in a structured ZIP-ready package
 */
async function exportAllPlaybooksAsZip() {
  return new Promise((resolve) => {
    chrome.storage.local.get({ reelsData: [] }, async (result) => {
      const all = result.reelsData || [];
      if (!all.length) {
        resolve({ success: false, error: "No reels saved yet." });
        return;
      }

      const taxonomy = await getLivingTaxonomy();
      const files = [];

      // Find all distinct domains in saved data
      const distinctDomains = [...new Set(all.map(r => r.domain || "General Insights"))];

      for (const dom of distinctDomains) {
        const res = await exportCategoryPlaybook(dom);
        if (res.success) {
          files.push({ filename: res.filename, content: res.content });
        }
      }

      // Generate Master INDEX.md
      const dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      let idx = `# Reel Analyzer Knowledge Base (Master Index)\n> Exported: ${dateStr} | Total Reels: ${all.length}\n\n`;
      idx += `## Knowledge Taxonomy & Playbooks\n\n`;

      for (const dom of distinctDomains) {
        const domReels = all.filter(r => (r.domain || "General Insights") === dom);
        const subList = [...new Set(domReels.map(r => r.subdomain || "General"))];
        idx += `### 📘 [${dom}](${dom.replace(/[^a-zA-Z0-9]/g, "_")}_Playbook.md) — ${domReels.length} reels\n`;
        subList.forEach(sub => {
          const subCount = domReels.filter(r => (r.subdomain || "General") === sub).length;
          idx += `  - **${sub}**: ${subCount} reels\n`;
        });
        idx += `\n`;
      }

      idx += `---\n\n## All Saved Reels\n\n`;
      idx += `| # | Subject | Domain | Subdomain | Author | Tags |\n|---|---------|--------|-----------|--------|------|\n`;
      all.forEach((r, i) => {
        idx += `| ${i + 1} | ${r.subject || "Untitled"} | ${r.domain || "General"} | ${r.subdomain || "General"} | @${r.author} | ${r.tags || ""} |\n`;
      });

      // Tools & Entities Stack
      const allEntities = all
        .flatMap(r => (r.entities || "").split(",").map(e => e.trim()))
        .filter(e => e && e.toLowerCase() !== "none" && e.length > 1);
      const uniqueEntities = [...new Set(allEntities)];
      if (uniqueEntities.length) {
        let toolsMd = `# Tools & Resources Stack\n> Auto-extracted from ${all.length} reels | ${dateStr}\n\n`;
        toolsMd += `| Tool / Resource | Domain | Subdomain | Mentioned In |\n|-----------------|--------|-----------|--------------|\n`;
        uniqueEntities.forEach(entity => {
          const mentions = all.filter(r => (r.entities || "").includes(entity));
          const first = mentions[0];
          toolsMd += `| **${entity}** | ${first?.domain || "General"} | ${first?.subdomain || "General"} | [${first?.subject || "Reel"}](${first?.url || ""}) |\n`;
        });
        files.push({ filename: "TOOLS_STACK.md", content: toolsMd });
      }

      files.push({ filename: "INDEX.md", content: idx });

      resolve({ success: true, files: files, totalFiles: files.length, totalReels: all.length });
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

