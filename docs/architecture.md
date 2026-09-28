# Architecture

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v7, Vite 7.3 |
| Backend | Express 4, Nodemailer 9, Puppeteer 22, better-sqlite3 |
| Styling | Vanilla CSS — global `styles.css` + CSS Modules per component |
| Testing | Vitest 3.2, Testing Library |
| Production | nginx (port 3500), static build + Express API (port 5000) |

## Entry Flow

```
index.html (Vite entry)
  └─ src/index.js
       └─ App.js
            ├─ Header (eager)
            ├─ Experience (homepage, eager)
            └─ All other routes (React.lazy)
```

## Routing

Routes are **config-driven** — no manual route list in App.js.

1. `src/config/skillsConfig.js` defines:
   - `CUSTOM_SKILL_IDS` — Set of skill IDs with dedicated component files
   - `codingSkills` — array of `{ id, label }` objects (23 skills)
   - `softwareSkills` — array of `{ id, label }` objects (22 skills)
   - `allSkills` — combined array with `category` tags ("coding" or "software")

2. `App.js` iterates `allSkills` to generate `<Route>` elements. Each skill ID is checked against `CUSTOM_SKILL_IDS`:
   - **Match** — renders the lazy-loaded component from the `customComponents` map
   - **No match** — renders the generic `SkillDetail` placeholder

Adding a new skill requires only config + component changes. See [skill-page-guide.md](skill-page-guide.md).

## Lazy Loading

All routes except Experience (homepage) and Header use `React.lazy()`:

- Each lazy route is wrapped in `<Suspense fallback={<PageLoader />}>`
- `PageLoader` renders a shimmer skeleton animation
- `src/config/skillPreloads.js` defines priority skill preloaders for faster navigation

## Error Handling

A class-based `ErrorBoundary` component provides two layers:

- **App-level** — wraps the entire Router, catches catastrophic failures
- **Route-level** — wraps each individual route, isolates per-page errors

The boundary renders a "Try Again" reset button and accepts a custom `fallback` prop.

## Component Inventory

| Component | File | Purpose |
|---|---|---|
| `App` | `src/App.js` | Router, route generation, analytics tracker |
| `Header` | `src/components/Header.js` | Sticky header with data-driven nav |
| `Experience` | `src/components/Experience.js` | Homepage — work history timeline |
| `Skills` | `src/components/Skills.js` | Skills overview with accordion categories |
| `Coding` | `src/components/Coding.js` | Category nav for coding skills |
| `Software` | `src/components/Software.js` | Category nav for software skills |
| `Education` | `src/components/Education.js` | Education page |
| `Certifications` | `src/components/Certifications.js` | Certifications section |
| `QrCode` | `src/components/QrCode.js` | QR code connect section |
| `NotFound` | `src/components/NotFound.js` | 404 catch-all |
| `PageLoader` | `src/components/PageLoader.js` | Suspense fallback skeleton |
| `ErrorBoundary` | `src/components/ErrorBoundary.js` | Error isolation with retry |

## Custom Hooks

| Hook | File | Purpose |
|---|---|---|
| `useDocTitle` | `src/hooks/useDocTitle.js` | Sets document title to `"<Name> \| Brandon Boyd"`, restores default on unmount |
| `useScrollReveal` | `src/hooks/useScrollReveal.js` | IntersectionObserver scroll-reveal animation with stagger. Respects `prefers-reduced-motion` |

## Express Backend

Located in `server/` with its own `package.json`.

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/resume` | GET | Generates PDF resume on-the-fly via Puppeteer |
| `/api/contact` | POST | Contact form — sends email via SMTP (Nodemailer) |
| `/q/:slug` | GET | QR code redirect with scan analytics logging |
| `/api/qr/stats` | GET | QR scan analytics summary (human vs bot counts) |

Additional features:
- SQLite database (`qr.db`, WAL mode) for QR tracking
- Bot detection via User-Agent regex matching
- Privacy-preserving IP logging (SHA-256 with salt)
- DataTracker integration for error reporting and heartbeat (5-minute interval)

## Build Pipeline

| Command | Action |
|---|---|
| `npm start` / `npm run dev` | Vite dev server on port 3210 |
| `npm run build` | Production build to `build/` (runs `generate-resume.js` first via `prebuild`) |
| `npm test` | Vitest test suite |
| `npm run server` | Express backend on port 5000 |

Vite config (`vite.config.mjs`):
- JSX in `.js` files via esbuild loader
- API proxy: `/api` and `/q/` forward to `http://localhost:5000`
- `envPrefix: 'REACT_APP_'` (legacy CRA convention)
- No sourcemaps in production

## Production (nginx)

- Serves static build on port 3500
- SPA fallback: `try_files $uri $uri/ /index.html`
- Gzip compression for text, CSS, JS, JSON, XML, SVG, woff2
- Static assets (`/static/`): 1-year cache; images/fonts: 30-day cache
- `index.html`: `no-cache` header
- `/api/` and `/q/` proxied to Express backend on port 5000
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`

## Google Analytics

- Tag: `G-PCR1VN8WRP`
- Loaded via deferred `<script>` in `index.html`
- Page views tracked by `useGtagPageView` hook in App.js on every route change
- Initial page view suppressed (`send_page_view: false`) to avoid double-counting
