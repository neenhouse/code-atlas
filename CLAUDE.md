# CodeAtlas

Codebase intelligence platform. Upload a repo, get architecture diagrams, dependency graphs, complexity hotspots, and tech debt scoring.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8 |
| Backend | Cloudflare Workers |
| Deploy | Cloudflare Pages via GitHub Actions |
| Testing | Vitest + React Testing Library |
| Tooling | pnpm (package manager), mise (runtime versions) |

## Dev Commands

```bash
pnpm dev           # Start dev server
pnpm build         # TypeScript check + Vite production build
pnpm test          # Run Vitest
pnpm lint          # ESLint
```

## Conventions

- Use **pnpm** as package manager (never npm or yarn)
- Use **mise** for runtime versions (see `.mise.toml`)
- CSS custom properties for theming
- React.lazy + Suspense for route-level code splitting
- Tests live next to source files (`Component.test.tsx`)

## Project Structure

```
src/
  pages/           Route-level components
  components/
    ui/            Reusable UI components
    viz/           Visualization components (diagrams, graphs, heatmaps)
  hooks/           Custom React hooks
  lib/             Utilities and analysis logic
worker/
  routes/          API endpoints
docs/
  vision.md        North star vision and design principles
  prd.md           Product requirements
public/
  assets/          Static assets
```

## Single Source of Truth

| Concern | Source File |
|---------|------------|
| Vision and design principles | `docs/vision.md` |
| Product requirements | `docs/prd.md` |
| Runtime versions | `.mise.toml` |
| Agent definitions | `.claude/agents/*.md` |

## Agent Team

| Agent | Role | Scope | Writes Code |
|-------|------|-------|-------------|
| `frontend-dev` | React, visualizations, components, pages | `src/` | Yes |
| `qa` | Testing, accessibility, performance | Tests + read-only | Yes (tests) |
