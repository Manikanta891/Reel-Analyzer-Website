/**
 * summaryParser.ts - Robust markdown sanitizer and structured section parser
 * Handles edge cases, missing fields, and unformatted raw outputs safely.
 */

export interface ParsedSummary {
  isStructured: boolean;
  cleanedFull: string;
  premise: string | null;
  breakdown: string | null;
  entitiesSection: string | null;
  goldenNugget: string | null;
}

/**
 * Safely cleans raw markdown by removing leaked single-line metadata headers
 */
export function sanitizeSummary(raw: string | undefined | null): string {
  if (!raw || typeof raw !== 'string') return '';
  try {
    let cleaned = raw.trim();
    // Strip leading raw metadata block if present
    cleaned = cleaned.replace(
      /^(?:Domain:\s*[\s\S]*?(?:Tags:|Entities:)[^\n]*\n*)/i,
      ''
    );
    return cleaned.trim();
  } catch (err) {
    console.error('Error sanitizing summary:', err);
    return String(raw || '');
  }
}

/**
 * Safely parses summary markdown into structured sections
 */
export function parseStructuredSections(text: string | undefined | null): ParsedSummary {
  const defaultResult: ParsedSummary = {
    isStructured: false,
    cleanedFull: '',
    premise: null,
    breakdown: null,
    entitiesSection: null,
    goldenNugget: null,
  };

  if (!text || typeof text !== 'string') return defaultResult;

  try {
    const cleaned = sanitizeSummary(text);
    if (!cleaned) return defaultResult;

    // Identify standard 4-point sections
    const premiseMatch = cleaned.match(
      /(?:1\.\s*🎯?\s*Core Premise[^\n]*\n)([\s\S]*?)(?=(?:2\.\s*📜?\s*Complete Breakdown|3\.\s*🔍?\s*Named Entities|4\.\s*💎?\s*Golden Nugget|$))/i
    );
    const breakdownMatch = cleaned.match(
      /(?:2\.\s*📜?\s*Complete Breakdown[^\n]*\n)([\s\S]*?)(?=(?:3\.\s*🔍?\s*Named Entities|4\.\s*💎?\s*Golden Nugget|$))/i
    );
    const entitiesMatch = cleaned.match(
      /(?:3\.\s*🔍?\s*Named Entities[^\n]*\n)([\s\S]*?)(?=(?:4\.\s*💎?\s*Golden Nugget|$))/i
    );
    const goldenMatch = cleaned.match(
      /(?:4\.\s*💎?\s*Golden Nugget[^\n]*\n)([\s\S]*?)$/i
    );

    const isStructured = Boolean(premiseMatch || breakdownMatch || goldenMatch);

    return {
      isStructured,
      cleanedFull: cleaned,
      premise: premiseMatch ? premiseMatch[1].trim() : null,
      breakdown: breakdownMatch ? breakdownMatch[1].trim() : null,
      entitiesSection: entitiesMatch ? entitiesMatch[1].trim() : null,
      goldenNugget: goldenMatch ? goldenMatch[1].trim() : null,
    };
  } catch (err) {
    console.error('Error parsing structured sections:', err);
    return {
      isStructured: false,
      cleanedFull: String(text || ''),
      premise: null,
      breakdown: null,
      entitiesSection: null,
      goldenNugget: null,
    };
  }
}
