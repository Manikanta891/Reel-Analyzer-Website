# 🧠 AI Agent System Instructions & Operational Protocol (AGENTS.md)

---

## 1. What This File Is For & How Agents Load Memory
> **Purpose:** This file is the **primary system entry point** for all AI coding agents (Antigravity, Cursor, Claude Code, Copilot, etc.) operating in this workspace.  
> **Loading Mechanism:** AI coding agents automatically scan the project root for `AGENTS.md`, `CLAUDE.md`, or `.cursorrules` and load this file into their system prompt context at the start of every session.  
> **Agent Directive:** You must strictly follow the protocols, file routing rules, context links, and documentation sync triggers defined in this document.

---

## 2. Core Operational Principles

1. **North Star Alignment:** Always verify feature scope and behavior against [`docs/PRD.md`](./docs/PRD.md) and technical topology against [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). Never invent features, unapproved external services, or redundant dependencies outside these blueprints.
2. **Local-First & Privacy-Preserving:** Reel Analyzer is local-first. User notes, taxonomy, and reel libraries live in the user's browser (`localStorage` + `chrome.storage.local`). The MongoDB backend is strictly for anonymous aggregated metrics and voluntary feedback.
3. **Component Modularity & Clean Boundaries:** 
   - Keep files focused and clean.
   - Separate UI presentation from business/parsing logic (keep parsing in `lib/`, types in `types/`, UI in `components/`).
   - Clearly separate Client vs. Server components using `'use client'` where React hooks or browser APIs are accessed.
4. **Bi-Directional Extension Compatibility:** Any changes touching reel data models or sync logic must remain compatible with the Chrome Extension's `content_bridge.js`.

---

## 3. Context & Rule Routing

When working on specific domains of the project, you **MUST** read and enforce the corresponding rule files:

| When You Are Working On... | You Must Read & Obey... |
| :--- | :--- |
| Any UI, Page, or Component (`app/**`, `components/**`) | [`.agents/rules/frontend.md`](./.agents/rules/frontend.md) & [`docs/FRONTEND.md`](./docs/FRONTEND.md) |
| API Routes, MongoDB, or Server Code (`app/api/**`, `lib/mongodb.ts`) | [`.agents/rules/backend.md`](./.agents/rules/backend.md) & [`docs/BACKEND.md`](./docs/BACKEND.md) |
| Data Sanitization, Bridge Messaging, or Auth/Privacy | [`.agents/rules/security.md`](./.agents/rules/security.md) |
| Implementing a New Feature or Extension Hook | Follow [`.agents/workflows/new-feature.md`](./.agents/workflows/new-feature.md) |
| Testing, Verification, & Pre-Commit Checks | Follow [`.agents/workflows/pre-commit.md`](./.agents/workflows/pre-commit.md) & [`docs/TESTING.md`](./docs/TESTING.md) |
| Architecture, Schema, or Data Pipelines | Read [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) |
| Model Context Protocol (MCP) Server & Agent Tools | Read [`docs/MCP_GUIDE.md`](./docs/MCP_GUIDE.md) & [`scripts/mcp-server.mjs`](./scripts/mcp-server.mjs) |
| Product Requirements, User Personas, & Scope Boundaries | Read [`docs/PRD.md`](./docs/PRD.md) |

---

## 4. ⚡ Automatic Documentation Sync Triggers (MANDATORY)

You are strictly required to keep the project's documentation in sync with code changes. **Whenever you perform any action listed below, you MUST update the corresponding document in the same turn:**

### 📡 Trigger 1: Modifying API Endpoints or Bridge Protocol
* **When you:** Add, modify, or deprecate an API route (`/api/...`) or change `window.postMessage` bridge action strings.
* **You must update:** [`docs/BACKEND.md`](./docs/BACKEND.md) and [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
* **What to write:** Request payload schemas, query parameters, response examples, and bridge message formats.

### 🗄️ Trigger 2: Data Models & Schema Evolution
* **When you:** Add or change fields in `types/index.ts` (e.g., `ReelItem`, `TaxonomyTree`, `AnalyticsStats`) or MongoDB collection schemas.
* **You must update:** [`docs/BACKEND.md`](./docs/BACKEND.md) and [`docs/FRONTEND.md`](./docs/FRONTEND.md).
* **What to write:** Field name, type, optionality, default value, and parsing fallback.

### 🎨 Trigger 3: Adding or Refactoring UI Components
* **When you:** Create or restructure pages, modals, or widgets in `components/` or `app/`.
* **You must update:** [`docs/FRONTEND.md`](./docs/FRONTEND.md).
* **What to write:** Component name, location, props interface, and responsibility.

### 🧠 Trigger 4: Solving Tricky Bugs & Framework Quirks
* **When you:** Solve an SSR hydration mismatch, Next.js 15 cache issue, regex edge case in markdown parsing, or postMessage race condition.
* **You must update:** [`.agents/memory/gotchas.md`](./.agents/memory/gotchas.md).
* **What to write:** Log the **Symptom**, the **Root Cause**, and the **Exact Fix**.

### 🏛️ Trigger 5: Architectural Decisions & Dependency Additions
* **When you:** Introduce a new npm library, change state persistence, or alter the taxonomy extraction engine.
* **You must update:** [`.agents/memory/decisions.md`](./.agents/memory/decisions.md).
* **What to write:** Add an ADR (Architecture Decision Record) explaining the **Context**, the **Decision**, and the **Rationale**.

---

## 5. End-of-Turn Verification Rule

Before informing the user that a task is complete, run this mental checklist:
- [ ] Did I run `npx tsc --noEmit` to verify type safety?
- [ ] If I added/changed API routes or schemas, did I update `docs/BACKEND.md`?
- [ ] If I touched components or pages, did I update `docs/FRONTEND.md`?
- [ ] If I solved a tricky quirk or made an architectural choice, did I log it in `.agents/memory/`?
- [ ] Does the UI maintain the Obsidian dark theme (`#09090b` zinc-950, glassmorphism, violet/indigo accents)?
