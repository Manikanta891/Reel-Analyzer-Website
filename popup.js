/**
 * Reel Analyzer - Side Panel / Popup Entry Point
 */

import { ACTIONS } from './src/shared/constants.js';
import {
  elements,
  showWelcome,
  hideWelcome,
  setStatus,
  setConnStatus,
  togglePromptEditor,
  updatePromptCharCount,
  updateSavedCount,
  renderDomainPills,
  applyBatchState
} from './src/popup/ui.js';
import { createZipBlob } from './src/popup/zipPackager.js';

document.addEventListener('DOMContentLoaded', () => {
  // ─── Welcome Overlay ──────────────────────────────────────────────────────
  chrome.storage.local.get({ welcomeSeen: false }, (r) => {
    if (!r.welcomeSeen) showWelcome();
  });

  elements.btnDismissWelcome?.addEventListener('click', () => {
    chrome.storage.local.set({ welcomeSeen: true });
    hideWelcome();
  });
  elements.btnGotIt?.addEventListener('click', () => {
    chrome.storage.local.set({ welcomeSeen: true });
    hideWelcome();
  });
  elements.btnShowHelp?.addEventListener('click', showWelcome);
  elements.btnFooterHelp?.addEventListener('click', showWelcome);

  // ─── Load Saved Configurations ───────────────────────────────────────────
  chrome.storage.local.get({
    customPromptEnabled: false,
    customPrompt: '',
    batchCount: 5,
    autoUnsave: false,
    unsaveCount: 10
  }, (result) => {
    let promptVal = (result.customPrompt || '').trim();
    let isEnabled = !!result.customPromptEnabled;

    // Purge legacy system prompt text if previously saved in storage
    if (
      promptVal.includes('Analyze the attached') ||
      promptVal.includes('TAXONOMY:') ||
      promptVal.includes('KNOWLEDGE EXTRACTION:') ||
      promptVal.includes('CURRENT KNOWLEDGE TAXONOMY') ||
      promptVal.includes('personal_utility')
    ) {
      promptVal = '';
      isEnabled = false;
      chrome.storage.local.set({ customPrompt: '', customPromptEnabled: false });
    }

    if (elements.chkCustomPrompt) elements.chkCustomPrompt.checked = isEnabled;
    if (elements.customPromptInput) elements.customPromptInput.value = promptVal;
    togglePromptEditor(isEnabled);

    if (elements.batchCountInput) elements.batchCountInput.value = result.batchCount || 5;
    if (elements.unsaveCountInput) elements.unsaveCountInput.value = result.unsaveCount || 10;

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
      const reelOpen = igTabs.some((t) => t.url && (/\/(?:reel|reels|p)\/[A-Za-z0-9_-]+/.test(t.url)));

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

      if (!metaOpen) {
        setConnStatus('meta', 'offline', 'Not open', true, 'Open meta.ai ↗');
      } else {
        const activeMetaTab = metaTabs[0];
        try {
          chrome.tabs.sendMessage(activeMetaTab.id, { action: 'PING' }, (resp) => {
            if (chrome.runtime.lastError || !resp) {
              setConnStatus('meta', 'pending', 'Open tab', true, 'Focus tab ↗');
            } else if (resp.isLoggedIn) {
              setConnStatus('meta', 'ready', 'Logged In', false);
            } else {
              setConnStatus('meta', 'pending', 'Login required', true, 'Log in ↗');
            }
          });
        } catch (e) {
          setConnStatus('meta', 'pending', 'Checking...', false);
        }
      }
    } catch (e) {
      console.warn('Connection check error:', e);
    }
  }

  function startConnectionPolling() {
    checkLiveConnections();
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(checkLiveConnections, 2500);
  }

  // 1-Click Open Links
  elements.btnOpenIg?.addEventListener('click', async () => {
    const igTabs = await chrome.tabs.query({ url: '*://www.instagram.com/*' });
    if (igTabs.length > 0) {
      const tab = igTabs[0];
      chrome.tabs.update(tab.id, { active: true });
      if (tab.windowId) chrome.windows.update(tab.windowId, { focused: true });
    } else {
      chrome.tabs.create({ url: 'https://www.instagram.com/reels/' });
    }
  });

  elements.btnOpenMeta?.addEventListener('click', async () => {
    const metaTabs = await chrome.tabs.query({ url: ['*://www.meta.ai/*', '*://meta.ai/*'] });
    if (metaTabs.length > 0) {
      const tab = metaTabs[0];
      chrome.tabs.update(tab.id, { active: true });
      if (tab.windowId) chrome.windows.update(tab.windowId, { focused: true });
    } else {
      chrome.tabs.create({ url: 'https://www.meta.ai/' });
    }
  });

  // ─── Custom Prompt Event Handlers ─────────────────────────────────────────
  elements.chkCustomPrompt?.addEventListener('change', () => {
    const isEnabled = elements.chkCustomPrompt.checked;
    chrome.storage.local.set({ customPromptEnabled: isEnabled });
    togglePromptEditor(isEnabled);
  });

  elements.customPromptInput?.addEventListener('input', () => {
    const val = elements.customPromptInput.value;
    chrome.storage.local.set({ customPrompt: val });
    updatePromptCharCount();
  });

  elements.btnResetPrompt?.addEventListener('click', () => {
    elements.customPromptInput.value = '';
    chrome.storage.local.set({ customPrompt: '' });
    updatePromptCharCount();
  });

  // ─── Batch Settings Sync ──────────────────────────────────────────────────
  elements.batchCountInput?.addEventListener('change', () => {
    chrome.storage.local.set({ batchCount: parseInt(elements.batchCountInput.value, 10) || 5 });
  });
  elements.unsaveCountInput?.addEventListener('change', () => {
    chrome.storage.local.set({ unsaveCount: parseInt(elements.unsaveCountInput.value, 10) || 10 });
  });

  // ─── Background State & Storage Listeners ─────────────────────────────────
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === ACTIONS.BATCH_STATE_UPDATED && message.state) {
      applyBatchState(message.state);
    }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.reelsData || changes.knowledgeTaxonomy)) {
      updateSavedCount();
    }
  });

  // ─── Batch Action Handlers ────────────────────────────────────────────────
  elements.btnStartBatch?.addEventListener('click', handleStartBatch);
  elements.btnStopBatch?.addEventListener('click', handleStopBatch);
  elements.btnStartUnsaveBatch?.addEventListener('click', handleStartBatchUnsave);

  async function handleStartBatch() {
    const targetCount = parseInt(elements.batchCountInput.value, 10) || 1;
    const isCustomPromptActive = elements.chkCustomPrompt.checked;
    const customPromptText = isCustomPromptActive ? elements.customPromptInput.value.trim() : '';

    const metaTabs = await chrome.tabs.query({ url: ['*://www.meta.ai/*', '*://meta.ai/*'] });
    if (metaTabs.length === 0) {
      alert('Please open meta.ai and ensure you are logged in before starting.');
      chrome.tabs.create({ url: 'https://www.meta.ai/' });
      return;
    }

    setStatus('Starting...', 'active');

    chrome.runtime.sendMessage({
      action: ACTIONS.START_BATCH,
      targetCount,
      autoUnsave: false,
      provider: 'meta',
      customPrompt: customPromptText
    }, (response) => {
      if (!response || !response.success) {
        setStatus('Error', 'error');
      }
    });
  }

  function handleStopBatch() {
    if (elements.btnStopBatch) elements.btnStopBatch.disabled = true;
    chrome.runtime.sendMessage({ action: ACTIONS.STOP_BATCH });
  }

  function handleStartBatchUnsave() {
    const count = parseInt(elements.unsaveCountInput.value, 10) || 10;
    if (!confirm(`Are you sure you want to remove ${count} reels from your Saved collection?`)) return;
    setStatus('Unsaving...', 'active');
    chrome.runtime.sendMessage({ action: ACTIONS.START_BATCH_UNSAVE, count }, (response) => {
      if (!response || !response.success) setStatus('Error', 'error');
    });
  }

  // ─── Batch State Applicator ───────────────────────────────────────────────
  function checkCurrentBatchState() {
    chrome.runtime.sendMessage({ action: ACTIONS.GET_BATCH_STATE }, (response) => {
      if (response && response.success && response.state) {
        applyBatchState(response.state);
      }
    });
  }

  // ─── Downloads & Dashboard ────────────────────────────────────────────────
  elements.btnExportMd?.addEventListener('click', () => handleExport('md'));
  elements.btnExportCsv?.addEventListener('click', () => handleExport('csv'));
  elements.btnExportPlaybookZip?.addEventListener('click', handleExportPlaybookZip);
  elements.btnOpenDashboard?.addEventListener('click', handleOpenDashboard);
  elements.btnClearData?.addEventListener('click', handleClearData);

  function handleExport(format) {
    chrome.runtime.sendMessage({ action: ACTIONS.EXPORT_DATA, format }, (response) => {
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
    chrome.runtime.sendMessage({ action: ACTIONS.EXPORT_ALL_PLAYBOOKS_ZIP }, (response) => {
      if (!response || !response.success || !response.files || !response.files.length) {
        alert(response?.error || 'No reels saved yet.');
        return;
      }
      const zipBlob = createZipBlob(response.files);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ReelAnalyzer_Obsidian_Vault_${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function handleOpenDashboard() {
    chrome.runtime.sendMessage({ action: ACTIONS.OPEN_WEB_DASHBOARD });
  }

  function handleClearData() {
    chrome.storage.local.get({ reelsData: [] }, (r) => {
      const count = (r.reelsData || []).length;
      if (count === 0) {
        alert('Your Knowledge Vault is already empty.');
        return;
      }

      const warningMsg =
        `⚠️ WARNING: Permanent Data Deletion\n\n` +
        `This will permanently delete all ${count} saved reel note(s) and your entire knowledge taxonomy from this browser.\n\n` +
        `• This action CANNOT be undone.\n` +
        `• If you want to keep your notes, click 'Cancel' and download your Obsidian Vault (.zip) first.\n\n` +
        `Are you sure you want to delete everything?`;

      if (confirm(warningMsg)) {
        chrome.runtime.sendMessage({ action: ACTIONS.CLEAR_DATA }, () => {
          updateSavedCount();
          renderDomainPills({});
          setStatus('Cleared', 'idle');
        });
      }
    });
  }
});
