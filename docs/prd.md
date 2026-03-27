# CodeAtlas -- Product Requirements Document

## Overview

CodeAtlas is a codebase intelligence platform. Users upload a repository and receive architecture diagrams, dependency graphs, complexity hotspots, and tech debt scoring. The platform transforms raw source code into actionable visual intelligence.

---

## Feature 1: Landing Page

### Description
A clear, compelling landing page that communicates what CodeAtlas does and drives users to upload their first repo.

### Requirements
- Hero section with tagline and primary CTA ("Analyze Your Repo")
- Visual preview showing example output (architecture diagram screenshot or animation)
- Three value propositions: Understand, Maintain, Improve
- How-it-works section: Upload -> Analyze -> Explore (3-step flow)
- Footer with links to docs, GitHub, and contact

### Acceptance Criteria
- Page loads in < 2 seconds on 3G connection
- CTA is visible above the fold on all screen sizes
- Responsive layout (mobile, tablet, desktop)

---

## Feature 2: Repo Upload & Analysis

### Description
Users upload a repository (via URL, ZIP, or GitHub integration) and the platform analyzes its structure, dependencies, and code quality metrics.

### Requirements
- Support three input methods: Git URL clone, ZIP upload, GitHub OAuth connect
- Display analysis progress with real-time status updates
- Parse supported languages: TypeScript, JavaScript, Python, Go, Rust, Java
- Extract: file tree, import/export graph, function/class definitions, line counts, cyclomatic complexity
- Store analysis results for re-access (keyed by repo + commit SHA)

### Acceptance Criteria
- Analysis completes in < 60 seconds for repos up to 100k LOC
- Progress bar reflects actual analysis stage (parsing, graphing, scoring)
- Unsupported file types are skipped gracefully with a summary
- Results persist and can be revisited via a unique URL

---

## Feature 3: Architecture Diagram View

### Description
An auto-generated, interactive diagram showing the high-level module structure of the codebase.

### Requirements
- Identify logical modules (directories, packages, namespaces) and their relationships
- Render as an interactive node-graph (zoom, pan, click-to-expand)
- Color-code nodes by type (UI, API, database, utility, test)
- Show edge weights indicating coupling strength (import count)
- Click a module to see its files, exports, and dependencies
- Export as SVG or PNG

### Acceptance Criteria
- Diagram renders in < 3 seconds for repos with up to 200 modules
- Modules with zero external dependencies are visually distinct
- Layout avoids overlapping nodes and minimizes edge crossings
- Export produces a clean, print-ready image

---

## Feature 4: Dependency Graph

### Description
A detailed, navigable graph of file-level and package-level dependencies within the codebase.

### Requirements
- Two views: file-level (internal imports) and package-level (external dependencies)
- Highlight circular dependencies with distinct visual treatment (red edges, warning icon)
- Filter by directory, file type, or dependency depth
- Show dependency direction (arrows) and weight (import count)
- Search for a specific file or package and highlight its dependency chain
- List unused dependencies (imported but never referenced)

### Acceptance Criteria
- Circular dependencies are identified with 100% accuracy for supported languages
- Filtering updates the graph in < 500ms
- Search highlights the full dependency chain (upstream and downstream)
- Unused dependencies list matches output of standard lint tools

---

## Feature 5: Complexity Heatmap

### Description
A treemap-style heatmap that visualizes code complexity across the entire repository, making hotspots immediately visible.

### Requirements
- Treemap layout where rectangle size = lines of code, color intensity = cyclomatic complexity
- Support drill-down: repo -> directory -> file -> function
- Tooltip on hover showing: file path, LOC, complexity score, last modified date
- Threshold indicators: green (low), yellow (moderate), red (high complexity)
- Sort/filter by complexity score, file size, or last modified
- Compare two snapshots (e.g., two branches or commits) to see complexity changes

### Acceptance Criteria
- Heatmap renders in < 2 seconds for repos up to 100k LOC
- Drill-down animation is smooth (< 300ms transition)
- Color thresholds are configurable by the user
- Comparison mode clearly highlights files that increased/decreased in complexity

---

## Feature 6: Tech Debt Scorecard

### Description
A quantified summary of technical debt across the codebase, with per-module scores and actionable recommendations.

### Requirements
- Overall debt score (0--100, where 0 = no debt, 100 = critical)
- Per-module breakdown showing individual debt contributions
- Debt categories: complexity, duplication, dependency health, test coverage gaps, outdated dependencies
- Each category shows specific findings with file paths and line numbers
- Trend chart showing debt score over time (requires multiple analysis runs)
- Export as PDF or JSON report

### Acceptance Criteria
- Debt score is deterministic (same repo + commit = same score)
- Per-module scores sum to the overall score (additive model)
- Each finding links to the specific file and line
- PDF export includes all charts and findings in a printable format
- Trend chart updates automatically when a new analysis is run

---

## Non-Functional Requirements

- **Performance**: All visualizations render in < 3 seconds for repos up to 100k LOC
- **Security**: Uploaded code is processed in isolated sandboxes; never stored permanently without user consent
- **Accessibility**: All interactive elements are keyboard-navigable; color is not the sole indicator of meaning
- **Browser Support**: Latest 2 versions of Chrome, Firefox, Safari, Edge
