/**
 * Knowledge-Engine Prompt Builder (Master Prompt vs Lean Continuation)
 */

import { getLivingTaxonomy } from "./taxonomy.js";

/**
 * Builds high-impact prompt with Living Taxonomy Knowledge Tree injection.
 * Turn 0 / every 10th turn: Master Prompt (Sets full rules, YAML schema, quality expectations).
 * Turns 1..9, 11..19...: Lean Prompt (URL + Live Taxonomy ONLY, references established rules).
 */
export async function buildPromptForReel(reelData, provider = "meta", customPrompt = "", turnIndex = 0) {
  const taxonomy = await getLivingTaxonomy();
  const domainKeys = Object.keys(taxonomy).filter((d) => taxonomy[d] && taxonomy[d].length > 0);

  let taxonomyStr = "(None established yet — create concise Domain and Subdomain based on taxonomy rules)";
  if (domainKeys.length > 0) {
    const treeLines = [];
    for (const dom of domainKeys) {
      const subs = taxonomy[dom];
      treeLines.push(`- ${dom}: [${subs.map((s) => `"${s}"`).join(", ")}]`);
    }
    taxonomyStr = treeLines.join("\n");
  }

  const isMasterTurn = (turnIndex % 10 === 0);

  let basePrompt = "";

  if (isMasterTurn) {
    // Prompt 1: Full Master Prompt (Turn 0, 10, 20, 30...)
    basePrompt = `Analyze the attached Instagram Reel and convert it into a reusable knowledge note.

Reel URL: ${reelData.url}

CURRENT KNOWLEDGE TAXONOMY:
${taxonomyStr}

Follow these rules for this Reel and all subsequent Reels in this conversation.

TAXONOMY:
1. Reuse an existing Domain and Subdomain whenever applicable.
2. If an existing Domain fits but the Reel introduces a new specialization, create a concise 2–3 word Subdomain.
3. Create a new Domain only when the topic belongs to a genuinely distinct field.
4. Existing Domain and Subdomain names must be reused EXACTLY.
5. Do not create unnecessary categories.

At the very top, ALWAYS output this exact YAML:

---
domain: "[Domain]"
subdomain: "[Subdomain]"
subject: "[3–7 word title]"
personal_utility: "[Why this could be useful to me]"
entities: ["[tools/resources/etc]"]
tags: ["#tag1", "#tag2", "#tag3"]
---

KNOWLEDGE EXTRACTION:
Do NOT simply summarize the Reel. Extract its permanent, reusable knowledge.

Choose the best structure dynamically based on the Reel. Do not use a fixed template.

Preserve all high-value information, including:
- frameworks and concepts
- complete lists
- steps and processes
- exact names and numbers
- examples
- code and commands
- tools and resources
- prompts and settings
- techniques and important caveats

Remove hooks, filler, repetition, and hype.

Clearly distinguish facts, demonstrations, opinions, and recommendations.

Never invent information that is not present in the Reel.

The final note should be concise, information-dense, searchable, and useful months later without needing to watch the Reel again.`;
  } else {
    // Prompt 2: Lean Continuation Prompt (Turns 1-9, 11-19, 21-29...)
    basePrompt = `Follow ALL rules, formatting requirements, taxonomy rules, and knowledge-extraction instructions established in the first prompt.

Reel URL: ${reelData.url}

CURRENT KNOWLEDGE TAXONOMY:
${taxonomyStr}

Process the attached Reel using those rules. Reuse existing Domain/Subdomain names EXACTLY whenever applicable.

Output the required YAML metadata followed by the dynamically structured knowledge note.`;
  }

  // If user provided custom instructions, cleanly append at the very end
  if (customPrompt && typeof customPrompt === "string" && customPrompt.trim().length > 0) {
    basePrompt += `\n\nADDITIONAL INSTRUCTIONS:\n${customPrompt.trim()}`;
  }

  return basePrompt;
}
