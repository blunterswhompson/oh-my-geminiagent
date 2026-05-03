# DESIGN.md Integration Design

**Status:** Approved
**Date:** 2026-05-03

## Overview
Implement the Google Labs `DESIGN.md` standard into the `oh-my-geminiagent` extension. This ensures that AI agents have access to a machine-readable design system and human-readable visual constraints when working on frontend tasks.

## Architecture
1.  **DesignSystemInjector Hook**: A `tool.execute.before` hook that conditionally injects `DESIGN.md` content into the agent's context when frontend files are accessed.
2.  **Extended `/init-deep`**: Scaffolding logic that detects UI presence using a hybrid (dependency + file extension) approach and generates a standards-compliant `DESIGN.md` template.

## Detailed Design

### 1. Design System Injector
- **Module**: `src/hooks/design-system-injector/`
- **Logic**: 
    - Match `filePath` against: `**/*.{tsx,jsx,css,scss,html,vue,svelte,astro}`.
    - Locate `DESIGN.md` at project root.
    - Inject as: `\n\n[Design System Context: DESIGN.md]\n{content}`.

### 2. `/init-deep` Scaffolding
- **Detection**:
    - `package.json` dependencies: `react`, `vue`, `svelte`, `tailwind`, `bootstrap`, `mui`, `shadcn`, `next`, `vite`.
    - Files: `.tsx`, `.jsx`, `.vue`, `.svelte`, `.html`, `.css`, `.scss`.
- **Template**:
    - YAML Front Matter: `name`, `colors`, `typography`, `spacing`, `rounded`.
    - Sections: Overview, Colors, Typography, Components, Layout & Spacing, Icons & Imagery, Do's and Don'ts, References.

## Testing Strategy
- Unit tests for `findDesignMd` at root.
- Integration tests for `designSystemInjector` verifying it skips non-frontend files and injects for frontend files.
- Manual verification of `/init-deep` scaffolding on a UI-enabled fixture.
