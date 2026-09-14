/**
 * Reel Analyzer - Side Panel Script (Option B: All-in-One Compact UI)
 * Dedicated to Meta AI automated extraction, live tab connection checks, and instant downloads.
 */

const FLUID_PROMPT_TEMPLATE = `Analyze the attached Instagram Reel and convert it into a reusable knowledge note: {url}

At the very top, ALWAYS output this exact YAML:

---
creator: "[creator name or Unknown]"
domain: "[Domain]"
subdomain: "[Subdomain]"
subject: "[3–7 word title]"
personal_utility: "[Why this could be useful to me]"
entities: ["[tools/resources/etc]"]
tags: ["#tag1", "#tag2", "#tag3"]
---

Then extract the Reel's knowledge.

Do NOT use a fixed structure. Choose the best structure based on the Reel.

Preserve all high-value information: exact names, numbers, steps, examples, code, commands, tools, frameworks, and important details.

Remove hooks, filler, repetition, and hype.

Separate facts from opinions or recommendations.

The goal is not to summarize the Reel. The goal is to create a permanent knowledge note that I can search and reuse later without watching the Reel again.

Never invent information that is not present in the Reel.`;

document.addEventListener('DOMContentLoaded', () => {
  // ─── Welcome Overlay ──────────────────────────────────────────────────────
  const welcomeCard = document.getElementById('welcomeCard');
  const btnDismissWelcome = document.getElementById('btnDismissWelcome');
  const btnGotIt = document.getElementById('btnGotIt');
  const btnShowHelp = document.getElementById('btnShowHelp');
  const btnFooterHelp = document.getElementById('btnFooterHelp');

  function showWelcome() {
    if (!welcomeCard) return;
    welcomeCard.style.display = 'flex';
    welcomeCard.classList.add('welcome-card-enter');
  }
  function hideWelcome() {
    if (!welcomeCard) return;
    welcomeCard.classList.remove('welcome-card-enter');
    welcomeCard.classList.add('welcome-card-exit');
    setTimeout(() => {
      welcomeCard.style.display = 'none';
      welcomeCard.classList.remove('welcome-card-exit');
    }, 220);
  }

  chrome.storage.local.get({ welcomeSeen: false }, (r) => {
    if (!r.welcomeSeen) showWelcome();
  });

  btnDismissWelcome?.addEventListener('click', () => {
    chrome.storage.local.set({ welcomeSeen: true });
    hideWelcome();
  });
  btnGotIt?.addEventListener('click', () => {
    chrome.storage.local.set({ welcomeSeen: true });
    hideWelcome();
  });
  btnShowHelp?.addEventListener('click', showWelcome);
  btnFooterHelp?.addEventListener('click', showWelcome);

  // ─── Status Elements ──────────────────────────────────────────────────────
  const statusBadge = document.getElementById('statusBadge');
  const statusText = statusBadge.querySelector('.status-text');

  const igStatusDot = document.getElementById('igStatusDot');
  const igStatusText = document.getElementById('igStatusText');
  const btnOpenIg = document.getElementById('btnOpenIg');

  const metaStatusDot = document.getElementById('metaStatusDot');
  const metaStatusText = document.getElementById('metaStatusText');
  const btnOpenMeta = document.getElementById('btnOpenMeta');

  // ─── Batch Controls ───────────────────────────────────────────────────────
  const batchCountInput = document.getElementById('batchCount');
  const chkAutoUnsave = document.getElementById('chkAutoUnsave');
  const btnStartBatch = document.getElementById('btnStartBatch');
  const btnStopBatch = document.getElementById('btnStopBatch');

  const batchProgressContainer = document.getElementById('batchProgressContainer');
  const progressText = document.getElementById('progressText');
  const progressPercent = document.getElementById('progressPercent');
  const progressBarFill = document.getElementById('progressBarFill');
  const batchStatusText = document.getElementById('batchStatusText');

  // ─── Downloads & Vault ────────────────────────────────────────────────────
  const savedCountEl = document.getElementById('savedCount');
  const categoryPillsEl = document.getElementById('categoryPills');
  const btnOpenDashboard = document.getElementById('btnOpenDashboard');
  const btnExportMd = document.getElementById('btnExportMd');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnExportPlaybookZip = document.getElementById('btnExportPlaybookZip');
  const btnClearData = document.getElementById('btnClearData');

  // ─── Custom Prompt ────────────────────────────────────────────────────────
  const chkCustomPrompt = document.getElementById('chkCustomPrompt');
  const promptEditorContainer = document.getElementById('promptEditorContainer');
  const customPromptInput = document.getElementById('customPromptInput');
  const btnResetPrompt = document.getElementById('btnResetPrompt');
  const promptCharCount = document.getElementById('promptCharCount');

  // ─── Bulk Unsave ──────────────────────────────────────────────────────────
  const unsaveCountInput = document.getElementById('unsaveCount');
  const btnStartUnsaveBatch = document.getElementById('btnStartUnsaveBatch');

  // ─── Load Saved Configurations ───────────────────────────────────────────
  chrome.storage.local.get({
    customPromptEnabled: false,
    customPrompt: '',
    batchCount: 5,
    autoUnsave: false,
    unsaveCount: 10
  }, (result) => {
    chkCustomPrompt.checked = !!result.customPromptEnabled;
    
    // Auto-migrate legacy prompt templates
    let promptVal = result.customPrompt || '';
    if (!promptVal || promptVal.includes('ADAPTIVE PLAYBOOK EXTRACTION') || promptVal.includes('Posted Date:') || promptVal.includes('1. The Hook') || promptVal.includes('CORE PLAYBOOK') || promptVal.includes('### 1.')) {
      promptVal = FLUID_PROMPT_TEMPLATE;
      chrome.storage.local.set({ customPrompt: FLUID_PROMPT_TEMPLATE });
    }
    
    customPromptInput.value = promptVal;
    togglePromptEditor(chkCustomPrompt.checked);

    batchCountInput.value = result.batchCount || 5;
    chkAutoUnsave.checked = !!result.autoUnsave;
    unsaveCountInput.value = result.unsaveCount || 10;

    updateSavedCount();
    checkCurrentBatchState();
    startConnectionPolling();
  });

  // ─── Live Connection Polling (Instagram + Meta AI) ────────────────────────
  let pollInterval = null;

  async function checkLiveConnections() {
    try {
      // 1. Check Instagram
      const igTabs = await chrome.tabs.query({ url: '*://www.instagram.com/*' });
      const igOpen = igTabs.length > 0;
      const reelOpen = igTabs.some(t => t.url && (/\/(?:reel|reels|p)\/[A-Za-z0-9_-]+/.test(t.url)));

      if (reelOpen) {
        setConnStatus('ig', 'ready', 'Reel detected', false);
      } else if (igOpen) {
        setConnStatus('ig', 'pending', 'Click any reel', false);
      } else {
        setConnStatus('ig', 'offline', 'Not open', true);
      }

      // 2. Check Meta AI
      const metaTabs = await chrome.tabs.query({ url: ['*://www.meta.ai/*', '*://meta.ai/*'] });
      const metaOpen = metaTabs.length > 0;

      if (metaOpen) {
        setConnStatus('meta', 'ready', 'Connected', false);
      } else {
        setConnStatus('meta', 'offline', 'Not open', true);
      }
    } catch (e) {
      console.warn('Connection check error:', e);
    }
  }

  function setConnStatus(type, state, text, showOpenBtn) {
    const dot = type === 'ig' ? igStatusDot : metaStatusDot;
    const desc = type === 'ig' ? igStatusText : metaStatusText;
    const btn = type === 'ig' ? btnOpenIg : btnOpenMeta;

    if (!dot || !desc) return;

    dot.className = `status-dot-mini dot-${state}`;
    desc.textContent = text;
    if (btn) btn.style.display = showOpenBtn ? 'inline-block' : 'none';
  }

  function startConnectionPolling() {
    checkLiveConnections();
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(checkLiveConnections, 2500);
  }

  // 1-Click Open Links
  btnOpenIg?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.instagram.com/reels/' });
  });
  btnOpenMeta?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.meta.ai/' });
  });

  // ─── Custom Prompt Event Handlers ─────────────────────────────────────────
  chkCustomPrompt.addEventListener('change', () => {
    const isEnabled = chkCustomPrompt.checked;
    chrome.storage.local.set({ customPromptEnabled: isEnabled });
    togglePromptEditor(isEnabled);
    if (isEnabled && !customPromptInput.value.trim()) {
      customPromptInput.value = FLUID_PROMPT_TEMPLATE;
      chrome.storage.local.set({ customPrompt: FLUID_PROMPT_TEMPLATE });
      updatePromptCharCount();
    }
  });

  function togglePromptEditor(show) {
    promptEditorContainer.style.display = show ? 'block' : 'none';
    btnResetPrompt.style.display = show ? 'inline' : 'none';
    if (show) updatePromptCharCount();
  }

  customPromptInput.addEventListener('input', () => {
    const val = customPromptInput.value;
    chrome.storage.local.set({ customPrompt: val });
    updatePromptCharCount();
  });

  btnResetPrompt.addEventListener('click', () => {
    customPromptInput.value = FLUID_PROMPT_TEMPLATE;
    chrome.storage.local.set({ customPrompt: FLUID_PROMPT_TEMPLATE });
    updatePromptCharCount();
  });

  function updatePromptCharCount() {
    const len = customPromptInput.value.trim().length;
    promptCharCount.innerText = `${len} chars`;
  }

  // ─── Batch Settings Sync ──────────────────────────────────────────────────
  batchCountInput.addEventListener('change', () => {
    chrome.storage.local.set({ batchCount: parseInt(batchCountInput.value, 10) || 5 });
  });
  chkAutoUnsave.addEventListener('change', () => {
    chrome.storage.local.set({ autoUnsave: chkAutoUnsave.checked });
  });
  unsaveCountInput.addEventListener('change', () => {
    chrome.storage.local.set({ unsaveCount: parseInt(unsaveCountInput.value, 10) || 10 });
  });

  // ─── Background State & Storage Listeners ─────────────────────────────────
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'BATCH_STATE_UPDATED' && message.state) {
      applyBatchState(message.state);
    }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.reelsData || changes.categoriesRegistry)) {
      updateSavedCount();
    }
  });

  // ─── Batch Action Handlers ────────────────────────────────────────────────
  btnStartBatch.addEventListener('click', handleStartBatch);
  btnStopBatch.addEventListener('click', handleStopBatch);
  btnStartUnsaveBatch.addEventListener('click', handleStartBatchUnsave);

  function handleStartBatch() {
    const targetCount = parseInt(batchCountInput.value, 10) || 1;
    const autoUnsave = chkAutoUnsave.checked;
    const isCustomPromptActive = chkCustomPrompt.checked;
    const customPromptText = isCustomPromptActive ? customPromptInput.value.trim() : '';

    setStatus('Starting...', 'active');

    chrome.runtime.sendMessage({
      action: 'START_BATCH',
      targetCount,
      autoUnsave,
      provider: 'meta',
      customPrompt: customPromptText
    }, (response) => {
      if (!response || !response.success) {
        setStatus('Error', 'error');
      }
    });
  }

  function handleStopBatch() {
    btnStopBatch.disabled = true;
    chrome.runtime.sendMessage({ action: 'STOP_BATCH' });
  }

  function handleStartBatchUnsave() {
    const count = parseInt(unsaveCountInput.value, 10) || 10;
    if (!confirm(`Are you sure you want to remove ${count} reels from your Saved collection?`)) return;
    setStatus('Unsaving...', 'active');
    chrome.runtime.sendMessage({ action: 'START_BATCH_UNSAVE', count }, (response) => {
      if (!response || !response.success) setStatus('Error', 'error');
    });
  }

  // ─── Batch State Applicator ───────────────────────────────────────────────
  function checkCurrentBatchState() {
    chrome.runtime.sendMessage({ action: 'GET_BATCH_STATE' }, (response) => {
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
      batchProgressContainer.style.display = 'block';
      setStatus(state.mode === 'unsave' ? 'Unsaving' : 'Summarizing', 'active');

      const percent = state.targetCount > 0 ? Math.round((state.processedCount / state.targetCount) * 100) : 0;
      progressText.innerText = `${state.mode === 'unsave' ? 'Unsaved' : 'Reel'} ${state.processedCount} of ${state.targetCount}`;
      progressPercent.innerText = `${percent}%`;
      progressBarFill.style.width = `${percent}%`;
      batchStatusText.innerText = state.statusMessage || 'Processing...';
    } else {
      btnStartBatch.disabled = false;
      btnStartUnsaveBatch.disabled = false;
      btnStopBatch.disabled = true;

      if (state.currentStep === 'done') {
        batchProgressContainer.style.display = 'block';
        progressBarFill.style.width = '100%';
        progressPercent.innerText = '100%';
        progressText.innerText = `Completed ${state.processedCount} of ${state.targetCount}`;
        batchStatusText.innerText = state.statusMessage || 'Completed.';
        setStatus('Done', 'active');
      } else if (state.currentStep === 'error') {
        batchProgressContainer.style.display = 'block';
        batchStatusText.innerText = state.statusMessage;
        setStatus('Error', 'error');
      } else {
        batchProgressContainer.style.display = 'none';
        setStatus('Idle', 'idle');
      }
    }
  }

  function setStatus(text, mode = 'idle') {
    statusText.innerText = text;
    statusBadge.className = `status-pill status-${mode}`;
  }

  // ─── Downloads & Dashboard ────────────────────────────────────────────────
  btnExportMd.addEventListener('click', () => handleExport('md'));
  btnExportCsv.addEventListener('click', () => handleExport('csv'));
  btnExportPlaybookZip.addEventListener('click', handleExportPlaybookZip);
  btnOpenDashboard.addEventListener('click', handleOpenDashboard);
  btnClearData.addEventListener('click', handleClearData);

  function handleExport(format) {
    chrome.runtime.sendMessage({ action: 'EXPORT_DATA', format }, (response) => {
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

  function handleExportPlaybookZip() {
    chrome.runtime.sendMessage({ action: 'EXPORT_ALL_PLAYBOOKS_ZIP' }, (response) => {
      if (!response || !response.success) {
        alert(response?.error || 'No reels saved yet.');
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
        }, i * 300);
      });
    });
  }

  function handleOpenDashboard() {
    chrome.runtime.sendMessage({ action: 'OPEN_WEB_DASHBOARD' });
  }

  function handleClearData() {
    if (confirm('Delete all saved summaries and taxonomy from storage?')) {
      chrome.runtime.sendMessage({ action: 'CLEAR_DATA' }, () => {
        updateSavedCount();
        renderDomainPills({});
        setStatus('Cleared', 'idle');
      });
    }
  }

  function updateSavedCount() {
    chrome.storage.local.get({ reelsData: [] }, (result) => {
      const reels = result.reelsData || [];
      if (savedCountEl) savedCountEl.innerText = reels.length;

      const domainCounts = {};
      reels.forEach(r => {
        const d = r.domain || r.category || 'General';
        domainCounts[d] = (domainCounts[d] || 0) + 1;
      });
      renderDomainPills(domainCounts);
    });
  }

  function renderDomainPills(domainCounts) {
    if (!categoryPillsEl) return;
    const entries = Object.entries(domainCounts);
    if (entries.length === 0) {
      categoryPillsEl.style.display = 'none';
      return;
    }
    categoryPillsEl.style.display = 'flex';
    categoryPillsEl.innerHTML = '';
    entries.forEach(([dom, count]) => {
      const pill = document.createElement('span');
      pill.className = 'category-pill';
      pill.textContent = `${dom} (${count})`;
      categoryPillsEl.appendChild(pill);
    });
  }
});
