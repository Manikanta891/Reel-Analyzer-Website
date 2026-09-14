(() => {
  if (window.__instaReelGeminiLoaded) {
    console.log("[InstaReel-AI] Gemini Content Script already loaded. Skipping.");
    return;
  }
  window.__instaReelGeminiLoaded = true;

  console.log("[InstaReel-AI] Gemini Content Script loaded.");

  let lastSubmissionTime = 0;
  let baselineResponseText = "";
  let baselineResponseCount = 0;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "PING") {
      sendResponse({ status: "ok", url: window.location.href, provider: "gemini" });
      return true;
    }

  if (request.action === "INJECT_PROMPT") {
    try {
      const result = injectPromptAndSend(request.promptText);
      sendResponse(result);
    } catch (err) {
      console.error("[InstaReel-AI] Gemini Prompt error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }

  if (request.action === "EXTRACT_RESPONSE") {
    try {
      const result = extractLatestResponse();
      sendResponse(result);
    } catch (err) {
      console.error("[InstaReel-AI] Gemini Extract error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }
});

/**
 * Injects prompt text into Gemini input box and simulates pressing Send
 */
function injectPromptAndSend(promptText) {
  // Wait for input element readiness (handles freshly opened Gemini tab)
  let waitAttempts = 0;
  const maxWait = 20;

  function waitForEditorThenInject() {
    const editorEl =
      document.querySelector('rich-textarea div[contenteditable="true"]') ||
      document.querySelector('div.ql-editor') ||
      document.querySelector('rich-textarea p') ||
      document.querySelector('div[contenteditable="true"]') ||
      document.querySelector('textarea') ||
      document.querySelector('div[role="textbox"]');

    if (!editorEl && waitAttempts < maxWait) {
      waitAttempts++;
      setTimeout(waitForEditorThenInject, 200);
      return;
    }

    if (!editorEl) {
      console.error('[InstaReel-AI] Gemini editor not found after waiting.');
      return;
    }

    doGeminiInjectAndSubmit(editorEl, promptText);
  }

  // Snapshot baseline BEFORE starting wait
  const existingResponses = getGeminiResponseElements();
  baselineResponseCount = existingResponses.length;
  baselineResponseText = existingResponses.length > 0 ? (existingResponses[existingResponses.length - 1].innerText?.trim() || '') : '';
  lastSubmissionTime = Date.now();

  console.log(`[InstaReel-AI] Gemini baseline: ${baselineResponseCount} messages, length: ${baselineResponseText.length}`);

  waitForEditorThenInject();
  return { success: true, status: 'submitted', provider: 'gemini' };
}

function doGeminiInjectAndSubmit(editorEl, promptText) {
  editorEl.focus();

  if (editorEl.tagName.toLowerCase() === 'textarea') {
    editorEl.value = promptText;
    editorEl.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    // 1. Clear existing text
    try {
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);
    } catch (e) {}

    // 2. Paste event (Quill/Angular in Gemini updates on paste)
    let pasted = false;
    try {
      const dt = new DataTransfer();
      dt.setData('text/plain', promptText);
      const pasteEvt = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
      editorEl.dispatchEvent(pasteEvt);
      pasted = editorEl.textContent.trim().length > 0;
    } catch (e) { pasted = false; }

    // 3. Fallback: execCommand insertText
    if (!pasted || !editorEl.textContent.trim()) {
      try { document.execCommand('insertText', false, promptText); } catch (e) {}
    }

    // 4. Final fallback: innerHTML paragraphs
    if (!editorEl.textContent.trim()) {
      editorEl.innerHTML = promptText.split('\n').map(l => `<p>${escapeHtml(l) || '<br>'}</p>`).join('');
    }
  }

  // Trigger reactive input events for Gemini / Angular
  try {
    editorEl.dispatchEvent(new InputEvent('beforeinput', {
      bubbles: true, cancelable: true, inputType: 'insertText', data: promptText
    }));
  } catch (e) {}

  editorEl.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  editorEl.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

  const parentRich = editorEl.closest('rich-textarea');
  if (parentRich) {
    parentRich.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    parentRich.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  // Wait 300ms for editor to process content, then submit
  setTimeout(() => trySubmitGeminiOnce(editorEl, 0), 300);
}

function trySubmitGeminiOnce(editorEl, attempts) {
  const maxAttempts = 20; // 20 × 200ms = 4 seconds of retries

  const sendBtn =
    document.querySelector('button[aria-label*="Send" i]') ||
    document.querySelector('button.send-button') ||
    document.querySelector('button[jsname="Q42zjd"]') ||
    document.querySelector('.send-button-container button') ||
    document.querySelector('button[aria-label="Send message"]') ||
    document.querySelector('button[type="submit"]');

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
    console.log(`[InstaReel-AI] Gemini send button clicked on attempt ${attempts + 1}`);
    return;
  }

  if (attempts < maxAttempts) {
    setTimeout(() => trySubmitGeminiOnce(editorEl, attempts + 1), 200);
  } else {
    // Final Enter key fallback
    console.log('[InstaReel-AI] Gemini send button not found — using Enter key fallback.');
    editorEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
    editorEl.dispatchEvent(new KeyboardEvent('keyup',  { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
  }
}


/**
 * Checks generation status and extracts the latest response text from Gemini
 */
function extractLatestResponse() {
  const timeSinceSubmission = Date.now() - lastSubmissionTime;

  // Check for Stop generation button (by aria-label, text, or SVG)
  const stopBtn = document.querySelector('button[aria-label*="Stop" i]') ||
                  document.querySelector('button[aria-label*="stop" i]') ||
                  document.querySelector('button[mat-icon-button][aria-label*="stop" i]') ||
                  document.querySelector('button .mat-icon[data-mat-icon-name="stop"]') ||
                  document.querySelector('mat-icon[data-mat-icon-name="stop"]');

  const isStopActive = !!stopBtn;

  // Locate response elements (standard Gemini containers)
  const responseEls = getGeminiResponseElements();
  const currentCount = responseEls.length;

  let currentText = "";
  if (responseEls.length > 0) {
    const lastResponse = responseEls[responseEls.length - 1];
    
    // Clone element to safely strip citations, sources, draft switchers without mutating page
    const clone = lastResponse.cloneNode(true);
    clone.querySelectorAll('sources-list, .sources-list, [data-test-id="sources-list"], .citation-container, button[aria-label*="draft" i], .draft-selector').forEach(el => el.remove());
    
    currentText = (clone.innerText || clone.textContent || "").trim();
  }

  // 1. Initial 2.5s debounce: Gemini is still making network request
  if (timeSinceSubmission < 2500) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: 0,
      text: "",
      provider: "gemini"
    };
  }

  // 2. If no new response appeared yet and text equals baseline
  if (currentCount <= baselineResponseCount && currentText === baselineResponseText) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: 0,
      text: "",
      provider: "gemini"
    };
  }

  // 3. Stop button active means still streaming
  if (isStopActive) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: currentText.length,
      text: currentText,
      provider: "gemini"
    };
  }

  const hasNewContent = currentText !== baselineResponseText && currentText.length > 30;
  const isRefusal = /i cannot fulfill|i can't fulfill|i'm unable to|i cannot assist|as an ai language model/i.test(currentText) && currentText.length < 180;

  return {
    success: true,
    completed: hasNewContent && !isStopActive,
    isGenerating: isStopActive || !hasNewContent,
    isRefusal: isRefusal,
    textLength: currentText.length,
    text: hasNewContent ? currentText : "",
    provider: "gemini"
  };
}

/**
 * Helper to collect response containers in Gemini Web UI.
 * Filters out nested children to preserve the full message bubble.
 */
function getGeminiResponseElements() {
  const modelResponses = Array.from(document.querySelectorAll('model-response, message-content')).filter(el => {
    const text = el.innerText?.trim() || "";
    return text.length > 20;
  });
  if (modelResponses.length > 0) {
    return modelResponses;
  }

  const candidateEls = Array.from(document.querySelectorAll(
    '.response-container-content, div.markdown, .model-response-text'
  ));

  const valid = candidateEls.filter(el => {
    if (el.isContentEditable || el.getAttribute('role') === 'textbox' || el.closest('rich-textarea')) {
      return false;
    }
    const text = el.innerText?.trim() || "";
    return text.length > 20;
  });

  // Keep outermost containers only
  const outermost = valid.filter((el, _, arr) => {
    return !arr.some(parent => parent !== el && parent.contains(el));
  });

  return outermost;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}
})();
