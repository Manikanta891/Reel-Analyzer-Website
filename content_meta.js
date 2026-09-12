/**
 * InstaReel Multi-AI Summarizer - Meta AI Content Script
 * Automates prompt injection and response extraction in Meta AI Web UI (meta.ai).
 */

console.log("[InstaReel-AI] Meta AI Content Script loaded.");

let lastSubmissionTime = 0;
let baselineResponseText = "";
let baselineResponseCount = 0;
let lastInjectedPrompt = "";

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
 * Retries up to 20 times (4 seconds total) — handles freshly opened tabs.
 */
function injectPromptAndSendMetaAI(promptText) {
  lastInjectedPrompt = promptText.trim();

  // Wait for the input element to appear in the DOM (handles new tab load)
  let waitAttempts = 0;
  const maxWait = 20;

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
  // Snapshot baseline BEFORE injecting
  const existingResponses = getMetaResponseElements();
  baselineResponseCount = existingResponses.length;
  baselineResponseText = existingResponses.length > 0
    ? (existingResponses[existingResponses.length - 1].innerText?.trim() || '')
    : '';
  lastSubmissionTime = Date.now();

  console.log(`[InstaReel-AI] Meta AI baseline: ${baselineResponseCount} messages, length: ${baselineResponseText.length}`);

  inputEl.focus();

  if (inputEl.tagName.toLowerCase() === 'textarea') {
    inputEl.value = promptText;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    // 1. Clear existing content
    try {
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);
    } catch (e) {}

    // 2. Dispatch native clipboard paste (Lexical parses this cleanly)
    try {
      const dt = new DataTransfer();
      dt.setData('text/plain', promptText);
      inputEl.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    } catch (e) {
      try { document.execCommand('insertText', false, promptText); } catch (err) {}
    }

    // Notify Lexical reactive store
    inputEl.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  // Wait 300ms for the editor to process paste, then try to submit
  setTimeout(() => trySubmitMetaOnce(inputEl, 0), 300);
}

function trySubmitMetaOnce(inputEl, attempts) {
  const maxAttempts = 20; // 20 × 200ms = 4 seconds of retries

  const sendBtn =
    document.querySelector('button[aria-label*="Send" i]') ||
    document.querySelector('button[aria-label*="Submit" i]') ||
    document.querySelector('div[role="button"][aria-label*="Send" i]') ||
    document.querySelector('button[type="submit"]') ||
    document.querySelector('[data-testid="send-button"]');

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
                  document.querySelector('[aria-label="Stop generating"]');

  const isStopActive = !!stopBtn;

  // Locate all response elements in Meta AI
  const responseEls = getMetaResponseElements();
  const currentCount = responseEls.length;

  let currentText = "";
  if (responseEls.length > 0) {
    const lastEl = responseEls[responseEls.length - 1];
    currentText = (lastEl.innerText || lastEl.textContent || "").trim();
  }

  // 1. If less than 3 seconds since submission, Meta AI is still preparing / starting request
  if (timeSinceSubmission < 3000) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: 0,
      text: "",
      provider: "meta"
    };
  }

  // 2. If no new message appeared yet and text is still identical to baseline
  if (currentCount <= baselineResponseCount && currentText === baselineResponseText) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: 0,
      text: "",
      provider: "meta"
    };
  }

  // 3. If stop button is active, generation is actively streaming
  if (isStopActive) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: currentText.length,
      text: currentText,
      provider: "meta"
    };
  }

  // 4. If we have a new response that is different from baseline and has meaningful content
  const hasNewContent = currentText !== baselineResponseText && currentText.length > 30;

  return {
    success: true,
    completed: hasNewContent && !isStopActive,
    isGenerating: isStopActive || !hasNewContent,
    textLength: currentText.length,
    text: hasNewContent ? currentText : "",
    provider: "meta"
  };
}

/**
 * Helper to collect all AI response message elements in Meta AI
 */
function getMetaResponseElements() {
  const candidateEls = Array.from(document.querySelectorAll(
    'div[dir="auto"], div.markdown, div[role="region"] div[tabindex="0"], div[class*="x1vjfegm"], div.html-div'
  ));

  return candidateEls.filter(el => {
    // Avoid input boxes and user prompt echoes
    if (el.isContentEditable || el.getAttribute('role') === 'textbox' || el.closest('[data-lexical-editor="true"]')) {
      return false;
    }
    const text = el.innerText?.trim() || "";
    if (text.length <= 40) return false;
    if (lastInjectedPrompt && text.includes(lastInjectedPrompt.substring(0, 35))) {
      return false;
    }
    return true;
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}
