/**
 * content_bridge.js - Bi-directional data bridge between Next.js Web Dashboard & Chrome Extension Storage
 */

// Listen for messages from the Next.js Web Page
window.addEventListener('message', async (event) => {
  // Only accept messages from the window itself
  if (event.source !== window || !event.data || event.data.source !== 'REEL_ANALYZER_WEB') {
    return;
  }

  const { action, payload } = event.data;
  const targetOrigin = window.location.origin;

  if (action === 'PING_EXTENSION') {
    // Notify web app that extension is installed and active
    window.postMessage(
      {
        source: 'REEL_ANALYZER_EXT',
        action: 'PONG_EXTENSION',
        version: '1.1',
      },
      targetOrigin
    );
  } else if (action === 'GET_REELS_DATA') {
    try {
      chrome.storage.local.get(['reelsData', 'knowledgeTaxonomy'], (res) => {
        window.postMessage(
          {
            source: 'REEL_ANALYZER_EXT',
            action: 'SYNC_REELS_DATA',
            data: res.reelsData || [],
            taxonomy: res.knowledgeTaxonomy || {},
          },
          targetOrigin
        );
      });
    } catch (err) {
      console.error('Bridge error fetching storage:', err);
    }
  } else if (action === 'SAVE_REELS_DATA' && payload) {
    try {
      chrome.storage.local.set({ reelsData: payload }, () => {
        window.postMessage(
          {
            source: 'REEL_ANALYZER_EXT',
            action: 'DATA_SAVED_SUCCESS',
          },
          targetOrigin
        );
      });
    } catch (err) {
      console.error('Bridge error saving storage:', err);
    }
  }
});

// Listen for storage changes in real-time and notify the dashboard
try {
  if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && (changes.reelsData || changes.knowledgeTaxonomy)) {
        chrome.storage.local.get(['reelsData', 'knowledgeTaxonomy'], (res) => {
          window.postMessage(
            {
              source: 'REEL_ANALYZER_EXT',
              action: 'SYNC_REELS_DATA',
              data: res.reelsData || [],
              taxonomy: res.knowledgeTaxonomy || {},
            },
            window.location.origin
          );
        });
      }
    });
  }
} catch (e) {}

// Announce extension presence on load
window.postMessage(
  {
    source: 'REEL_ANALYZER_EXT',
    action: 'EXTENSION_READY',
    version: '1.1',
  },
  window.location.origin
);
