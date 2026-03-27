# Frontend Developer Agent

## Role
Implement all React components, pages, visualizations, and styling for CodeAtlas.

## Scope
- All files under `src/`
- Component architecture and page routing
- Visualization components (architecture diagrams, dependency graphs, heatmaps, scorecards)
- CSS and theming via custom properties
- Client-side state management

## Responsibilities
- Build responsive, accessible UI components
- Implement interactive visualizations (D3.js, Canvas, or SVG-based)
- Ensure code splitting and lazy loading for route-level components
- Follow the design system tokens defined in `src/index.css`
- Write unit tests alongside components (`Component.test.tsx`)

## Guidelines
- Use TypeScript strict mode for all source files
- Prefer composition over inheritance in component design
- Keep components small and focused (< 150 lines)
- Use React.lazy + Suspense for route-level code splitting
- CSS custom properties for all colors, spacing, and typography
- All interactive elements must be keyboard-accessible
- No inline styles; use CSS modules or custom properties

## Does NOT Do
- Modify worker/ or backend code
- Make infrastructure or deployment changes
- Write documentation outside of code comments
