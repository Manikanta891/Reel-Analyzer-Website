# 🏗️ System Architecture & Technical Topology

---

## 1. System Overview & Technology Stack

Reel Analyzer Web is built as a modern, local-first Next.js 15 application designed to operate in tandem with the Reel Analyzer Chrome Extension.

### Tech Stack Matrix
| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 3.4, PostCSS, Custom Obsidian Glassmorphic tokens |
| **Icons & Animation** | Lucide React, Framer Motion |
| **Markdown & Archiving** | `react-markdown`, `remark-gfm`, `jszip` (pure client-side) |
| **Local Persistence** | Browser `localStorage` (`reel_analyzer_data`) |
| **Extension Bridge** | `window.postMessage` via isolated `content_bridge.js` |
| **Backend & APIs** | Next.js App Router Route Handlers (`app/api/**`) |
| **Database** | MongoDB Atlas (Node driver `mongodb` v6) |
| **Agent Protocol** | Model Context Protocol (MCP) via `@modelcontextprotocol/sdk` (stdio) |
| **Deployment** | Vercel / Node.js Server Environment |

---

## 2. Technical Topology & Data Flow

```text
┌──────────────────────────────────────────────────────────┐
│                     USER BROWSER                         │
│                                                          │
│  ┌───────────────────────┐      ┌─────────────────────┐  │
│  │ Chrome Extension MV3  │      │   Next.js 15 Web    │  │
│  │ chrome.storage.local  │      │  Dashboard (/vault) │  │
│  └──────────┬────────────┘      └──────────┬──────────┘  │
│             │                              │             │
│             ▼                              ▼             │
│     content_bridge.js              Browser LocalStorage  │
│             │                      ("reel_analyzer_data")│
│             └────── window.postMessage ────┘             │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │ Next.js API Handlers  │
                 │  - /api/analytics     │
                 │  - /api/feedback      │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │     MongoDB Atlas     │
                 │ Collections:          │
                 │  - unique_visitors    │
                 │  - site_metrics       │
                 │  - creator_messages   │
                 │  - uninstall_surveys  │
                 └───────────────────────┘
```

---

## 3. Extension Bridge Protocol (`lib/storage.ts`)

The web app interacts with the Chrome Extension via `window.postMessage`:

| Action | Source | Target | Payload | Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `PING_EXTENSION` | `REEL_ANALYZER_WEB` | `REEL_ANALYZER_EXT` | `{}` | Pings extension bridge on mount |
| `PONG_EXTENSION` | `REEL_ANALYZER_EXT` | `REEL_ANALYZER_WEB` | `{}` | Confirms extension is connected |
| `EXTENSION_READY` | `REEL_ANALYZER_EXT` | `REEL_ANALYZER_WEB` | `{}` | Dispatched when content script attaches |
| `GET_REELS_DATA` | `REEL_ANALYZER_WEB` | `REEL_ANALYZER_EXT` | `{}` | Requests all reels from `chrome.storage.local` |
| `SYNC_REELS_DATA` | `REEL_ANALYZER_EXT` | `REEL_ANALYZER_WEB` | `data: ReelItem[]` | Hydrates web vault with extension library |
| `SAVE_REELS_DATA` | `REEL_ANALYZER_WEB` | `REEL_ANALYZER_EXT` | `payload: ReelItem[]` | Synchronizes deletions or edits to extension |

---

## 4. Local-First Storage Architecture

1. **Client-Side Storage:** The primary store is `localStorage.getItem('reel_analyzer_data')`.
2. **Initial Boot:** If the user has never synced, the store automatically seeds with 12 curated educational reels (`INITIAL_SAMPLE_REELS` in `lib/sampleData.ts`).
3. **Reactive Re-Renders:** State modifications write to `localStorage` first, trigger React state updates, and broadcast `SAVE_REELS_DATA` to sync the extension.

---

## 5. Deployment & Environment Topology

* **Port:** 3000 (Development & Production container).
* **Environment Variables:**
  - `MONGODB_URI`: MongoDB Atlas connection string.
  - `MONGODB_DB`: Database name (defaults to `reel_analyzer`).
  - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: Google AdSense publisher ID.
* **Offline Resilience:** If `MONGODB_URI` is unset, the app runs in baseline mode without crashing.

---

## 6. Model Context Protocol (MCP) Server Subsystem

Reel Analyzer includes an embedded MCP Server (`scripts/mcp-server.mjs`) enabling coding agents (Cursor, Claude Code, Antigravity) to query the knowledge vault over standard `stdio`.
* **Data Source:** `website/data/vault.json` (auto-synced via `POST /api/vault/sync` when `/vault` opens).
* **Two-Way Capture:** Agents can query notes/code and append new discoveries directly into the vault using `add_insight`.
* **Documentation:** Detailed tool and prompt contracts documented in [`docs/MCP_GUIDE.md`](./MCP_GUIDE.md).
