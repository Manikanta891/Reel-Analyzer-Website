// Reel Analyzer Dashboard Logic

// State
let allReels = [];
let activeCategory = 'All Reels';
let currentSearch = '';
let activeTab = 'reels'; // 'reels' or 'tools'

const BASE_CATEGORIES = ['Technology & AI', 'Finance & Business', 'Fitness & Health', 'Career & Education', 'Design & Creative', 'Productivity & Habits', 'Lifestyle & Hobbies', 'General Insights'];

function normalizeCategory(raw) {
  if (!raw) return 'General Insights';
  const tokens = raw.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const clusterMap = {
    'Technology & AI': ['tech','ai','llm','code','coding','software','python','developer','web','cloud','github','app','programming','machine','learning','data','model'],
    'Finance & Business': ['finance','money','invest','stock','crypto','tax','business','revenue','profit','marketing','sales','startup','real','estate','wealth'],
    'Fitness & Health': ['fitness','workout','gym','diet','nutrition','health','exercise','muscle','training','yoga','run','cardio','weight','body'],
    'Career & Education': ['career','job','interview','resume','study','learn','skill','course','degree','productivity','college','university','leadership'],
    'Design & Creative': ['design','ui','ux','figma','css','animation','video','photo','creative','art','color','typography','brand','logo'],
    'Productivity & Habits': ['productivity','habit','focus','routine','mindset','goal','time','manage','system','discipline','morning','evening'],
    'Lifestyle & Hobbies': ['food','cook','recipe','travel','fashion','music','game','gaming','sport','diy','craft','garden','pet','hobby'],
    'General Insights': ['quote','motivation','inspire','philosophy','mindfulness','life','general']
  };
  for (const [cat, keywords] of Object.entries(clusterMap)) {
    if (tokens.some(t => t.length > 2 && keywords.includes(t))) return cat;
  }
  // New dynamic category
  return raw.trim().replace(/^(\w)/, c => c.toUpperCase());
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  render();
});

function loadData() {
  try {
    const data = localStorage.getItem('reelsData');
    if (data) {
      allReels = JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load data from localStorage', e);
  }
  normalizeReelsData();
}

function saveData() {
  localStorage.setItem('reelsData', JSON.stringify(allReels));
}

function normalizeReelsData() {
  allReels = allReels.map(reel => ({
    ...reel,
    normalizedCategory: normalizeCategory(reel.category)
  }));
}

// Window Message Listener for Sync
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REEL_ANALYZER_SYNC') {
    const incomingData = event.data.data;
    if (Array.isArray(incomingData)) {
      // Merge, avoid exact URL duplicates (simple approach)
      const existingUrls = new Set(allReels.map(r => r.url));
      const newReels = incomingData.filter(r => !existingUrls.has(r.url));
      if (newReels.length > 0) {
        allReels = [...newReels, ...allReels];
        normalizeReelsData();
        saveData();
        render();
        alert(`Synced ${newReels.length} new reels!`);
      } else {
        alert('Data is already up to date.');
      }
    }
  }
});

function setupEventListeners() {
  const btnSync = document.getElementById('btnSync');
  if (btnSync) {
    btnSync.addEventListener('click', () => {
      alert('Click the "Open Web Dashboard" button in the Reel Analyzer side panel extension to sync your reels here.');
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      currentSearch = e.target.value.toLowerCase();
      render();
    });
  }

  const btnReels = document.getElementById('btnTabReels');
  const btnTools = document.getElementById('btnTabTools');
  
  if (btnReels) {
    btnReels.addEventListener('click', () => {
      activeTab = 'reels';
      updateTabs();
      render();
    });
  }
  if (btnTools) {
    btnTools.addEventListener('click', () => {
      activeTab = 'tools';
      updateTabs();
      render();
    });
  }

  const btnDownloadPlaybook = document.getElementById('btnDownloadPlaybook');
  if (btnDownloadPlaybook) {
    btnDownloadPlaybook.addEventListener('click', downloadPlaybook);
  }
}

function updateTabs() {
  const btnReels = document.getElementById('btnTabReels');
  const btnTools = document.getElementById('btnTabTools');
  if (activeTab === 'reels') {
    if(btnReels) btnReels.classList.add('active');
    if(btnTools) btnTools.classList.remove('active');
  } else {
    if(btnReels) btnReels.classList.remove('active');
    if(btnTools) btnTools.classList.add('active');
  }
}

function getFilteredReels() {
  return allReels.filter(reel => {
    const matchCategory = activeCategory === 'All Reels' || reel.normalizedCategory === activeCategory;
    
    if (!matchCategory) return false;
    if (!currentSearch) return true;

    const searchableText = [
      reel.subject,
      reel.personalUtility,
      reel.tags ? (Array.isArray(reel.tags) ? reel.tags.join(' ') : reel.tags) : '',
      reel.author,
      reel.entities ? (Array.isArray(reel.entities) ? reel.entities.join(' ') : reel.entities) : '',
      reel.summary || reel.geminiResponse
    ].join(' ').toLowerCase();

    return searchableText.includes(currentSearch);
  });
}

function render() {
  renderSidebar();
  
  const container = document.getElementById('mainContent');
  if (!container) return;

  if (activeTab === 'reels') {
    renderGrid(container, getFilteredReels());
  } else {
    renderToolsDirectory(container, getFilteredReels());
  }
}

function renderSidebar() {
  const sidebar = document.getElementById('categorySidebar');
  if (!sidebar) return;
  
  const categoryCounts = { 'All Reels': allReels.length };
  
  allReels.forEach(reel => {
    const cat = reel.normalizedCategory;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  sidebar.innerHTML = '';
  
  // Create All Reels
  sidebar.appendChild(createCategoryItem('All Reels', categoryCounts['All Reels']));
  
  // Sort other categories by count
  const sortedCategories = Object.keys(categoryCounts)
    .filter(c => c !== 'All Reels')
    .sort((a, b) => categoryCounts[b] - categoryCounts[a]);

  sortedCategories.forEach(cat => {
    sidebar.appendChild(createCategoryItem(cat, categoryCounts[cat]));
  });
}

function createCategoryItem(name, count) {
  const div = document.createElement('div');
  div.className = `category-item ${activeCategory === name ? 'active' : ''}`;
  div.innerHTML = `<span>${name}</span> <span class="badge">${count}</span>`;
  div.addEventListener('click', () => {
    activeCategory = name;
    render();
  });
  return div;
}

function renderGrid(container, reels) {
  if (reels.length === 0) {
    container.innerHTML = '<div class="empty-state">No reels found matching your criteria.</div>';
    return;
  }

  let html = '<div class="reel-grid" id="reelGrid">';
  
  reels.forEach((reel, index) => {
    const tagsArr = Array.isArray(reel.tags) ? reel.tags : (reel.tags ? reel.tags.split(',') : []);
    const tagsHtml = tagsArr.map(t => `<span class="tag-chip">${t.trim()}</span>`).join('');
    
    html += `
      <div class="reel-card">
        <div class="category-pill">${reel.normalizedCategory}</div>
        <h3>${reel.subject || 'Untitled Reel'}</h3>
        <p class="personal-utility"><i>${reel.personalUtility || 'No specific utility found'}</i></p>
        <div class="tags-container">${tagsHtml}</div>
        <div class="author-info">By ${reel.author || 'Unknown'} - <a href="${reel.url}" target="_blank">View Original</a></div>
        
        <div class="card-actions">
          <button class="btn btn-sm btn-outline" onclick="toggleSummary(${index})">View Summary</button>
          <button class="btn btn-sm btn-outline" onclick="copyReelMarkdown(${index})">Copy Markdown</button>
        </div>
        
        <div class="summary-expand" id="summary-${index}" style="display: none;">
          ${(reel.summary || reel.geminiResponse || 'No summary available.').replace(/\\n/g, '<br>')}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

function toggleSummary(index) {
  const el = document.getElementById(`summary-${index}`);
  if (el) {
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  }
}

function renderToolsDirectory(container, reels) {
  // Aggregate entities
  const toolMap = {};
  
  reels.forEach(reel => {
    let entities = [];
    if (Array.isArray(reel.entities)) {
      entities = reel.entities;
    } else if (typeof reel.entities === 'string') {
      entities = reel.entities.split(',').map(e => e.trim());
    }
    
    entities.forEach(ent => {
      if (!ent) return;
      if (!toolMap[ent]) {
        toolMap[ent] = { count: 0, category: reel.normalizedCategory, mentions: [] };
      }
      toolMap[ent].count++;
      toolMap[ent].mentions.push(`${reel.subject} (${reel.author})`);
    });
  });

  const sortedTools = Object.entries(toolMap).sort((a, b) => b[1].count - a[1].count);

  if (sortedTools.length === 0) {
    container.innerHTML = '<div class="empty-state">No tools or entities found.</div>';
    return;
  }

  let html = `
    <div class="tools-directory">
      <table class="tools-table">
        <thead>
          <tr>
            <th>Tool / Entity</th>
            <th>Category</th>
            <th>Mentioned In</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  `;

  sortedTools.forEach(([tool, data]) => {
    const mentionsText = data.mentions.join('<br>');
    html += `
      <tr>
        <td><strong>${tool}</strong></td>
        <td><span class="category-pill">${data.category}</span></td>
        <td class="mentions-cell">${mentionsText}</td>
        <td><button class="btn btn-sm btn-outline" onclick="copyToClipboard('${tool}')">Copy</button></td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = html;
}

// Export utilities
function generateMarkdownReel(reel) {
  let md = `## ${reel.subject || 'Untitled'}\n\n`;
  md += `**Category:** ${reel.normalizedCategory}\n`;
  md += `**Author:** ${reel.author}\n`;
  md += `**URL:** ${reel.url}\n\n`;
  md += `> ${reel.personalUtility}\n\n`;
  
  if (reel.tags) {
    const t = Array.isArray(reel.tags) ? reel.tags.join(', ') : reel.tags;
    md += `**Tags:** ${t}\n\n`;
  }
  
  if (reel.entities) {
    const e = Array.isArray(reel.entities) ? reel.entities.join(', ') : reel.entities;
    md += `**Entities/Tools:** ${e}\n\n`;
  }
  
  md += `### Summary\n\n`;
  md += `${reel.summary || reel.geminiResponse}\n\n`;
  md += `---\n\n`;
  return md;
}

window.copyReelMarkdown = function(index) {
  const reels = getFilteredReels();
  const reel = reels[index];
  if (reel) {
    const md = generateMarkdownReel(reel);
    copyToClipboard(md, 'Markdown copied!');
  }
}

function downloadPlaybook() {
  const reels = getFilteredReels();
  if (reels.length === 0) {
    alert('No reels to download in the current view.');
    return;
  }

  let md = `# Reel Playbook: ${activeCategory}\n\n`;
  reels.forEach(r => {
    md += generateMarkdownReel(r);
  });

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Playbook_${activeCategory.replace(/\s+/g, '_')}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.copyToClipboard = function(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert(successMsg);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      fallbackCopyTextToClipboard(text, successMsg);
    });
  } else {
    fallbackCopyTextToClipboard(text, successMsg);
  }
}

function fallbackCopyTextToClipboard(text, successMsg) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) alert(successMsg);
    else alert('Fallback copy failed');
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
