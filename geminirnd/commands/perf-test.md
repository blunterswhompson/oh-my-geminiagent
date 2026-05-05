---
description: Core Web Vitals measurement and performance budget enforcement with Playwright
agent: testing/performance-tester
subtask: true
---

Measure Core Web Vitals, run Lighthouse audits, enforce performance budgets, and detect regressions for comprehensive frontend performance validation.

$ARGUMENTS

!`ls -la test/performance/ 2>/dev/null | head -10 || echo "No performance tests"`
!`cat performance-budgets.json 2>/dev/null || echo "No budgets defined"`

## What This Command Does

The Performance Tester provides frontend performance validation:
- **Core Web Vitals**: LCP, FID/INP, CLS, FCP, TTFB measurement
- **Lighthouse Integration**: Comprehensive performance, accessibility, SEO audits
- **Resource Analysis**: Bundle sizes, loading patterns, optimization opportunities
- **Performance Budgets**: Define and enforce thresholds in CI/CD
- **Regression Detection**: Compare metrics vs baseline, fail on degradation
- **Mobile Testing**: Test on mobile devices with CPU/network throttling

## When to Use This Command

✅ **Use Performance Tester For**:
- Measuring Core Web Vitals
- Running Lighthouse audits
- Enforcing performance budgets
- Detecting performance regressions
- Analyzing bundle sizes
- Mobile performance testing

❌ **Don't Use For**:
- Backend profiling (use `perf-benchmark`)
- Database optimization (use `perf-benchmark`)
- E2E user journeys (use `e2e-test`)

## Usage Examples

### Example 1: Measure Core Web Vitals
```bash
perf-test "Measure Core Web Vitals for homepage"
```

**What you'll get**:
```
📊 Core Web Vitals:
  LCP: 2100ms ✅ (budget: <2500ms)
  FID: 85ms ✅ (budget: <100ms)
  CLS: 0.05 ✅ (budget: <0.1)
  FCP: 1500ms ✅ (budget: <1800ms)
  TTFB: 450ms ✅ (budget: <600ms)

All metrics within budget ✅
```

### Example 2: Lighthouse Audit
```bash
perf-test "Run Lighthouse audit with threshold 90"
```

**What you'll get**:
```
🔦 Lighthouse Scores:
  Performance: 95/100 ✅
  Accessibility: 92/100 ✅
  Best Practices: 100/100 ✅
  SEO: 88/100 ⚠️

Top Opportunities:
  - Eliminate render-blocking resources: Save 850ms
  - Properly size images: Save 125KB
  - Reduce unused JavaScript: Save 95KB

Report: lighthouse-reports/homepage-1234567890.html
```

### Example 3: Bundle Size Analysis
```bash
perf-test "Analyze bundle sizes and enforce budgets"
```

**What you'll get**:
```
📦 Bundle Size Analysis:
  app.js: 145KB ✅ (budget: 150KB)
  vendor.js: 195KB ✅ (budget: 200KB)
  styles.css: 42KB ✅ (budget: 100KB)
  
  Total JS: 340KB ✅ (budget: 500KB)
  Total CSS: 42KB ✅ (budget: 100KB)
  
All bundles within budget ✅
```

### Example 4: Regression Detection
```bash
perf-test "Detect performance regressions vs baseline"
```

**What you'll get**:
```
📊 Performance Comparison (vs baseline):

Baseline (main branch):
  LCP: 2100ms | FID: 85ms | CLS: 0.05

Current (feature branch):
  LCP: 2500ms | FID: 92ms | CLS: 0.05

Changes:
  LCP: +19% ❌ REGRESSION (threshold: 10%)
  FID: +8% ✅ Within threshold
  CLS: No change ✅

❌ Performance regression detected - build FAILED
```

### Example 5: Mobile Performance
```bash
perf-test "Test performance on iPhone 13 with 4G throttling"
```

**What you'll get**:
```
📱 Mobile Performance (iPhone 13, 4G):
  LCP: 3200ms ⚠️ (budget: 2500ms for mobile)
  INP: 250ms ✅ (budget: 500ms)
  CLS: 0.08 ✅ (budget: 0.1)
  
  Bundle Impact:
    JS: 450KB (3.2s load on 4G)
    CSS: 85KB (0.6s load on 4G)
    
Recommendations:
  - Code splitting to reduce initial bundle
  - Lazy load below-the-fold images
  - Defer non-critical JavaScript
```

### Example 6: Resource Loading Analysis
```bash
perf-test "Analyze resource loading patterns"
```

**What you'll get**:
```
📦 Resource Analysis:
  Total Resources: 42
  Total Size: 1.2 MB
  
  By Type:
    script: 8 files, 340 KB
    stylesheet: 2 files, 42 KB
    img: 15 files, 680 KB
    font: 3 files, 125 KB
    
  Largest Resources:
    1. hero-image.jpg (img): 245 KB
    2. vendor.js (script): 195 KB
    3. app.js (script): 145 KB
    
  Optimization Opportunities:
    - Convert hero-image.jpg to WebP (save ~150KB)
    - Enable gzip for vendor.js (save ~60KB)
    - Use font-display: swap for custom fonts
```

## What You'll Get

### 1. Core Web Vitals Report
- LCP, FID/INP, CLS, FCP, TTFB measurements
- Budget compliance status
- Industry threshold comparison
- Mobile vs desktop metrics

### 2. Lighthouse Audit Report
- Performance score (/100)
- Accessibility score (/100)
- Best practices score (/100)
- SEO score (/100)
- Detailed recommendations

### 3. Bundle Size Analysis
- JavaScript bundle sizes
- CSS bundle sizes
- Image sizes
- Total page weight
- Budget compliance

### 4. Regression Detection
- Baseline vs current comparison
- Percentage changes
- Threshold violations
- Historical trend data

### 5. Optimization Recommendations
- Prioritized by impact
- Savings estimates (KB or ms)
- Implementation difficulty
- Code examples

## Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | <2.5s | 2.5-4s | >4s |
| **FID** | <100ms | 100-300ms | >300ms |
| **INP** | <200ms | 200-500ms | >500ms |
| **CLS** | <0.1 | 0.1-0.25 | >0.25 |
| **FCP** | <1.8s | 1.8-3s | >3s |
| **TTFB** | <600ms | 600-1000ms | >1000ms |

## Performance Budgets Template

```json
{
  "budgets": {
    "core_web_vitals": {
      "lcp": { "max": 2500, "unit": "ms" },
      "fid": { "max": 100, "unit": "ms" },
      "cls": { "max": 0.1, "unit": "score" },
      "fcp": { "max": 1800, "unit": "ms" },
      "ttfb": { "max": 600, "unit": "ms" }
    },
    "bundle_sizes": {
      "js_total": { "max": 500, "unit": "kb" },
      "css_total": { "max": 100, "unit": "kb" }
    },
    "lighthouse": {
      "performance": { "min": 90, "unit": "score" }
    }
  }
}
```

## CI/CD Integration

```yaml
# .github/workflows/performance.yml
name: Performance Testing

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run start &
      - run: npx playwright test test/performance/
      - uses: actions/upload-artifact@v3
        with:
          name: lighthouse-reports
          path: lighthouse-reports/
```

## Common Optimizations

**For LCP**:
- Optimize largest image (WebP, lazy load)
- Remove render-blocking resources
- Use CDN for static assets
- Implement code splitting

**For FID/INP**:
- Reduce JavaScript execution time
- Break up long tasks (>50ms)
- Use web workers for heavy computation
- Defer non-critical JavaScript

**For CLS**:
- Add explicit dimensions to images
- Reserve space for dynamic content
- Use font-display: swap
- Avoid inserting content above existing content

**For Bundle Size**:
- Code splitting with dynamic imports
- Tree shaking to remove unused code
- Minification and compression (gzip/brotli)
- Lazy load below-the-fold content

## Related Commands

- `/perf-benchmark` - Backend profiling and database optimization
- `/e2e-test` - End-to-end user journey testing
- `/qa-engineer` - Unit and integration testing

## Reference

Web Vitals: https://web.dev/vitals/
Lighthouse: https://developers.google.com/web/tools/lighthouse

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
