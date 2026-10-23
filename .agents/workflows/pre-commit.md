# ✅ Workflow: Pre-Commit & Turn Verification

Before completing any task, executing a git commit, or reporting completion to the user, complete this verification checklist:

---

## 1. Automated Compiler & Typecheck
Run the TypeScript compiler with no emit:
```bash
npx tsc --noEmit
```
* **Exit condition:** Must finish with 0 errors (Exit code 0).
* If errors exist, fix type annotations and prop interfaces immediately.

---

## 2. Build Verification (When Adding Routes or Dependencies)
If new libraries, pages, or API routes were introduced:
```bash
npm run build
```
* Verify that server/client boundaries compile cleanly and dynamic routes don't fail prerendering.

---

## 3. Documentation Sync Verification
- [ ] Were any types in `types/index.ts` modified? -> *Sync with `docs/FRONTEND.md` / `docs/BACKEND.md`.*
- [ ] Were any new UI components or modals added? -> *List them in `docs/FRONTEND.md`.*
- [ ] Were any API endpoints or MongoDB queries added? -> *Document in `docs/BACKEND.md`.*
- [ ] Did you solve a tricky runtime bug? -> *Add to `.agents/memory/gotchas.md`.*

---

## 4. Git Status Inspection
```bash
git status
```
* Ensure no unwanted temporary files, scratch scripts, or `.next` artifacts are staged.
