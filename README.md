# Reel Analyzer Web &mdash; Next.js 15 Knowledge Dashboard

A modern, high-performance web dashboard built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas** to visualize, organize, search, and export reel summaries extracted by the **Reel Analyzer Chrome Extension**.

---

## ✨ Features

- **Dark Obsidian & Glassmorphism Design System:** Built to match the Chrome Extension's palette (`#09090b` obsidian background, indigo `#6366f1` to violet `#8b5cf6` gradients, glass borders).
- **2-Tier Emergent Knowledge Taxonomy:** Macro **Domain** navigation with live count badges and adaptive micro **Subdomain** filter pills.
- **3 View Modes:**
  1. **Masonry Grid View:** Glass cards with expandable Markdown summaries, personal utility callouts, and entity chips.
  2. **High-Density Table View:** Fast spreadsheet-like overview with sorting and instant previews.
  3. **Interactive Flashcard / Focus Mode:** Spaced-repetition study mode with keyboard navigation (`Space` to flip, `←` / `→` to navigate).
- **Tools & Entities Ecosystem Directory:** Aggregated directory of software tools, libraries, and frameworks (Docker, Tailwind, Cursor, Next.js, etc.) with usage counts.
- **Instant Multi-Field Search:** Real-time client-side search across subjects, creators, tools, tags, utilities, and markdown summaries.
- **Unique Visitor Analytics:** Secure API route (`/api/analytics/view`) with SHA-256 IP/User-Agent hashing for daily & all-time unique visitor analytics using MongoDB Atlas.
- **Bi-Directional Extension Sync:** Real-time synchronization with the Chrome Extension's `chrome.storage.local` via `content_bridge.js`.
- **Obsidian Playbook Exporter:** Generate downloadable Markdown playbooks formatted with YAML frontmatter, Tables of Contents, and official branding.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Add your MongoDB Atlas connection string inside `.env.local`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/reel_analyzer?retryWrites=true&w=majority
MONGODB_DB=reel_analyzer
```
*(If omitted, the dashboard runs in local fallback mode).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
