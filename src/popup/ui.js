/**
 * Popup / Side Panel UI Controller & Component Renderers
 */

export const elements = {
  welcomeCard: document.getElementById('welcomeCard'),
  btnDismissWelcome: document.getElementById('btnDismissWelcome'),
  btnGotIt: document.getElementById('btnGotIt'),
  btnShowHelp: document.getElementById('btnShowHelp'),
  btnFooterHelp: document.getElementById('btnFooterHelp'),

  statusBadge: document.getElementById('statusBadge'),
  statusText: document.getElementById('statusBadge')?.querySelector('.status-text'),

  igStatusDot: document.getElementById('igStatusDot'),
  igStatusText: document.getElementById('igStatusText'),
  btnOpenIg: document.getElementById('btnOpenIg'),

  metaStatusDot: document.getElementById('metaStatusDot'),
  metaStatusText: document.getElementById('metaStatusText'),
  btnOpenMeta: document.getElementById('btnOpenMeta'),

  batchCountInput: document.getElementById('batchCount'),
  btnStartBatch: document.getElementById('btnStartBatch'),
  btnStopBatch: document.getElementById('btnStopBatch'),

  batchProgressContainer: document.getElementById('batchProgressContainer'),
  progressText: document.getElementById('progressText'),
  progressPercent: document.getElementById('progressPercent'),
  progressBarFill: document.getElementById('progressBarFill'),
  batchStatusText: document.getElementById('batchStatusText'),

  savedCountEl: document.getElementById('savedCount'),
  categoryPillsEl: document.getElementById('categoryPills'),
  btnOpenDashboard: document.getElementById('btnOpenDashboard'),
  btnExportMd: document.getElementById('btnExportMd'),
  btnExportCsv: document.getElementById('btnExportCsv'),
  btnExportPlaybookZip: document.getElementById('btnExportPlaybookZip'),
  btnClearData: document.getElementById('btnClearData'),

  chkCustomPrompt: document.getElementById('chkCustomPrompt'),
  promptEditorContainer: document.getElementById('promptEditorContainer'),
  customPromptInput: document.getElementById('customPromptInput'),
  btnResetPrompt: document.getElementById('btnResetPrompt'),
  promptCharCount: document.getElementById('promptCharCount'),

  unsaveCountInput: document.getElementById('unsaveCount'),
  btnStartUnsaveBatch: document.getElementById('btnStartUnsaveBatch')
};

export function showWelcome() {
  if (!elements.welcomeCard) return;
  elements.welcomeCard.style.display = 'flex';
  elements.welcomeCard.classList.add('welcome-card-enter');
}

export function hideWelcome() {
  if (!elements.welcomeCard) return;
  elements.welcomeCard.classList.remove('welcome-card-enter');
  elements.welcomeCard.classList.add('welcome-card-exit');
  setTimeout(() => {
    elements.welcomeCard.style.display = 'none';
    elements.welcomeCard.classList.remove('welcome-card-exit');
  }, 220);
}

export function setStatus(text, mode = 'idle') {
  if (elements.statusText) elements.statusText.innerText = text;
  if (elements.statusBadge) elements.statusBadge.className = `status-pill status-${mode}`;
}

export function setConnStatus(type, state, text, showOpenBtn, btnText = '') {
  const dot = type === 'ig' ? elements.igStatusDot : elements.metaStatusDot;
  const desc = type === 'ig' ? elements.igStatusText : elements.metaStatusText;
  const btn = type === 'ig' ? elements.btnOpenIg : elements.btnOpenMeta;

  if (!dot || !desc) return;
  dot.className = `status-dot-mini dot-${state}`;
  desc.textContent = text;
  if (btn) {
    btn.style.display = showOpenBtn ? 'inline-block' : 'none';
    if (btnText) btn.textContent = btnText;
  }
}

export function togglePromptEditor(show) {
  if (elements.promptEditorContainer) elements.promptEditorContainer.style.display = show ? 'block' : 'none';
  if (elements.btnResetPrompt) elements.btnResetPrompt.style.display = show ? 'inline' : 'none';
  if (show) updatePromptCharCount();
}

export function updatePromptCharCount() {
  if (!elements.customPromptInput || !elements.promptCharCount) return;
  const len = elements.customPromptInput.value.trim().length;
  elements.promptCharCount.innerText = `${len} chars`;
}

export function renderDomainPills(domainCounts) {
  if (!elements.categoryPillsEl) return;
  const entries = Object.entries(domainCounts);
  if (entries.length === 0) {
    elements.categoryPillsEl.style.display = 'none';
    elements.categoryPillsEl.innerHTML = '';
    return;
  }

  // Sort descending by reel count (most active domains first)
  entries.sort((a, b) => b[1] - a[1]);

  elements.categoryPillsEl.style.display = 'flex';
  elements.categoryPillsEl.innerHTML = '';

  const MAX_VISIBLE = 3;
  const visible = entries.length <= 4 ? entries : entries.slice(0, MAX_VISIBLE);
  const overflow = entries.length > 4 ? entries.slice(MAX_VISIBLE) : [];

  visible.forEach(([dom, count]) => {
    const pill = document.createElement('span');
    pill.className = 'category-pill';
    pill.textContent = `${dom} (${count})`;
    pill.title = `${dom}: ${count} reel(s)`;
    elements.categoryPillsEl.appendChild(pill);
  });

  if (overflow.length > 0) {
    const overflowPill = document.createElement('span');
    overflowPill.className = 'category-pill category-pill-overflow';
    overflowPill.textContent = `+${overflow.length} more`;
    overflowPill.title = overflow.map(([dom, count]) => `${dom} (${count})`).join('\n') + '\nClick to view all in Web Dashboard';
    overflowPill.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'OPEN_WEB_DASHBOARD' });
    });
    elements.categoryPillsEl.appendChild(overflowPill);
  }
}

export function updateSavedCount() {
  chrome.storage.local.get({ reelsData: [] }, (result) => {
    const reels = result.reelsData || [];
    if (elements.savedCountEl) elements.savedCountEl.innerText = reels.length;

    const domainCounts = {};
    reels.forEach((r) => {
      const d = r.domain || r.category || 'General';
      domainCounts[d] = (domainCounts[d] || 0) + 1;
    });
    renderDomainPills(domainCounts);
  });
}

export function applyBatchState(state) {
  updateSavedCount();

  if (state.isRunning) {
    if (elements.btnStartBatch) elements.btnStartBatch.disabled = true;
    if (elements.btnStartUnsaveBatch) elements.btnStartUnsaveBatch.disabled = true;
    if (elements.btnStopBatch) elements.btnStopBatch.disabled = false;
    if (elements.batchProgressContainer) elements.batchProgressContainer.style.display = 'block';
    setStatus(state.mode === 'unsave' ? 'Unsaving' : 'Summarizing', 'active');

    const percent = state.targetCount > 0 ? Math.round((state.processedCount / state.targetCount) * 100) : 0;
    if (elements.progressText) elements.progressText.innerText = `${state.mode === 'unsave' ? 'Unsaved' : 'Reel'} ${state.processedCount} of ${state.targetCount}`;
    if (elements.progressPercent) elements.progressPercent.innerText = `${percent}%`;
    if (elements.progressBarFill) elements.progressBarFill.style.width = `${percent}%`;
    if (elements.batchStatusText) elements.batchStatusText.innerText = state.statusMessage || 'Processing...';
  } else {
    if (elements.btnStartBatch) elements.btnStartBatch.disabled = false;
    if (elements.btnStartUnsaveBatch) elements.btnStartUnsaveBatch.disabled = false;
    if (elements.btnStopBatch) elements.btnStopBatch.disabled = true;

    if (state.currentStep === 'done') {
      if (elements.batchProgressContainer) elements.batchProgressContainer.style.display = 'block';
      if (elements.progressBarFill) elements.progressBarFill.style.width = '100%';
      if (elements.progressPercent) elements.progressPercent.innerText = '100%';
      if (elements.progressText) elements.progressText.innerText = `Completed ${state.processedCount} of ${state.targetCount}`;
      if (elements.batchStatusText) elements.batchStatusText.innerText = state.statusMessage || 'Completed.';
      setStatus('Done', 'active');
    } else if (state.currentStep === 'error') {
      if (elements.batchProgressContainer) elements.batchProgressContainer.style.display = 'block';
      if (elements.batchStatusText) elements.batchStatusText.innerText = state.statusMessage;
      setStatus('Error', 'error');
    } else {
      if (elements.batchProgressContainer) elements.batchProgressContainer.style.display = 'none';
      setStatus('Idle', 'idle');
    }
  }
}
