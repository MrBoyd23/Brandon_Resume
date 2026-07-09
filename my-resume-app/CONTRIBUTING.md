# Contributing — Brandon's Resume

A React 18 + Express single-page portfolio. This doc covers the conventions used
in this repo. (Setup and run instructions live in `README.md`.)

## Commit convention — Conventional Commits

Every commit message follows `type(scope): short description`, imperative mood,
with the Jira key referenced where one applies.

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

**Examples:**
```
feat(ui): adopt Space Grotesk / IBM Plex Sans type system (THALAB-709)
refactor(css): introduce :root design-token layer (THALAB-708)
fix(contact): handle empty reCAPTCHA token
chore(deps): add prettier and stylelint
```

Keep the subject ~50 chars, capitalized, no trailing period. Use the body to
explain **why**, not what. One logical change per commit.

## Branching & flow

One branch per task, cut from the latest `main`:

| Type | Pattern |
|------|---------|
| Feature | `feature/short-description` |
| Fix | `fix/short-description` |
| Refactor | `refactor/short-description` |
| Chore | `chore/short-description` |

Per-task flow: branch off `main` → implement → commit → merge to `main`
(fast-forward) → branch the next task off `main`. Delete branches once merged.

## Formatting & linting

Design tokens live in `:root` in `src/css/styles.css` — never hardcode colors,
radii, fonts, or z-index in components; use `var(--token)`.

```bash
npm run format        # Prettier: auto-format src
npm run format:check  # Prettier: verify formatting (CI-friendly)
npm run lint:css      # Stylelint on src CSS
```

Config: `.editorconfig`, `.prettierrc`, `.prettierignore`, `.stylelintrc.json`.

## Do not commit

Secrets (`.env*`), build output (`build/`), dependencies (`node_modules/`), and
local editor/agent settings are gitignored. Commit `.env.example` (placeholders
only), never `.env`.
