---
description: Visual regression testing and screenshot comparison using Playwright
agent: testing/visual-regression
subtask: true
---

Specialized agent for visual regression testing using Playwright screenshot comparison. Captures baseline screenshots, compares images with configurable thresholds, and generates detailed diff reports to prevent visual bugs from reaching production.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

!`ls -la test/visual/ test/screenshots/ playwright.config.js 2>/dev/null`
!`find test -name "*visual*" -o -name "*screenshot*" 2>/dev/null | head -20`
!`cat playwright.config.js 2>/dev/null | head -30`

## Overview

Visual regression testing catches unintended UI changes by comparing screenshots against approved baselines. Prevents layout shifts, broken styles, color regressions, and responsive design issues. Integrates with Playwright, Chromatic, and Percy for comprehensive visual testing.

## Usage Examples

### 1. Capture Baseline Screenshots

Create comprehensive baseline screenshots with consistent settings:

```bash
@visual-regress "Set up visual regression baselines for ChronoDrip:
- Pages: Homepage, Dashboard, Notifications, Settings
- Components: Buttons (all variants), Forms, Modals, Navigation
- Breakpoints: Mobile (375×667), Tablet (768×1024), Desktop (1280×720)
- Browsers: Chrome, Firefox, Safari

Configure:
- Disable animations (animations: 'disabled')
- Wait for fonts (fonts: 'ready')
- Mask dynamic content (timestamps, avatars)
- Comparison threshold: 0.2 standard
- Store baselines in test/visual/baselines/"
```

**What you'll get**:
- Playwright config with consistent screenshot settings
- Baseline tests for all specified pages/components
- Responsive tests across 3 breakpoints
- Dynamic content masking implemented
- Baselines generated and committed
- Baseline coverage documentation

### 2. Configure Image Comparison

Set up pixelmatch comparison with appropriate thresholds:

```bash
@visual-regress "Configure comparison thresholds for different content:
- Text-heavy pages (login, forms): Strict (threshold 0.1, maxDiffPixels 50)
- Mixed content (dashboard): Standard (threshold 0.2, maxDiffPixels 100)
- Image-heavy (gallery): Relaxed (threshold 0.3, maxDiffPixels 200)

Create comparison presets:
- ComparisonPresets.strict
- ComparisonPresets.standard
- ComparisonPresets.relaxed
- ComparisonPresets.customButton

Document threshold rationale and when to use each"
```

**What you'll get**:
- Comparison config file with presets
- Threshold guidelines documented
- maxDiffPixels calculator based on image size
- Examples showing each preset in use
- False positive mitigation strategies
- Diff reporting configuration

### 3. Test Responsive Design

Capture screenshots across multiple breakpoints:

```bash
@visual-regress "Test responsive design for navigation component:
- Mobile (375×667): Hamburger menu collapsed/expanded
- Mobile landscape (667×375): Horizontal menu
- Tablet (768×1024): Condensed navigation
- Desktop (1280×720): Full navigation with dropdowns
- Wide desktop (1920×1080): Max width navigation

For each breakpoint:
- Capture default state
- Capture hover states
- Capture active/focused states
- Mask dynamic elements (user avatar, notifications count)"
```

**What you'll get**:
- Responsive test suite covering 5 breakpoints
- Navigation states tested (default, hover, active)
- Dynamic content masked
- Baseline screenshots organized by breakpoint
- Responsive issues identified
- Breakpoint-specific fixes if needed

### 4. Handle Dynamic Content

Implement masking strategies for changing content:

```bash
@visual-regress "Create masking strategy for notifications page:
- Always mask:
  * Timestamps (.notification-timestamp)
  * User avatars (.user-avatar)
  * Random quotes (.random-quote)
  * Loading spinners (.loading-spinner)
  
- Freeze animations:
  * Disable all animations
  * Set transition-duration: 0s
  
- Replace with fixtures:
  * Use static test data instead of API calls
  * Freeze time to specific date

Implement using page.addStyleTag() before screenshots"
```

**What you'll get**:
- Masking helper functions
- CSS injection for hiding dynamic elements
- Test data fixtures
- Animation freezing configuration
- Before/after comparison showing stable screenshots
- Masking strategy documentation

### 5. Integrate Cloud Visual Testing

Set up Chromatic or Percy for collaborative review:

```bash
@visual-regress "Integrate Chromatic for cloud-based visual testing:
1. Install and configure Chromatic
2. Create Storybook stories for components
3. Set up GitHub Actions CI/CD integration
4. Configure auto-approval for main branch
5. Document review workflow for design team

Provide:
- Chromatic config with project token
- Example stories for Button component
- CI/CD workflow YAML
- Collaborative review workflow docs
- Cost estimation at 40 features/month"
```

**What you'll get**:
- Chromatic configured with project token
- Storybook stories created for components
- GitHub Actions workflow for visual tests
- PR integration (visual changes as comment)
- Design team review workflow documented
- Cost analysis (per-snapshot pricing)
- Alternative: Percy integration guide

### 6. Optimize Test Performance

Improve visual test execution speed:

```bash
@visual-regress "Optimize visual test performance:
Current: 120 tests in 25 minutes (unoptimized)
Target: <10 minutes

Implement:
- Parallel execution (4 workers)
- Smart baseline selection (only test changed components)
- Browser context reuse across tests
- Baseline caching in CI
- Element screenshots instead of full page where possible

Measure improvements and document optimization techniques"
```

**What you'll get**:
- Parallel execution configured (4 workers)
- Smart baseline selection implemented
- Shared browser context pattern
- CI cache configuration for baselines
- Element screenshot optimization
- Performance dashboard (before: 25min, after: 8min)
- Optimization techniques documented

### 7. Debug Visual Regressions

Analyze and fix screenshot comparison failures:

```bash
@visual-regress "Debug failing visual test: button-primary.png
Failure: 150 pixels different (threshold: 100)

Investigate:
1. Generate detailed diff report
2. Identify what changed (layout, color, font)
3. Determine if intentional or bug
4. If intentional: update baseline with approval
5. If bug: identify root cause and fix
6. Document in knowledge graph

Provide diff images: expected, actual, diff (highlighted)"
```

**What you'll get**:
- Diff report with pixel count and percentage
- Three images: expected, actual, diff
- Root cause analysis (CSS change, font loading, etc.)
- Fix recommendation or baseline update
- Approval workflow if intentional change
- Troubleshooting guide for common issues
- Neo4j knowledge graph updated

### 8. Create Comprehensive Test Suite

Build complete visual regression coverage:

```bash
@visual-regress "Create comprehensive visual test suite:

Pages (full page + above fold):
- Homepage, Login, Dashboard, Settings, 404

Components (all states):
- Buttons (default, hover, focus, disabled)
- Forms (empty, filled, error states)
- Modals (open, closed, with long content)
- Alerts (success, warning, error, info)
- Cards (default, loading, error)

Cross-browser:
- Chrome (baseline)
- Firefox (separate baselines)
- Safari (if available)

Organize as:
- test/visual/pages/*.spec.js
- test/visual/components/*.spec.js
- test/visual/responsive/*.spec.js"
```

**What you'll get**:
- Organized test structure
- Page tests with full scroll + viewport
- Component tests with all states
- Responsive tests across breakpoints
- Cross-browser test configuration
- Test coverage report
- Missing coverage identified
- Best practices guide

## What You'll Get

### Playwright Configuration

```javascript
// playwright.config.js
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',
      fonts: 'ready',
    },
  },
  projects: [
    { name: 'Desktop Chrome', viewport: { width: 1280, height: 720 } },
    { name: 'Mobile Safari', viewport: { width: 390, height: 844 } },
    { name: 'Tablet', viewport: { width: 768, height: 1024 } },
  ],
});
```

### Baseline Test Example

```javascript
test('homepage above fold', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Mask dynamic content
  await page.addStyleTag({
    content: `
      [data-testid="current-time"] { visibility: hidden; }
      .user-avatar { background: #ccc; }
    `
  });
  
  await expect(page).toHaveScreenshot('homepage-above-fold.png');
});
```

### Comparison Presets

```javascript
export const ComparisonPresets = {
  strict: { threshold: 0.1, maxDiffPixels: 50 },
  standard: { threshold: 0.2, maxDiffPixels: 100 },
  relaxed: { threshold: 0.3, maxDiffPixels: 200 },
};
```

### Masking Strategy

```markdown
## Always Mask
- Timestamps: `[data-testid="current-time"]`
- Avatars: `.user-avatar`
- Random content: `.random-quote`
- Animations: `* { animation-duration: 0s !important; }`

## Method
```javascript
await page.addStyleTag({
  content: '.dynamic { visibility: hidden !important; }'
});
```
```

### Diff Report

```
Screenshot: button-primary.png
Diff pixels: 150 (0.75% of total)
Threshold: 100 pixels (exceeded)

Images generated:
- button-primary-expected.png (baseline)
- button-primary-actual.png (current)
- button-primary-diff.png (differences highlighted in red)

Root cause: Button padding changed from 8px to 12px
Action: Intentional design change - update baseline
```

## Reference

- Baseline capture best practices
- Threshold tuning guidelines
- Dynamic content masking techniques
- Chromatic/Percy integration patterns
- Performance optimization strategies
- Troubleshooting common issues

## Integration with Other Agents

- **@elixir-wallaby-specialist**: E2E tests that trigger visual tests
- **@playwright-automation**: Advanced Playwright features
- **@frontend-design**: Design changes requiring baseline updates
- **@tool-evaluator**: Evaluating Percy vs Chromatic

## Core Principles

### Consistent Baselines
- ALWAYS disable animations
- ALWAYS wait for fonts to load
- ALWAYS mask dynamic content
- Use stable test data (fixtures)
- Test at defined breakpoints only

### Appropriate Thresholds
- Text-heavy: 0.1 threshold (strict)
- Mixed content: 0.2 threshold (standard)
- Images/charts: 0.3-0.5 threshold (relaxed)
- Document threshold rationale
- Adjust based on false positive rate

### Collaborative Review
- Visual changes require design approval
- Use Chromatic/Percy for team review
- Block PRs until visual changes approved
- Celebrate intentional improvements
- Learn from unintended regressions

## Modern System Standards

### Next.js 15+ (App Router)
- **Architecture**: App Router with Server Components as default. Use `use client` sparingly.
- **Mutations**: Server Actions with Zod validation.
- **Performance**: Optimize for INP (Interaction to Next Paint) and leverage Next.js Data Cache.

### Elixir 2025 (Phoenix/Ash)
- **Architecture**: Phoenix 1.7+ with LiveView 1.1 (Streaming). Ash 3.0 for domain logic.
- **Testing**: ExUnit with StreamData for property-based testing.

### Rust 2024 (Tokio/Axum)
- **Architecture**: Axum with safe concurrency actors and JoinSet for task management.
- **Data Layer**: Compile-time checked SQLx queries.
