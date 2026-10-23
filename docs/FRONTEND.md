# 🎨 Frontend Architecture & Component Guide

---

## 1. Page Routes & Route Structure

Reel Analyzer Web utilizes Next.js 15 App Router:

| Route Path | Type | Responsibility |
| :--- | :--- | :--- |
| `/` | Server Component | High-conversion landing page with hero, workflow stepper, and FAQs |
| `/vault` | Client Component | Interactive Knowledge Vault with Grid, Table, Search, and Modals |
| `/privacy` | Server Component | Privacy policy and Chrome Web Store permission disclosures |
| `/uninstall` | Client Component | Extension uninstall feedback survey and reason collector |
| `/use-cases/*` | Server Components | 7 Programmatic SEO landing pages with Schema.org JSON-LD |

---

## 2. Component Hierarchy (`components/`)

```text
components/
├── Navbar.tsx                   # Vault top navigation, search input, stats, sync/export triggers
├── DomainSidebar.tsx            # Macro-domain drawer with counts and search filter
├── SubdomainPills.tsx           # Micro-domain horizontal filter tags
├── ReelCard.tsx                 # Masonry grid card with subject, tools, tags & markdown preview
├── ReelTableView.tsx            # High-density spreadsheet table with instant sort
├── ReelDetailModal.tsx          # Full-screen markdown inspector with code block rendering
├── PlaybookExportModal.tsx      # Obsidian markdown playbook generator (.md download / copy)
├── McpModal.tsx                 # 3-step guided MCP setup: download vault.json → copy IDE config → try prompts
├── SyncModal.tsx                # Extension sync status & zip vault uploader
├── TopCreatorsWidget.tsx        # Creator frequency ranking list
├── StatsCounter.tsx             # Animated live visitor badge
├── SkeletonCard.tsx             # Loading state card skeleton
├── ErrorBoundary.tsx            # React lifecycle error boundary
│
├── ads/                         # Google AdSense integration units
│   ├── AdSenseUnit.tsx
│   ├── FeedAdSpot.tsx
│   ├── SidebarAdSpot.tsx
│   └── TopBannerAdSpot.tsx
│
└── landing/                     # Modular sections for the root landing page (/)
    ├── HeroSection.tsx
    ├── HowItWorksSection.tsx
    ├── FeaturesSection.tsx
    ├── MetaVsLegacySection.tsx
    ├── FaqSection.tsx
    ├── CreatorContactSection.tsx
    └── LandingFooter.tsx
```

---

## 3. UI State Management (`app/vault/page.tsx`)

The `/vault` dashboard orchestrates state via React hooks:

```typescript
const [reels, setReels] = useState<ReelItem[]>([]);
const [selectedDomain, setSelectedDomain] = useState<string>('All');
const [selectedSubdomain, setSelectedSubdomain] = useState<string>('All');
const [searchQuery, setSearchQuery] = useState<string>('');
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
const [feedViewMode, setFeedViewMode] = useState<'grid' | 'table'>('table');
const [sortBy, setSortBy] = useState<'default' | 'title' | 'domain'>('default');
const [selectedReelForModal, setSelectedReelForModal] = useState<ReelItem | null>(null);
const [currentPage, setCurrentPage] = useState<number>(1);
const [isMcpOpen, setIsMcpOpen] = useState<boolean>(false);   // McpModal visibility
```

### McpModal State Flow
1. User clicks **"Connect to Cursor / Agents"** button in `<Navbar onOpenMcp={...} />`
2. `isMcpOpen` is set to `true` — `<McpModal>` renders as a full-screen modal
3. Modal guides user through 3 steps:
   - **Step 1**: Download `vault.json` (serialises current `reels` state via `Blob` + `URL.createObjectURL`)
   - **Step 2**: Copy IDE config (tabs: Cursor / Claude Desktop / Antigravity)
   - **Step 3**: Try example prompts in their IDE

### Search Performance
- Search input is debounced by 120ms to prevent main-thread UI locking.
- Multi-field matching evaluates:
  1. `item.subject`
  2. `item.personalUtility`
  3. `item.entities`
  4. `item.tags`
  5. `item.creator`
  6. `item.summary`

---

## 4. Design System Tokens & Styling Standards

* **Obsidian Canvas:** `bg-zinc-950` (`#09090b`), text `text-zinc-100` / `text-zinc-400`.
* **Glass Cards:** `bg-zinc-900/60` with `border-zinc-800/80` and `backdrop-blur-md`.
* **Brand Highlights:** Indigo to Violet gradients (`bg-gradient-to-r from-indigo-500 to-violet-500`).
* **Tags & Chips:**
  - Entities (Tools): `bg-cyan-500/10 text-cyan-400 border border-cyan-500/20`
  - Domains: `bg-violet-500/10 text-violet-400 border border-violet-500/20`
  - Hashtags: `bg-zinc-800/60 text-zinc-400 border border-zinc-700/40`
