/**
 * summaryParser.ts - Robust markdown sanitizer and structured section parser
 * Handles edge cases, missing fields, inline/fenced YAML, and unformatted raw outputs safely.
 */

export interface ExtractedMeta {
  domain: string | null;
  subdomain: string | null;
  subject: string | null;
  personalUtility: string | null;
  entities: string | null;
  tags: string | null;
}

/**
 * Extracts structured metadata fields from raw markdown or summary text
 */
export function extractMetadataFromText(raw: string | undefined | null): ExtractedMeta {
  const result: ExtractedMeta = {
    domain: null,
    subdomain: null,
    subject: null,
    personalUtility: null,
    entities: null,
    tags: null,
  };

  if (!raw || typeof raw !== 'string') return result;

  const extractField = (aliases: string[]): string | null => {
    for (const alias of aliases) {
      // Matches both line-by-line YAML and inline "key: value"
      const pattern = new RegExp(
        `(?:^|[\\n#*\\s|,-])\\*?\\*?${alias}\\*?\\*?\\s*:\\s*` +
        `((?:\\[[^\\]]*\\]|"[^"]*"|'[^']*'|[^\\n|]+?))` +
        `(?=(?:\\s+\\*?\\*?(?:domain|subdomain|sub-domain|topic|subcategory|subject|title|personal_utility|personal\\s+utility|utility|takeaway|entities|tools|tech|tags|hashtags)\\*?\\*?\\s*:)|\\n|---|$)`,
        'i'
      );

      const m = raw.match(pattern);
      if (m && m[1]) {
        let clean = m[1].trim();
        clean = clean.replace(/^["']|["']$/g, '').trim();

        if (clean.startsWith('[') && clean.endsWith(']')) {
          try {
            const parsed = JSON.parse(clean);
            if (Array.isArray(parsed)) {
              clean = parsed.join(', ');
            }
          } catch {
            clean = clean.replace(/^\[|\]$/g, '').replace(/["']/g, '').trim();
          }
        }
        clean = clean.replace(/^\[|\]$/g, '').trim();
        clean = clean.replace(/^\*+|\*+$/g, '').trim();
        clean = clean.replace(/^[|:-]+\s*/, '').trim();

        if (clean && clean.toLowerCase() !== 'none' && !clean.includes('---') && clean.length > 0) {
          return clean;
        }
      }
    }
    return null;
  };

  result.domain = extractField(['domain', 'Domain', 'Category', 'Super-Category']);
  result.subdomain = extractField(['subdomain', 'Subdomain', 'Sub-domain', 'Topic', 'Subcategory']);
  result.subject = extractField(['subject', 'Subject', 'Title', 'Topic Title']);
  result.personalUtility = extractField([
    'personal_utility',
    'personalUtility',
    'Personal Utility',
    'utility',
    'takeaway',
    'Core Takeaway',
    'Key Value',
  ]);
  result.entities = extractField(['entities', 'Entities', 'tools', 'Tools', 'Tech', 'Tools & Tech', 'Tools & Frameworks']);
  result.tags = extractField(['tags', 'Tags', 'hashtags', 'Hashtags']);

  return result;
}

/**
 * Safely cleans raw markdown by removing YAML frontmatter, prompt preambles, and leaked metadata lines
 */
export function sanitizeSummary(raw: string | undefined | null): string {
  if (!raw || typeof raw !== 'string') return '';
  try {
    let cleaned = raw.trim();

    // 1. Strip prompt preamble echoes if any
    cleaned = cleaned.replace(/^Analyze the attached Instagram Reel[\s\S]*?---\n?/i, '');
    cleaned = cleaned.replace(/^Extract this Reel[\s\S]*?---\n?/i, '');
    cleaned = cleaned.replace(/^I will be sending you[\s\S]*?---\n?/i, '');

    // 2. Strip standard YAML fenced block: --- ... --- strictly line-anchored
    cleaned = cleaned.replace(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(?:\n|$)/i, '');

    // 2b. Strip any leaked "10 lines hidden" or similar code-folding button text artifacts
    cleaned = cleaned.replace(/\n*\b\d+\s*lines?\s*hidden\b\n*/gi, '\n');

    // 3. Strip any leaked inline or multiline metadata headers at the beginning
    cleaned = cleaned.replace(
      /^(?:(?:\*?\*?(?:creator|author|domain|subdomain|sub-domain|subject|title|personal_utility|personal\s+utility|utility|takeaway|entities|tools|tech|tags|hashtags)\*?\*?\s*:\s*(?:\[[^\]]*\]|"[^"]*"|'[^']*'|[^\n]+)\s*)+)/i,
      ''
    );

    // 4. Strip inline metadata blob if leaked as a single line (e.g. domain: "..." subdomain: "..." ...)
    cleaned = cleaned.replace(
      /^(?:domain\s*:\s*["'][^"']+["']\s+subdomain\s*:\s*["'][^"']+["'][\s\S]*?(?:tags\s*:\s*(?:\[[^\]]*\]|#[^\n]+)))\s*\n?/i,
      ''
    );

    // 5. Clean up any empty/whitespace-only code blocks or backtick artifacts like `   `
    cleaned = cleaned.replace(/`\s+`/g, '');
    cleaned = cleaned.replace(/```\s*```/g, '');

    // 6. Clean up stray/duplicate language names preceding code blocks (e.g. "Python\n\npython\n\n```")
    cleaned = cleaned.replace(
      /(?:^|\n)[ \t]*(?:Python|JavaScript|TypeScript|JSON|Bash|Shell|HTML|CSS|SQL|YAML|Rust|Go|C\+\+|C#)\s*\n+[ \t]*(?:python|javascript|typescript|json|bash|shell|html|css|sql|yaml|rust|go|c\+\+|c#)?\s*\n+[ \t]*(```\w*)/gi,
      '\n\n$1'
    );

    return cleaned.trim();
  } catch (err) {
    console.error('Error sanitizing summary:', err);
    return String(raw || '');
  }
}
