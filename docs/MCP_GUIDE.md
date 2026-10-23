# 🔌 Reel Analyzer MCP Server Guide

> **Protocol:** Model Context Protocol (MCP)  
> **Transport:** `stdio` (JSON-RPC)  
> **Server Script:** `website/scripts/mcp-server.mjs`  
> **Local Knowledge Store:** `website/data/vault.json`

---

## 🚀 1. Overview

The **Reel Analyzer MCP Server** allows AI coding agents (Cursor, Claude Code, Antigravity, Windsurf) to directly search, query, and review code against your Instagram Reel knowledge vault during active development.

---

## 🛠️ 2. Available MCP Tools & Prompts

### Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `search_insights` | `query: string`, `domain?: string`, `limit?: number` | Search notes, directives, and code snippets across your entire reel library. |
| `get_insight` | `id_or_url: string` | Fetch the complete, untruncated markdown note, directives, and original reel URL. |
| `get_code_snippets` | `query: string`, `language?: string` | Extract only the raw code blocks (Dockerfiles, YAML, TypeScript, SQL, bash). |
| `generate_cheat_sheet` | `topic: string` | Synthesize all notes and code blocks on a topic into a dense 1-page cheat sheet. |
| `get_latest_insights` | `limit?: number` | Return the latest bookmarked or summarized reels sorted by timestamp. |
| `add_insight` | `domain, subdomain, subject, personalUtility, summary, entities?, tags?` | Two-way capture: Save a new coding tip or architectural note directly into your vault from your IDE. |
| `list_taxonomy` | *None* | Browse all knowledge domains, subdomains, and item counts. |
| `get_tools_directory` | `tool_name?: string` | Query all indexed developer tools, frameworks, and libraries. |
| `export_playbook` | `domain?: string`, `subdomain?: string` | Generate an Obsidian-formatted Markdown playbook with Table of Contents and anchors. |

### Prompts

| Prompt Name | Parameters | Description |
| :--- | :--- | :--- |
| `review_with_vault` | `code: string`, `topic?: string` | Reviews selected code or configuration against best practices saved in your vault. |

---

## ⚙️ 3. Agent Configuration Snippets

### A. Cursor IDE (`.cursor/mcp.json` or Global Settings)
Place in your workspace root at `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": [
        "c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/website/scripts/mcp-server.mjs"
      ]
    }
  }
}
```

### B. Claude Desktop (`claude_desktop_config.json`)
Add under `"mcpServers"` in `%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": [
        "c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/website/scripts/mcp-server.mjs"
      ]
    }
  }
}
```

### C. Antigravity MCP Config
Configure in your Antigravity agent settings or MCP directory:
```json
{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": [
        "c:/Users/manik/Desktop/Projects/Instagram-Reels-Summarizer/website/scripts/mcp-server.mjs"
      ]
    }
  }
}
```

---

## 🔄 4. How Vault Synchronization Works

1. **When you open `/vault`:**  
   The web dashboard connects to the extension via `content_bridge.js` and automatically syncs all reels to `POST /api/vault/sync`, keeping `website/data/vault.json` up to date.
2. **From the IDE:**  
   When an agent calls `add_insight`, the new note is appended directly into `website/data/vault.json`.
3. **Offline Resilience:**  
   If the browser is closed, coding agents still have instant, zero-latency access to all saved notes via `website/data/vault.json`.
