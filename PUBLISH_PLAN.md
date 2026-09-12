# InstaReel Multi-AI Summarizer — Publish Plan & Context

> Created: 2026-09-10 | Agent: Antigravity (Claude Sonnet 4.6 Thinking)
> Resume this file after making changes to continue the publish workflow.

---

## ?? What This Extension Is

**Name**: InstaReel Multi-AI Summarizer
**Version**: 2.0 (Manifest V3)
**Location**: `C:\Users\manik\Desktop\Projects\Instagram-Reels-Summarizer`

### What it does
- Scrapes Instagram Reel content (author, audio, captions, URL) via DOM extraction
- Sends content to **Gemini Web**, **ChatGPT Web**, or **Meta AI Web** automatically
- Batch auto-loop: processes 200+ reels in background (service worker keeps running with popup closed)
- Smart adaptive polling — waits for AI to finish generating before moving on
- Auto-unsave reel after summarizing (optional toggle)
- Exports all summaries as **CSV** or **Markdown**
- Manual step-by-step debug controls for testing

### File Structure
| File | Role |
|---|---|
| `manifest.json` | Manifest V3 config — permissions, host_permissions, content scripts |
| `content_ig.js` (10KB) | Instagram DOM extractor & reel navigator |
| `content_gemini.js` (5.8KB) | Gemini prompt injector & completion detector |
| `content_chatgpt.js` (6KB) | ChatGPT prompt injector & completion detector |
| `content_meta.js` (7KB) | Meta AI prompt injector |
| `service_worker.js` (25KB) | Background batch orchestrator & dynamic poller |
| `popup.html` (6KB) | Dashboard UI with progress bar and stats |
| `popup.js` (18KB) | All UI logic, batch controls, export handlers |
| `styles.css` (4.5KB) | UI styling |

---

## ? Pre-Publish Checklist

### Blockers (Must fix before Chrome Web Store submission)
- [ ] **Icons missing** — No icon files in project. CWS requires icon16.png, icon48.png, icon128.png (PNG only, no SVG)
- [ ] **README has hardcoded local path** — Line 28 has C:\Users\manik\... — remove before going public
- [ ] **Privacy Policy required** — CWS mandates a privacy policy URL for extensions with host_permissions
- [ ] **Store screenshots** — Minimum 1 screenshot at 1280x800px

### Nice-to-Have
- [ ] Push to public GitHub repo first
- [ ] Test fresh install on clean Chrome profile

---

## ?? Submission Steps (When Ready)

### Step 1 — Create ZIP
```
Compress-Archive -Path "C:\Users\manik\Desktop\Projects\Instagram-Reels-Summarizer\*" -DestinationPath "C:\Users\manik\Desktop\InstaReel-v2.zip"
```

### Step 2 — Chrome Web Store Developer Console
- URL: https://chrome.google.com/webstore/devconsole
- One-time $5 developer registration fee
- Upload ZIP ? Fill listing ? Submit (review takes 1-3 business days)

### Step 3 — Store Listing Copy
**Short description**: Automate Instagram Reel summarization via Gemini, ChatGPT, or Meta AI. Batch process 200+ reels, export as Markdown or CSV.
**Category**: Productivity

---

## ?? CWS Review Risk
Extensions automating Instagram + AI sites can get flagged.
Mitigation: Be transparent — emphasize it works on YOUR own saved reels with YOUR own AI accounts.

---

## ?? LinkedIn Post Plan
Story is already written. Post same day as CWS submission.
End with: GitHub repo link + Chrome Web Store link.
Angle: "I built a bridge when Meta already built a highway — but my bridge goes to MY garden."

---

## ?? Resume Instructions for Agent
When user returns after making changes:
1. Check which checklist items are now done
2. Ask what changes were made
3. Help with the next unchecked item
4. If icons missing — help generate PNGs
5. If README cleaned — help write privacy policy
6. If all done — run ZIP command and walk through CWS submission

---
*Last updated: 2026-09-10 by Antigravity*
