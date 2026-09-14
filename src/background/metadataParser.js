/**
 * Metadata Parsing, YAML extraction, and Clean String Utilities
 */

/**
 * Strips formatting, handles, and prefixes from creator strings
 */
export function normalizeCreatorHandle(raw) {
  if (!raw || typeof raw !== "string") return "";
  let clean = raw.trim();

  clean = clean.replace(/^(?:instagram\.com\/|https?:\/\/(?:www\.)?instagram\.com\/)/i, "");
  clean = clean.replace(/^[@/]+/, "").replace(/[/]+$/, "");
  clean = clean.replace(/^(?:creator|author|by)\s*:\s*/i, "");
  clean = clean.replace(/^["']|["']$/g, "").trim();

  if (["unknown", "none", "null", "undefined", "n/a"].includes(clean.toLowerCase())) {
    return "";
  }

  // Pick first handle if comma-separated
  if (clean.includes(",")) {
    clean = clean.split(",")[0].trim();
  }

  return clean.replace(/\s+/g, "_");
}

/**
 * Extracts structured metadata fields from AI response
 */
export function parseMetadataFromResponse(responseText) {
  const meta = {
    domain: null,
    subdomain: null,
    subject: null,
    personalUtility: null,
    entities: null,
    tags: null
  };

  if (!responseText) return meta;

  const extractField = (aliases) => {
    for (const alias of aliases) {
      const pattern = new RegExp(
        `(?:^|[\\n#*\\s|,-])\\*?\\*?${alias}\\*?\\*?\\s*:\\s*\\*?\\*?` +
        `([^\\n|]+?)` +
        `(?=(?:\\s+\\*?\\*?(?:domain|subdomain|sub-domain|topic|subcategory|subject|title|personal_utility|personal\\s+utility|utility|entities|tools|tech|tags|hashtags)\\*?\\*?\\s*:)|\\n|---|$)`,
        "i"
      );

      const m = responseText.match(pattern);
      if (m && m[1]) {
        let clean = m[1].trim();
        clean = clean.replace(/^["']|["']$/g, "").trim();
        if (clean.startsWith("[") && clean.endsWith("]")) {
          try {
            const parsed = JSON.parse(clean);
            if (Array.isArray(parsed)) {
              clean = parsed.join(", ");
            }
          } catch (e) {
            clean = clean.replace(/^\[|\]$/g, "").replace(/["']/g, "").trim();
          }
        }
        clean = clean.replace(/^\[|\]$/g, "").trim();
        clean = clean.replace(/^\*+|\*+$/g, "").trim();
        clean = clean.replace(/^[|:-]+\s*/, "").trim();
        if (clean && clean.toLowerCase() !== "none" && !clean.includes("---") && clean.length > 0) {
          return clean;
        }
      }
    }
    return null;
  };

  meta.domain = extractField(["domain", "Domain", "Super-Category", "Category"]);
  meta.subdomain = extractField(["subdomain", "Subdomain", "Sub-domain", "Topic", "Subcategory", "Specialization"]);
  meta.subject = extractField(["subject", "Subject", "Title", "Topic Title"]);
  meta.personalUtility = extractField(["personal_utility", "personalUtility", "Personal Utility", "Utility", "Why it matters", "Key Value"]);
  meta.entities = extractField(["entities", "Entities", "Tools & Resources", "Tools & Tech", "Tools", "Tech"]);
  meta.tags = extractField(["tags", "Tags", "Hashtags"]);

  return meta;
}

/**
 * Removes fenced (--- ... ---) and leading metadata headers from the summary body
 */
export function stripMetadataBlock(text) {
  if (!text) return "";
  let clean = text.trim();

  const promptPreamblePatterns = [
    /I will be sending you Instagram Reels[\s\S]*?Never invent information[^\n]*\n?/i,
    /Extract this Reel into a (?:permanent )?knowledge note[\s\S]*?YOUR CURRENT KNOWLEDGE TAXONOMY[^\n]*\n?/i,
    /Analyze the attached Instagram Reel[\s\S]*?Never invent information[^\n]*\n?/i,
    /YOUR CURRENT KNOWLEDGE TAXONOMY[\s\S]*?Never invent information[^\n]*\n?/i,
    /CLASSIFICATION RULES[\s\S]*?Never invent information[^\n]*\n?/i,
    /At the very top, ALWAYS output this exact YAML[\s\S]*?---\n?/i,
    /Analyze and extract 100% of the permanent, high-yield value[^\n]*\n?/i
  ];

  for (const pat of promptPreamblePatterns) {
    clean = clean.replace(pat, "").trim();
  }

  clean = clean.replace(/^Today\s*\n+/i, "").trim();
  clean = clean.replace(/^---[\s\S]*?---\n?/, "");
  clean = clean.replace(/^(?:(?:\*?\*?(?:creator|author|domain|subdomain|sub-domain|topic|subcategory|subject|title|personal_utility|personal\s+utility|utility|entities|tools|tech|tags|hashtags)\*?\*?:[^\n]*\n?)+\s*)+/i, "");
  clean = clean.replace(/^(?:\*?\*?(?:creator|domain)\*?\*?:[^\n]+?(?:tags|hashtags)\*?\*?:[^\n]+(?:\n|$))\s*/i, "");

  return clean.trim();
}

/**
 * Fallback categorizer when AI completely omits metadata
 */
export function fallbackCategorizer(caption, summaryText) {
  const combined = `${caption || ""} ${summaryText || ""}`.toLowerCase();
  
  if (/code|coding|devops|docker|kubernetes|python|javascript|react|api|backend|frontend|ai|llm|software|github/.test(combined)) {
    return { domain: "Technology", subdomain: "Software & Tools" };
  }
  if (/fitness|workout|gym|diet|nutrition|health|exercise|muscle|training|yoga/.test(combined)) {
    return { domain: "Fitness & Health", subdomain: "Workouts & Nutrition" };
  }
  if (/money|invest|stock|crypto|finance|business|revenue|profit|startup|sales/.test(combined)) {
    return { domain: "Finance & Business", subdomain: "Business & Growth" };
  }
  if (/career|job|interview|resume|study|learn|degree|college|salary/.test(combined)) {
    return { domain: "Career & Education", subdomain: "Career & Learning" };
  }
  if (/design|ui|ux|figma|css|animation|video|photo|creative|art|logo/.test(combined)) {
    return { domain: "Design & Creative", subdomain: "Visual & UI Design" };
  }

  return { domain: "General Insights", subdomain: "Insights" };
}
