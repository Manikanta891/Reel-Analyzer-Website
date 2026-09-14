/**
 * Global Batch State Management & Session Persistence
 */

import { ACTIONS } from "../shared/constants.js";

export let batchState = {
  isRunning: false,
  mode: "summary", // "summary" | "unsave"
  provider: "meta",
  targetCount: 5,
  processedCount: 0,
  currentStep: "idle", // "idle" | "skipping" | "scraping" | "generating" | "unsaving" | "saving" | "delay" | "done" | "error"
  statusMessage: "Idle",
  elapsedAISeconds: 0,
  lastProcessedUrl: ""
};

/**
 * Restores state from session storage on service worker startup
 */
export function restoreSessionState() {
  if (chrome.storage && chrome.storage.session) {
    chrome.storage.session.get({ batchState: null }, (res) => {
      if (res && res.batchState) {
        batchState = { ...batchState, ...res.batchState };
      }
    });
  }
}

/**
 * Broadcasts current batch state to active popup / side panel
 */
export function broadcastState() {
  chrome.runtime.sendMessage({
    action: ACTIONS.BATCH_STATE_UPDATED,
    state: batchState
  }).catch(() => {
    // Side panel / popup may be closed
  });
}

/**
 * Updates partial state and persists to chrome.storage.session
 */
export function updateBatchState(partial) {
  batchState = { ...batchState, ...partial };
  broadcastState();
  if (chrome.storage && chrome.storage.session) {
    chrome.storage.session.set({ batchState }).catch(() => {});
  }
}

export function getProviderDisplayName(provider) {
  return "Meta AI";
}
