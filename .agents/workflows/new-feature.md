# 🚀 Workflow: Implementing a New Feature

Follow this step-by-step workflow whenever implementing a new feature in Reel Analyzer Web:

---

## Step 1: Requirements & Scope Verification
1. Open [`docs/PRD.md`](../../docs/PRD.md) and verify that the requested feature aligns with product goals.
2. Check [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md) to determine if new interfaces, storage keys, or bridge actions are needed.

---

## Step 2: Data Models & Type Definitions
1. If new fields or state models are introduced, update `types/index.ts`.
2. Ensure backward compatibility with existing `ReelItem` structures so existing stored reels in user local storage do not crash on parse.

---

## Step 3: Core Logic & Parsers (`lib/`)
1. Implement pure logic, sanitizers, or transformation functions inside `lib/` (e.g., `lib/storage.ts`, `lib/summaryParser.ts`, `lib/playbookExporter.ts`).
2. Keep helper functions pure and testable without side-effects.

---

## Step 4: UI Components & Views (`components/` & `app/`)
1. Build modular UI components following [`.agents/rules/frontend.md`](../rules/frontend.md).
2. Adhere to the Obsidian dark mode design system (`bg-zinc-950`, glass borders, indigo/violet gradients).
3. If new modal, filter, or view mode is added, wire it into `app/vault/page.tsx` or `app/page.tsx`.

---

## Step 5: Documentation & Pre-Commit Sync
1. Run `npx tsc --noEmit` to verify type safety.
2. Update documentation triggers in `docs/FRONTEND.md`, `docs/BACKEND.md`, or `docs/ARCHITECTURE.md`.
3. If any framework quirks or design choices were encountered, document them in `.agents/memory/gotchas.md` or `.agents/memory/decisions.md`.
