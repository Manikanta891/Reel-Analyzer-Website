(() => {
  if (window.__instaReelMetaLoaded) {
    console.log("[InstaReel-AI] Meta AI Content Script already initialized. Skipping duplicate listener registration.");
    return;
  }
  window.__instaReelMetaLoaded = true;

  console.log("[InstaReel-AI] Meta AI Content Script loaded.");

  let lastSubmissionTime = 0;
  let baselineResponseText = "";
  let baselineResponseCount = 0;
  let lastInjectedPrompt = "";
  let isTurnPending = false;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "PING") {
      sendResponse({ status: "ok", url: window.location.href, provider: "meta" });
      return true;
    }

    if (request.action === "INJECT_PROMPT") {
      try {
        const result = injectPromptAndSendMetaAI(request.promptText);
        sendResponse(result);
      } catch (err) {
        console.error("[InstaReel-AI] Meta AI Prompt error:", err);
        sendResponse({ success: false, error: err.message });
      }
      return true;
    }

    if (request.action === "EXTRACT_RESPONSE") {
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

    // Snapshot current state before typing
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

    console.log(`[InstaReel-AI] Injecting prompt into Meta AI (baseline text len: ${baselineResponseText.length})...`);

    try {
      inputEl.focus();
    } catch (e) {}

    if (inputEl.tagName.toLowerCase() === 'textarea') {
      inputEl.value = promptText;
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // 1. Select and clear old text
      try {
        inputEl.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
      } catch (e) {}

      // 2. Insert text cleanly using execCommand
      try {
        document.execCommand('insertText', false, promptText);
      } catch (e) {}

      // 3. Check if editor is populated. Only fallback to clipboard paste if editor is still empty!
      const currentInputText = (inputEl.innerText || inputEl.textContent || "").trim();
      if (!currentInputText) {
        try {
          const dt = new DataTransfer();
          dt.setData('text/plain', promptText);
          inputEl.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
        } catch (e) {}
      }

      // 4. Trigger reactive input events
      inputEl.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }

    // Attempt button submit with retries
    setTimeout(() => trySubmitMetaOnce(inputEl, 0), 250);
  }

function trySubmitMetaOnce(inputEl, attempts) {
  const maxAttempts = 20; // 20 × 200ms = 4 seconds of retries

  const sendBtn =
    document.querySelector('button[aria-label*="Send" i]') ||
    document.querySelector('button[aria-label*="Submit" i]') ||
    document.querySelector('div[role="button"][aria-label*="Send" i]') ||
    document.querySelector('button[type="submit"]') ||
    document.querySelector('[data-testid="send-button"]') ||
    document.querySelector('svg[aria-label*="Send" i]')?.closest('button') ||
    document.querySelector('svg[aria-label*="Send" i]')?.closest('div[role="button"]');

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

  if (attempts < maxAttempts) {
    setTimeout(() => trySubmitMetaOnce(inputEl, attempts + 1), 200);
  } else {
    // Final fallback: Enter key
    console.log('[InstaReel-AI] Meta AI send button not found — trying Enter key fallback.');
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
    inputEl.dispatchEvent(new KeyboardEvent('keyup',  { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
  }
}

/**
 * Checks generation status and extracts the latest response text from Meta AI
 */
function extractLatestMetaAIResponse() {
  const timeSinceSubmission = Date.now() - lastSubmissionTime;

  // Check if Meta AI stop button or generation indicator is active
  const stopBtn = document.querySelector('button[aria-label*="Stop" i]') ||
                  document.querySelector('div[role="button"][aria-label*="Stop" i]') ||
                  document.querySelector('[aria-label="Stop generating"]') ||
                  document.querySelector('svg[aria-label*="Stop" i]')?.closest('button');

  const isStopActive = !!stopBtn;
  const currentText = getFullMetaAIResponseText();

  // 1. If less than 4.5 seconds since submission, Meta AI is still preparing / starting request
  if (timeSinceSubmission < 4500) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: 0,
      text: "",
      provider: "meta"
    };
  }

  // 2. If stop button is active, generation is actively streaming
  if (isStopActive) {
    isTurnPending = false;
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: currentText.length,
      text: currentText,
      provider: "meta"
    };
  }

  // 3. If no new response has started yet (identical to baseline or turn is still pending)
  if (currentText === baselineResponseText || currentText.length < 30) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: 0,
      text: "",
      provider: "meta"
    };
  }

  // 4. We have a completed response
  const hasNewContent = currentText !== baselineResponseText && currentText.length > 50;
  const isRefusal = /i cannot fulfill|i can't fulfill|i'm unable to|i cannot assist|as an ai language model/i.test(currentText) && currentText.length < 180;

  if (hasNewContent && !isStopActive) {
    isTurnPending = false;
  }

  return {
    success: true,
    completed: hasNewContent && !isStopActive,
    isGenerating: isStopActive || !hasNewContent,
    isRefusal: isRefusal,
    textLength: currentText.length,
    text: hasNewContent ? currentText : "",
    provider: "meta"
  };
}

/**
 * Super-Robust Assistant Turn Extractor for Meta AI:
 * Climbs from the lowest active response node up to the full assistant turn container.
 * This guarantees that multi-paragraph responses with interleaved code blocks, tables,
 * and lists are NEVER truncated or split into separate fragments.
 */
function getFullMetaAIResponseText() {
  const candidateLeaves = Array.from(document.querySelectorAll(
    'div.markdown, div[dir="auto"], div[class*="x1vjfegm"], div.html-div, pre, code'
  )).filter(el => {
    if (el.isContentEditable || el.closest('[data-lexical-editor="true"]') || el.getAttribute('role') === 'textbox') {
      return false;
    }
    const t = el.innerText?.trim() || "";
    if (t.length < 15) return false;
    if (lastInjectedPrompt && t.includes(lastInjectedPrompt.substring(0, 35))) return false;
    return true;
  });

  if (candidateLeaves.length === 0) return "";

  // Target the latest response leaf in the chat feed
  const lastLeaf = candidateLeaves[candidateLeaves.length - 1];

  // Walk up the DOM hierarchy to find the enclosing assistant turn container
  let curr = lastLeaf;
  let bestContainer = lastLeaf;

  for (let i = 0; i < 15 && curr && curr.parentElement && curr.parentElement !== document.body; i++) {
    const parent = curr.parentElement;
    const parentText = (parent.innerText || "").trim();

    // Do not climb into user prompt echo or input box
    if (lastInjectedPrompt && parentText.includes(lastInjectedPrompt.substring(0, 35))) {
      break;
    }
    if (parentText.includes("YOUR CURRENT KNOWLEDGE TAXONOMY") || parentText.includes("CLASSIFICATION RULES")) {
      break;
    }
    if (parent.querySelector('[data-lexical-editor="true"]') || parent.tagName === 'MAIN' || parent.id === 'root') {
      break;
    }

    bestContainer = parent;
    curr = parent;

    // If this container already captures the full start and end of the summary, we have the complete turn
    if ((parentText.includes("Core Premise") || parentText.includes("Domain:")) &&
        (parentText.includes("Golden Nugget") || parentText.includes("Takeaway") || parentText.includes("Named Entities"))) {
      break;
    }
  }

  let extracted = (bestContainer.innerText || bestContainer.textContent || "").trim();

  // Strip prompt preamble echoes if included in the turn
  const promptPreamblePatterns = [
    /YOUR CURRENT KNOWLEDGE TAXONOMY[\s\S]*?Analyze and extract 100%[^\n]*\n?/i,
    /CLASSIFICATION (?:INSTRUCTIONS|RULES)[\s\S]*?Analyze and extract 100%[^\n]*\n?/i,
    /At the very top of your response, output this exact metadata block[\s\S]*?Analyze and extract 100%[^\n]*\n?/i,
    /Analyze and extract 100% of the permanent, high-yield value[^\n]*\n?/i
  ];

  for (const pat of promptPreamblePatterns) {
    extracted = extracted.replace(pat, "").trim();
  }

  // Remove leading "Today" header if Meta AI added it
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
