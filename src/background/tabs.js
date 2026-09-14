/**
 * Browser Tab Finders, Injections, and Tab Messaging Helpers
 */

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Finds the currently active or open Instagram tab
 */
export async function findActiveInstagramTab() {
  const tabs = await chrome.tabs.query({ url: ["*://*.instagram.com/*"] });
  if (!tabs || tabs.length === 0) return null;
  const activeTab = tabs.find((t) => t.active);
  return activeTab || tabs[0];
}

/**
 * Finds the currently open Meta AI tab
 */
export async function findActiveMetaAITab() {
  const tabs = await chrome.tabs.query({ url: ["*://*.meta.ai/*"] });
  if (!tabs || tabs.length === 0) return null;
  const activeTab = tabs.find((t) => t.active);
  return activeTab || tabs[0];
}

/**
 * Ensures a Meta AI tab is available, creating one if not open
 */
export async function ensureMetaAITab() {
  let tab = await findActiveMetaAITab();
  if (!tab) {
    tab = await chrome.tabs.create({ url: "https://www.meta.ai/", active: false });
    await sleep(4000);
  }
  return tab;
}

/**
 * Sends a message to a tab, re-injecting the content script if the receiver was disconnected
 */
export async function sendOrInjectAI(tabId, message) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (err) {
    console.warn(`[InstaReel-AI] Error communicating with tab ${tabId}. Attempting re-injection...`, err);
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["content_meta.js"]
      });
      await sleep(600);
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (injectErr) {
      console.error(`[InstaReel-AI] Failed to re-inject script into tab ${tabId}:`, injectErr);
      throw injectErr;
    }
  }
}

/**
 * Scrapes current reel data from Instagram tab
 */
export async function handleScrapeIG() {
  const igTab = await findActiveInstagramTab();
  if (!igTab) {
    return { success: false, error: "Please open an Instagram Reel in a browser tab first." };
  }
  try {
    return await chrome.tabs.sendMessage(igTab.id, { action: "SCRAPE_REEL" });
  } catch (err) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: igTab.id },
        files: ["content_ig.js"]
      });
      await sleep(500);
      return await chrome.tabs.sendMessage(igTab.id, { action: "SCRAPE_REEL" });
    } catch (e) {
      return { success: false, error: "Could not communicate with Instagram. Please refresh your Instagram tab." };
    }
  }
}

/**
 * Advances to the next reel on the Instagram tab
 */
export async function handleNextIG() {
  const igTab = await findActiveInstagramTab();
  if (!igTab) return { success: false, error: "No active Instagram tab found." };
  try {
    return await chrome.tabs.sendMessage(igTab.id, { action: "CLICK_NEXT" });
  } catch (err) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: igTab.id },
        files: ["content_ig.js"]
      });
      await sleep(500);
      return await chrome.tabs.sendMessage(igTab.id, { action: "CLICK_NEXT" });
    } catch (e) {
      return { success: false, error: "Could not trigger next reel. Please refresh Instagram." };
    }
  }
}

/**
 * Unsaves current reel on Instagram tab
 */
export async function handleUnsaveIG() {
  const igTab = await findActiveInstagramTab();
  if (!igTab) return { success: false, error: "No active Instagram tab found." };
  try {
    return await chrome.tabs.sendMessage(igTab.id, { action: "UNSAVE_REEL" });
  } catch (err) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: igTab.id },
        files: ["content_ig.js"]
      });
      await sleep(500);
      return await chrome.tabs.sendMessage(igTab.id, { action: "UNSAVE_REEL" });
    } catch (e) {
      return { success: false, error: "Could not unsave reel." };
    }
  }
}

/**
 * Sends prompt to Meta AI tab
 */
export async function handleSendAI(prompt) {
  const metaTab = await ensureMetaAITab();
  if (!metaTab) {
    return { success: false, error: "Could not open or find Meta AI tab (https://www.meta.ai)." };
  }
  return await sendOrInjectAI(metaTab.id, {
    action: "INJECT_AND_SEND",
    prompt: prompt
  });
}

/**
 * Polls Meta AI tab for latest response completion
 */
export async function handleCheckAIResponse() {
  const metaTab = await findActiveMetaAITab();
  if (!metaTab) {
    return { success: false, isGenerating: false, text: "", error: "Meta AI tab was closed." };
  }
  return await sendOrInjectAI(metaTab.id, {
    action: "CHECK_AI_RESPONSE"
  });
}
