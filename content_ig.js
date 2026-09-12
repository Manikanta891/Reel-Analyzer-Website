/**
 * InstaReel Gemini Summarizer - Instagram Content Script
 * Extracts Reel data, unsaves reels, and navigates to the next reel.
 */

console.log("[InstaReel-AI] Instagram Content Script loaded.");

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
      console.error("[InstaReel-Gemini] Scrape error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }

  if (request.action === "UNSAVE_REEL") {
    try {
      const result = unsaveCurrentReel();
      sendResponse(result);
    } catch (err) {
      console.error("[InstaReel-Gemini] Unsave error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }

  if (request.action === "CLICK_NEXT") {
    try {
      const result = clickNextReel();
      sendResponse(result);
    } catch (err) {
      console.error("[InstaReel-Gemini] Next button error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }
});

/**
 * Extracts comprehensive Reel Data across both Saved Posts (/p/) and Reels Feed (/reels/)
 */
function extractReelData() {
  let reelUrl = window.location.href;
  
  // Find modal container, article element, or active video card in Reels feed
  let container = document.querySelector('div[role="dialog"]') || 
                  document.querySelector('article');

  if (!container) {
    // In /reels/ feed: find the active reel card closest to viewport center
    const videos = Array.from(document.querySelectorAll('video'));
    for (const v of videos) {
      const rect = v.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
        container = v.closest('div[class*="x1qjc9v5"]') || v.closest('div[style*="height"]') || v.parentElement?.parentElement || document.body;
        break;
      }
    }
  }

  // Fallback to document.body if currently on a reel page or /reels/ feed
  if (!container && (window.location.href.includes('/reel') || window.location.href.includes('/p/'))) {
    container = document.body;
  }

  if (!container && !window.location.href.includes('/reel') && !window.location.href.includes('/p/')) {
    throw new Error("Please click on any Reel in Instagram to open it first.");
  }

  const activeContainer = container || document.body;

  // Auto-expand "... more" if caption is collapsed in Reels feed
  try {
    const moreBtn = activeContainer.querySelector('span[role="button"]') ||
                    Array.from(activeContainer.querySelectorAll('div[role="button"], span')).find(el => {
                      const t = el.textContent.trim().toLowerCase();
                      return t === 'more' || t === '... more' || t === '… more' || t.endsWith('more');
                    });
    if (moreBtn && typeof moreBtn.click === 'function') {
      moreBtn.click();
    }
  } catch (e) {}

  // Find the true, exact Reel permalink (excluding audio pages and profile tabs)
  reelUrl = findTrueReelUrl(activeContainer);

  // Extract author username
  let author = "Unknown";
  const authorEl = activeContainer.querySelector('header a[role="link"]') || 
                   activeContainer.querySelector('header a') || 
                   activeContainer.querySelector('a[role="link"] span')?.closest('a') ||
                   activeContainer.querySelector('a[role="link"]');
  if (authorEl) {
    const rawAuthor = (authorEl.querySelector('span') || authorEl).textContent.trim().replace(/^@/, '');
    if (rawAuthor && !['follow', 'following', 'audio'].includes(rawAuthor.toLowerCase())) {
      author = rawAuthor;
    }
  }

  // Extract audio name if present
  let audioTitle = "";
  const audioEl = activeContainer.querySelector('a[href*="/audio/"]') ||
                  activeContainer.querySelector('header span');
  if (audioEl) {
    audioTitle = audioEl.textContent.trim();
  }

  // Deep extract clean caption text (avoiding UI status tokens)
  let fullText = [];
  
  // Priority 1: Primary caption container (_a9zs or h1)
  const primaryCaption = activeContainer.querySelector('div._a9zs') ||
                         activeContainer.querySelector('h1') || 
                         activeContainer.querySelector('ul li h1');
  if (primaryCaption && primaryCaption.textContent.trim()) {
    fullText.push(primaryCaption.textContent.trim());
  } else {
    // Priority 2: Text spans excluding UI labels and metrics
    const textSpans = Array.from(activeContainer.querySelectorAll('span[dir="auto"], div._a9zs'));
    textSpans.forEach(span => {
      const text = span.textContent.trim();
      const lower = text.toLowerCase();
      if (
        text.length > 3 &&
        !fullText.includes(text) &&
        !lower.includes('audio is muted') &&
        !lower.includes('audio is playing') &&
        !lower.includes('verified') &&
        !lower.includes('play button') &&
        !['follow', 'following', 'more', '... more', '… more', 'view more', 'original audio'].includes(lower) &&
        !/^\d+[\d,\.kKmM]*$/.test(text) // Exclude pure like/view counts
      ) {
        fullText.push(text);
      }
    });
  }

  const combinedCaption = fullText.join("\n\n");

  // Extract video source URL if available in DOM
  let videoSrc = "";
  const videoEl = activeContainer.querySelector('video');
  if (videoEl && videoEl.src) {
    videoSrc = videoEl.src;
  }

  return {
    url: reelUrl,
    author: author,
    audioTitle: audioTitle,
    caption: combinedCaption || "No text caption found in reel post.",
    videoSrc: videoSrc,
    timestamp: new Date().toISOString()
  };
}

/**
 * Robustly finds the true Instagram Reel URL, eliminating audio links and profile tabs
 */
function findTrueReelUrl(container) {
  // Regex strictly matching 9-15 char Instagram shortcodes (e.g., /p/DcCCPVVyt5l/ or /reel/DcCCPVVyt5l/)
  const shortcodeRegex = /\/(?:p|reel|reels)\/([A-Za-z0-9_-]{9,15})(?:\/|\?|$)/;

  // 1. Check window.location.href first if user is directly on a reel or post permalink
  if (window.location.href) {
    const locMatch = window.location.href.match(shortcodeRegex);
    if (locMatch && locMatch[1] && locMatch[1].toLowerCase() !== 'audio' && locMatch[1].toLowerCase() !== 'videos') {
      return `https://www.instagram.com/reel/${locMatch[1]}/`;
    }
  }

  // 2. Scan all links inside the container
  const allLinks = Array.from((container || document).querySelectorAll('a[href]'));

  // Prioritize timestamp links (<time>)
  for (const link of allLinks) {
    if (link.querySelector('time') || link.closest('time')) {
      const href = link.getAttribute('href') || '';
      const match = href.match(shortcodeRegex);
      if (match && match[1] && match[1].toLowerCase() !== 'audio' && match[1].toLowerCase() !== 'videos') {
        return `https://www.instagram.com/reel/${match[1]}/`;
      }
    }
  }

  // 3. Scan all valid anchor hrefs, excluding audio & profile tabs
  for (const link of allLinks) {
    const href = link.getAttribute('href') || '';
    if (href.includes('/audio/') || href.includes('/reels/audio/')) continue;
    if (href.match(/^\/[A-Za-z0-9._]+\/(?:reels|saved|tagged)\/?$/)) continue; // e.g. /imzache/reels/

    const match = href.match(shortcodeRegex);
    if (match && match[1] && match[1].toLowerCase() !== 'audio' && match[1].toLowerCase() !== 'videos') {
      return `https://www.instagram.com/reel/${match[1]}/`;
    }
  }

  return window.location.href;
}

/**
 * Removes (unsaves) the current reel from Saved collection
 */
function unsaveCurrentReel() {
  console.log("[InstaReel-Gemini] Searching for Instagram Remove/Saved bookmark button...");

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
  console.log("[InstaReel-Gemini] Found Remove SVG! Triggering full ancestor click cascade...", removeSvg);
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
      console.warn("[InstaReel-Gemini] Error dispatching on node:", el, err);
    }
  });
}

/**
 * Clicks the Next arrow button or dispatches navigation events (ArrowDown / ArrowRight / Scroll)
 */
function clickNextReel() {
  const container = document.querySelector('div[role="dialog"]') || 
                    document.querySelector('article') || 
                    document.body;

  // Strategy 1: Modal Next Button (Right Arrow icon)
  const nextSvg = container.querySelector('svg[aria-label="Next"]') || 
                  container.querySelector('svg[aria-label="Next slide"]') ||
                  document.querySelector('svg[aria-label="Next"]') ||
                  document.querySelector('div[role="dialog"] svg[aria-label="Next"]');

  if (nextSvg) {
    const btn = nextSvg.closest('button') || nextSvg.closest('div[role="button"]');
    if (btn) {
      simulateInstagramClick(btn);
      return { success: true, method: "button_click_next" };
    }
  }

  // Strategy 2: Reels Feed Down Chevron Button
  const downSvg = document.querySelector('svg[aria-label="Down chevron"]') ||
                  document.querySelector('svg[aria-label*="Down" i]');
  if (downSvg) {
    const btn = downSvg.closest('button') || downSvg.closest('div[role="button"]');
    if (btn) {
      simulateInstagramClick(btn);
      return { success: true, method: "button_click_down" };
    }
  }

  // Strategy 3: Next Link Element
  const nextLink = document.querySelector('a._a6wv') || document.querySelector('div._aa2m button');
  if (nextLink) {
    simulateInstagramClick(nextLink);
    return { success: true, method: "link_click" };
  }

  // Strategy 4: Keyboard Navigation (Dispatches BOTH ArrowDown for Reels Feed and ArrowRight for Modal)
  const targets = [document.activeElement, document.body, document, window].filter(Boolean);

  targets.forEach(target => {
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      code: 'ArrowRight',
      keyCode: 39,
      which: 39,
      bubbles: true,
      cancelable: true
    }));
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      which: 40,
      bubbles: true,
      cancelable: true
    }));
  });

  // Strategy 5: Vertical Scroll (for /reels/ feed)
  if (window.location.pathname.includes('/reels')) {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }

  return { success: true, method: "keyboard_navigation" };
}
