---
description: WCAG 2.2 Level AA accessibility compliance testing with axe-core/playwright
agent: testing/playwrite-accessibility-auditor
subtask: true
---

# Playwright Accessibility Auditor Command

Comprehensive WCAG 2.2 Level AA accessibility testing using @axe-core/playwright. Automated scanning, keyboard navigation testing, color contrast validation, ARIA auditing, and detailed violation reporting with remediation guidance.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

```bash
!`grep '@axe-core/playwright' package.json || echo 'axe-core not installed'`
!`cat playwright.config.js | grep -A 5 'use:' || echo 'No config'`
!`ls -la tests/accessibility/ 2>/dev/null || echo 'No a11y tests'`
!`ls -la a11y-reports/ 2>/dev/null || echo 'No reports'`
```

## What This Command Does

The Playwright Accessibility Auditor provides:
- **Automated Scanning**: Run axe-core scans across all pages with WCAG 2.2 AA tags
- **Keyboard Navigation**: Test tab order, focus indicators, focus management
- **Color Contrast**: Validate 4.5:1 (normal) and 3:1 (large text) ratios
- **ARIA Validation**: Check roles, attributes, states, and semantic HTML
- **Detailed Reports**: Violations organized by severity with specific remediation steps
- **Focus Management**: Test modal focus traps, skip links, SPA navigation

## When to Use This Command

✅ **Use Accessibility Auditor For**:
- Running comprehensive WCAG 2.2 AA accessibility scans
- Testing keyboard navigation and focus management
- Validating color contrast ratios
- Auditing ARIA attributes and semantic HTML
- Generating accessibility violation reports with fixes
- Testing dynamic content states (modals, menus, forms)

❌ **Don't Use For**:
- General browser automation (use `playwright-help`)
- Performance testing
- Visual regression testing

## Usage Examples

### Example 1: Initial Accessibility Audit
```bash
playwright-a11y "Run comprehensive WCAG 2.2 AA audit on all main pages (home, products, contact)"
```

**What you'll get**:
1. **Test Setup**:
   ```javascript
   const AxeBuilder = require('@axe-core/playwright').default;
   
   const pages = [
     { name: 'Home', url: '/' },
     { name: 'Products', url: '/products' },
     { name: 'Contact', url: '/contact' }
   ];
   
   for (const pageInfo of pages) {
     test(`${pageInfo.name} accessibility`, async ({ page }) => {
       await page.goto(pageInfo.url);
       
       const results = await new AxeBuilder({ page })
         .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
         .analyze();
       
       expect(results.violations).toEqual([]);
     });
   }
   ```

2. **Violations Report**:
   ```markdown
   ## Accessibility Audit Results
   
   ### Summary
   - Total Violations: 12
   - Critical: 3
   - Serious: 5
   - Moderate: 3
   - Minor: 1
   
   ### Critical Violations
   
   #### 1. Missing Alt Text on Images (3 instances)
   **WCAG**: 1.1.1 Non-text Content (Level A)
   **Impact**: Critical - Screen readers cannot describe images
   **Elements**:
   ```html
   <img src="/logo.png">
   <img src="/product-1.jpg">
   ```
   **Fix**:
   ```html
   <img src="/logo.png" alt="Company Name">
   <img src="/product-1.jpg" alt="Product Name - description">
   ```
   ```

3. **Remediation Roadmap**: Prioritized list of fixes
4. **Test Files**: Complete accessibility test suite

**Timeline**: 2 hours for audit + report

### Example 2: Test Keyboard Navigation
```bash
playwright-a11y "Test keyboard navigation on our dashboard - verify tab order, focus indicators, and skip links"
```

**What you'll get**:
- **Tab Order Test**:
  ```javascript
  test('tab order is logical', async ({ page }) => {
    await page.goto('/dashboard');
    
    const tabOrder = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => ({
        tag: document.activeElement.tagName,
        text: document.activeElement.textContent?.trim().substring(0, 30),
        role: document.activeElement.getAttribute('role')
      }));
      tabOrder.push(focused);
    }
    
    // Verify skip link is first
    expect(tabOrder[0].text).toContain('Skip to main content');
  });
  ```

- **Focus Indicator Test**:
  ```javascript
  test('focus indicators visible', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    
    const focusStyles = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.activeElement);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow
      };
    });
    
    // Verify focus indicator exists
    const hasFocusIndicator = 
      focusStyles.outline !== 'none' || 
      focusStyles.boxShadow !== 'none';
    
    expect(hasFocusIndicator).toBeTruthy();
  });
  ```

- **Analysis**: Tab order diagram, focus indicator contrast check
- **Recommendations**: Specific fixes for any issues found

**Timeline**: 1-2 hours

### Example 3: Test Modal Accessibility
```bash
playwright-a11y "Test our settings modal for accessibility - focus trap, ARIA attributes, keyboard close"
```

**What you'll get**:
- **Focus Trap Test**:
  ```javascript
  test('modal traps focus correctly', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    // Verify focus in modal
    const inModal = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog.contains(document.activeElement);
    });
    expect(inModal).toBeTruthy();
    
    // Tab through and verify stays in modal
    const elementsCount = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog.querySelectorAll('button, [href], input, select').length;
    });
    
    for (let i = 0; i < elementsCount + 1; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Still in modal after cycling
    const stillInModal = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog.contains(document.activeElement);
    });
    expect(stillInModal).toBeTruthy();
    
    // Close with Escape
    await page.keyboard.press('Escape');
    
    // Focus returned to trigger
    const focusedText = await page.evaluate(() => 
      document.activeElement.textContent.trim()
    );
    expect(focusedText).toContain('Settings');
  });
  ```

- **ARIA Scan**:
  ```javascript
  const results = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withRules(['aria-allowed-attr', 'aria-required-attr'])
    .analyze();
  ```

- **Report**: Focus management analysis, ARIA compliance, recommendations

**Timeline**: 1-2 hours

### Example 4: Color Contrast Audit
```bash
playwright-a11y "Check all text on our site meets WCAG AA color contrast requirements"
```

**What you'll get**:
- **Contrast Scan**:
  ```javascript
  test('color contrast meets WCAG AA', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .withTags(['wcag2aa'])
      .analyze();
    
    if (results.violations.length > 0) {
      results.violations.forEach(v => {
        console.log(`\nContrast Violation: ${v.description}`);
        v.nodes.forEach(node => {
          console.log(`  Element: ${node.html}`);
          console.log(`  Fix: ${node.failureSummary}`);
        });
      });
    }
    
    expect(results.violations).toEqual([]);
  });
  ```

- **Dark Mode Test**: Same scan with dark mode enabled
- **Contrast Report**:
  ```markdown
  ## Color Contrast Violations
  
  ### Violation 1: Insufficient Contrast
  - **Element**: `.btn-secondary { color: #999; background: #fff; }`
  - **Current Ratio**: 2.8:1
  - **Required**: 4.5:1 (normal text)
  - **Fix**: Change color to #767676 (4.54:1) or darker
  ```

**Timeline**: 1 hour

### Example 5: Form Accessibility Audit
```bash
playwright-a11y "Test our contact form for accessibility - labels, error messages, and validation"
```

**What you'll get**:
- **Label Association Test**:
  ```javascript
  test('form inputs properly labeled', async ({ page }) => {
    await page.goto('/contact');
    
    const results = await new AxeBuilder({ page })
      .withRules(['label', 'label-title-only'])
      .analyze();
    
    expect(results.violations).toEqual([]);
    
    // Verify programmatic associations
    const labelAssociations = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select');
      return Array.from(inputs).map(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        const ariaLabel = input.getAttribute('aria-label');
        
        return {
          id: input.id,
          hasLabel: !!label,
          hasAriaLabel: !!ariaLabel,
          hasAccessibleName: !!(label || ariaLabel)
        };
      });
    });
    
    labelAssociations.forEach(input => {
      expect(input.hasAccessibleName).toBeTruthy();
    });
  });
  ```

- **Error State Test**:
  ```javascript
  test('form error messages accessible', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Scan form with errors
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    
    // Verify aria-describedby connects errors to inputs
    const emailError = await page.evaluate(() => {
      const input = document.querySelector('#email');
      const errorId = input.getAttribute('aria-describedby');
      const error = document.getElementById(errorId);
      return {
        hasAriaDescribedBy: !!errorId,
        errorText: error?.textContent.trim()
      };
    });
    
    expect(emailError.hasAriaDescribedBy).toBeTruthy();
    expect(emailError.errorText).toContain('required');
  });
  ```

**Timeline**: 1-2 hours

### Example 6: Generate Comprehensive Report
```bash
playwright-a11y "Generate a full accessibility report with all violations, severity levels, and remediation steps"
```

**What you'll get**:
- **HTML Report** (`a11y-reports/report.html`):
  - Executive summary with metrics
  - Violations by severity (Critical, Serious, Moderate, Minor)
  - HTML snippets for each violation
  - Specific remediation steps with code examples
  - W3C WCAG documentation links
- **JSON Report** (`a11y-reports/report.json`): Detailed data
- **Metrics Dashboard**:
  ```markdown
  ## Accessibility Health Score: 78/100
  
  **Violations by Severity**:
  - Critical: 3
  - Serious: 5
  - Moderate: 3
  - Minor: 1
  
  **Pages Scanned**: 5
  **Total Rules Checked**: 87
  **Pass Rate**: 89.7%
  ```

**Timeline**: 30 minutes (after audits complete)

### Example 7: Test SPA Navigation
```bash
playwright-a11y "Test our single-page app for focus management during page transitions"
```

**What you'll get**:
- **Navigation Test**:
  ```javascript
  test('focus managed during SPA navigation', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Products' }).click();
    await page.waitForURL('/products');
    
    // Verify focus moved (not lost)
    const focused = await page.evaluate(() => ({
      tag: document.activeElement.tagName,
      role: document.activeElement.getAttribute('role')
    }));
    
    // Focus should be on main content or heading
    expect(['MAIN', 'H1', 'H2']).toContain(focused.tag);
  });
  ```

- **Recommendations**: Focus management strategies for SPAs

**Timeline**: 1 hour

### Example 8: Continuous Accessibility Monitoring
```bash
playwright-a11y "Set up accessibility tests to run in CI on every PR"
```

**What you'll get**:
- **GitHub Actions Workflow**:
  ```yaml
  name: Accessibility Tests
  on: [pull_request]
  
  jobs:
    a11y:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm ci
        - run: npx playwright install --with-deps
        - run: npx playwright test tests/accessibility/
        - uses: actions/upload-artifact@v3
          if: failure()
          with:
            name: a11y-report
            path: a11y-reports/
  ```

- **Baseline Configuration**: Set acceptable violation counts
- **Regression Detection**: Fail PR if new violations introduced

**Timeline**: 1 hour

## What You'll Get

Every response includes:

### 1. **Test Implementation**
   - Complete test files with axe-core integration
   - WCAG 2.2 AA tag configuration
   - Keyboard navigation tests
   - Color contrast validation
   - ARIA and semantic HTML audits

### 2. **Violation Reports**
   - Organized by severity (Critical → Minor)
   - Grouped by WCAG success criteria
   - HTML snippets for context
   - Specific remediation steps with code
   - W3C documentation references

### 3. **Remediation Guidance**
   - Prioritized fix list
   - Code examples for each violation
   - Before/after comparisons
   - Accessibility pattern recommendations

### 4. **Testing Strategies**
   - Automated scanning approach
   - Manual testing checklists
   - Screen reader testing guidance
   - Cross-browser compatibility notes

## Related Commands

- `/playwright-help` - Playwright CLI, Codegen, debugging, utilities
- `/test-analyze` - Analyze test results and trends
- `/qa-engineer` - Comprehensive test strategy
- `/code-review` - Review accessibility implementation

## Key Capabilities

This command leverages the playwright-accessibility-auditor agent:

- **WCAG 2.2 AA Expertise**: Complete understanding of latest standard
- **axe-core Integration**: Configure and execute comprehensive scans
- **Keyboard Testing**: Tab order, focus indicators, focus management
- **Color Contrast**: Validate ratios, provide specific color fixes
- **ARIA Auditing**: Roles, attributes, states, semantic HTML
- **Detailed Reporting**: Severity-based organization with remediation
- **Pattern Recognition**: Common accessibility anti-patterns
- **CI Integration**: Automated accessibility regression testing

## Tips for Best Results

1. **Start Early**: Test accessibility during development, not after
2. **Test All States**: Scan modals, menus, forms, error states
3. **Complement Automated**: Manual keyboard and screen reader testing required
4. **Prioritize Critical**: Fix critical and serious violations first
5. **Test Across Themes**: Dark mode, high contrast, etc.
6. **Involve Users**: Get feedback from users with disabilities

## Technical Details

**Powered by:** `.opencode/agent/testing/playwrite-accessibility-auditor.md`  
**MCP Servers:** context7 (WCAG/axe docs), neo4j (pattern storage), sequential-thinking (analysis), playwright (browser automation)  
**Knowledge Graph:** Stores WCAG criteria, violation patterns, remediation strategies

---

**Note:** Automated tools catch ~30-40% of accessibility issues. Always complement with manual keyboard navigation and screen reader testing for comprehensive coverage.

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
