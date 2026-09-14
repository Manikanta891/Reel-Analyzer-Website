(() => {
  if (window.__instaReelMetaLoaded) {
    console.log("[InstaReel-AI] Meta AI Content Script already initialized. Skipping duplicate listener registration.");
    return;
  }
  window.__instaReelMetaLoaded = true;

  console.log("[InstaReel-AI] Meta AI Content Script loaded.");

  let lastSubmissionTime = 0;
  let baselineResponseText = "";
  let lastInjectedPrompt = "";
  let isTurnPending = false;
  let hasSeenGenerating = false;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request) return false;

    if (request.action === "PING") {
      const inputEl = document.querySelector('[data-lexical-editor="true"]') ||
                      document.querySelector('div[contenteditable="true"]') ||
                      document.querySelector('div[role="textbox"]') ||
                      document.querySelector('textarea') ||
                      document.querySelector('form textarea');
      const isLoggedIn = !!inputEl;
      sendResponse({ status: "ok", url: window.location.href, provider: "meta", isLoggedIn, hasInput: isLoggedIn });
      return true;
    }

    if (request.action === "INJECT_PROMPT" || request.action === "INJECT_AND_SEND") {
      try {
        const text = request.prompt || request.promptText || "";
        const result = injectPromptAndSendMetaAI(text);
        sendResponse(result);
      } catch (err) {
        console.error("[InstaReel-AI] Meta AI Prompt error:", err);
        sendResponse({ success: false, error: err.message });
      }
      return true;
    }

    if (request.action === "EXTRACT_RESPONSE" || request.action === "CHECK_AI_RESPONSE") {
      try {
        const result = extractLatestMetaAIResponse();
        sendResponse(result);
      } catch (err) {
        console.error("[InstaReel-AI] Meta AI Extract error:", err);
        sendResponse({ success: false, error: err.message });
      }
      return true;
    }
  });

  /**
   * Waits until the Meta AI input element is available, then injects and submits prompt.
   * Retries up to 25 times (5 seconds total) — handles freshly opened tabs.
   */
  function injectPromptAndSendMetaAI(promptText) {
    lastInjectedPrompt = promptText.trim();
    isTurnPending = true;
    hasSeenGenerating = false;

    // Snapshot existing response state before typing new turn
    baselineResponseText = getFullMetaAIResponseText();
    lastSubmissionTime = Date.now();

    let waitAttempts = 0;
    const maxWait = 25;

    function waitForInputThenInject() {
      const inputEl = document.querySelector('[data-lexical-editor="true"]') ||
                      document.querySelector('div[contenteditable="true"]') ||
                      document.querySelector('div[role="textbox"]') ||
                      document.querySelector('textarea') ||
                      document.querySelector('form textarea');

      if (!inputEl && waitAttempts < maxWait) {
        waitAttempts++;
        setTimeout(waitForInputThenInject, 200);
        return;
      }

      if (!inputEl) {
        console.error('[InstaReel-AI] Meta AI input not found after waiting.');
        return;
      }

      doInjectAndSubmit(inputEl, promptText);
    }

    waitForInputThenInject();
    return { success: true, status: 'submitted', provider: 'meta' };
  }

  function doInjectAndSubmit(inputEl, promptText) {
    lastSubmissionTime = Date.now();
    isTurnPending = true;
    hasSeenGenerating = false;

    console.log(`[InstaReel-AI] Injecting prompt into Meta AI (len: ${promptText.length})...`);

    try {
      inputEl.focus();
    } catch (e) {}

    if (inputEl.tagName && inputEl.tagName.toLowerCase() === 'textarea') {
      inputEl.value = promptText;
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // 1. Focus and clear existing text
      try {
        inputEl.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
      } catch (e) {}

      // 2. Insert text via single DataTransfer paste event
      // Meta AI's Lexical editor natively listens to onPaste, parsing all newlines and YAML blocks cleanly
      try {
        const dt = new DataTransfer();
        dt.setData('text/plain', promptText);
        inputEl.dispatchEvent(new ClipboardEvent('paste', {
          clipboardData: dt,
          bubbles: true,
          cancelable: true
        }));
      } catch (e) {
        console.warn('[InstaReel-AI] Clipboard paste error, fallback to insertText:', e);
        try {
          document.execCommand('insertText', false, promptText);
        } catch (e2) {}
      }

      // 3. Trigger reactive events
      inputEl.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }

    // Attempt button submit with retries
    setTimeout(() => trySubmitMetaOnce(inputEl, 0), 350);
  }

  function trySubmitMetaOnce(inputEl, attempts) {
    const maxAttempts = 25; // 25 × 200ms = 5 seconds of retries

    const sendBtn =
      document.querySelector('button[aria-label*="Send" i]') ||
      document.querySelector('button[aria-label*="Submit" i]') ||
      document.querySelector('div[role="button"][aria-label*="Send" i]') ||
      document.querySelector('button[type="submit"]') ||
      document.querySelector('[data-testid="send-button"]') ||
      document.querySelector('svg[aria-label*="Send" i]')?.closest('button') ||
      document.querySelector('svg[aria-label*="Send" i]')?.closest('div[role="button"]') ||
      document.querySelector('form button:not([disabled])');

    if (sendBtn && !sendBtn.disabled && sendBtn.getAttribute('aria-disabled') !== 'true') {
      try {
        sendBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
        sendBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        sendBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
        sendBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        sendBtn.click();
      } catch (err) {
        sendBtn.click();
      }
      console.log(`[InstaReel-AI] Meta AI send button clicked on attempt ${attempts + 1}`);
      return;
    }

    // Key fallback if attempts reach 3
    if (attempts >= 3 && inputEl) {
      try {
        inputEl.focus();
        inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
        inputEl.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
        inputEl.dispatchEvent(new KeyboardEvent('keyup',  { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
      } catch (e) {}
    }

    if (attempts < maxAttempts) {
      setTimeout(() => trySubmitMetaOnce(inputEl, attempts + 1), 200);
    }
  }

  /**
   * Checks generation status and extracts the latest response text from Meta AI
   */
  function extractLatestMetaAIResponse() {
    const timeSinceSubmission = Date.now() - lastSubmissionTime;

    // Check specifically for active Stop generating button
    const stopBtn = document.querySelector('button[aria-label="Stop generating" i]') ||
                    document.querySelector('button[aria-label="Stop" i]') ||
                    document.querySelector('div[role="button"][aria-label="Stop generating" i]') ||
                    document.querySelector('div[role="button"][aria-label="Stop" i]') ||
                    document.querySelector('[data-testid="stop-button"]');

    const isStopActive = !!stopBtn;
    const currentText = getFullMetaAIResponseText();

    // If stop button is active, generation is actively streaming
    if (isStopActive) {
      isTurnPending = false;
      hasSeenGenerating = true;
      return {
        success: true,
        completed: false,
        isGenerating: true,
        textLength: currentText.length,
        text: currentText,
        provider: "meta"
      };
    }

    // If this turn is still pending submission/start
    if (isTurnPending) {
      // If we just submitted within the last 3.5s, wait for Meta AI to start processing
      if (timeSinceSubmission < 3500) {
        return {
          success: true,
          completed: false,
          isGenerating: true,
          textLength: 0,
          text: "",
          provider: "meta"
        };
      }

      // If current response text matches the previous turn's baseline and < 20s passed, still waiting
      if (baselineResponseText && currentText === baselineResponseText && timeSinceSubmission < 20000) {
        return {
          success: true,
          completed: false,
          isGenerating: true,
          textLength: 0,
          text: "",
          provider: "meta"
        };
      }
    }

    // Response has arrived and is new/substantive
    const isNewContent = !baselineResponseText || currentText !== baselineResponseText || hasSeenGenerating;
    const hasContent = currentText.length > 30 && isNewContent;

    if (hasContent) {
      isTurnPending = false;
    }

    return {
      success: true,
      completed: hasContent,
      isGenerating: isTurnPending && !hasContent,
      textLength: currentText.length,
      text: hasContent ? currentText : "",
      provider: "meta"
    };
  }

/**
 * Lightweight & Robust DOM-to-Markdown Serializer
 * Converts Meta AI's rendered HTML tree into clean, standard Markdown.
 */
function htmlToMarkdown(element) {
  if (!element) return "";

  function walk(node) {
    if (!node) return "";

    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const tag = node.tagName.toLowerCase();

    // Skip scripts, styles, SVG icons, and copy buttons
    if (["script", "style", "svg", "button"].includes(tag)) {
      return "";
    }

    // Preformatted code blocks
    if (tag === "pre") {
      const codeEl = node.querySelector("code") || node;
      const langMatch = codeEl.className.match(/(?:lang|language)-(\w+)/);
      const lang = langMatch ? langMatch[1] : "";
      const codeContent = codeEl.textContent.replace(/\r\n/g, "\n").trim();
      return `\n\`\`\`${lang}\n${codeContent}\n\`\`\`\n\n`;
    }

    // Inline code
    if (tag === "code") {
      const parent = node.parentElement;
      if (parent && parent.tagName.toLowerCase() === "pre") {
        return node.textContent;
      }
      return `\`${node.textContent}\``;
    }

    let childrenText = "";
    for (const child of node.childNodes) {
      childrenText += walk(child);
    }

    switch (tag) {
      case "h1":
        return `\n# ${childrenText.trim()}\n\n`;
      case "h2":
        return `\n## ${childrenText.trim()}\n\n`;
      case "h3":
        return `\n### ${childrenText.trim()}\n\n`;
      case "h4":
        return `\n#### ${childrenText.trim()}\n\n`;
      case "h5":
        return `\n##### ${childrenText.trim()}\n\n`;
      case "h6":
        return `\n###### ${childrenText.trim()}\n\n`;
      case "p":
        return `${childrenText.trim()}\n\n`;
      case "strong":
      case "b":
        return childrenText.trim() ? `**${childrenText.trim()}**` : "";
      case "em":
      case "i":
        return childrenText.trim() ? `*${childrenText.trim()}*` : "";
      case "s":
      case "del":
        return `~~${childrenText.trim()}~~`;
      case "blockquote":
        return `\n> ${childrenText.trim().replace(/\n/g, "\n> ")}\n\n`;
      case "ul":
        return `\n${childrenText.trim()}\n\n`;
      case "ol":
        return `\n${childrenText.trim()}\n\n`;
      case "li": {
        const parent = node.parentElement;
        if (parent && parent.tagName.toLowerCase() === "ol") {
          const idx = Array.from(parent.children).indexOf(node) + 1;
          return `${idx}. ${childrenText.trim()}\n`;
        }
        return `- ${childrenText.trim()}\n`;
      }
      case "hr":
        return `\n---\n\n`;
      case "br":
        return `\n`;
      case "a": {
        const href = node.getAttribute("href");
        const title = childrenText.trim() || href;
        return href ? `[${title}](${href})` : title;
      }
      case "table": {
        const rows = Array.from(node.querySelectorAll("tr"));
        if (rows.length === 0) return "";
        let tableMd = "\n";
        rows.forEach((row, idx) => {
          const cells = Array.from(row.querySelectorAll("th, td"));
          const rowStr = "| " + cells.map(c => c.textContent.trim().replace(/\|/g, "\\|")).join(" | ") + " |";
          tableMd += rowStr + "\n";
          if (idx === 0) {
            tableMd += "| " + cells.map(() => "---").join(" | ") + " |\n";
          }
        });
        return tableMd + "\n";
      }
      default:
        return childrenText;
    }
  }

  try {
    let md = walk(element).trim();
    md = md.replace(/\n{3,}/g, "\n\n");
    return md;
  } catch (err) {
    console.warn("[InstaReel-AI] htmlToMarkdown fallback to innerText:", err);
    return (element.innerText || "").trim();
  }
}

/**
 * Super-Robust Multi-Strategy Assistant Turn Extractor for Meta AI
 */
function getFullMetaAIResponseText() {
  const editor = document.querySelector('[data-lexical-editor="true"]') ||
                 document.querySelector('div[contenteditable="true"]') ||
                 document.querySelector('div[role="textbox"]');

  // Strategy 1: Check for standard markdown containers in Meta AI
  const markdownContainers = Array.from(document.querySelectorAll('div.markdown, div[class*="markdown"], div[data-testid*="message-response"], div[data-testid*="bot-message"]'))
    .filter(el => !(editor && (el === editor || editor.contains(el))));

  if (markdownContainers.length > 0) {
    const lastMd = markdownContainers[markdownContainers.length - 1];
    let txt = htmlToMarkdown(lastMd) || (lastMd.innerText || "").trim();
    if (
      txt.length > 30 &&
      !txt.startsWith("Analyze the attached Instagram Reel") &&
      !txt.startsWith("Follow ALL rules") &&
      !txt.includes("CURRENT KNOWLEDGE TAXONOMY:")
    ) {
      return txt.replace(/^Today\s*\n+/i, "").trim();
    }
  }

  // Strategy 2: Look for containers containing the YAML header
  const allElements = Array.from(document.querySelectorAll('main div, section div, div[role="main"] div, article, div[dir="auto"]'))
    .filter(el => {
      if (editor && (el === editor || editor.contains(el))) return false;
      if (el.isContentEditable) return false;
      const t = (el.innerText || "").trim();
      return t.includes("---") && (t.includes("domain:") || t.includes("subject:"));
    });

  if (allElements.length > 0) {
    let largest = allElements[0];
    for (const el of allElements) {
      const t = (el.innerText || "").trim();
      if (
        !t.startsWith("Analyze the attached Instagram Reel") &&
        !t.startsWith("Follow ALL rules") &&
        !t.includes("CURRENT KNOWLEDGE TAXONOMY:") &&
        t.length > (largest.innerText || "").trim().length
      ) {
        largest = el;
      }
    }
    let txt = htmlToMarkdown(largest) || (largest.innerText || "").trim();
    if (txt.includes("---")) {
      const idx = txt.lastIndexOf("---");
      if (idx > 0 && (txt.includes("Analyze the attached Instagram Reel") || txt.includes("Follow ALL rules"))) {
        txt = txt.slice(idx).trim();
      }
    }
    if (txt.length > 30) {
      return txt.replace(/^Today\s*\n+/i, "").trim();
    }
  }

  // Strategy 3: General leaf collection fallback
  const candidateLeaves = Array.from(document.querySelectorAll(
    'div[dir="auto"], div[class*="x1vjfegm"], div.html-div, pre, code'
  )).filter((el) => {
    if (editor && (el === editor || editor.contains(el))) return false;
    if (el.isContentEditable || el.getAttribute('role') === 'textbox') return false;
    const t = (el.innerText || "").trim();
    if (t.length < 15) return false;
    if (
      t.startsWith("Analyze the attached Instagram Reel") ||
      t.startsWith("Follow ALL rules") ||
      t.startsWith("Extract this Reel") ||
      t.includes("CURRENT KNOWLEDGE TAXONOMY:") ||
      t.includes("CLASSIFICATION RULES:")
    ) return false;
    if (lastInjectedPrompt && t === lastInjectedPrompt) return false;
    return true;
  });

  if (candidateLeaves.length === 0) return "";

  const lastLeaf = candidateLeaves[candidateLeaves.length - 1];
  let curr = lastLeaf;
  let bestContainer = lastLeaf;

  for (let i = 0; i < 8 && curr && curr.parentElement && curr.parentElement !== document.body; i++) {
    const parent = curr.parentElement;
    if (editor && parent.contains(editor)) break;
    if (parent.querySelector('[data-lexical-editor="true"]')) break;
    if (parent.tagName === 'MAIN' || parent.id === 'root') break;

    const parentText = (parent.innerText || "").trim();
    if (parentText.includes("Analyze the attached Instagram Reel") || parentText.includes("CLASSIFICATION RULES:")) {
      break;
    }

    bestContainer = parent;
    curr = parent;
  }

  let extracted = htmlToMarkdown(bestContainer) || (bestContainer.innerText || bestContainer.textContent || "").trim();
  extracted = extracted.replace(/^Today\s*\n+/i, "").trim();
  return extracted;
}

function getMetaResponseElements() {
  const text = getFullMetaAIResponseText();
  return text ? [{ innerText: text }] : [];
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}
})();
