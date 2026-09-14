/**
 * Living Knowledge Taxonomy Tree & Classification Normalizer
 */

import { TAXONOMY_STOP_WORDS } from "../shared/constants.js";

export const DEFAULT_TAXONOMY = {
  "Technology": [
    "AI & Machine Learning",
    "Web Development",
    "DevOps & Cloud",
    "Mobile Development",
    "Data Science",
    "Cybersecurity",
    "Software Tools & Productivity"
  ],
  "Finance & Business": [
    "Investing & Stocks",
    "Personal Finance",
    "Real Estate",
    "Entrepreneurship & Startups",
    "Marketing & Growth",
    "Sales & Negotiation"
  ],
  "Fitness & Health": [
    "Strength & Hypertrophy",
    "Nutrition & Diet",
    "Mobility & Recovery",
    "Cardio & Endurance",
    "Mental Health & Sleep"
  ],
  "Design & Creative": [
    "UI/UX Design",
    "Motion & Animation",
    "Video Editing",
    "Photography",
    "Graphic & Brand Design"
  ],
  "Career & Self-Improvement": [
    "Productivity Systems",
    "Career & Interview Prep",
    "Public Speaking & Communication",
    "Learning & Memory Hacks",
    "Habit Building"
  ],
  "Culinary & Lifestyle": [
    "Quick Recipes",
    "Cooking Techniques",
    "Travel & Exploration",
    "Home & Organization"
  ]
};

export async function getLivingTaxonomy() {
  return new Promise((resolve) => {
    chrome.storage.local.get({ reelsData: [], knowledgeTaxonomy: {} }, (result) => {
      const reels = result.reelsData || [];
      const storedTax = result.knowledgeTaxonomy && typeof result.knowledgeTaxonomy === "object"
        ? result.knowledgeTaxonomy
        : {};

      // Combine taxonomy from both existing knowledgeTaxonomy object and all saved reelsData
      const combinedTax = { ...storedTax };
      for (const r of reels) {
        if (r.domain && typeof r.domain === "string") {
          const d = r.domain.trim();
          const s = (r.subdomain || "General Insights").trim();
          if (d && !d.toLowerCase().includes("unknown")) {
            if (!combinedTax[d]) combinedTax[d] = [];
            if (!combinedTax[d].includes(s)) combinedTax[d].push(s);
          }
        }
      }

      // Sanitize any stray or placeholder keys from storage
      const cleanedTax = {};
      for (const [k, v] of Object.entries(combinedTax)) {
        const kLow = k.toLowerCase().trim();
        if (
          !kLow.includes("taxonomy") &&
          !kLow.includes("existing") &&
          !kLow.includes("domain") &&
          !kLow.includes("---") &&
          !kLow.includes("...") &&
          !kLow.includes("[") &&
          k.length > 2 &&
          Array.isArray(v) &&
          v.length > 0
        ) {
          const cleanSubs = v.filter((s) => {
            const sLow = (s || "").toLowerCase().trim();
            return (
              sLow.length > 2 &&
              !sLow.includes("existing") &&
              !sLow.includes("subdomain") &&
              !sLow.includes("taxonomy") &&
              !sLow.includes("...") &&
              !sLow.includes("---")
            );
          });
          if (cleanSubs.length > 0) {
            cleanedTax[k] = cleanSubs;
          }
        }
      }
      resolve(cleanedTax);
    });
  });
}

/**
 * Snaps raw AI-generated Domain/Subdomain to existing living taxonomy or dynamically registers new nodes
 */
export function snapToTaxonomy(domain, subdomain, taxonomy) {
  const isInvalidPlaceholder = (val) => {
    if (!val || typeof val !== "string") return true;
    const low = val.toLowerCase().trim();
    return (
      low.includes("taxonomy") ||
      low.includes("existing or new") ||
      low.includes("your current") ||
      low.includes("choose from") ||
      low.includes("select from") ||
      low.includes("2-3 word") ||
      low.startsWith("from ") ||
      low === "domain" ||
      low === "subdomain" ||
      low === "..." ||
      low.includes("---") ||
      low.length < 2
    );
  };

  if (isInvalidPlaceholder(domain)) domain = "General Insights";
  if (isInvalidPlaceholder(subdomain)) subdomain = "Insights";

  domain = domain.trim();
  subdomain = subdomain.trim();

  // Strip wrapping brackets/quotes
  domain = domain.replace(/^\[|\]$/g, "").replace(/^["']|["']$/g, "").trim();
  subdomain = subdomain.replace(/^\[|\]$/g, "").replace(/^["']|["']$/g, "").trim();

  if (isInvalidPlaceholder(domain)) domain = "General Insights";
  if (isInvalidPlaceholder(subdomain)) subdomain = "Insights";

  const domainKeys = Object.keys(taxonomy);

  // 1. Exact match for domain (case-insensitive)
  let matchedDomain = domainKeys.find(
    (d) => d.toLowerCase() === domain.toLowerCase()
  );

  // 2. Fuzzy match for domain (prefix / substring / token match)
  if (!matchedDomain) {
    const domainTokens = domain
      .toLowerCase()
      .split(/[\s&,/]+/)
      .filter((w) => w.length > 2 && !TAXONOMY_STOP_WORDS.has(w));

    for (const d of domainKeys) {
      const dLower = d.toLowerCase();
      if (domainTokens.some((t) => dLower.includes(t))) {
        matchedDomain = d;
        break;
      }
    }
  }

  // 3. Fallback to closest standard domain
  if (!matchedDomain) {
    const dLow = domain.toLowerCase();
    if (/tech|code|ai|dev|data|software|app|tool|web|python|cloud/.test(dLow)) matchedDomain = "Technology";
    else if (/finance|money|crypto|invest|business|startup|market|sales/.test(dLow)) matchedDomain = "Finance & Business";
    else if (/fit|health|diet|workout|gym|nutrition|muscle|sleep/.test(dLow)) matchedDomain = "Fitness & Health";
    else if (/design|art|creative|photo|video|edit|ui|ux|brand/.test(dLow)) matchedDomain = "Design & Creative";
    else if (/career|prod|habit|learn|study|work|speak|mind/.test(dLow)) matchedDomain = "Career & Self-Improvement";
    else if (/food|cook|recipe|travel|home|life/.test(dLow)) matchedDomain = "Culinary & Lifestyle";
    else {
      matchedDomain = domain.length > 20 ? domain.slice(0, 20) : domain;
      if (!taxonomy[matchedDomain]) {
        taxonomy[matchedDomain] = [];
      }
    }
  }

  // Subdomain Matching within matchedDomain
  const existingSubs = taxonomy[matchedDomain] || [];
  let matchedSub = existingSubs.find(
    (s) => s.toLowerCase() === subdomain.toLowerCase()
  );

  if (!matchedSub) {
    const subTokens = subdomain
      .toLowerCase()
      .split(/[\s&,/]+/)
      .filter((w) => w.length > 2 && !TAXONOMY_STOP_WORDS.has(w));

    for (const s of existingSubs) {
      const sLower = s.toLowerCase();
      if (subTokens.some((t) => sLower.includes(t))) {
        matchedSub = s;
        break;
      }
    }
  }

  // If new subdomain, add it to taxonomy
  if (!matchedSub) {
    matchedSub = subdomain.length > 30 ? subdomain.slice(0, 30) : subdomain;
    if (!existingSubs.map((s) => s.toLowerCase()).includes(matchedSub.toLowerCase())) {
      taxonomy[matchedDomain] = [...existingSubs, matchedSub];
    }
  }

  return { domain: matchedDomain, subdomain: matchedSub };
}
