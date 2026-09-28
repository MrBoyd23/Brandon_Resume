# Resume Site Documentation

Reference documentation for Brandon's Resume — a React + Express portfolio site.

## Contents

| Document | Purpose |
|---|---|
| [architecture.md](architecture.md) | Frontend and backend architecture, routing, components, build pipeline |
| [design-system.md](design-system.md) | Color palette, typography, spacing, breakpoints, animation, accessibility tokens |
| [skill-page-guide.md](skill-page-guide.md) | Pattern and registration steps for adding new skill detail pages |

## Keeping Docs Current

These files are the source of truth for architectural and design decisions. When changing the site:

- **New component or route** — update `architecture.md`
- **New token, breakpoint, or visual pattern** — update `design-system.md`
- **New skill page** — follow the steps in `skill-page-guide.md`

If a doc contradicts the code, the code wins — update the doc to match.
