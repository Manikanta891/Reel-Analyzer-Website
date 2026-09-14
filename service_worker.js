/**
 * Reel Analyzer - Background Service Worker Entry Point
 * Orchestrates message dispatching across modular engines.
 */

import { ACTIONS } from "./src/shared/constants.js";
import { batchState, restoreSessionState } from "./src/background/state.js";
import { handleScrapeIG, handleNextIG, handleUnsaveIG, handleSendAI, handleCheckAIResponse } from "./src/background/tabs.js";
import { buildPromptForReel } from "./src/background/promptBuilder.js";
import { parseMetadataFromResponse } from "./src/background/metadataParser.js";
import { clearData } from "./src/background/storage.js";
import { exportData, exportCategoryPlaybook, exportAllPlaybooksAsZip } from "./src/background/exporter.js";
import { startBatchLoop, stopBatchLoop, startBatchUnsaveLoop } from "./src/background/batchEngine.js";

console.log("[InstaReel-AI] Modular Service Worker initialized.");

// Enable Chrome Side Panel to open when extension action icon is clicked
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error("[InstaReel-AI] Error setting side panel behavior:", error));
}

if (chrome.runtime && chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => {
    if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
      chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error("[InstaReel-AI] Error setting side panel behavior on installed:", error));
    }
  });
}

// Set offboarding feedback survey URL when user removes extension
if (chrome.runtime && chrome.runtime.setUninstallURL) {
  chrome.runtime.setUninstallURL("https://reelanalyzer.manikanta.co.in/uninstall");
}

// Restore active batch state from session storage
restoreSessionState();

// Main Message Dispatcher
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request || !request.action) return false;

  switch (request.action) {
    case ACTIONS.GET_BATCH_STATE:
      sendResponse({ success: true, state: batchState });
      return true;

    case ACTIONS.START_BATCH: {
      const target = parseInt(request.targetCount, 10) || 1;
      const autoUnsave = !!request.autoUnsave;
      const provider = request.provider || "meta";
      const customPrompt = request.customPrompt || "";
      startBatchLoop(target, autoUnsave, provider, customPrompt).then((res) => sendResponse(res));
      return true;
    }

    case ACTIONS.START_BATCH_UNSAVE: {
      const count = parseInt(request.count, 10) || 10;
      startBatchUnsaveLoop(count).then((res) => sendResponse(res));
      return true;
    }

    case ACTIONS.STOP_BATCH:
      stopBatchLoop();
      sendResponse({ success: true, message: "Batch loop stopping..." });
      return true;

    case ACTIONS.SCRAPE_IG:
      handleScrapeIG().then((res) => sendResponse(res));
      return true;

    case ACTIONS.NEXT_IG:
      handleNextIG().then((res) => sendResponse(res));
      return true;

    case ACTIONS.UNSAVE_IG:
      handleUnsaveIG().then((res) => sendResponse(res));
      return true;

    case ACTIONS.CLEAR_DATA:
      clearData().then((res) => sendResponse(res));
      return true;

    case ACTIONS.EXPORT_DATA:
      exportData(request.format || "markdown").then((res) => sendResponse(res));
      return true;

    case ACTIONS.EXPORT_CATEGORY_PLAYBOOK:
      exportCategoryPlaybook(request.category, request.subdomain).then((res) => sendResponse(res));
      return true;

    case ACTIONS.EXPORT_ALL_PLAYBOOKS_ZIP:
      exportAllPlaybooksAsZip().then((res) => sendResponse(res));
      return true;

    case ACTIONS.OPEN_WEB_DASHBOARD: {
      const VAULT_URL = "https://reelanalyzer.manikanta.co.in/vault";
      chrome.tabs.create({ url: VAULT_URL, active: true }, () => {
        sendResponse({ success: true, url: VAULT_URL });
      });
      return true;
    }

    default:
      return false;
  }
});
