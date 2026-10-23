# 🏛️ Architecture Decision Records (ADRs)

---

## ADR 1: Local-First Client Architecture
* **Date:** 2026-09-15
* **Context:** Users extract and save sensitive educational, coding, and personal workflow reels. They need zero-latency search, offline capability, and total privacy assurance.
* **Decision:** The web dashboard uses the browser's `localStorage` as the primary client persistence layer, supplemented by bi-directional sync with the Chrome Extension's `chrome.storage.local`.
* **Rationale:** Zero cloud database dependency for personal note content, 100% private, instant zero-latency client search and filtering.

---

## ADR 2: PostMessage Bridge for Extension Sync
* **Date:** 2026-09-21
* **Context:** Chromium extensions cannot directly inject scripts into cross-origin extension pages, but can inject content scripts on whitelisted dashboard web domains.
* **Decision:** Use an isolated `content_bridge.js` content script that listens to `window.postMessage` between `REEL_ANALYZER_WEB` and `REEL_ANALYZER_EXT`.
* **Rationale:** Clean separation of concerns, secure messaging without exposing extension API tokens to the web page, seamless real-time syncing.

---

## ADR 3: Privacy-Preserving Anonymous Analytics
* **Date:** 2026-09-27
* **Context:** The site requires basic usage insights (unique daily and total visitors) without violating user privacy or requiring cookie banners.
* **Decision:** Compute a SHA-256 fingerprint hash from `ip + userAgent`, mask the IP address to 8 characters before storage, and use a 24-hour cookie for deduplication.
* **Rationale:** Fully compliant with privacy regulations; no personally identifiable information (PII) is stored in MongoDB Atlas.
