/**
 * Shared constants across Background and Popup modules
 */

export const ACTIONS = {
  GET_BATCH_STATE: "GET_BATCH_STATE",
  BATCH_STATE_UPDATED: "BATCH_STATE_UPDATED",
  START_BATCH: "START_BATCH",
  START_BATCH_UNSAVE: "START_BATCH_UNSAVE",
  STOP_BATCH: "STOP_BATCH",
  SCRAPE_IG: "SCRAPE_IG",
  NEXT_IG: "NEXT_IG",
  UNSAVE_IG: "UNSAVE_IG",
  CLEAR_DATA: "CLEAR_DATA",
  EXPORT_DATA: "EXPORT_DATA",
  EXPORT_CATEGORY_PLAYBOOK: "EXPORT_CATEGORY_PLAYBOOK",
  EXPORT_ALL_PLAYBOOKS_ZIP: "EXPORT_ALL_PLAYBOOKS_ZIP",
  OPEN_WEB_DASHBOARD: "OPEN_WEB_DASHBOARD"
};

export const AI_PROVIDERS = {
  META: "meta"
};

export const PROMPT_INTERVAL = 10;


export const TAXONOMY_STOP_WORDS = new Set([
  "and", "the", "for", "with", "from", "into", "that", "this", "over",
  "under", "about", "more", "your", "what", "when", "where", "which"
]);
