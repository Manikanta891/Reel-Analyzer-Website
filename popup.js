/**
 * InstaReel Multi-AI Summarizer - Side Panel Script
 * Manages model card selection, custom prompt editor with live defaults, automated batch execution, and simplified unsaving.
 */

const DEFAULT_PROMPTS = {
  meta: `Summarize and extract key actionable insights from this Instagram Reel: {url}

🎯 INSTRUCTIONS:
1. Core Breakdown: Summarize what this Reel is teaching/demonstrating in 2-3 concise sentences.
2. Tools & Tech Mentioned: List all libraries, tools, repositories, extensions, prompts, or methods with exact names.
3. Step-by-Step Actionables: Extract the exact workflow, code snippet, or implementation steps shown.
4. Key Takeaway: Why is this valuable and how can a developer/creator apply it immediately?

Format with clean markdown bullet points, bold keywords, and section headers.
(Post context: {caption})`,

  gemini: `Analyze and extract actionable knowledge from the following Instagram Reel:

📌 Author: @{author}
🎵 Audio Track: {audio}
🔗 Reel URL: {url}

--- EXTRACTED POST SCRIPT, CAPTION & TEXT ---
{caption}
----------------------------------------------

🎯 INSTRUCTIONS:
1. Core Summary: Explain what is being demonstrated or taught in 2-3 concise sentences.
2. Tools, Tech & Resources: List every library, tool, extension, repository, prompt, or technique referenced.
3. Actionable Breakdown: Detail the step-by-step method, architecture, or code shown in the reel.
4. Key Takeaways: Provide high-yield bullet points for immediate practical application.

Format cleanly with markdown section headers, bold terms, and structured lists.`,

  chatgpt: `Analyze and extract actionable knowledge from the following Instagram Reel:

📌 Author: @{author}
🎵 Audio Track: {audio}
🔗 Reel URL: {url}

--- EXTRACTED POST SCRIPT, CAPTION & TEXT ---
{caption}
----------------------------------------------

🎯 INSTRUCTIONS:
1. Core Summary: Explain what is being demonstrated or taught in 2-3 concise sentences.
2. Tools, Tech & Resources: List every library, tool, extension, repository, prompt, or technique referenced.
3. Actionable Breakdown: Detail the step-by-step method, architecture, or code shown in the reel.
4. Key Takeaways: Provide high-yield bullet points for immediate practical application.

Format cleanly with markdown section headers, bold terms, and structured lists.`
};

document.addEventListener('DOMContentLoaded', () => {
  // Status & Counters
  const statusBadge = document.getElementById('statusBadge');
  const statusText = statusBadge.querySelector('.status-text');
  const savedCountEl = document.getElementById('savedCount');

  // AI Model Cards
  const modelCards = Array.from(document.querySelectorAll('.model-card'));
  let selectedProvider = 'meta';

  // Custom Prompt Elements
  const chkCustomPrompt = document.getElementById('chkCustomPrompt');
  const promptEditorContainer = document.getElementById('promptEditorContainer');
  const customPromptInput = document.getElementById('customPromptInput');
  const btnResetPrompt = document.getElementById('btnResetPrompt');
  const promptCharCount = document.getElementById('promptCharCount');

  // Batch Processor Elements
  const batchCountInput = document.getElementById('batchCount');
  const chkAutoUnsave = document.getElementById('chkAutoUnsave');
  const btnStartBatch = document.getElementById('btnStartBatch');
  const btnStopBatch = document.getElementById('btnStopBatch');
  const batchProgressContainer = document.getElementById('batchProgressContainer');
  const progressText = document.getElementById('progressText');
  const progressPercent = document.getElementById('progressPercent');
  const progressBarFill = document.getElementById('progressBarFill');
  const batchStatusText = document.getElementById('batchStatusText');

  // Simplified Unsaver Elements
  const unsaveCountInput = document.getElementById('unsaveCount');
  const btnStartUnsaveBatch = document.getElementById('btnStartUnsaveBatch');

  // Export Elements
  const btnExportMd = document.getElementById('btnExportMd');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnClearData = document.getElementById('btnClearData');
  const btnExportPlaybookZip = document.getElementById('btnExportPlaybookZip');
  const btnOpenDashboard = document.getElementById('btnOpenDashboard');
  const categoryPillsEl = document.getElementById('categoryPills');

  // Instagram Source & Auto-Connect Elements
  const igUsernameInput = document.getElementById('igUsername');
  const btnGoSaved = document.getElementById('btnGoSaved');
  const btnGoFeed = document.getElementById('btnGoFeed');

  // Restore configurations from storage
  chrome.storage.local.get({
    aiProvider: 'meta',
    customPromptEnabled: false,
    customPrompt: '',
    batchCount: 5,
    autoUnsave: false,
    unsaveCount: 10,
    igUsername: ''
  }, (result) => {
    selectedProvider = result.aiProvider || 'meta';
    updateModelCardSelection(selectedProvider);

    if (result.igUsername) {
      igUsernameInput.value = result.igUsername;
    }

    chkCustomPrompt.checked = !!result.customPromptEnabled;
    customPromptInput.value = result.customPrompt || DEFAULT_PROMPTS[selectedProvider];
    togglePromptEditor(chkCustomPrompt.checked);

    batchCountInput.value = result.batchCount || 5;
    chkAutoUnsave.checked = !!result.autoUnsave;
    unsaveCountInput.value = result.unsaveCount || 10;

    updateSavedCount();
    checkCurrentBatchState();
  });

  // Save Instagram username on change
  igUsernameInput.addEventListener('input', () => {
    const val = igUsernameInput.value.trim().replace(/^@/, '');
    chrome.storage.local.set({ igUsername: val });
  });

  // Model selection handler
  modelCards.forEach(card => {
    card.addEventListener('click', () => {
      const provider = card.getAttribute('data-provider');
      if (provider && provider !== selectedProvider) {
        selectedProvider = provider;
        chrome.storage.local.set({ aiProvider: provider });
        updateModelCardSelection(provider);

        // If custom prompt is open but matches previous default or is empty, update to the new provider's default
        if (chkCustomPrompt.checked) {
          const currentVal = customPromptInput.value.trim();
          const isMatchingAnyDefault = Object.values(DEFAULT_PROMPTS).some(d => d.trim() === currentVal);
          if (isMatchingAnyDefault || currentVal.length === 0) {
            customPromptInput.value = DEFAULT_PROMPTS[provider];
            chrome.storage.local.set({ customPrompt: DEFAULT_PROMPTS[provider] });
            updatePromptCharCount();
          }
        }
      }
    });
  });

  function updateModelCardSelection(provider) {
    modelCards.forEach(card => {
      if (card.getAttribute('data-provider') === provider) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Custom Prompt Checkbox handler
  chkCustomPrompt.addEventListener('change', () => {
    const isEnabled = chkCustomPrompt.checked;
    chrome.storage.local.set({ customPromptEnabled: isEnabled });
    togglePromptEditor(isEnabled);

    if (isEnabled && !customPromptInput.value.trim()) {
      customPromptInput.value = DEFAULT_PROMPTS[selectedProvider];
      chrome.storage.local.set({ customPrompt: DEFAULT_PROMPTS[selectedProvider] });
      updatePromptCharCount();
    }
  });

  function togglePromptEditor(show) {
    promptEditorContainer.style.display = show ? 'block' : 'none';
    btnResetPrompt.style.display = show ? 'inline' : 'none';
    if (show) {
      updatePromptCharCount();
    }
  }

  customPromptInput.addEventListener('input', () => {
    const val = customPromptInput.value;
    chrome.storage.local.set({ customPrompt: val });
    updatePromptCharCount();
  });

  btnResetPrompt.addEventListener('click', () => {
    const defaultTemplate = DEFAULT_PROMPTS[selectedProvider] || DEFAULT_PROMPTS.meta;
    customPromptInput.value = defaultTemplate;
    chrome.storage.local.set({ customPrompt: defaultTemplate });
    updatePromptCharCount();
  });

  function updatePromptCharCount() {
    const len = customPromptInput.value.trim().length;
    promptCharCount.innerText = `${len} chars`;
  }

  // Batch Setting Listeners
  batchCountInput.addEventListener('change', () => {
    chrome.storage.local.set({ batchCount: parseInt(batchCountInput.value, 10) || 5 });
  });

  chkAutoUnsave.addEventListener('change', () => {
    chrome.storage.local.set({ autoUnsave: chkAutoUnsave.checked });
  });

  unsaveCountInput.addEventListener('change', () => {
    chrome.storage.local.set({ unsaveCount: parseInt(unsaveCountInput.value, 10) || 10 });
  });

  // Background state listener
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "BATCH_STATE_UPDATED" && message.state) {
      applyBatchState(message.state);
    }
  });

  // Background storage change listener
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.igUsername && document.activeElement !== igUsernameInput) {
        igUsernameInput.value = changes.igUsername.newValue || '';
      }
      if (changes.reelsData || changes.categoriesRegistry) {
        updateSavedCount();
      }
    }
  });

  // Action Button Listeners
  btnStartBatch.addEventListener('click', handleStartBatch);
  btnStopBatch.addEventListener('click', handleStopBatch);
  btnStartUnsaveBatch.addEventListener('click', handleStartBatchUnsave);
  // Instagram Auto-Connect 1-Click Navigation
  btnGoSaved?.addEventListener('click', async () => {
    let username = igUsernameInput.value.trim().replace(/^@/, '');
    if (!username) {
      username = prompt("Enter your Instagram username (e.g. manikanta_sandula):", "manikanta_sandula");
      if (username) {
        username = username.trim().replace(/^@/, '');
        igUsernameInput.value = username;
        chrome.storage.local.set({ igUsername: username });
      }
    }
    const finalUser = username || "your_username";
    navigateToUrl(`https://www.instagram.com/${finalUser}/saved/all-posts/`);
  });

  btnGoFeed?.addEventListener('click', () => {
    navigateToUrl("https://www.instagram.com/reels/");
  });

  async function navigateToUrl(targetUrl) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url === "about:blank" || tab.url.includes("instagram.com"))) {
        chrome.tabs.update(tab.id, { url: targetUrl });
      } else {
        chrome.tabs.create({ url: targetUrl });
      }
    } catch (e) {
      chrome.tabs.create({ url: targetUrl });
    }
  }

  // Export Buttons
  btnExportMd.addEventListener('click', () => handleExport('md'));
  btnExportCsv.addEventListener('click', () => handleExport('csv'));
  btnClearData.addEventListener('click', handleClearData);

  function setStatus(text, mode = "idle") {
    statusText.innerText = text;
    statusBadge.className = `status-pill status-${mode}`;
  }

  function updateSavedCount() {
    chrome.storage.local.get({ reelsData: [], categoriesRegistry: [] }, (result) => {
      const count = result.reelsData ? result.reelsData.length : 0;
      savedCountEl.innerText = count;
      renderCategoryPills(result.categoriesRegistry || []);
    });
  }

  function checkCurrentBatchState() {
    chrome.runtime.sendMessage({ action: "GET_BATCH_STATE" }, (response) => {
      if (response && response.success && response.state) {
        applyBatchState(response.state);
      }
    });
  }

  function applyBatchState(state) {
    updateSavedCount();

    if (state.isRunning) {
      btnStartBatch.disabled = true;
      btnStartUnsaveBatch.disabled = true;
      btnStopBatch.disabled = false;
      batchProgressContainer.style.display = "block";
      setStatus(state.mode === "unsave" ? "Unsaving" : `Running (${getProviderName(state.provider)})`, "active");

      const percent = state.targetCount > 0 ? Math.round((state.processedCount / state.targetCount) * 100) : 0;
      progressText.innerText = `${state.mode === "unsave" ? 'Unsaved' : 'Reel'} ${state.processedCount} of ${state.targetCount}`;
      progressPercent.innerText = `${percent}%`;
      progressBarFill.style.width = `${percent}%`;
      batchStatusText.innerText = state.statusMessage || "Processing...";
    } else {
      btnStartBatch.disabled = false;
      btnStartUnsaveBatch.disabled = false;
      btnStopBatch.disabled = true;

      if (state.currentStep === "done") {
        batchProgressContainer.style.display = "block";
        progressBarFill.style.width = "100%";
        progressPercent.innerText = "100%";
        progressText.innerText = `Completed ${state.processedCount} of ${state.targetCount}`;
        batchStatusText.innerText = state.statusMessage || "Completed.";
        setStatus("Done", "active");
      } else if (state.currentStep === "error") {
        batchProgressContainer.style.display = "block";
        batchStatusText.innerText = state.statusMessage;
        setStatus("Error", "error");
      } else {
        batchProgressContainer.style.display = "none";
        setStatus("Idle", "idle");
      }
    }
  }

  // Start Summarizer Action
  function handleStartBatch() {
    const targetCount = parseInt(batchCountInput.value, 10) || 1;
    const autoUnsave = chkAutoUnsave.checked;
    const isCustomPromptActive = chkCustomPrompt.checked;
    const customPromptText = isCustomPromptActive ? customPromptInput.value.trim() : "";

    setStatus("Starting...", "active");

    chrome.runtime.sendMessage({
      action: "START_BATCH",
      targetCount: targetCount,
      autoUnsave: autoUnsave,
      provider: selectedProvider,
      customPrompt: customPromptText
    }, (response) => {
      if (!response || !response.success) {
        setStatus("Error", "error");
      }
    });
  }

  // Start Unsave Action
  function handleStartBatchUnsave() {
    const count = parseInt(unsaveCountInput.value, 10) || 10;

    if (!confirm(`Are you sure you want to remove ${count} reels from your Saved collection?`)) {
      return;
    }

    setStatus("Unsaving...", "active");

    chrome.runtime.sendMessage({
      action: "START_BATCH_UNSAVE",
      count: count
    }, (response) => {
      if (!response || !response.success) {
        setStatus("Error", "error");
      }
    });
  }

  // Stop Action
  function handleStopBatch() {
    btnStopBatch.disabled = true;
    chrome.runtime.sendMessage({ action: "STOP_BATCH" });
  }

  // Export Handler (legacy CSV / all-in-one Markdown)
  function handleExport(format) {
    chrome.runtime.sendMessage({ action: "EXPORT_DATA", format }, (response) => {
      if (!response || !response.success) return;
      const blob = new Blob([response.content], { type: format === 'csv' ? 'text/csv' : 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Playbook ZIP Export — downloads each category file sequentially
  function handleExportPlaybookZip() {
    chrome.runtime.sendMessage({ action: "EXPORT_ALL_PLAYBOOKS_ZIP" }, (response) => {
      if (!response || !response.success) {
        alert(response?.error || "No reels saved yet.");
        return;
      }
      response.files.forEach((file, i) => {
        setTimeout(() => {
          const blob = new Blob([file.content], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.filename;
          a.click();
          URL.revokeObjectURL(url);
        }, i * 300); // Stagger downloads 300ms apart
      });
    });
  }

  // Open Web Dashboard
  function handleOpenDashboard() {
    chrome.runtime.sendMessage({ action: "OPEN_WEB_DASHBOARD" });
  }

  // Clear Storage with Confirmation
  function handleClearData() {
    if (confirm("Delete all saved summaries and categories from storage?")) {
      chrome.runtime.sendMessage({ action: "CLEAR_DATA" }, () => {
        updateSavedCount();
        renderCategoryPills([]);
        setStatus("Cleared", "idle");
      });
    }
  }

  // Render dynamic category filter pills
  function renderCategoryPills(categories) {
    if (!categoryPillsEl) return;
    if (!categories || categories.length === 0) {
      categoryPillsEl.style.display = 'none';
      return;
    }
    categoryPillsEl.style.display = 'flex';
    categoryPillsEl.innerHTML = '';
    categories.forEach(cat => {
      const pill = document.createElement('span');
      pill.className = 'category-pill';
      pill.textContent = cat;
      categoryPillsEl.appendChild(pill);
    });
  }

  function getProviderName(provider) {
    if (provider === "meta") return "Meta AI";
    if (provider === "chatgpt") return "ChatGPT";
    return "Gemini";
  }

  // Wire new buttons
  if (btnExportPlaybookZip) btnExportPlaybookZip.addEventListener('click', handleExportPlaybookZip);
  if (btnOpenDashboard) btnOpenDashboard.addEventListener('click', handleOpenDashboard);
});
