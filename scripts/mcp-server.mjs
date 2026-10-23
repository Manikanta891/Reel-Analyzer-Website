#!/usr/bin/env node

/**
 * Reel Analyzer MCP (Model Context Protocol) Server
 * 
 * Provides coding agents (Cursor, Claude Code, Antigravity, Windsurf)
 * direct stdio access to your Instagram Reel Knowledge Vault.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support VAULT_PATH env var (set by user in IDE config) so the server can
// read the vault.json from wherever the user saved it on their machine.
// Falls back to vault.json next to this script file for local dev.
const DATA_FILE =
  process.env.VAULT_PATH ||
  path.join(__dirname, 'vault.json');

/**
 * Helper to read reels from data/vault.json
 */
function readVaultReels() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('[Reel Vault MCP] Error reading vault.json:', err.message);
  }
  return [];
}

/**
 * Helper to save reels back to data/vault.json
 */
function writeVaultReels(reels) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(reels, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Reel Vault MCP] Error saving to vault.json:', err.message);
    return false;
  }
}

/**
 * Extract code blocks from a markdown text
 */
function extractCodeBlocks(markdownText) {
  const blocks = [];
  const regex = /```([a-zA-Z0-9_\-\.\+]*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(markdownText)) !== null) {
    blocks.push({
      language: match[1]?.trim() || 'text',
      code: match[2]?.trim(),
    });
  }
  return blocks;
}

// Initialize MCP Server
const server = new McpServer({
  name: 'reel-analyzer-vault',
  version: '1.2.0',
});

// ==========================================
// TOOL 1: search_insights
// ==========================================
server.tool(
  'search_insights',
  'Search your saved reel vault for coding tricks, architectural patterns, tool directives, and code snippets.',
  {
    query: z.string().describe('Keywords or topic to search (e.g., "Docker", "Next.js", "indexes", "cursor")'),
    domain: z.string().optional().describe('Optional macro domain filter (e.g. "Technology", "AI & Engineering")'),
    limit: z.number().optional().default(5).describe('Maximum number of results to return (default: 5)'),
  },
  async ({ query, domain, limit = 5 }) => {
    const reels = readVaultReels();
    const q = query.toLowerCase();

    const matches = reels
      .filter((item) => {
        if (domain && item.domain?.toLowerCase() !== domain.toLowerCase()) return false;
        const text = [
          item.subject,
          item.personalUtility,
          item.entities,
          item.tags,
          item.summary,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return text.includes(q);
      })
      .slice(0, limit);

    if (matches.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No saved reel insights found matching query: "${query}"${domain ? ` in domain "${domain}"` : ''}.`,
          },
        ],
      };
    }

    const formatted = matches
      .map((item, idx) => {
        return `### ${idx + 1}. ${item.subject}
- **Category:** ${item.domain || 'General'} > ${item.subdomain || 'General'}
- **💡 Key Takeaway:** ${item.personalUtility || 'N/A'}
- **🛠️ Tools & Entities:** ${item.entities || 'N/A'}
- **🏷️ Tags:** ${item.tags || 'N/A'}
- **🔗 Source Reel:** ${item.url}
\n**Summary & Directives:**\n${item.summary}\n---`;
      })
      .join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${matches.length} matching insights for "${query}":\n\n${formatted}`,
        },
      ],
    };
  }
);

// ==========================================
// TOOL 2: get_insight
// ==========================================
server.tool(
  'get_insight',
  'Get the complete, untruncated note, directives, and code blocks for a specific reel by URL, ID, or title.',
  {
    id_or_url: z.string().describe('Reel URL, ID, or approximate title'),
  },
  async ({ id_or_url }) => {
    const reels = readVaultReels();
    const target = id_or_url.toLowerCase().trim();

    const match = reels.find((item) => {
      if (item.url?.toLowerCase() === target) return true;
      if (item.id?.toLowerCase() === target) return true;
      if (item.subject?.toLowerCase().includes(target)) return true;
      return false;
    });

    if (!match) {
      return {
        content: [
          {
            type: 'text',
            text: `No reel found matching identifier: "${id_or_url}". Use list_taxonomy or search_insights to discover saved reels.`,
          },
        ],
      };
    }

    const note = `# 📚 ${match.subject}

> **Category:** ${match.domain || 'General'} > ${match.subdomain || 'General'}  
> 💡 **Key Takeaway:** ${match.personalUtility || 'N/A'}  
> 🛠️ **Tools & Tech:** \`${match.entities || 'N/A'}\`  
> 🏷️ **Tags:** ${match.tags || 'N/A'}  
> 🔗 **Original Reel:** [Watch on Instagram](${match.url})

---

### 📖 Full Summary & Directives
${match.summary}
`;

    return {
      content: [
        {
          type: 'text',
          text: note,
        },
      ],
    };
  }
);

// ==========================================
// TOOL 3: get_code_snippets
// ==========================================
server.tool(
  'get_code_snippets',
  'Extract only the raw code blocks (Dockerfiles, YAML, bash, TypeScript, Python) from matching reels.',
  {
    query: z.string().describe('Search term (e.g. "docker-compose", "nginx", "postgres index", "tailwind")'),
    language: z.string().optional().describe('Optional filter by language (e.g. "yaml", "sql", "bash", "css")'),
  },
  async ({ query, language }) => {
    const reels = readVaultReels();
    const q = query.toLowerCase();
    const langFilter = language?.toLowerCase();

    const results = [];

    reels.forEach((item) => {
      const matchText = [item.subject, item.entities, item.summary].filter(Boolean).join(' ').toLowerCase();
      if (!matchText.includes(q)) return;

      const codeBlocks = extractCodeBlocks(item.summary || '');
      codeBlocks.forEach((block) => {
        if (!langFilter || block.language.toLowerCase() === langFilter) {
          results.push({
            subject: item.subject,
            utility: item.personalUtility,
            language: block.language,
            code: block.code,
            url: item.url,
          });
        }
      });
    });

    if (results.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No code blocks found matching query "${query}"${language ? ` with language "${language}"` : ''}.`,
          },
        ],
      };
    }

    const formatted = results
      .map(
        (r, idx) => `### Snippet ${idx + 1}: ${r.subject} (${r.language})
*💡 ${r.utility || ''}*
\`\`\`${r.language}
${r.code}
\`\`\``
      )
      .join('\n\n---\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${results.length} code snippets for "${query}":\n\n${formatted}`,
        },
      ],
    };
  }
);

// ==========================================
// TOOL 4: generate_cheat_sheet
// ==========================================
server.tool(
  'generate_cheat_sheet',
  'Synthesize all saved insights and code on a topic into a dense, 1-page quick-reference cheat sheet.',
  {
    topic: z.string().describe('Topic or tool name (e.g. "Docker", "Tailwind", "Postgres", "Cursor")'),
  },
  async ({ topic }) => {
    const reels = readVaultReels();
    const t = topic.toLowerCase();

    const matches = reels.filter((r) => {
      const combined = [r.subject, r.entities, r.subdomain, r.domain, r.tags, r.summary]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return combined.includes(t);
    });

    if (matches.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No saved insights found to generate a cheat sheet for "${topic}".`,
          },
        ],
      };
    }

    let cheatSheet = `# 📑 ${topic.toUpperCase()} &mdash; Rapid Developer Cheat Sheet\n\n`;
    cheatSheet += `> Generated from **${matches.length}** curated Reel Analyzer notes.\n\n`;

    cheatSheet += `## 💡 Core Principles & Key Takeaways\n`;
    matches.forEach((m, i) => {
      cheatSheet += `${i + 1}. **${m.subject}:** ${m.personalUtility || 'No summary takeaway'}\n`;
    });

    cheatSheet += `\n## 🛠️ Code Snippets & Directives\n\n`;
    matches.forEach((m, i) => {
      const blocks = extractCodeBlocks(m.summary || '');
      if (blocks.length > 0) {
        cheatSheet += `### ${i + 1}. ${m.subject}\n`;
        blocks.forEach((b) => {
          cheatSheet += `\`\`\`${b.language}\n${b.code}\n\`\`\`\n\n`;
        });
      }
    });

    return {
      content: [
        {
          type: 'text',
          text: cheatSheet,
        },
      ],
    };
  }
);

// ==========================================
// TOOL 5: get_latest_insights
// ==========================================
server.tool(
  'get_latest_insights',
  'Retrieve the most recently saved or bookmarked reels in your vault.',
  {
    limit: z.number().optional().default(5).describe('Number of latest reels to return (default: 5)'),
  },
  async ({ limit = 5 }) => {
    const reels = readVaultReels();
    const sorted = [...reels].sort((a, b) => {
      const timeA = typeof a.timestamp === 'number' ? a.timestamp : 0;
      const timeB = typeof b.timestamp === 'number' ? b.timestamp : 0;
      return timeB - timeA;
    });

    const slice = sorted.slice(0, limit);

    const formatted = slice
      .map((r, i) => {
        return `${i + 1}. **${r.subject}** (${r.domain || 'General'} > ${r.subdomain || 'General'})
   - 💡 *Takeaway:* ${r.personalUtility || 'N/A'}
   - 🛠️ *Tools:* \`${r.entities || 'N/A'}\`
   - 🔗 *Reel:* ${r.url}`;
      })
      .join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Latest ${slice.length} Saved Insights:\n\n${formatted}`,
        },
      ],
    };
  }
);

// ==========================================
// TOOL 6: add_insight (2-Way Capture from IDE)
// ==========================================
server.tool(
  'add_insight',
  'Save a new development tip, prompt, or architectural note directly into your Reel Analyzer knowledge vault.',
  {
    domain: z.string().describe('Macro domain (e.g. "Technology", "AI & Engineering")'),
    subdomain: z.string().describe('Micro topic (e.g. "Frontend", "Docker", "Database")'),
    subject: z.string().describe('Title or headline of the insight'),
    personalUtility: z.string().describe('Direct practical takeaway or rule of thumb'),
    summary: z.string().describe('Markdown summary including code blocks and explanations'),
    entities: z.string().optional().describe('Comma-separated tools or libraries (e.g. "Docker, Nginx")'),
    tags: z.string().optional().describe('Comma-separated hashtags (e.g. "#docker, #devops")'),
    sourceUrl: z.string().optional().describe('Source link or reference URL'),
  },
  async ({ domain, subdomain, subject, personalUtility, summary, entities = '', tags = '', sourceUrl = '' }) => {
    const reels = readVaultReels();
    const now = Date.now();

    const newItem = {
      url: sourceUrl || `local_ide_note_${now}`,
      domain,
      subdomain,
      subject,
      personalUtility,
      entities,
      tags,
      summary,
      timestamp: now,
    };

    reels.unshift(newItem);
    const ok = writeVaultReels(reels);

    if (ok) {
      return {
        content: [
          {
            type: 'text',
            text: `Successfully saved "${subject}" under ${domain} > ${subdomain} in your local knowledge vault! (Total insights: ${reels.length})`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to save insight to ${DATA_FILE}. Check file write permissions.`,
          },
        ],
      };
    }
  }
);

// ==========================================
// TOOL 7: list_taxonomy
// ==========================================
server.tool(
  'list_taxonomy',
  'List all knowledge domains, subdomains, and item counts saved in your vault.',
  {},
  async () => {
    const reels = readVaultReels();
    const tree = {};

    reels.forEach((r) => {
      const d = r.domain || 'General';
      const s = r.subdomain || 'General';
      if (!tree[d]) tree[d] = {};
      if (!tree[d][s]) tree[d][s] = 0;
      tree[d][s]++;
    });

    let output = `# 🗂️ Knowledge Vault Taxonomy (${reels.length} total insights)\n\n`;
    for (const [domain, subdomains] of Object.entries(tree)) {
      const totalInDomain = Object.values(subdomains).reduce((a, b) => a + b, 0);
      output += `### 🌐 ${domain} (${totalInDomain} reels)\n`;
      for (const [sub, count] of Object.entries(subdomains)) {
        output += `  - **${sub}**: ${count} reels\n`;
      }
      output += '\n';
    }

    return {
      content: [
        {
          type: 'text',
          text: output,
        },
      ],
    };
  }
);

// ==========================================
// TOOL 8: get_tools_directory
// ==========================================
server.tool(
  'get_tools_directory',
  'Browse the ecosystem directory of developer tools, frameworks, and libraries saved in your notes.',
  {
    tool_name: z.string().optional().describe('Specific tool to search for (e.g. "Docker", "Tailwind", "Cursor")'),
  },
  async ({ tool_name }) => {
    const reels = readVaultReels();

    if (tool_name) {
      const t = tool_name.toLowerCase();
      const matching = reels.filter((r) => r.entities?.toLowerCase().includes(t));
      if (matching.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No reels found referencing tool: "${tool_name}".`,
            },
          ],
        };
      }
      const list = matching.map((r, i) => `${i + 1}. **${r.subject}** (${r.url})\n   - 💡 ${r.personalUtility || ''}`).join('\n\n');
      return {
        content: [
          {
            type: 'text',
            text: `Found ${matching.length} reels referencing "${tool_name}":\n\n${list}`,
          },
        ],
      };
    }

    // Aggregate all tools
    const toolCounts = {};
    reels.forEach((r) => {
      if (!r.entities) return;
      r.entities.split(',').forEach((tool) => {
        const clean = tool.trim();
        if (clean) {
          toolCounts[clean] = (toolCounts[clean] || 0) + 1;
        }
      });
    });

    const sorted = Object.entries(toolCounts).sort((a, b) => b[1] - a[1]);
    const formatted = sorted.slice(0, 30).map(([name, count]) => `- **${name}**: ${count} reels`).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Top Developer Tools & Frameworks in your Vault:\n\n${formatted}`,
        },
      ],
    };
  }
);

// ==========================================
// TOOL 9: export_playbook
// ==========================================
server.tool(
  'export_playbook',
  'Generate an Obsidian-formatted Markdown playbook with Table of Contents and anchors for any domain or all notes.',
  {
    domain: z.string().optional().describe('Filter by domain, or leave blank for all'),
    subdomain: z.string().optional().describe('Filter by subdomain'),
  },
  async ({ domain, subdomain }) => {
    const reels = readVaultReels();
    const filtered = reels.filter((r) => {
      const dMatch = !domain || r.domain?.toLowerCase() === domain.toLowerCase();
      const sMatch = !subdomain || r.subdomain?.toLowerCase() === subdomain.toLowerCase();
      return dMatch && sMatch;
    });

    if (filtered.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No reels found for playbook with domain="${domain || 'All'}" and subdomain="${subdomain || 'All'}".`,
          },
        ],
      };
    }

    const title = domain ? `${domain} Playbook` : 'Reel Analyzer Master Playbook';
    let md = `---
vault: "Reel Analyzer"
domain: "${domain || 'All'}"
subdomain: "${subdomain || 'All'}"
total_insights: ${filtered.length}
exported_at: "${new Date().toISOString().slice(0, 10)}"
---

# 📚 ${title}
Total Insights: ${filtered.length} Reels

## 📑 Table of Contents\n`;

    filtered.forEach((item, index) => {
      const num = index + 1;
      md += `${num}. [${item.subject}](#insight-${num})\n`;
    });

    md += '\n---\n\n';

    filtered.forEach((item, index) => {
      const num = index + 1;
      md += `### ${num}. ${item.subject} <a id="insight-${num}"></a>\n\n`;
      if (item.personalUtility) md += `> 💡 **Takeaway:** ${item.personalUtility}\n`;
      if (item.entities) md += `> 🛠️ **Tools:** \`${item.entities}\`\n`;
      md += `> 🔗 [Original Reel](${item.url})\n\n`;
      md += `${item.summary}\n\n---\n\n`;
    });

    return {
      content: [
        {
          type: 'text',
          text: md,
        },
      ],
    };
  }
);

// ==========================================
// MCP PROMPT: review_with_vault
// ==========================================
server.prompt(
  'review_with_vault',
  'Review a piece of code or configuration against your saved best practices in the Reel Analyzer vault.',
  {
    code: z.string().describe('The code or configuration to review'),
    topic: z.string().optional().describe('Framework or tool topic (e.g. "Docker", "Tailwind", "Next.js")'),
  },
  async ({ code, topic = '' }) => {
    const reels = readVaultReels();
    const relevant = reels
      .filter((r) => {
        if (!topic) return true;
        const comb = [r.subject, r.entities, r.summary].join(' ').toLowerCase();
        return comb.includes(topic.toLowerCase());
      })
      .slice(0, 3);

    const context = relevant
      .map((r, i) => `Insight ${i + 1}: ${r.subject}\nRule: ${r.personalUtility}\nDirectives:\n${r.summary}`)
      .join('\n\n---\n\n');

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please review the following code against these best practices saved in my Reel Analyzer knowledge vault:\n\n=== VAULT CONTEXT ===\n${context || 'No specific rules found. Apply general clean architecture.'}\n\n=== CODE TO REVIEW ===\n${code}\n\nHighlight any potential bugs, optimization opportunities, or deviations from the saved directives.`,
          },
        },
      ],
    };
  }
);

// Start Server via Stdio Transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[Reel Vault MCP] Server running on stdio transport.');
}

main().catch((err) => {
  console.error('[Reel Vault MCP] Fatal error:', err);
  process.exit(1);
});
