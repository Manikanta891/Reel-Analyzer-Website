# 🧪 Testing Strategy & QA Verification Guide

---

## 1. Overview & Verification Philosophy

Reel Analyzer Web combines client-side local-first state, real-time extension bridge messaging, and serverless API routes. Verification encompasses:
1. **Static Type Safety:** TypeScript compiler checks (`npx tsc --noEmit`).
2. **Build Verification:** Production bundling test (`npm run build`).
3. **Manual Feature QA Matrix:** Functional verification across Vault, Exporters, Extension Bridge, and Mobile Viewports.

---

## 2. Automated Commands

### 2.1 TypeScript Typecheck
```bash
npx tsc --noEmit
```
* **Required Output:** Exit code 0 with zero type errors. Run before every commit or turn completion.

### 2.2 Production Build Verification
```bash
npm run build
```
* **Required Output:** Successfully builds all static routes and generates dynamic serverless API route handlers.

---

## 3. Manual Functional QA Matrix

| Feature Area | Test Scenario | Expected Outcome |
| :--- | :--- | :--- |
| **Search & Filter** | Type "Docker" or "Next.js" in `/vault` search bar | Cards & table rows instantly filter to matching items within 150ms. |
| **Taxonomy Navigation** | Click a macro domain (e.g. *Web Development*) in sidebar | Subdomain pills populate; cards filter to that domain with active count badges. |
| **View Modes** | Toggle between Table and Grid icons in `/vault` navbar | View smoothly switches from compact spreadsheet table to rich masonry cards without layout shift. |
| **Playbook Export** | Click **Export Playbook** -> Select domain -> Click **Download Playbook** | Downloads `.md` file containing valid YAML frontmatter, numbered TOC with anchor links, and clean summary body. |
| **Vault Zip Import** | Open **Sync** modal -> Drop `.zip` file of Obsidian notes | `lib/vaultParser.ts` unpacks files, extracts domains from folders, and appends reels to `localStorage`. |
| **Extension Bridge** | Open `/vault` with Chrome Extension installed and pinned | Badge in Navbar changes to "Connected" with green dot; extension syncs reels via `SYNC_REELS_DATA`. |
| **Analytics Deduplication** | Refresh `/vault` or `/` within 24 hours | Visitor counter preserves count; cookie `last_visit_24h` prevents incrementing duplicate daily hits. |
| **Offline Resilience** | Unset `MONGODB_URI` in `.env.local` and restart server | Site loads normally; analytics falls back to baseline mode with no 500 crashes. |
| **Mobile Responsiveness** | Resize browser viewport to 375px width | Navbar wraps gracefully; Domain Sidebar collapses into a drawer; table view scrolls horizontally. |
