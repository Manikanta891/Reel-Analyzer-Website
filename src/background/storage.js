/**
 * Storage Engine with Atomic Writes & Living Taxonomy Sync
 */

import { getLivingTaxonomy, snapToTaxonomy } from "./taxonomy.js";
import { stripMetadataBlock, fallbackCategorizer } from "./metadataParser.js";

/**
 * Atomically saves a summarized reel and updates the living taxonomy tree in a single transaction
 */
export async function saveReelData(data, summaryText, meta = {}) {
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

  // Strip metadata block from summary body for clean display
  const cleanSummary = stripMetadataBlock(summaryText);
  const finalDate = data.postedDate || data.timestamp || new Date().toISOString();

  const enrichedItem = {
    ...data,
    author: "",
    date: finalDate,
    postedDate: finalDate,
    domain: domain,
    subdomain: subdomain,
    category: `${domain} - ${subdomain}`,
    subject: meta.subject || "Reel Knowledge Note",
    personalUtility: meta.personalUtility || "",
    entities: meta.entities && meta.entities.toLowerCase() !== "none" ? meta.entities : "",
    tags: meta.tags || "",
    summary: cleanSummary,
    aiResponse: cleanSummary
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
      chrome.storage.local.set({ reelsData, knowledgeTaxonomy: taxonomy }, () => {
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
 * Clears all saved summaries and resets taxonomy to defaults
 */
export async function clearData() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ reelsData: [], knowledgeTaxonomy: {} }, () => {
      resolve({ success: true, message: "Storage cleared successfully." });
    });
  });
}

/**
 * Retrieves all stored reels
 */
export async function getStoredReels() {
  return new Promise((resolve) => {
    chrome.storage.local.get({ reelsData: [] }, (res) => {
      resolve(res.reelsData || []);
    });
  });
}
