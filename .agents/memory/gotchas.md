# 🧠 Agent Memory: Gotchas & Tricky Quirks

Document known technical traps, edge cases, and framework nuances here so all agents avoid repeating mistakes.

---

### Gotcha 1: SSR Hydration & LocalStorage Access
* **Symptom:** Next.js throws hydration mismatch error (`Text content did not match server-rendered HTML`) when reading `localStorage` directly in component state initialization.
* **Root Cause:** Next.js server pre-renders without `window` or `localStorage`. If client initializes state with `getStoredReels()` while server initialized with empty or fallback data, the initial DOM diff fails.
* **Fix:** Use an `isHydrating` flag. Load from `localStorage` inside `useEffect` on client mount, or render a skeleton placeholder while `isHydrating === true`.

---

### Gotcha 2: Loose YAML Regex Stripping Headers
* **Symptom:** When cleaning AI summaries, markdown headings like `### 1. The Core Problem` or markdown tables disappeared.
* **Root Cause:** A loose regex like `/---[\s\S]*?---/` matched from the top YAML frontmatter delimiter down to a horizontal rule or table border further down in the content.
* **Fix:** Use strictly line-anchored regex `/^---[ \t]*\n[\s\S]*?\n---[ \t]*(?:\n|$)/i` to only strip the genuine top-level frontmatter block.

---

### Gotcha 3: Extension PostMessage Race Condition
* **Symptom:** When opening the web dashboard, the sync badge shows disconnected even though the extension is installed.
* **Root Cause:** The web app posted `PING_EXTENSION` before `content_bridge.js` finished injecting into the page.
* **Fix:** `content_bridge.js` sends an `EXTENSION_READY` broadcast upon injection, and the web app listens continuously as well as sending periodic ping on mount.

---

### Gotcha 4: Next.js 15 Caching of API Routes
* **Symptom:** `/api/analytics/view` returns static cached counts instead of live DB metrics.
* **Root Cause:** Next.js 15 aggressively optimizes route handlers unless explicitly configured as dynamic.
* **Fix:** Always add `export const dynamic = 'force-dynamic';` at the top of API route files that query live databases or inspect incoming request headers/cookies.

---

### Gotcha 5: Minified React Error #310 (Early Return Before Hooks)
* **Symptom:** Production error `Minified React error #310; visit https://react.dev/errors/310` ("Rendered more hooks than during the previous render").
* **Root Cause:** Placing an early return like `if (!isOpen) return null;` before other hooks (such as `useCallback`, `useEffect`, `useState`). When `isOpen` toggles from false to true, the number of hooks called increases, breaking React's hook order invariant.
* **Fix:** Never call hooks after conditional returns. Place all hooks at the top level of the component unconditionally, or conditionally mount the component in the parent: `{isOpen && <Modal ... />}`.
