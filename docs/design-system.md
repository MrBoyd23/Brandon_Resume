# Design System

Single source of truth for visual design decisions. All tokens are defined in `src/css/styles.css` `:root` and consumed via `var(--token)` across global styles and CSS Modules.

## Theme

Dark-premium charcoal with gold accents. Single dark theme — no light mode.

## Color Palette

### Surfaces (depth progression)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#12121f` | Page background (deepest) |
| `--surface` | `#1a1a2e` | Card surfaces |
| `--surface-2` | `#15151f` | Darker panels, code backgrounds |
| `--surface-3` | `#20202e` | Skeleton/loader base |
| `--surface-accent` | `#232338` | Raised elements, gradient stops |
| `--border` | `#2a2a40` | Default borders |
| `--border-2` | `#37374f` | Lighter borders |

### Text (warm off-white ramp)

| Token | Value | Usage |
|---|---|---|
| `--text` | `#f3f1ea` | Primary text |
| `--text-secondary` | `#b8b4a8` | Body paragraphs |
| `--text-muted` | `#9a9484` | Meta, subtitles |
| `--text-dim` | `#83806f` | Labels, captions |
| `--white` | `#fff` | Pure white accents |

### Accent (gold)

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#d4a849` | Primary accent |
| `--accent-hover` | `#e4c072` | Hover state |
| `--accent-strong` | `#c2953a` | Darker accent |
| `--accent-soft` | `#e8d09a` | Light accent text |
| `--link` | `#d8b45f` | Link color |
| `--link-hover` | `#eccf8a` | Link hover |
| `--star` | `#fbbf24` | GitHub stars (amber) |
| `--danger` | `#f87171` | Error/danger |

### RGB Channels

For `rgba()` alpha usage: `--accent-rgb`, `--link-rgb`, `--danger-rgb`, `--text-muted-rgb`, `--text-rgb`, `--white-rgb`, `--shadow-rgb`.

## Typography

### Font Families

| Token | Font | Usage |
|---|---|---|
| `--font-display` | Space Grotesk | Headings, the name |
| `--font-body` | IBM Plex Sans | Body text, UI elements |
| `--font-mono` | IBM Plex Mono | Code blocks, metadata |

Fonts loaded via Google Fonts `<link>` in `index.html` with `display=swap`.

### Type Scale

| Token | Value | Usage |
|---|---|---|
| `--fs-hero` | `clamp(2.75rem, 6vw, 4.5rem)` | The name — fluid |
| `--fs-h1` | `clamp(1.75rem, 3.5vw, 2.25rem)` | Page headings — fluid |
| `--fs-h2` | `1.6rem` | Section headings |
| `--fs-h3` | `1.35rem` | Subsection headings |
| `--fs-lg` | `1.1rem` | Large body text |
| `--fs-base` | `0.95rem` | Default body |
| `--fs-sm` | `0.85rem` | Small text |
| `--fs-xs` | `0.75rem` | Captions |
| `--fs-2xs` | `0.68rem` | Fine print |

### Font Weights

| Token | Value |
|---|---|
| `--fw-body` | 400 |
| `--fw-medium` | 500 |
| `--fw-semibold` | 600 |
| `--fw-bold` | 700 |

## Spacing Scale

| Token | Value | Pixels |
|---|---|---|
| `--space-1` | `0.25rem` | 4px |
| `--space-2` | `0.5rem` | 8px |
| `--space-3` | `0.75rem` | 12px |
| `--space-4` | `1rem` | 16px |
| `--space-5` | `1.5rem` | 24px |
| `--space-6` | `2rem` | 32px |
| `--space-7` | `2.5rem` | 40px |
| `--space-8` | `3rem` | 48px |

## Border Radius

| Token | Value |
|---|---|
| `--radius-2` | 2px |
| `--radius-sm` | 6px |
| `--radius` | 8px (default) |
| `--radius-md` | 10px |
| `--radius-lg` | 12px |
| `--radius-pill` | 50% |

## Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| `--z-base` | 1 | Default stacking |
| `--z-above` | 10 | Floating elements |
| `--z-header` | 100 | Sticky header |
| `--z-skip` | 9999 | Skip-to-content link |

## Breakpoints

Mobile-first (`min-width`). Base styles target mobile; breakpoints scale up.

| Name | Value | Usage |
|---|---|---|
| sm | `480px` | Large phones |
| md | `768px` | Tablets |
| lg | `1024px` | Laptops, desktops |
| xl | `1280px` | Wide screens (used sparingly) |

Defined as CSS comments in `:root` (media queries cannot use custom properties).

## Transition Durations

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `150ms` | Micro-interactions |
| `--transition-base` | `250ms` | Standard transitions |
| `--transition-slow` | `400ms` | Emphasis transitions |

## Animation

| Name | Purpose | File |
|---|---|---|
| `bb-fade-up` | Entrance animation for header elements | `styles.css` |
| Scroll reveal | IntersectionObserver-based fade-up on scroll, via `useScrollReveal` hook. Opt-in via `.reveal-enabled` class; elements get `.is-visible` when in viewport | `styles.css` |
| `shimmer` | Skeleton loader animation | `PageLoader.module.css` |
| `pulse` | Live-data indicator dot | `SkillPage.module.css` |

All animations respect `prefers-reduced-motion: reduce` — a global guard in `styles.css` sets all animation/transition durations to near-zero and forces scroll-reveal elements visible.

## CSS Architecture

| File | Scope | Contents |
|---|---|---|
| `src/css/styles.css` | Global | Design tokens, resets, base typography, layout container, experience timeline, education/certifications, code blocks, motion system, focus visibility |
| `*.module.css` | Component | Scoped styles consumed via CSS Modules import. Custom properties (`var(--token)`) resolve globally |

CSS Modules in use: Header, Skills, SkillPage, Education, Certifications, QrCode, Sidebar, PageLoader, HTML.

No preprocessor (SCSS/Less), no utility framework (Tailwind), no CSS-in-JS.

## Accessibility

| Feature | Implementation |
|---|---|
| Skip-to-content | `.skip-link` in `styles.css`, `<a href="#main-content">` in App.js |
| Focus ring | `:focus-visible` outline using `--accent`, 2px solid, 3px offset |
| Pointer suppression | `:focus:not(:focus-visible)` removes ring for mouse/touch |
| Reduced motion | `prefers-reduced-motion: reduce` guard disables all animation/transition |
| Semantic landmarks | `<nav aria-label>`, `<main id="main-content">`, `lang="en"` |
| Touch targets | 44px minimum height on buttons and interactive elements |
