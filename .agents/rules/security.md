# 🛡️ Security & Privacy Agent Rules

> **Scope:** Cross-cutting security, data privacy, and bridge validation rules.

---

## 1. Local-First User Privacy Invariant

* **Zero Note Cloud Exfiltration:** User reel summaries, notes, personal utility takeaways, and taxonomy trees MUST remain 100% in local browser storage (`localStorage` & Chrome Extension `chrome.storage.local`).
* Never transmit user note contents, reel URLs, or private queries to backend endpoints or remote servers.
* MongoDB Atlas collections are strictly restricted to:
  1. Hashed, masked visitor counts (`unique_visitors`, `site_metrics`).
  2. Voluntary user feedback & creator messages (`creator_messages`, `uninstall_surveys`).

---

## 2. Input Sanitization & XSS Prevention

* **Raw Markdown Sanitization:**
  - AI-generated summaries or uploaded vaults may contain malformed HTML or injection vectors.
  - All markdown imports in `lib/vaultParser.ts` and `lib/summaryParser.ts` must strip `<script>`, `<iframe>`, and `javascript:` URIs before persisting or rendering.
* **Component Rendering:**
  - When rendering markdown via `react-markdown`, do NOT enable raw HTML rendering unless strictly piped through a sanitizer.
  - Treat all incoming user strings as untrusted.

---

## 3. Chrome Extension Bridge Origin & Message Safety

* **Message Verification:**
  - In `lib/storage.ts`, when listening to `window.addEventListener('message')`, always verify `event.data && event.data.source === 'REEL_ANALYZER_EXT'`.
  - Discard messages without matching source or unrecognized action enums.
* **Non-Destructive Sync:**
  - Never allow an empty extension payload (`SYNC_REELS_DATA` with `[]` or non-array) to accidentally wipe out an existing populated `localStorage` cache.
