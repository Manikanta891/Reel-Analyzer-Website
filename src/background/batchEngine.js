/**
 * Summary Batch Engine & Bulk Unsave Execution Loops
 */

import { batchState, updateBatchState, getProviderDisplayName } from "./state.js";
import { sleep, handleScrapeIG, handleNextIG, handleUnsaveIG, handleSendAI, handleCheckAIResponse } from "./tabs.js";
import { buildPromptForReel } from "./promptBuilder.js";
import { parseMetadataFromResponse } from "./metadataParser.js";
import { saveReelData } from "./storage.js";

/**
 * Starts the Batch Summarizer Loop
 */
export async function startBatchLoop(targetCount, autoUnsave, provider = "meta", customPrompt = "") {
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
 * Starts the Simplified Batch Unsaver Loop
 */
export async function startBatchUnsaveLoop(count) {
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
export function stopBatchLoop() {
  updateBatchState({
    isRunning: false,
    currentStep: "idle",
    statusMessage: "Batch process stopped by user."
  });
}

/**
 * Summary Batch Engine Loop (Random adaptive delay with deduplication & stability polling)
 */
export async function runSummaryBatchEngine(targetCount, autoUnsave, provider = "meta", customPrompt = "") {
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
      
      // If on the very first turn of a new batch, advance if current reel was already summarized in storage
      if (batchState.processedCount === 0 && scrapeRes?.success && scrapeRes.data?.url) {
        const stored = await new Promise((res) => chrome.storage.local.get({ reelsData: [] }, res));
        const alreadySaved = (stored.reelsData || []).some((r) => r.url === scrapeRes.data.url && (r.summary || r.domain));
        if (alreadySaved) {
          console.log(`[InstaReel-AI] Reel ${scrapeRes.data.url} was already summarized in previous batch. Advancing to next reel...`);
          updateBatchState({
            statusMessage: `Current reel already saved. Advancing to next reel...`
          });
          await handleNextIG();
          await sleep(2000);
          scrapeRes = await handleScrapeIG();
        }
      }

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

      // If STILL the same reel after 3 attempts, we have reached the end of the feed
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

      const currentTurn = batchState.processedCount;
      const prompt = await buildPromptForReel(reelData, provider, customPrompt, currentTurn);

      const sendRes = await handleSendAI(prompt);
      if (!sendRes || !sendRes.success) {
        throw new Error(sendRes?.error || `Could not submit prompt to ${getProviderDisplayName(provider)}.`);
      }

      const summaryText = await waitForAIWebResponse(currentTurn);
      const meta = parseMetadataFromResponse(summaryText);

      // 3. Unsave First (if enabled) so unsaved flag is accurate
      let unsavedSuccessfully = false;
      if (autoUnsave) {
        updateBatchState({
          currentStep: "unsaving",
          statusMessage: `Unsaving reel (${currentNum}/${targetCount})...`
        });

        const unsaveRes = await handleUnsaveIG();
        unsavedSuccessfully = !!(unsaveRes && unsaveRes.success);
        console.log(`[InstaReel-AI] Auto-Unsave Reel (${currentNum}/${targetCount}) result:`, unsaveRes);
      }

      // 4. Atomically Save Enriched Knowledge Note to Storage
      updateBatchState({
        currentStep: "saving",
        statusMessage: `Saving note: ${meta.subject || meta.domain || "Reel Note"}...`
      });

      const fullItem = {
        ...reelData,
        author: "",
        domain: meta.domain || "General Insights",
        subdomain: meta.subdomain || "Insights",
        subject: meta.subject || "",
        personalUtility: meta.personalUtility || "",
        entities: meta.entities || "",
        tags: meta.tags || "",
        aiProvider: provider,
        unsaved: unsavedSuccessfully
      };

      await saveReelData(fullItem, summaryText, meta);

      batchState.processedCount++;
      batchState.lastProcessedUrl = reelData.url;
      consecutiveErrors = 0;

      // Check if batch is completed
      if (batchState.processedCount >= targetCount) {
        updateBatchState({
          isRunning: false,
          currentStep: "done",
          statusMessage: `🎉 Done! Successfully summarized ${batchState.processedCount} reels.`
        });
        break;
      }

      // 5. Navigate to Next Reel with Randomized Adaptive Delay
      const randomDelay = Math.floor(Math.random() * 2000) + 1500; // 1.5s - 3.5s
      updateBatchState({
        currentStep: "delay",
        statusMessage: `Advancing to next reel in ${(randomDelay / 1000).toFixed(1)}s...`
      });

      await handleNextIG();
      await sleep(randomDelay);

    } catch (err) {
      console.error(`[InstaReel-AI] Batch error on reel ${currentNum}:`, err);
      consecutiveErrors++;

      if (consecutiveErrors >= 3) {
        updateBatchState({
          isRunning: false,
          currentStep: "error",
          statusMessage: `Batch stopped: ${err.message}`
        });
        break;
      }

      updateBatchState({
        statusMessage: `Retrying (${consecutiveErrors}/3) after error: ${err.message}...`
      });

      await handleNextIG();
      await sleep(2500);
    }
  }

  if (batchState.processedCount >= targetCount) {
    updateBatchState({
      isRunning: false,
      currentStep: "done",
      statusMessage: `🎉 Done! Successfully summarized ${batchState.processedCount} reels.`
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
 * Simplified Unsave Engine Loop (Count only, 1s delay with error cutoff)
 */
export async function runUnsaveBatchEngine(count) {
  console.log(`[InstaReel-AI] Running unsave for ${count} reels...`);
  let consecutiveErrors = 0;

  while (batchState.isRunning && batchState.processedCount < count) {
    const currentNum = batchState.processedCount + 1;

    try {
      updateBatchState({
        currentStep: "unsaving",
        statusMessage: `Unsaving reel ${currentNum} of ${count}...`
      });

      const scrapeRes = await handleScrapeIG();
      if (!scrapeRes || !scrapeRes.success) {
        throw new Error(scrapeRes?.error || "Instagram tab unreachable.");
      }

      const currentUrl = scrapeRes?.data?.url || "";

      // Click Unsave
      const unsaveRes = await handleUnsaveIG();
      console.log(`[InstaReel-AI] Unsave Reel (${currentNum}/${count}):`, unsaveRes);

      batchState.processedCount++;
      consecutiveErrors = 0;

      updateBatchState({
        statusMessage: `Unsaved ${batchState.processedCount}/${count}. Next in 1s...`
      });

      if (batchState.processedCount >= count) {
        updateBatchState({
          isRunning: false,
          currentStep: "done",
          statusMessage: `🎉 Done! Unsaved ${batchState.processedCount} reels.`
        });
        break;
      }

      await handleNextIG();
      await sleep(1000);

    } catch (err) {
      console.error(`[InstaReel-AI] Unsave error on reel ${currentNum}:`, err);
      consecutiveErrors++;

      if (consecutiveErrors >= 3) {
        updateBatchState({
          isRunning: false,
          currentStep: "error",
          statusMessage: `Unsave stopped: ${err.message}`
        });
        break;
      }

      await handleNextIG();
      await sleep(1500);
    }
  }

  if (batchState.processedCount >= count) {
    updateBatchState({
      isRunning: false,
      currentStep: "done",
      statusMessage: `🎉 Done! Successfully unsaved ${batchState.processedCount} reels.`
    });
  }
}

/**
 * Polls Meta AI tab for completion with a 2-cycle stability check
 */
async function waitForAIWebResponse(turnIndex = 0) {
  const MAX_WAIT_MS = 60000;
  const POLL_INTERVAL_MS = 1500;
  const startTime = Date.now();
  let previousText = "";
  let stableCycles = 0;

  while (Date.now() - startTime < MAX_WAIT_MS) {
    if (!batchState.isRunning) {
      throw new Error("Batch process was stopped by user.");
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    batchState.elapsedAISeconds = elapsed;
    updateBatchState({
      elapsedAISeconds: elapsed,
      statusMessage: `Generating knowledge note (${elapsed}s)...`
    });

    const checkRes = await handleCheckAIResponse();

    if (checkRes && checkRes.success && checkRes.text) {
      const currentText = checkRes.text.trim();

      if (currentText.length > 50 && !checkRes.isGenerating) {
        if (currentText === previousText) {
          stableCycles++;
          if (stableCycles >= 2) {
            console.log(`[InstaReel-AI] Response verified stable (${currentText.length} chars). Complete.`);
            return currentText;
          }
        } else {
          stableCycles = 0;
          previousText = currentText;
        }
      } else if (currentText.length > 50) {
        previousText = currentText;
        stableCycles = 0;
      }
    }

    await sleep(POLL_INTERVAL_MS);
  }

  // Fallback if timed out but text was received
  const lastCheck = await handleCheckAIResponse();
  if (lastCheck && lastCheck.text && lastCheck.text.trim().length > 30) {
    return lastCheck.text.trim();
  }

  throw new Error("Meta AI generation timed out (60s).");
}
