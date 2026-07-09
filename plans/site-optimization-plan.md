# Site Optimization Plan ~95% COMPLETE 2026-06-01

*Generated: May 2026*

---

## What's Already in Good Shape

- All 31 skills have custom component files — zero stubs or placeholders
- Every skill route is lazy-loaded via `React.lazy()` — no unnecessary JS is loaded upfront
- `skillsConfig.js` is a clean single source of truth — adding a skill requires one line
- Google Analytics page-view tracking is wired up
- Skip-to-content accessibility link exists
- `NotFound` 404 component exists

---

## Issues Found — Prioritized

### 🔴 High Priority

**1. Duplicated inline Suspense fallback (6 places in App.js)**
The same inline style object is copy-pasted six times:
```js
<div style={{color:'#666',fontStyle:'italic',padding:'40px 0',textAlign:'center'}}>Loading…</div>
```
Should be extracted to a single `<PageLoader />` component. Easy win for code quality and consistency.

**2. Skill button order never updated**
Coding & Development buttons need to be reordered with the newest technologies first.
`skillsConfig.js` still has `ansible`, `aws`, and `python` ahead of more modern tools.
The current order doesn't reflect career relevance to an employer browsing the skills.

**3. URL case inconsistency**
Routes are mixed case — bad for SEO and linking:
- `/Experience/*` — capital E
- `/Education/*` — capital E
- `/coding/*` — lowercase c ← inconsistent
- `/Software/*` — capital S

All URLs should be lowercase (`/experience`, `/education`, `/coding`, `/software`).

**4. No sitemap.xml**
31 skill pages + 4 main pages = ~35 indexable URLs with zero sitemap.
Google is discovering these by crawling only. A sitemap in `public/` guarantees all skill pages get indexed.

---

### 🟡 Medium Priority

**5. No error boundaries**
If any lazy-loaded skill component throws an error, the entire route crashes with a blank screen.
A React error boundary component would catch failures and show a helpful fallback instead.

**6. `SkillDetail` fallback is dead code**
`SkillDetail` is lazy-imported in `App.js` and used as the fallback for skills without custom
components — but since all 31 skills now have custom components, `SkillDetail` is never actually
rendered. It's wasted overhead in the module graph.

**7. `e-commerce` label is inconsistent**
`label: 'ECommerce'` in skillsConfig — should be `'E-Commerce'` to match how it's written
everywhere else on the site.

**8. No per-page `<title>` or meta description updates**
Every skill page shares the same browser tab title ("Brandon's Resume"). Each skill page should
update `document.title` to something like `"CSS | Brandon Boyd"` for better SEO and browser
history clarity.

**9. CategoryNav re-renders on every skill route**
Each skill route renders `<CategoryNav />` + `<SkillComponent />` in the same `Suspense` boundary.
This means when navigating between skills in the same category, the nav re-fetches unnecessarily.
Nested routing would fix this.

---

### 🟢 Low Priority / Polish

**10. No robots.txt**
Public directory doesn't have a `robots.txt`. Should exist even if it's just `Allow: /`.

**11. Loading state is plain text**
`Loading…` as italic gray text works but a skeleton loader (pulsing placeholder cards) would
look much more polished while skill pages hydrate.

**12. Coding skills order doesn't reflect modern relevance**
Beyond the reordering request, consider whether `phpmyadmin` and `apache` should remain in the
Coding category vs. moving to Software — they're tools/admin interfaces, not development skills.

**13. No preloading on hover**
The most-visited skill pages (React, Python, AI Development) could be preloaded when the user
hovers over their nav bubble, eliminating any perceived load delay.

---

## Recommended Implementation Order

| # | Task | Effort | Impact |
|---|---|---|---|
| 1 | Extract `<PageLoader />` component | 15 min | Code quality |
| 2 | Reorder skill buttons (newest first) | 10 min | Recruiter UX |
| 3 | Fix URL case inconsistency | 20 min | SEO |
| 4 | Add `sitemap.xml` to `public/` | 20 min | SEO |
| 5 | Add `robots.txt` to `public/` | 5 min | SEO |
| 6 | Add per-page `document.title` to skill pages | 30 min | SEO + UX |
| 7 | Fix `e-commerce` label casing | 2 min | Polish |
| 8 | Remove dead `SkillDetail` import | 5 min | Code quality |
| 9 | Add React error boundaries | 30 min | Stability |
| 10 | Skeleton loader for Suspense | 45 min | Polish |
| 11 | Preload on hover for top skills | 30 min | Performance |

---

## Files Affected

| File | Tasks |
|---|---|
| `src/App.js` | #1, #3, #6, #8, #9 |
| `src/data/skillsConfig.js` | #2, #7, #12 |
| `src/components/PageLoader.js` | #1 (new file) |
| `src/components/ErrorBoundary.js` | #9 (new file) |
| `src/components/skills/*.js` | #6 (all 31 skill pages) |
| `public/sitemap.xml` | #4 (new file) |
| `public/robots.txt` | #5 (new file) |
