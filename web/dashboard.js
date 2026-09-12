/**
 * Reel Analyzer - Web Knowledge Dashboard
 * Data source: chrome.storage.local (read as extension page)
 * Fallback: localStorage (for GitHub Pages / Vercel deploy)
 */

// ─── State ─────────────────────────────────────────────────────────────────
let allReels = [];
let activeCategory = 'All Reels';
let currentSearch = '';
let activeTab = 'reels';

// ─── Category Normalizer ────────────────────────────────────────────────────
const BASE_CATEGORIES = [
  'Technology & AI', 'Finance & Business', 'Fitness & Health',
  'Career & Education', 'Design & Creative', 'Productivity & Habits',
  'Lifestyle & Hobbies', 'General Insights'
];

const CLUSTER_MAP = {
  'Technology & AI':      ['tech','ai','llm','code','coding','software','python','developer','web','cloud','github','app','programming','machine','learning','data','model','api','framework'],
  'Finance & Business':   ['finance','money','invest','investing','stock','crypto','tax','business','revenue','profit','marketing','sales','startup','estate','wealth','accounting','budget'],
  'Fitness & Health':     ['fitness','workout','gym','diet','nutrition','health','exercise','muscle','training','yoga','run','cardio','weight','body','sleep','recovery','protein'],
  'Career & Education':   ['career','job','interview','resume','study','learn','skill','course','degree','college','university','leadership','work','salary','networking'],
  'Design & Creative':    ['design','ui','ux','figma','css','animation','video','photo','creative','art','color','typography','brand','logo','graphic','illustration'],
  'Productivity & Habits':['productivity','habit','focus','routine','mindset','goal','time','manage','system','discipline','morning','evening','journal','planning'],
  'Lifestyle & Hobbies':  ['food','cook','recipe','travel','fashion','music','game','gaming','sport','diy','craft','garden','pet','hobby','decor','culture'],
  'General Insights':     ['quote','motivation','inspire','philosophy','mindfulness','life','general','advice','tip','lesson']
};

function normalizeCategory(raw) {
  if (!raw) return 'General Insights';
  const tokens = raw.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 2);
  // Exact match
  for (const cat of BASE_CATEGORIES) {
    if (cat.toLowerCase() === raw.toLowerCase()) return cat;
  }
  // Token overlap vs known
  for (const cat of BASE_CATEGORIES) {
    const catTokens = cat.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    if (tokens.some(t => catTokens.includes(t))) return cat;
  }
  // Keyword cluster
  for (const [cat, keywords] of Object.entries(CLUSTER_MAP)) {
    if (tokens.some(t => keywords.includes(t))) return cat;
  }
  return raw.trim().replace(/^\w/, c => c.toUpperCase());
}

// ─── Data Loading ───────────────────────────────────────────────────────────
function loadData() {
  // Priority 1: chrome.storage.local (when opened as extension page)
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get({ reelsData: [] }, (result) => {
      allReels = Array.isArray(result.reelsData) ? result.reelsData : [];
      normalizeAllReels();
      // Also persist to localStorage as fallback mirror
      try { localStorage.setItem('reelAnalyzerData', JSON.stringify(allReels)); } catch(e) {}
      render();
      showSyncStatus(`Loaded ${allReels.length} reel${allReels.length !== 1 ? 's' : ''} from extension.`);
    });
    return;
  }

  // Priority 2: localStorage fallback (GitHub Pages / Vercel)
  try {
    const raw = localStorage.getItem('reelAnalyzerData') || localStorage.getItem('reelsData');
    if (raw) {
      allReels = JSON.parse(raw) || [];
      normalizeAllReels();
    }
  } catch(e) {
    console.error('[Reel Analyzer] Failed to load from localStorage:', e);
  }
  render();
}

function saveToLocalStorage() {
  try { localStorage.setItem('reelAnalyzerData', JSON.stringify(allReels)); } catch(e) {}
}

function normalizeAllReels() {
  allReels = allReels.map(r => ({
    ...r,
    _normCat: normalizeCategory(r.category || r.normalizedCategory)
  }));
}

// ─── Extension Sync (message listener from service worker) ──────────────────
// The service worker sends a chrome.tabs.sendMessage — extension pages receive
// this via chrome.runtime.onMessage (NOT window.addEventListener('message'))
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'SYNC_DATA' && Array.isArray(request.reelsData)) {
      mergeAndSync(request.reelsData);
      sendResponse({ success: true });
    }
    return true;
  });
}

// Also support postMessage for GitHub Pages embed scenario
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REEL_ANALYZER_SYNC' && Array.isArray(event.data.data)) {
    mergeAndSync(event.data.data);
  }
});

function mergeAndSync(incoming) {
  const existingUrls = new Set(allReels.map(r => r.url));
  const newReels = incoming.filter(r => r.url && !existingUrls.has(r.url));
  if (newReels.length > 0) {
    allReels = [...newReels, ...allReels];
    normalizeAllReels();
    saveToLocalStorage();
    render();
    showSyncStatus(`✓ Synced ${newReels.length} new reel${newReels.length !== 1 ? 's' : ''}!`);
  } else {
    showSyncStatus('✓ Already up to date.');
  }
}

// ─── Event Setup ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // Sync button
  const btnSync = document.getElementById('btnSync');
  if (btnSync) {
    btnSync.addEventListener('click', () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        // Re-read directly from chrome.storage.local
        chrome.storage.local.get({ reelsData: [] }, (result) => {
          allReels = Array.isArray(result.reelsData) ? result.reelsData : [];
          normalizeAllReels();
          saveToLocalStorage();
          render();
          showSyncStatus(`✓ Synced ${allReels.length} reel${allReels.length !== 1 ? 's' : ''}.`);
        });
      } else {
        showSyncStatus('Open this dashboard from the Reel Analyzer extension side panel to sync data.');
      }
    });
  }

  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      render();
    });
  }

  // Tab: Reels
  const btnTabReels = document.getElementById('btnTabReels');
  if (btnTabReels) {
    btnTabReels.addEventListener('click', () => {
      activeTab = 'reels';
      btnTabReels.classList.add('active');
      const btnTabTools = document.getElementById('btnTabTools');
      if (btnTabTools) btnTabTools.classList.remove('active');
      render();
    });
  }

  // Tab: Tools
  const btnTabTools = document.getElementById('btnTabTools');
  if (btnTabTools) {
    btnTabTools.addEventListener('click', () => {
      activeTab = 'tools';
      btnTabTools.classList.add('active');
      const btnTabReels2 = document.getElementById('btnTabReels');
      if (btnTabReels2) btnTabReels2.classList.remove('active');
      render();
    });
  }

  // Download Playbook
  const btnDownloadPlaybook = document.getElementById('btnDownloadPlaybook');
  if (btnDownloadPlaybook) {
    btnDownloadPlaybook.addEventListener('click', downloadPlaybook);
  }
});

// ─── Filtering ────────────────────────────────────────────────────────────────
function getFilteredReels() {
  return allReels.filter(reel => {
    const cat = reel._normCat || 'General Insights';
    const matchCat = activeCategory === 'All Reels' || cat === activeCategory;
    if (!matchCat) return false;
    if (!currentSearch) return true;

    const tags = Array.isArray(reel.tags) ? reel.tags.join(' ') : (reel.tags || '');
    const entities = Array.isArray(reel.entities) ? reel.entities.join(' ') : (reel.entities || '');
    const searchable = [
      reel.subject || '', reel.personalUtility || '', tags, entities,
      reel.author || '', reel.summary || reel.geminiResponse || '',
      reel.caption || ''
    ].join(' ').toLowerCase();

    return searchable.includes(currentSearch);
  });
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
  renderSidebar();
  const container = document.getElementById('mainContent');
  if (!container) return;

  const filtered = getFilteredReels();

  if (activeTab === 'reels') {
    renderGrid(container, filtered);
  } else {
    renderToolsDirectory(container, filtered);
  }
}

function renderSidebar() {
  const sidebar = document.getElementById('categorySidebar');
  if (!sidebar) return;

  const counts = { 'All Reels': allReels.length };
  allReels.forEach(r => {
    const c = r._normCat || 'General Insights';
    counts[c] = (counts[c] || 0) + 1;
  });

  const categories = Object.keys(counts)
    .filter(c => c !== 'All Reels')
    .sort((a, b) => counts[b] - counts[a]);

  sidebar.innerHTML = '';
  [['All Reels', counts['All Reels']], ...categories.map(c => [c, counts[c]])].forEach(([name, count]) => {
    const div = document.createElement('div');
    div.className = 'category-item' + (activeCategory === name ? ' active' : '');
    div.innerHTML = `<span class="cat-name">${esc(name)}</span><span class="badge">${count || 0}</span>`;
    div.addEventListener('click', () => {
      activeCategory = name;
      render();
    });
    sidebar.appendChild(div);
  });
}

function renderGrid(container, reels) {
  if (reels.length === 0) {
    const msg = allReels.length === 0
      ? `<div class="empty-state"><div class="empty-icon">📂</div><h2>No reels synced yet</h2><p>Click <strong>Sync from Extension</strong> to load your knowledge base, or open this page from the extension's <em>Open Knowledge Dashboard</em> button.</p></div>`
      : `<div class="empty-state"><div class="empty-icon">🔍</div><h2>No results</h2><p>No reels match your current filter or search.</p></div>`;
    container.innerHTML = msg;
    return;
  }

  let html = '<div class="reel-grid">';
  reels.forEach((reel, index) => {
    const tags = Array.isArray(reel.tags) ? reel.tags : (reel.tags ? String(reel.tags).split(',') : []);
    const tagsHtml = tags.map(t => `<span class="tag-chip">${esc(t.trim())}</span>`).join('');
    const cat = reel._normCat || 'General Insights';
    const subject = esc(reel.subject || 'Untitled Reel');
    const utility = esc(reel.personalUtility || '');
    const author = esc(reel.author || 'Unknown');
    const url = reel.url || '#';
    const summaryHtml = (reel.summary || reel.geminiResponse || 'No summary available.')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

    html += `
      <div class="reel-card">
        <span class="category-pill">${esc(cat)}</span>
        <h3>${subject}</h3>
        ${utility ? `<p class="personal-utility"><em>${utility}</em></p>` : ''}
        <div class="tags-row">${tagsHtml}</div>
        <div class="author-info">By <strong>@${author}</strong> &mdash; <a href="${url}" target="_blank" rel="noopener">View Reel ↗</a></div>
        <div class="card-actions">
          <button class="btn btn-sm" onclick="window.__toggleSummary(${index})">View Summary</button>
          <button class="btn btn-sm" onclick="window.__copyMarkdown(${index})">Copy Markdown</button>
        </div>
        <div class="summary-expand" id="summary-${index}" style="display:none;">${summaryHtml}</div>
      </div>`;
  });
  html += '</div>';
  container.innerHTML = html;

  // Attach global helpers scoped to current filtered list
  const snapshot = reels;
  window.__toggleSummary = (i) => {
    const el = document.getElementById(`summary-${i}`);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  };
  window.__copyMarkdown = (i) => {
    const reel = snapshot[i];
    if (!reel) return;
    copyToClipboard(generateMarkdown(reel));
  };
}

function renderToolsDirectory(container, reels) {
  const toolMap = {};
  reels.forEach(reel => {
    const rawEntities = Array.isArray(reel.entities)
      ? reel.entities
      : (reel.entities ? String(reel.entities).split(',') : []);

    rawEntities
      .map(e => e.trim())
      .filter(e => e && e.toLowerCase() !== 'none' && e.length > 1)
      .forEach(ent => {
        if (!toolMap[ent]) toolMap[ent] = { count: 0, category: reel._normCat || 'General Insights', mentions: [] };
        toolMap[ent].count++;
        toolMap[ent].mentions.push(`${reel.subject || 'Reel'} (@${reel.author || '?'})`);
      });
  });

  const sorted = Object.entries(toolMap).sort((a, b) => b[1].count - a[1].count);

  if (sorted.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🛠</div><h2>No tools or entities found</h2><p>Entities are auto-extracted from AI summaries. Process some reels first.</p></div>';
    return;
  }

  let html = `<div class="tools-directory"><table class="tools-table"><thead><tr>
    <th>Tool / Entity</th><th>Category</th><th>Mentioned In</th><th>Action</th>
  </tr></thead><tbody>`;

  sorted.forEach(([tool, data]) => {
    const mentionsHtml = data.mentions.slice(0, 3).map(m => `<div class="mention-item">${esc(m)}</div>`).join('');
    const moreCount = data.mentions.length > 3 ? ` <span class="muted">+${data.mentions.length - 3} more</span>` : '';
    html += `<tr>
      <td><strong>${esc(tool)}</strong></td>
      <td><span class="category-pill sm">${esc(data.category)}</span></td>
      <td class="mentions-cell">${mentionsHtml}${moreCount}</td>
      <td><button class="btn btn-sm" onclick="window.__copyTool('${esc(tool).replace(/'/g, "\\'")}')">Copy</button></td>
    </tr>`;
  });

  html += '</tbody></table></div>';
  container.innerHTML = html;

  window.__copyTool = (text) => copyToClipboard(text);
}

// ─── Markdown Generator ───────────────────────────────────────────────────────
function generateMarkdown(reel) {
  const tags = Array.isArray(reel.tags) ? reel.tags.join(', ') : (reel.tags || '');
  const entities = Array.isArray(reel.entities) ? reel.entities.join(', ') : (reel.entities || '');
  let md = `## ${reel.subject || 'Untitled Reel'}\n\n`;
  md += `**Category:** ${reel._normCat || reel.category || 'General Insights'}\n`;
  md += `**Author:** @${reel.author || 'Unknown'}\n`;
  md += `**Source:** ${reel.url || ''}\n\n`;
  if (reel.personalUtility) md += `> ${reel.personalUtility}\n\n`;
  if (tags) md += `**Tags:** ${tags}\n`;
  if (entities) md += `**Tools & Entities:** ${entities}\n`;
  md += `\n### Summary\n\n${reel.summary || reel.geminiResponse || 'No summary.'}\n\n---\n`;
  return md;
}

// ─── Download Playbook ────────────────────────────────────────────────────────
function downloadPlaybook() {
  const reels = getFilteredReels();
  if (reels.length === 0) {
    alert('No reels to download in the current view.');
    return;
  }
  let md = `# ${activeCategory} Playbook\n> ${reels.length} reels | Exported ${new Date().toLocaleDateString()}\n\n`;
  reels.forEach(r => { md += generateMarkdown(r); });
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${activeCategory.replace(/\s+/g, '_')}_Playbook.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Clipboard ────────────────────────────────────────────────────────────────
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showSyncStatus('✓ Copied to clipboard!'))
      .catch(() => legacyCopy(text));
  } else {
    legacyCopy(text);
  }
}

function legacyCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showSyncStatus('✓ Copied!'); } catch(e) {}
  document.body.removeChild(ta);
}

// ─── Status Toast ─────────────────────────────────────────────────────────────
function showSyncStatus(msg) {
  let toast = document.getElementById('_syncToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = '_syncToast';
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#1e1e2e;color:#f8fafc;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid rgba(255,255,255,0.12);box-shadow:0 4px 20px rgba(0,0,0,0.5);z-index:9999;transition:opacity 0.3s;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ─── HTML Escape Helper ───────────────────────────────────────────────────────
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
