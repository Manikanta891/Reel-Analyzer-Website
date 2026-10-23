# 📄 Product Requirements Document (PRD)

---

## 1. Executive Summary & Problem Statement

### 1.1 Project Overview
* **Product Name:** Reel Analyzer (Web Platform & Knowledge Vault)
* **Tagline:** Turn Instagram Reels into Structured AI Summaries, Obsidian Vaults & Actionable Playbooks.
* **Production URL:** [https://reelanalyzer.manikanta.co.in/](https://reelanalyzer.manikanta.co.in/)

### 1.2 The Problem
Instagram Reels has evolved into a primary channel for high-density tech tutorials, coding tips, AI tool announcements, and productivity hacks. However:
1. **Unsearchable Ephemerality:** Saved reels get lost in the infinite bookmark scroll on Instagram without search or tagging.
2. **No Code / Note Extraction:** Developers cannot easily copy code snippets, commands, or directives displayed in video reels.
3. **Wasted Information:** High-value knowledge remains locked in video format rather than integrated into personal knowledge management tools like Obsidian or Notion.

### 1.3 The Solution
An AI-powered extraction ecosystem combining:
* A Chrome Extension (Manifest V3) that scrapes reels and prompts Meta AI for structured analysis.
* A companion Web Dashboard (`/vault`) with 2-tier domain taxonomy, multi-field search, spreadsheet views, and Obsidian markdown exports.
* High-intent educational landing pages for organic developer search traffic.

---

## 2. Target Personas

1. **Software Engineers & Devs:** Watch reels for library recommendations, CLI commands, and architectural concepts; need code blocks, tool names, and markdown notes.
2. **AI & Tech Enthusiasts:** Track emerging LLM models, prompt hacks, and new apps; need rapid categorization and tool directories.
3. **Students & Self-Learners:** Collect educational reels; need spaced-repetition flashcards and structured study playbooks.
4. **Content Creators & Researchers:** Curate references and study creator hooks and styles across domains.

---

## 3. Product Scope & Feature Boundaries

### Core MVP Features (Shipped)
* **Feature 1: Interactive Knowledge Vault (`/vault`)**
  - **Masonry Grid View:** Responsive glass cards displaying subjects, key takeaways, tools & tech chips, hashtags, and collapsible Markdown summaries.
  - **High-Density Table View:** Sortable spreadsheet interface for high-speed skimming.
  - **Global Fast Search:** Debounced instant search across title, tools, tags, creator, and summary text.
  - **Domain & Subdomain Taxonomy:** Dynamic left sidebar grouping reels by macro domain with count badges and micro-subdomain filter pills.
* **Feature 2: Bi-Directional Extension Sync**
  - Instant bridge communication between browser `localStorage` and Chrome extension `chrome.storage.local`.
  - Manual sync modal with manual JSON/ZIP import/export.
* **Feature 3: Obsidian Vault & Playbook Exporter**
  - Formats reels into clean Obsidian-ready Markdown playbooks with YAML frontmatter, internal Table of Contents anchors, and key takeaways.
* **Feature 4: High-Converting Landing Page & Programmatic SEO**
  - Single-scroll landing page with interactive hero card, comparison matrix (Meta AI vs. Legacy OCR), and animated feature carousels.
  - 7 targeted use-case landing pages (`/use-cases/*`) with Schema.org JSON-LD structured data.
* **Feature 5: Privacy-Preserving Analytics & Feedback**
  - Anonymous SHA-256 fingerprint visitor tracker on MongoDB Atlas.
  - Creator message feedback form and extension uninstall survey collector.

### Out of Scope for MVP
* Cloud user accounts / mandatory login systems (the platform remains strictly local-first and frictionless).
* Automatic server-side scraping of private Instagram accounts.
* Paid subscription paywalls.

---

## 4. Non-Functional Requirements

* **Performance:** Vault search and filter latency < 16ms (60fps); initial page load LCP < 1.5s.
* **Privacy:** 100% of reel notes and taxonomy trees remain in local client storage; zero note data sent to backend servers.
* **Reliability:** The web dashboard functions with full utility even if MongoDB Atlas is offline or disconnected.
* **Responsive Design:** Flawless layout across mobile (375px+), tablet, and desktop displays.
