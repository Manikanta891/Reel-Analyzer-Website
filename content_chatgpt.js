/**
 * InstaReel Multi-AI Summarizer - ChatGPT Content Script
 * Automates prompt injection and response extraction in ChatGPT Web UI (chatgpt.com).
 */

console.log("[InstaReel-AI] ChatGPT Content Script loaded.");

let lastSubmissionTime = 0;
let baselineResponseText = "";
let baselineResponseCount = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PING") {
    sendResponse({ status: "ok", url: window.location.href, provider: "chatgpt" });
    return true;
  }

  if (request.action === "INJECT_PROMPT") {
    try {
      const result = injectPromptAndSendChatGPT(request.promptText);
      sendResponse(result);
    } catch (err) {
      console.error("[InstaReel-AI] ChatGPT Prompt error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }

  if (request.action === "EXTRACT_RESPONSE") {
    try {
      const result = extractLatestChatGPTResponse();
      sendResponse(result);
    } catch (err) {
      console.error("[InstaReel-AI] ChatGPT Extract error:", err);
      sendResponse({ success: false, error: err.message });
    }
    return true;
  }
});

/**
 * Finds ChatGPT input box, types text, and clicks Send
 */
function injectPromptAndSendChatGPT(promptText) {
  // Snapshot existing response state BEFORE injecting new prompt
  const existingResponses = getChatGPTResponseElements();
  baselineResponseCount = existingResponses.length;
  baselineResponseText = existingResponses.length > 0 ? (existingResponses[existingResponses.length - 1].innerText?.trim() || "") : "";
  lastSubmissionTime = Date.now();

  console.log(`[InstaReel-AI] ChatGPT baseline snapshot: ${baselineResponseCount} messages. Length: ${baselineResponseText.length}`);

  // Locate ChatGPT prompt input container
  const inputEl = document.querySelector('#prompt-textarea') ||
                  document.querySelector('div#prompt-textarea') ||
                  document.querySelector('textarea#prompt-textarea') ||
                  document.querySelector('div[contenteditable="true"]') ||
                  document.querySelector('textarea');

  if (!inputEl) {
    throw new Error("Could not locate ChatGPT prompt input box. Please ensure chatgpt.com is open.");
  }

  inputEl.focus();

  if (inputEl.tagName.toLowerCase() === 'textarea') {
    inputEl.value = promptText;
  } else if (inputEl.getAttribute('contenteditable') === 'true') {
    inputEl.innerHTML = promptText.split('\n').map(l => `<p>${escapeHtml(l) || '<br>'}</p>`).join('');
  } else {
    inputEl.textContent = promptText;
  }

  // Trigger input events for React / ProseMirror state
  inputEl.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  inputEl.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

  // Atomic single-submission helper for React / ProseMirror
  let submitted = false;
  let attempts = 0;
  const maxAttempts = 8;

  function trySubmitChatGPTOnce() {
    if (submitted) return;

    const sendBtn = document.querySelector('button[data-testid="send-button"]') ||
                    document.querySelector('button[aria-label="Send prompt"]') ||
                    document.querySelector('button[aria-label*="Send" i]') ||
                    document.querySelector('button[data-testid="fruitjuice-send-button"]') ||
                    document.querySelector('button[type="submit"]');

    if (sendBtn && !sendBtn.disabled && sendBtn.getAttribute('aria-disabled') !== 'true') {
      submitted = true;
      try {
        sendBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
        sendBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        sendBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
        sendBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        sendBtn.click();
      } catch (err) {
        sendBtn.click();
      }
      return;
    }

    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(trySubmitChatGPTOnce, 150);
    } else if (!submitted) {
      submitted = true;
      inputEl.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      }));
      inputEl.dispatchEvent(new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      }));
    }
  }

  // Trigger submission attempt
  setTimeout(trySubmitChatGPTOnce, 250);

  return { success: true, status: "submitted", provider: "chatgpt" };
}

/**
 * Checks generation status and extracts the latest response text from ChatGPT
 */
function extractLatestChatGPTResponse() {
  const timeSinceSubmission = Date.now() - lastSubmissionTime;

  // Check if ChatGPT is still generating: Stop button or streaming class
  const stopBtn = document.querySelector('button[data-testid="stop-button"]') ||
                  document.querySelector('button[aria-label="Stop streaming"]') ||
                  document.querySelector('button[aria-label*="Stop" i]') ||
                  document.querySelector('.result-streaming');

  const isStopActive = !!stopBtn;

  // Locate assistant response elements in conversation
  const responseEls = getChatGPTResponseElements();
  const currentCount = responseEls.length;

  let currentText = "";
  if (responseEls.length > 0) {
    const lastAssistant = responseEls[responseEls.length - 1];
    currentText = (lastAssistant.innerText || lastAssistant.textContent || "").trim();
  }

  // 1. Initial 2.5s debounce: ChatGPT network request in transit
  if (timeSinceSubmission < 2500) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: 0,
      text: "",
      provider: "chatgpt"
    };
  }

  // 2. If no new message appeared yet and text equals baseline
  if (currentCount <= baselineResponseCount && currentText === baselineResponseText) {
    return {
      success: true,
      completed: false,
      isGenerating: true,
      textLength: 0,
      text: "",
      provider: "chatgpt"
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
      provider: "chatgpt"
    };
  }

  const hasNewContent = currentText !== baselineResponseText && currentText.length > 30;

  return {
    success: true,
    completed: hasNewContent && !isStopActive,
    isGenerating: isStopActive || !hasNewContent,
    textLength: currentText.length,
    text: hasNewContent ? currentText : "",
    provider: "chatgpt"
  };
}

function getChatGPTResponseElements() {
  return Array.from(document.querySelectorAll(
    'div[data-message-author-role="assistant"], article[data-testid^="conversation-turn"] .markdown, .agent-turn .markdown, div.markdown, .prose'
  ));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}
