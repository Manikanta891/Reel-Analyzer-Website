(() => {
  if (window.__instaReelIgLoaded) {
    console.log("[InstaReel-IG] Instagram Content Script already loaded. Skipping.");
    return;
  }
  window.__instaReelIgLoaded = true;

  console.log("[InstaReel-IG] Instagram Content Script loaded.");

  // Auto-detect logged-in Instagram username if not already stored
  try {
    setTimeout(() => {
      const profileLink = document.querySelector('a[href*="/saved/"]') ||
                          document.querySelector('a[href^="/"][role="link"] img[alt*="profile" i]')?.closest('a') ||
                          document.querySelector('svg[aria-label="Profile" i]')?.closest('a');
      if (profileLink && profileLink.getAttribute('href')) {
        const match = profileLink.getAttribute('href').match(/^\/([a-zA-Z0-9._]+)\/?/);
        if (match && match[1] && !['explore', 'reels', 'direct', 'stories', 'your_activity', 'accounts'].includes(match[1])) {
          chrome.storage.local.get({ igUsername: '' }, (res) => {
            if (!res.igUsername) {
              chrome.storage.local.set({ igUsername: match[1] });
            }
          });
        }
      }
    }, 1200);
  } catch (e) {}

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "PING") {
      sendResponse({ status: "ok", url: window.location.href });
      return true;
    }

  if (request.action === "SCRAPE_REEL") {
    try {
      const data = extractReelData();
      sendResponse({ success: true, data });
    } catch (err) {
      console.error("[InstaReel-IG] Scrape error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }

  if (request.action === "UNSAVE_REEL") {
    try {
      const result = unsaveCurrentReel();
      sendResponse(result);
    } catch (err) {
      console.error("[InstaReel-IG] Unsave error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }

  if (request.action === "CLICK_NEXT") {
    try {
      const result = clickNextReel();
      sendResponse(result);
    } catch (err) {
      console.error("[InstaReel-IG] Next button error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }
});

/**
 * Extracts Reel URL across both Saved Posts (/p/) and Reels Feed (/reels/)
 */
function extractReelData() {
  // Check for Instagram unavailable / broken / deleted page
  const bodyText = document.body.innerText || "";
  if (
    bodyText.includes("Sorry, this page isn't available.") ||
    bodyText.includes("The link you followed may be broken, or the page may have been removed.") ||
    (document.title && document.title.includes("Page Not Found"))
  ) {
    throw new Error("This Instagram post or reel is unavailable or has been deleted.");
  }

  const reelUrl = findTrueReelUrl();
  if (!reelUrl) {
    throw new Error("Please open any Reel in Instagram first.");
  }

  return {
    url: reelUrl,
    author: "Unknown"
  };
}

/**
 * Finds the currently visible/active article or dialog element in the viewport
 */
function getActiveScope() {
  // 1. If in a modal dialog, scope to that dialog
  const dialog = document.querySelector('div[role="dialog"]');
  if (dialog) return dialog;

  // 2. If multiple articles exist (Reels feed), find the one centered in the viewport
  const articles = Array.from(document.querySelectorAll('article'));
  if (articles.length === 1) return articles[0];
  if (articles.length > 1) {
    const midY = window.innerHeight / 2;
    const centerArticle = articles.find(art => {
      const rect = art.getBoundingClientRect();
      return rect.top <= midY && rect.bottom >= midY;
    });
    if (centerArticle) return centerArticle;

    // Fallback: find article with largest visible area in viewport
    let maxVisible = articles[0];
    let maxArea = 0;
    for (const art of articles) {
      const r = art.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
      if (visibleHeight > maxArea) {
        maxArea = visibleHeight;
        maxVisible = art;
      }
    }
    return maxVisible;
  }

  return document;
}

/**
 * Robustly finds the true Instagram Reel URL for the currently visible reel
 */
function findTrueReelUrl(container) {
  const shortcodeRegex = /\/(?:p|reel|reels)\/([A-Za-z0-9_-]{7,25})(?:\/|\?|$)/;
  const scope = container || getActiveScope();

  // 1. Scan links inside active visible scope first (prioritizing <time> permalinks)
  const timeLink = scope.querySelector('time')?.closest('a[href]');
  if (timeLink) {
    const href = timeLink.getAttribute('href') || '';
    const match = href.match(shortcodeRegex);
    if (match && match[1] && !['audio', 'videos', 'saved', 'tagged', 'explore', 'reels'].includes(match[1].toLowerCase())) {
      return `https://www.instagram.com/reels/${match[1]}/`;
    }
  }

  // 2. Scan all links inside active visible scope
  const allLinks = Array.from(scope.querySelectorAll('a[href]'));
  for (const link of allLinks) {
    const href = link.getAttribute('href') || '';
    if (href.includes('/audio/') || href.includes('/reels/audio/') || href.includes('/saved/')) continue;
    if (href.match(/^\/[A-Za-z0-9._]+\/(?:reels|saved|tagged)\/?$/)) continue;

    const match = href.match(shortcodeRegex);
    if (match && match[1] && !['audio', 'videos', 'saved', 'tagged', 'explore', 'reels'].includes(match[1].toLowerCase())) {
      return `https://www.instagram.com/reels/${match[1]}/`;
    }
  }

  // 3. Fallback: check window.location.href if directly on a permalink
  if (window.location.href) {
    const locMatch = window.location.href.match(shortcodeRegex);
    if (locMatch && locMatch[1] && !['audio', 'videos', 'saved', 'tagged', 'explore', 'reels'].includes(locMatch[1].toLowerCase())) {
      return `https://www.instagram.com/reels/${locMatch[1]}/`;
    }
  }

  return window.location.href;
}

/**
 * Removes (unsaves) the current reel from Saved collection
 */
function unsaveCurrentReel() {
  console.log("[InstaReel-IG] Searching for Instagram Remove/Saved bookmark button...");

  // 1. Target the exact SVG matching Instagram's Bookmark Remove icon:
  // <svg aria-label="Remove" ...><title>Remove</title><path d="M20 22a.999..."></path></svg>
  let removeSvg = document.querySelector('div[role="dialog"] svg[aria-label="Remove"]') ||
                  document.querySelector('article svg[aria-label="Remove"]') ||
                  document.querySelector('svg[aria-label="Remove"]') ||
                  document.querySelector('svg path[d*="M20 22"]')?.closest('svg') ||
                  document.querySelector('svg[aria-label*="Remove" i]') ||
                  document.querySelector('svg[aria-label*="Saved" i]');

  // Fallback: check svg titles
  if (!removeSvg) {
    const titles = Array.from(document.querySelectorAll('svg title'));
    for (const t of titles) {
      if (t.textContent.trim().toLowerCase() === 'remove') {
        removeSvg = t.closest('svg');
        break;
      }
    }
  }

  // If already unsaved (shows "Save" button)
  if (!removeSvg) {
    const saveSvg = document.querySelector('div[role="dialog"] svg[aria-label="Save"]') ||
                    document.querySelector('svg[aria-label="Save"]') ||
                    document.querySelector('svg[aria-label*="Save" i]');
    if (saveSvg && !saveSvg.getAttribute('aria-label')?.toLowerCase().includes('saved')) {
      return {
        success: true,
        status: "already_unsaved",
        message: "Reel is already unsaved (shows 'Save' bookmark outline)."
      };
    }

    // Collect diagnostic SVGs
    const allLabels = Array.from(document.querySelectorAll('svg'))
      .map(s => s.getAttribute('aria-label') || s.querySelector('title')?.textContent || '')
      .filter(Boolean);

    return {
      success: false,
      status: "button_not_found",
      error: `Could not find Remove SVG. Detected SVGs: [${allLabels.join(', ')}]`,
      availableLabels: allLabels
    };
  }

  // 2. Dispatch full pointer/mouse/click event sequence to SVG AND all ancestor containers
  console.log("[InstaReel-IG] Found Remove SVG! Triggering full ancestor click cascade...", removeSvg);
  simulateInstagramClick(removeSvg);

  return {
    success: true,
    status: "unsaved",
    message: "Successfully clicked Remove/Unsave on current reel!"
  };
}

/**
 * Dispatches full mouse, pointer, and click events across all ancestor nodes
 * to guarantee compatibility with Meta's React Fiber Pressable handlers.
 */
function simulateInstagramClick(startEl) {
  if (!startEl) return;

  // Collect branch of elements: svg -> parent -> parent's parent up 5 levels
  const elements = [];
  let curr = startEl;
  for (let i = 0; i < 6 && curr && curr !== document.body; i++) {
    elements.push(curr);
    if (curr.getAttribute('role') === 'button' || curr.tagName === 'BUTTON') {
      if (curr.parentElement && !elements.includes(curr.parentElement)) {
        elements.push(curr.parentElement);
      }
      break;
    }
    curr = curr.parentElement;
  }

  const rect = startEl.getBoundingClientRect();
  const clientX = rect.left + rect.width / 2;
  const clientY = rect.top + rect.height / 2;

  const eventInit = {
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window,
    detail: 1,
    screenX: clientX,
    screenY: clientY,
    clientX: clientX,
    clientY: clientY,
    button: 0,
    buttons: 1,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true
  };

  // Dispatch events to each node in the hierarchy
  elements.forEach(el => {
    try {
      el.focus?.();
      el.dispatchEvent(new PointerEvent('pointerover', eventInit));
      el.dispatchEvent(new MouseEvent('mouseover', eventInit));
      el.dispatchEvent(new PointerEvent('pointerenter', eventInit));
      el.dispatchEvent(new PointerEvent('pointerdown', eventInit));
      el.dispatchEvent(new MouseEvent('mousedown', eventInit));
      el.dispatchEvent(new PointerEvent('pointerup', eventInit));
      el.dispatchEvent(new MouseEvent('mouseup', eventInit));
      el.dispatchEvent(new MouseEvent('click', eventInit));
      if (typeof el.click === 'function') {
        el.click();
      }
    } catch (err) {
      console.warn("[InstaReel-IG] Error dispatching on node:", el, err);
    }
  });
}

/**
 * Clicks the Next arrow button or dispatches navigation events (ArrowDown / ArrowRight / Scroll)
 * Uses a clean waterfall strategy to avoid skipping multiple reels.
 */
function clickNextReel() {
  const isModal = !!document.querySelector('div[role="dialog"]');

  // Strategy 1: Modal View (Saved Posts modal dialog)
  if (isModal) {
    const dialog = document.querySelector('div[role="dialog"]');
    const article = dialog ? dialog.querySelector('article') : null;

    let nextPostBtn = null;

    // 1. Look for Next Post button OUTSIDE the article (to avoid carousel next slide inside article)
    if (dialog) {
      const allControls = Array.from(dialog.querySelectorAll('button, div[role="button"], a[role="link"], a[href*="/p/"], a[href*="/reel/"]'));
      const outsideControls = allControls.filter(el => {
        if (article && article.contains(el)) return false; // Exclude carousel slide arrows inside article
        return true;
      });

      for (const el of outsideControls) {
        const aria = (el.getAttribute('aria-label') || '').toLowerCase();
        const title = (el.querySelector('title')?.textContent || '').toLowerCase();
        const svgAria = (el.querySelector('svg')?.getAttribute('aria-label') || '').toLowerCase();

        if (aria.includes('next') || aria.includes('right') || title.includes('next') || title.includes('right') || svgAria.includes('next') || svgAria.includes('right')) {
          nextPostBtn = el;
          break;
        }
      }
    }

    // 2. Fallback: Instagram modal floating navigation wrappers (_aaqg, _aaqh, _a6wv)
    if (!nextPostBtn) {
      const candidates = Array.from(document.querySelectorAll('div[class*="_aaqg"] button, div[class*="_aaqh"] button, a._a6wv, a[class*="_a6wv"], div._aaqg, div._aaqh'))
        .filter(el => !(article && article.contains(el)));

      if (candidates.length > 0) {
        nextPostBtn = candidates[0].closest('button') || candidates[0].closest('a') || candidates[0];
      }
    }

    // 3. Fallback: Any button positioned on the right edge outside the article
    if (!nextPostBtn && dialog) {
      const rightEdgeBtns = Array.from(dialog.querySelectorAll('button, div[role="button"], a')).filter(el => {
        if (article && article.contains(el)) return false;
        const rect = el.getBoundingClientRect();
        return rect.left > window.innerWidth / 2 && rect.width > 20 && rect.height > 20;
      });
      if (rightEdgeBtns.length > 0) {
        nextPostBtn = rightEdgeBtns[0];
      }
    }

    if (nextPostBtn) {
      console.log("[InstaReel-IG] Modal view detected. Clicking Next Post button (outside article):", nextPostBtn);
      simulateInstagramClick(nextPostBtn);
      return { success: true, method: "modal_next_post_button" };
    }

    // Modal fallback: click on the right side of the screen
    console.log("[InstaReel-IG] Modal button not found — dispatching ArrowRight on dialog container.");
    const modalTarget = dialog || document.body;
    const arrowRightEvent = { key: "ArrowRight", code: "ArrowRight", keyCode: 39, which: 39, bubbles: true, cancelable: true };
    modalTarget.dispatchEvent(new KeyboardEvent("keydown", arrowRightEvent));
    modalTarget.dispatchEvent(new KeyboardEvent("keyup", arrowRightEvent));
    return { success: true, method: "modal_arrow_right" };
  }

  // Strategy 2: Reels Feed View (/reels/)
  // Check for Next / Down Chevron button in reels feed
  const feedNextBtn =
    document.querySelector('button[aria-label*="Down" i]') ||
    document.querySelector('svg[aria-label*="Down" i]')?.closest('button') ||
    document.querySelector('div[role="button"][aria-label*="Down" i]');

  if (feedNextBtn) {
    console.log("[InstaReel-IG] Feed Down button found. Clicking it.");
    simulateInstagramClick(feedNextBtn);
    return { success: true, method: "feed_button" };
  }

  // Single clean ArrowDown keyboard event
  console.log("[InstaReel-IG] Feed navigation — dispatching single ArrowDown and smooth scroll.");
  const target = document.activeElement || document.querySelector('video') || document.body;
  const arrowDownEvent = { key: "ArrowDown", code: "ArrowDown", keyCode: 40, which: 40, bubbles: true, cancelable: true };
  target.dispatchEvent(new KeyboardEvent("keydown", arrowDownEvent));
  target.dispatchEvent(new KeyboardEvent("keyup", arrowDownEvent));

  // Smooth scroll fallback
  const scrollDistance = window.innerHeight || 800;
  window.scrollBy({ top: scrollDistance, behavior: "smooth" });

  return { success: true, method: "feed_arrow_scroll" };
}
})();
