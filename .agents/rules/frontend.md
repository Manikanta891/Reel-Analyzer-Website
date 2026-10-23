# 🎨 Frontend Agent Rules & Coding Standards

> **Scope:** All files in `website/app/**` and `website/components/**`

---

## 1. Architectural Invariants

### 1.1 Server vs. Client Boundary
* **Rule:** Next.js 15 App Router defaults to Server Components.
* **Directive:** Any component using React hooks (`useState`, `useEffect`, `useMemo`, `useRef`), event handlers (`onClick`, `onChange`), browser APIs (`window`, `localStorage`, `postMessage`), or Framer Motion MUST have `'use client';` at the top of the file.
* **Hydration Safeguard:** Always guard browser-only APIs (`window`, `localStorage`, `document`) against SSR execution:
  ```typescript
  if (typeof window === 'undefined') return;
  ```

### 1.2 Strict Type Safety
* **Zero `any` policy:** Every variable, prop, callback, and state value must be strictly typed using interfaces from `@/types`.
* **Explicit Component Props:** Every UI component must define and export an explicit props interface:
  ```typescript
  export interface ReelCardProps {
    item: ReelItem;
    onSelect?: (item: ReelItem) => void;
    onDelete?: (url: string) => void;
  }
  ```

### 1.3 Component Sizing & Separation of Concerns
* Keep components modular and focused. Avoid god-components exceeding 300 lines; extract modals, sub-bars, and list items into dedicated files in `components/`.
* Keep business logic, regex matching, and storage sync in `lib/` (e.g., `lib/storage.ts`, `lib/summaryParser.ts`, `lib/vaultParser.ts`), NOT inside component render functions.

---

## 2. Design System & Styling Rules

* **Palette & Theme:** Obsidian Dark Mode (`bg-zinc-950` / `#09090b`).
  - Card Surfaces: `bg-zinc-900/60` or `bg-zinc-900/80` with border `border-zinc-800/80`.
  - Glassmorphic Accents: `backdrop-blur-md` or `backdrop-blur-xl`.
  - Brand Gradients: Indigo to Violet (`from-indigo-500 to-violet-500`).
* **Icons:** Use `lucide-react` icons exclusively. Maintain consistent sizing (`w-4 h-4` for compact tags, `w-5 h-5` for buttons/headers).
* **Responsive Layout:** Ensure desktop (`lg:`, `xl:`) and mobile viewports are fully supported. The Domain Sidebar should collapse or slide out smoothly on mobile.
* **Never hardcode arbitrary CSS styles:** Always utilize Tailwind utility classes. Use `cn()` helper (`clsx` + `tailwind-merge`) from `@/lib/utils` for conditional class joining.

---

## 3. Performance & UX Directives

* **Debounced Search:** All text searches across large lists must be debounced (minimum 100-150ms) to ensure smooth 60fps typing without rendering stutter.
* **Markdown Rendering:** Render AI summaries using `react-markdown` with `remark-gfm`. Always sanitize raw input before rendering to prevent broken layout or unclosed markdown fences.
* **Keyboard Accessibility:** Preserve global hotkeys (e.g., `Ctrl+K` or `/` for search focus, `Esc` to close active modals).
