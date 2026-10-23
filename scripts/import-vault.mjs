#!/usr/bin/env node

/**
 * import-vault.mjs
 * 
 * Imports reels directly from:
 * 1. An exported vault.json file
 * 2. An Obsidian Knowledge Vault (.zip) exported by the Chrome extension
 * 3. Or automatically auto-detects recent vault downloads in ~/Downloads
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEST_FILE = path.join(__dirname, '..', 'data', 'vault.json');

function sanitizeString(str) {
  if (!str) return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

function parseMarkdownPlaybook(content, fallbackDomain = 'General', fallbackSubdomain = 'General') {
  if (!content || !content.trim()) return [];
  let docDomain = fallbackDomain;
  let docSubdomain = fallbackSubdomain;

  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fmLines = fmMatch[1].split('\n');
    fmLines.forEach((line) => {
      const dMatch = line.match(/^domain:\s*["']?([^"'\n\r]+)["']?/i);
      if (dMatch) docDomain = dMatch[1].trim();
      const sMatch = line.match(/^subdomain:\s*["']?([^"'\n\r]+)["']?/i);
      if (sMatch) docSubdomain = sMatch[1].trim();
    });
  }

  let mainBody = content.replace(/^---\s*\n[\s\S]*?\n---/, '');
  mainBody = mainBody.replace(/##\s*📑\s*Table of Contents[\s\S]*?(?=\n##\s+\d+\.|\n#\s+|$)/i, '');

  let rawSections = [];
  if (/\n##\s+\d+\.\s+/.test(mainBody) || /^##\s+\d+\.\s+/m.test(mainBody)) {
    rawSections = mainBody.split(/\n(?=##\s+\d+\.\s+)/);
  } else {
    rawSections = mainBody.split(/\n(?=##\s+[^#\n]+)/);
  }

  const parsedReels = [];
  rawSections.forEach((sec, idx) => {
    const trimmed = sec.trim();
    if (!trimmed || trimmed.startsWith('# 📂') || trimmed.startsWith('## 📑 Table of Contents') || trimmed.startsWith('# ')) {
      return;
    }

    const titleMatch = trimmed.match(/^##\s+(?:\d+\.\s+)?([^<\n\r]+)/) || trimmed.match(/^###\s+(?:\d+\.\s+)?([^<\n\r]+)/);
    if (!titleMatch) return;

    let subject = sanitizeString(titleMatch[1].replace(/<a[^>]*>.*?<\/a>/gi, '').replace(/\*\*([^*]+)\*\*/g, '$1'));
    if (!subject || subject.toLowerCase().startsWith('table of contents')) return;

    let takeaway = '';
    const takeawayMatch = trimmed.match(/>\s*💡\s*(?:\*\*)?Key Takeaway:(?:\*\*)?\s*([^\n\r]+)/i);
    if (takeawayMatch) takeaway = sanitizeString(takeawayMatch[1]);

    let entities = '';
    const toolsMatch = trimmed.match(/>\s*🛠️\s*(?:\*\*)?Tools\s*(?:&|and)?\s*Tech:(?:\*\*)?\s*`?([^`\n\r]+)`?/i);
    if (toolsMatch) entities = sanitizeString(toolsMatch[1]);

    let tags = '';
    const tagsMatch = trimmed.match(/>\s*🏷️\s*(?:\*\*)?Tags:(?:\*\*)?\s*([^\n\r]+)/i);
    if (tagsMatch) tags = sanitizeString(tagsMatch[1]);

    let url = '';
    const urlMatch = trimmed.match(/\[(?:Watch on Instagram|Original Reel)\]\((https?:\/\/[^\s)]+)\)/i) || trimmed.match(/(https?:\/\/(?:www\.)?instagram\.com\/reel(?:s)?\/[a-zA-Z0-9_\-]+)/i);
    if (urlMatch) url = urlMatch[1].trim();
    else url = `imported_${Date.now()}_${idx}`;

    let summaryBody = trimmed
      .replace(/^##\s+[^\n]+\n?/i, '')
      .replace(/^###\s+[^\n]+\n?/i, '')
      .replace(/>\s*💡[^\n]+\n?/gi, '')
      .replace(/>\s*🛠️[^\n]+\n?/gi, '')
      .replace(/>\s*🏷️[^\n]+\n?/gi, '')
      .replace(/>\s*🔗[^\n]+\n?/gi, '')
      .replace(/^---\s*\n?/gm, '')
      .trim();

    parsedReels.push({
      url,
      domain: docDomain,
      subdomain: docSubdomain,
      subject,
      personalUtility: takeaway,
      entities,
      tags,
      summary: summaryBody || 'No summary text',
      timestamp: Date.now(),
    });
  });

  return parsedReels;
}

async function main() {
  let targetPath = process.argv[2];

  // Auto-detect recent downloads if no argument passed
  if (!targetPath) {
    const downloadsDir = path.join(os.homedir(), 'Downloads');
    if (fs.existsSync(downloadsDir)) {
      const files = fs.readdirSync(downloadsDir);
      const matches = files
        .filter((f) => f.startsWith('ReelAnalyzer_') && (f.endsWith('.zip') || f.endsWith('.json')))
        .map((f) => ({
          name: f,
          path: path.join(downloadsDir, f),
          time: fs.statSync(path.join(downloadsDir, f)).mtimeMs,
        }))
        .sort((a, b) => b.time - a.time);

      if (matches.length > 0) {
        targetPath = matches[0].path;
        console.log(`[Auto-Detected] Found latest download: ${targetPath}`);
      }
    }
  }

  if (!targetPath || !fs.existsSync(targetPath)) {
    console.error('Usage: node scripts/import-vault.mjs <path-to-file.json-or-vault.zip>');
    process.exit(1);
  }

  console.log(`[Reel Vault Import] Reading: ${targetPath}`);
  let newReels = [];

  if (targetPath.endsWith('.json')) {
    const raw = fs.readFileSync(targetPath, 'utf-8');
    newReels = JSON.parse(raw);
  } else if (targetPath.endsWith('.zip')) {
    const buffer = fs.readFileSync(targetPath);
    const zip = await JSZip.loadAsync(buffer);
    for (const [filePath, file] of Object.entries(zip.files)) {
      if (file.dir || !filePath.endsWith('.md') || filePath.includes('__MACOSX') || filePath.endsWith('00_Master_Index.md')) {
        continue;
      }
      const text = await file.async('string');
      const parts = filePath.split('/');
      const domain = parts.length >= 2 ? parts[0].replace(/_/g, ' ') : 'General';
      const subdomain = parts.length >= 2 ? parts[1].replace(/\.md$/i, '').replace(/_/g, ' ') : 'General';
      const items = parseMarkdownPlaybook(text, domain, subdomain);
      newReels.push(...items);
    }
  }

  if (!Array.isArray(newReels) || newReels.length === 0) {
    console.error('[Reel Vault Import] No reels found in file.');
    process.exit(1);
  }

  // Merge with existing
  let existing = [];
  try {
    if (fs.existsSync(DEST_FILE)) {
      existing = JSON.parse(fs.readFileSync(DEST_FILE, 'utf-8'));
    }
  } catch {}

  const urlMap = new Map();
  existing.forEach((r) => r.url && urlMap.set(r.url, r));
  newReels.forEach((r) => r.url && urlMap.set(r.url, r));

  const merged = Array.from(urlMap.values());
  fs.mkdirSync(path.dirname(DEST_FILE), { recursive: true });
  fs.writeFileSync(DEST_FILE, JSON.stringify(merged, null, 2), 'utf-8');

  console.log(`[Reel Vault Import] ✅ Successfully imported ${newReels.length} reels!`);
  console.log(`[Reel Vault Import] 📊 Total unique reels now in vault.json: ${merged.length}`);
}

main().catch((err) => {
  console.error('[Reel Vault Import] Error:', err);
  process.exit(1);
});
