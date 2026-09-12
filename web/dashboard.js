/**
 * Reel Analyzer - Web Knowledge Dashboard
 * Full Domain & Subdomain Emergent Taxonomy Architecture
 * Data Source: chrome.storage.local (Extension Page) & localStorage (Web Mirror)
 */

// ─── State ─────────────────────────────────────────────────────────────────
let allReels = [];
let activeDomain = 'All Domains';
let activeSubdomain = 'All';
let currentSearch = '';
let activeTab = 'reels'; // 'reels' or 'tools'

// ─── Normalizer Helper ──────────────────────────────────────────────────────
function getNormalizedItem(r) {
  let domain = r.domain || r.category || 'General Insights';
  let subdomain = r.subdomain || 'General';

  // If old-format category like "Technology - DevOps & Cloud", split cleanly
  if ((!r.domain || !r.subdomain) && r.category && r.category.includes(' - ')) {
    const parts = r.category.split(' - ');
    domain = parts[0].trim();
    subdomain = parts[1].trim();
  }

  return {
    ...r,
    _domain: domain.trim(),
    _subdomain: subdomain.trim()
  };
}

function normalizeAllReels() {
  allReels = allReels.map(getNormalizedItem);
}

// ─── Data Loading ───────────────────────────────────────────────────────────
function loadData() {
  // Priority 1: chrome.storage.local (when opened as extension page)
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get({ reelsData: [] }, (result) => {
      allReels = Array.isArray(result.reelsData) ? result.reelsData : [];
      normalizeAllReels();
      try { localStorage.setItem('reelAnalyzerData', JSON.stringify(allReels)); } catch (e) {}
      render();
      showSyncStatus(`Loaded ${allReels.length} reel${allReels.length !== 1 ? 's' : ''} from extension.`);
    });
    return;
  }

  // Priority 2: localStorage fallback (GitHub Pages / Vercel deploy)
  try {
    const raw = localStorage.getItem('reelAnalyzerData') || localStorage.getItem('reelsData');
    if (raw) {
      allReels = JSON.parse(raw) || [];
      normalizeAllReels();
    }
  } catch (e) {
    console.error('[Reel Analyzer] Failed to load from localStorage:', e);
  }
  render();
}

function saveToLocalStorage() {
  try { localStorage.setItem('reelAnalyzerData', JSON.stringify(allReels)); } catch (e) {}
}

// ─── Extension Message Sync Listener ────────────────────────────────────────
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'SYNC_DATA' && Array.isArray(request.reelsData)) {
      mergeAndSync(request.reelsData);
      sendResponse({ success: true });
    }
    return true;
  });
}

// postMessage fallback
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REEL_ANALYZER_SYNC' && Array.isArray(event.data.data)) {
    mergeAndSync(event.data.data);
  }
});

function mergeAndSync(incoming) {
  const existingUrls = new Set(allReels.map((r) => r.url));
  const newReels = incoming.filter((r) => r.url && !existingUrls.has(r.url));
  if (newReels.length > 0) {
    allReels = [...newReels, ...allReels];
    normalizeAllReels();
    saveToLocalStorage();
    render();
    showSyncStatus(`✓ Synced ${newReels.length} new reel${newReels.length !== 1 ? 's' : ''}!`);
  } else {
    showSyncStatus('✓ Knowledge base is up to date.');
  }
}

// ─── Initialization & Event Handlers ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // Sync Button
  const btnSync = document.getElementById('btnSync');
  if (btnSync) {
    btnSync.addEventListener('click', () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get({ reelsData: [] }, (result) => {
          allReels = Array.isArray(result.reelsData) ? result.reelsData : [];
          normalizeAllReels();
          saveToLocalStorage();
          render();
          showSyncStatus(`✓ Refreshed ${allReels.length} reel${allReels.length !== 1 ? 's' : ''}.`);
        });
      } else {
        showSyncStatus('Open this dashboard from the Reel Analyzer extension side panel to sync data.');
      }
    });
  }

  // Live Search Input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      render();
    });
  }

  // Tabs: Reels vs Tools Directory
  const btnTabReels = document.getElementById('btnTabReels');
  const btnTabTools = document.getElementById('btnTabTools');

  if (btnTabReels) {
    btnTabReels.addEventListener('click', () => {
      activeTab = 'reels';
      btnTabReels.classList.add('active');
      if (btnTabTools) btnTabTools.classList.remove('active');
      render();
    });
  }

  if (btnTabTools) {
    btnTabTools.addEventListener('click', () => {
      activeTab = 'tools';
      btnTabTools.classList.add('active');
      if (btnTabReels) btnTabReels.classList.remove('active');
      render();
    });
  }

  // Download Playbook Button
  const btnDownloadPlaybook = document.getElementById('btnDownloadPlaybook');
  if (btnDownloadPlaybook) {
    btnDownloadPlaybook.addEventListener('click', downloadCurrentPlaybook);
  }
});

// ─── Filter Logic ────────────────────────────────────────────────────────────
function getFilteredReels() {
  return allReels.filter((reel) => {
    // 1. Domain match
    const matchDomain = activeDomain === 'All Domains' || reel._domain === activeDomain;
    if (!matchDomain) return false;

    // 2. Subdomain match
    const matchSub = activeSubdomain === 'All' || reel._subdomain === activeSubdomain;
    if (!matchSub) return false;

    // 3. Search query match
    if (!currentSearch) return true;

    const tags = Array.isArray(reel.tags) ? reel.tags.join(' ') : (reel.tags || '');
    const entities = Array.isArray(reel.entities) ? reel.entities.join(' ') : (reel.entities || '');
    const searchable = [
      reel.subject || '',
      reel.personalUtility || '',
      reel._domain || '',
      reel._subdomain || '',
      tags,
      entities,
      reel.author || '',
      reel.summary || reel.geminiResponse || '',
      reel.caption || ''
    ].join(' ').toLowerCase();

    return searchable.includes(currentSearch);
  });
}

// ─── Main Render ─────────────────────────────────────────────────────────────
function render() {
  renderSidebar();
  const container = document.getElementById('mainContent');
  if (!container) return;

  const filtered = getFilteredReels();

  if (activeTab === 'reels') {
    renderReelsView(container, filtered);
  } else {
    renderToolsDirectory(container, filtered);
  }
}

// ─── Sidebar (Domains) ───────────────────────────────────────────────────────
function renderSidebar() {
  const sidebar = document.getElementById('categorySidebar');
  if (!sidebar) return;

  // Aggregate domain counts
  const domainCounts = { 'All Domains': allReels.length };
  allReels.forEach((r) => {
    const d = r._domain || 'General Insights';
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  });

  const domains = Object.keys(domainCounts)
    .filter((d) => d !== 'All Domains')
    .sort((a, b) => domainCounts[b] - domainCounts[a]);

  sidebar.innerHTML = '';
  [['All Domains', domainCounts['All Domains']], ...domains.map((d) => [d, domainCounts[d]])].forEach(([name, count]) => {
    const div = document.createElement('div');
    div.className = 'category-item' + (activeDomain === name ? ' active' : '');
    div.innerHTML = `<span class="cat-name">${esc(name)}</span><span class="badge">${count || 0}</span>`;
    div.addEventListener('click', () => {
      activeDomain = name;
      activeSubdomain = 'All'; // Reset subdomain on domain switch
      render();
    });
    sidebar.appendChild(div);
  });
}

// ─── Reels View with Dynamic Subdomain Filter Bar ───────────────────────────
function renderReelsView(container, reels) {
  // 1. Build Subdomain Filter Pills Bar
  let subdomainsHtml = '';
  if (activeDomain !== 'All Domains') {
    // Find all subdomains in the active domain
    const domainReels = allReels.filter((r) => r._domain === activeDomain);
    const subCounts = { All: domainReels.length };
    domainReels.forEach((r) => {
      const s = r._subdomain || 'General';
      subCounts[s] = (subCounts[s] || 0) + 1;
    });

    const subList = Object.keys(subCounts).filter((s) => s !== 'All');

    if (subList.length > 0) {
      let pills = `<div class="subdomain-bar"><span class="subdomain-label">Subdomains:</span>`;
      pills += `<span class="subdomain-pill ${activeSubdomain === 'All' ? 'active' : ''}" onclick="window.__setSubdomain('All')">All (${subCounts['All']})</span>`;
      subList.forEach((sub) => {
        pills += `<span class="subdomain-pill ${activeSubdomain === sub ? 'active' : ''}" onclick="window.__setSubdomain('${esc(sub).replace(/'/g, "\\'")}')">${esc(sub)} (${subCounts[sub]})</span>`;
      });
      pills += `</div>`;
      subdomainsHtml = pills;
    }
  }

  // 2. Empty state check
  if (reels.length === 0) {
    const msg = allReels.length === 0
      ? `<div class="empty-state"><div class="empty-icon">📂</div><h2>No reels synced yet</h2><p>Click <strong>Sync from Extension</strong> to load your knowledge base, or summarize a reel in the extension side panel.</p></div>`
      : `<div class="empty-state"><div class="empty-icon">🔍</div><h2>No matching reels</h2><p>No reels found in <strong>${esc(activeDomain)}</strong> ${activeSubdomain !== 'All' ? `&rarr; <strong>${esc(activeSubdomain)}</strong>` : ''} matching your search.</p></div>`;
    container.innerHTML = subdomainsHtml + msg;
    return;
  }

  // 3. Grid of Cards
  let html = subdomainsHtml + '<div class="reel-grid">';
  reels.forEach((reel, index) => {
    const tags = Array.isArray(reel.tags) ? reel.tags : (reel.tags ? String(reel.tags).split(',') : []);
    const tagsHtml = tags.map((t) => `<span class="tag-chip">${esc(t.trim())}</span>`).join('');
    const domain = esc(reel._domain || 'General');
    const subdomain = esc(reel._subdomain || 'General');
    const subject = esc(reel.subject || 'Untitled Reel');
    const utility = esc(reel.personalUtility || '');
    const author = esc(reel.author || 'Unknown');
    const url = reel.url || '#';
    const summaryHtml = (reel.summary || reel.geminiResponse || 'No summary available.')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

    html += `
      <div class="reel-card">
        <div class="card-tax-header">
          <span class="category-pill">${domain}</span>
          ${subdomain && subdomain !== 'General' ? `<span class="subdomain-chip">${subdomain}</span>` : ''}
        </div>
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

  // Window helper bindings
  const snapshot = reels;
  window.__setSubdomain = (sub) => {
    activeSubdomain = sub;
    render();
  };
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

// ─── Tools & Entities Directory Tab ─────────────────────────────────────────
function renderToolsDirectory(container, reels) {
  const toolMap = {};
  reels.forEach((reel) => {
    const rawEntities = Array.isArray(reel.entities)
      ? reel.entities
      : (reel.entities ? String(reel.entities).split(',') : []);

    rawEntities
      .map((e) => e.trim())
      .filter((e) => e && e.toLowerCase() !== 'none' && e.length > 1)
      .forEach((ent) => {
        if (!toolMap[ent]) {
          toolMap[ent] = {
            count: 0,
            domain: reel._domain || 'General',
            subdomain: reel._subdomain || 'General',
            mentions: []
          };
        }
        toolMap[ent].count++;
        toolMap[ent].mentions.push(`${reel.subject || 'Reel'} (@${reel.author || '?'})`);
      });
  });

  const sorted = Object.entries(toolMap).sort((a, b) => b[1].count - a[1].count);

  if (sorted.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🛠</div><h2>No tools or entities found</h2><p>Tools and entities are auto-extracted from AI summaries. Process some reels first.</p></div>';
    return;
  }

  let html = `<div class="tools-directory"><table class="tools-table"><thead><tr>
    <th>Tool / Entity</th><th>Domain</th><th>Subdomain</th><th>Mentioned In</th><th>Action</th>
  </tr></thead><tbody>`;

  sorted.forEach(([tool, data]) => {
    const mentionsHtml = data.mentions.slice(0, 3).map((m) => `<div class="mention-item">${esc(m)}</div>`).join('');
    const moreCount = data.mentions.length > 3 ? ` <span class="muted">+${data.mentions.length - 3} more</span>` : '';
    html += `<tr>
      <td><strong>${esc(tool)}</strong></td>
      <td><span class="category-pill sm">${esc(data.domain)}</span></td>
      <td><span class="subdomain-chip sm">${esc(data.subdomain)}</span></td>
      <td class="mentions-cell">${mentionsHtml}${moreCount}</td>
      <td><button class="btn btn-sm" onclick="window.__copyTool('${esc(tool).replace(/'/g, "\\'")}')">Copy</button></td>
    </tr>`;
  });

  html += '</tbody></table></div>';
  container.innerHTML = html;

  window.__copyTool = (text) => copyToClipboard(text);
}

// ─── Markdown Generators ─────────────────────────────────────────────────────
function generateMarkdown(reel) {
  const tags = Array.isArray(reel.tags) ? reel.tags.join(', ') : (reel.tags || '');
  const entities = Array.isArray(reel.entities) ? reel.entities.join(', ') : (reel.entities || '');
  let md = `## ${reel.subject || 'Untitled Reel'}\n\n`;
  md += `**Domain:** ${reel._domain || 'General'}\n`;
  md += `**Subdomain:** ${reel._subdomain || 'General'}\n`;
  md += `**Author:** @${reel.author || 'Unknown'}\n`;
  md += `**Source:** ${reel.url || ''}\n\n`;
  if (reel.personalUtility) md += `> **Why it matters:** ${reel.personalUtility}\n\n`;
  if (tags) md += `**Tags:** ${tags}\n`;
  if (entities) md += `**Tools & Entities:** ${entities}\n`;
  md += `\n### Summary\n\n${reel.summary || reel.geminiResponse || 'No summary.'}\n\n---\n`;
  return md;
}

// ─── Download Playbook ────────────────────────────────────────────────────────
function downloadCurrentPlaybook() {
  const reels = getFilteredReels();
  if (reels.length === 0) {
    alert('No reels to download in the current view.');
    return;
  }

  const title = activeDomain === 'All Domains'
    ? 'Complete Knowledge Base'
    : (activeSubdomain === 'All' ? `${activeDomain} Playbook` : `${activeDomain} - ${activeSubdomain} Playbook`);

  // Group by subdomain
  const grouped = {};
  reels.forEach((r) => {
    const sub = r._subdomain || 'General';
    if (!grouped[sub]) grouped[sub] = [];
    grouped[sub].push(r);
  });

  let md = `# ${title}\n> Total Reels: ${reels.length} | Exported: ${new Date().toLocaleDateString()}\n\n`;

  // Table of Contents
  md += `## Table of Contents\n`;
  for (const [sub, subReels] of Object.entries(grouped)) {
    md += `### ${sub} (${subReels.length})\n`;
    subReels.forEach((r, i) => {
      const anchor = (r.subject || `Reel ${i + 1}`).toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      md += `- [${r.subject || `Reel by @${r.author}`}](#${anchor}) — @${r.author}\n`;
    });
  }
  md += `\n---\n\n`;

  // Content
  for (const [sub, subReels] of Object.entries(grouped)) {
    md += `## 📁 Subdomain: ${sub}\n\n`;
    subReels.forEach((r) => {
      md += generateMarkdown(r) + '\n';
    });
  }

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Clipboard Helper ─────────────────────────────────────────────────────────
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
  try { document.execCommand('copy'); showSyncStatus('✓ Copied!'); } catch (e) {}
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
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
