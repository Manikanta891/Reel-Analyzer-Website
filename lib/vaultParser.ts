import JSZip from 'jszip';
import { ReelItem } from '@/types';

/**
 * Strips dangerous HTML / script tags from extracted content
 */
function sanitizeString(str: string): string {
  if (!str) return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Parses frontmatter and individual reel sections from a markdown playbook
 */
export function parseMarkdownPlaybook(
  content: string,
  fallbackDomain = 'General',
  fallbackSubdomain = 'General'
): ReelItem[] {
  if (!content || !content.trim()) return [];

  // Extract YAML frontmatter if present
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

  // Remove frontmatter
  let mainBody = content.replace(/^---\s*\n[\s\S]*?\n---/, '');
  // Remove Table of Contents
  mainBody = mainBody.replace(/##\s*📑\s*Table of Contents[\s\S]*?(?=\n##\s+\d+\.|\n#\s+|$)/i, '');

  // Split into insight sections: if numbered sections exist (## 1. , ## 2. ), split strictly by them
  let rawSections: string[] = [];
  if (/\n##\s+\d+\.\s+/.test(mainBody) || /^##\s+\d+\.\s+/m.test(mainBody)) {
    rawSections = mainBody.split(/\n(?=##\s+\d+\.\s+)/);
  } else {
    rawSections = mainBody.split(/\n(?=##\s+[^#\n]+)/);
  }

  const parsedReels: ReelItem[] = [];

  rawSections.forEach((sec, idx) => {
    const trimmed = sec.trim();
    if (!trimmed || trimmed.startsWith('# 📂') || trimmed.startsWith('## 📑 Table of Contents') || trimmed.startsWith('# ')) {
      return;
    }

    // Extract Title / Subject from ## 1. Title or ### Title or ## Title
    const titleMatch =
      trimmed.match(/^##\s+(?:\d+\.\s+)?([^<\n\r]+)/) ||
      trimmed.match(/^###\s+(?:\d+\.\s+)?([^<\n\r]+)/);
    if (!titleMatch) return;

    let subject = sanitizeString(titleMatch[1].replace(/<a[^>]*>.*?<\/a>/gi, '').replace(/\*\*([^*]+)\*\*/g, '$1'));
    if (!subject || subject.toLowerCase().startsWith('table of contents')) return;

    // Extract Key Takeaway
    let takeaway = '';
    const takeawayMatch =
      trimmed.match(/>\s*💡\s*(?:\*\*)?Key Takeaway:(?:\*\*)?\s*([^\n\r]+)/i) ||
      trimmed.match(/(?:\*\*)?Key Takeaway:(?:\*\*)?\s*([^\n\r]+)/i);
    if (takeawayMatch) {
      takeaway = sanitizeString(takeawayMatch[1]);
    }

    // Extract Tools & Tech / Entities
    let entities = '';
    const toolsMatch =
      trimmed.match(/>\s*🛠️\s*(?:\*\*)?Tools\s*(?:&|and)?\s*Tech:(?:\*\*)?\s*`?([^`\n\r]+)`?/i) ||
      trimmed.match(/(?:\*\*)?Tools\s*(?:&|and)?\s*(?:Frameworks|Tech):(?:\*\*)?\s*`?([^`\n\r]+)`?/i) ||
      trimmed.match(/(?:\*\*)?Tools:(?:\*\*)?\s*`?([^`\n\r]+)`?/i);
    if (toolsMatch) {
      entities = sanitizeString(toolsMatch[1]);
    }

    // Extract Tags
    let tags = '';
    const tagsMatch =
      trimmed.match(/>\s*🏷️\s*(?:\*\*)?Tags:(?:\*\*)?\s*([^\n\r]+)/i) ||
      trimmed.match(/(?:\*\*)?Tags:(?:\*\*)?\s*([^\n\r]+)/i);
    if (tagsMatch) {
      tags = sanitizeString(tagsMatch[1]);
    }

    // Extract URL
    let url = '';
    const urlMatch =
      trimmed.match(/\[(?:Watch on Instagram|View Original Reel|Open Reel|Original Reel)\]\((https?:\/\/[^\s)]+)\)/i) ||
      trimmed.match(/(https?:\/\/(?:www\.)?instagram\.com\/reel(?:s)?\/[a-zA-Z0-9_\-]+)/i);
    if (urlMatch) {
      url = urlMatch[1].trim();
    } else {
      url = `https://instagram.com/reel/imported_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
    }

    // Extract remaining content as clean, full rich summary
    let summaryBody = trimmed;
    summaryBody = summaryBody.replace(/^##\s+[^\n]+\n?/i, '');
    summaryBody = summaryBody.replace(/^###\s+[^\n]+\n?/i, '');
    summaryBody = summaryBody.replace(/>\s*💡\s*(?:\*\*)?Key Takeaway:(?:\*\*)?[^\n]+\n?/gi, '');
    summaryBody = summaryBody.replace(/>\s*🛠️\s*(?:\*\*)?Tools\s*(?:&|and)?\s*Tech:(?:\*\*)?[^\n]+\n?/gi, '');
    summaryBody = summaryBody.replace(/>\s*🏷️\s*(?:\*\*)?Tags:(?:\*\*)?[^\n]+\n?/gi, '');
    summaryBody = summaryBody.replace(/>\s*🔗[^\n]+\n?/gi, '');
    summaryBody = summaryBody.replace(/###\s*📖\s*Summary\s*(?:&|and)?\s*Directives\s*\n?/gi, '');
    summaryBody = summaryBody.replace(/^---\s*\n?/gm, '');
    // Clean up duplicate YAML frontmatter lines inside summary if echoed
    summaryBody = summaryBody.replace(/##\s*domain:\s*"[^"]+"\n?/gi, '');
    summaryBody = summaryBody.replace(/subdomain:\s*"[^"]+"\n?/gi, '');
    summaryBody = summaryBody.replace(/subject:\s*"[^"]+"\n?/gi, '');
    summaryBody = summaryBody.replace(/personal_utility:\s*"[^"]+"\n?/gi, '');
    summaryBody = summaryBody.replace(/entities:\s*\[[^\]]+\]\n?/gi, '');
    summaryBody = summaryBody.replace(/tags:\s*\[[^\]]+\]\n?/gi, '');
    summaryBody = summaryBody.replace(/<div align="center">[\s\S]*?<\/div>/gi, '');
    summaryBody = summaryBody.replace(/<br>\s*$/gi, '');
    summaryBody = summaryBody.replace(/\n---\s*$/g, '');

    const summary = sanitizeString(summaryBody) || 'No detailed summary provided.';

    if (subject && subject.length > 1) {
      parsedReels.push({
        url,
        domain: docDomain,
        subdomain: docSubdomain,
        subject,
        personalUtility: takeaway,
        entities,
        tags,
        summary,
        timestamp: Date.now(),
      });
    }
  });

  return parsedReels;
}

/**
 * Unpacks and parses an Obsidian Knowledge Vault (.zip)
 */
export async function parseZipVault(
  zipBuffer: ArrayBuffer
): Promise<{ reels: ReelItem[]; totalFiles: number; domainsFound: string[] }> {
  const zip = await JSZip.loadAsync(zipBuffer);
  const allReels: ReelItem[] = [];
  const domainsSet = new Set<string>();
  let totalFiles = 0;

  const fileEntries = Object.keys(zip.files).filter(
    (fileName) =>
      fileName.endsWith('.md') &&
      !fileName.includes('__MACOSX') &&
      !fileName.endsWith('00_Master_Index.md')
  );

  for (const filePath of fileEntries) {
    const file = zip.files[filePath];
    if (file.dir) continue;

    totalFiles++;
    const textContent = await file.async('string');

    // Infer domain/subdomain from path: e.g. "Cloud_DevOps/Docker_Rollouts.md"
    const pathParts = filePath.split('/');
    let inferredDomain = 'General';
    let inferredSubdomain = 'General';

    if (pathParts.length >= 2) {
      inferredDomain = pathParts[0].replace(/_/g, ' ');
      inferredSubdomain = pathParts[pathParts.length - 1].replace(/\.md$/i, '').replace(/_/g, ' ');
    } else if (pathParts.length === 1) {
      inferredSubdomain = pathParts[0].replace(/\.md$/i, '').replace(/_/g, ' ');
    }

    const extracted = parseMarkdownPlaybook(textContent, inferredDomain, inferredSubdomain);
    extracted.forEach((r) => {
      allReels.push(r);
      if (r.domain) domainsSet.add(r.domain);
    });
  }

  return {
    reels: allReels,
    totalFiles,
    domainsFound: Array.from(domainsSet),
  };
}
