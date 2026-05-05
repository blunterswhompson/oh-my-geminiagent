---
description: Comprehensive WCAG 2.2 AA accessibility auditing with axe-core, screen reader testing, and remediation guidance
agent: testing/accessibility_auditor
subtask: true
---

# Accessibility Audit Command

Perform comprehensive WCAG 2.2 Level AA accessibility audits with automated testing (axe-core), manual validation (NVDA/VoiceOver), keyboard navigation testing, color contrast verification, and detailed remediation guidance.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather relevant context about your application:

**Current Accessibility Setup:**
```bash
!`grep -r 'axe\|aria\|wcag' package.json mix.exs 2>/dev/null | head -10`
!`find assets test -name '*a11y*' -o -name '*accessibility*' 2>/dev/null | head -10`
!`grep -r 'aria-\|role=' lib/*/templates lib/*_web/live 2>/dev/null | head -20`
```

**Application Structure:**
```bash
!`find lib/*_web -name '*.html.heex' -o -name '*.ex' | grep -i 'live\|component' | head -20`
!`ls -la assets/css assets/js 2>/dev/null`
```

**Localhost Availability:**
```bash
!`curl -s -o /dev/null -w "%{http_code}" http://localhost:4000 || echo "Server not running"`
```

## Usage Examples

### 1. Complete WCAG 2.2 AA Audit

**When to use:**
- Preparing for launch or major release
- Legal compliance requirements
- Quarterly accessibility reviews
- Baseline assessment for new features

**Example:**
```bash
/accessibility-audit Perform comprehensive WCAG 2.2 Level AA audit of entire application. Include:
- Automated axe-core testing for all major pages
- Manual NVDA screen reader testing
- Keyboard navigation validation
- Color contrast verification
- Generate detailed compliance report with remediation roadmap
```

**What you'll get:**
- **Accessibility Audit Report** (markdown format):
  ```markdown
  # Accessibility Audit Report
  **Overall Compliance**: 87.3% (65/75 WCAG 2.2 AA criteria)
  **Issues Found**: 23 (2 critical, 5 serious, 8 moderate, 8 minor)
  
  ## Critical Issues
  1. Form inputs missing labels (WCAG 3.3.2) - 5 instances
  2. Keyboard trap in modal dialog (WCAG 2.1.2) - 1 instance
  
  ## Remediation Roadmap
  Phase 1 (1 week): Fix critical issues - 5 hours
  Phase 2 (1 week): Fix serious issues - 6 hours
  Phase 3 (1 week): Fix moderate/minor - 5 hours
  Total: 16 hours over 3 weeks
  ```

- **WCAG 2.2 Compliance Matrix** (all 75+ criteria mapped)
- **axe-core Test Suite** (Playwright integration)
- **Remediation Code Examples** (before/after fixes)
- **Neo4j Pattern Storage** (reusable accessibility patterns)

**Timeline**: 1-2 days

### 2. Fix Specific Accessibility Issue

**When to use:**
- Addressing reported accessibility bug
- Fixing specific WCAG violation
- Remediating compliance issue

**Example:**
```bash
/accessibility-audit Fix keyboard trap in product modal. Issue:
- User opens modal with Enter key
- Tab navigation loops within modal (correct)
- Escape key does NOT close modal (bug)
- Focus not restored to trigger button when closed
- Need focus trap implementation and Escape handler
```

**What you'll get:**
- **Root Cause Analysis**:
  ```
  Issue: Missing Escape key handler and focus restoration
  WCAG Violation: 2.1.2 No Keyboard Trap (Level A)
  Impact: Keyboard users must reload page to exit modal
  ```

- **Remediation Code**:
  ```elixir
  # After: Focus trap with Escape key using Phoenix.LiveView.JS
  def modal(assigns) do
    ~H"""
    <div id="modal" class="relative z-50" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div 
          class="flex min-h-full items-end justify-center p-4"
          phx-window-keydown={JS.exec("data-cancel", to: "#modal-content")}
          phx-key="escape"
        >
          <div 
            id="modal-content"
            data-cancel={JS.push("close_modal") |> JS.hide(to: "#modal")}
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
          >
            <%= render_slot(@inner_block) %>
          </div>
        </div>
      </div>
    </div>
    """
  end
  ```

- **Validation Test**:
  ```elixir
  test "modal closes with Escape key", %{conn: conn} do
    {:ok, view, _html} = live(conn, ~p"/products")
    
    view |> element("button", "Open Modal") |> render_click()
    assert has_element?(view, "#modal")
    
    view |> element("#modal-content") |> render_keydown(%{key: "Escape"})
    refute has_element?(view, "#modal")
  end
  ```

**Timeline**: 2-3 hours

### 3. Automated axe-core Test Integration

**When to use:**
- Setting up CI/CD accessibility testing
- Adding accessibility to test suite
- Preventing regressions

**Example:**
```bash
/accessibility-audit Set up automated axe-core testing with Playwright for:
- Product listing page
- Product detail page
- Shopping cart
- Checkout flow
- Configure to fail CI on critical violations
- Generate HTML reports on failures
```

**What you'll get:**
- **Playwright + axe-core Tests**:
  ```javascript
  // test/accessibility/product_pages.spec.js
  import { test, expect } from '@playwright/test'
  import AxeBuilder from '@axe-core/playwright'
  
  test.describe('Product Pages Accessibility', () => {
    test('product listing has no violations', async ({ page }) => {
      await page.goto('http://localhost:4000/products')
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze()
      
      expect(results.violations).toEqual([])
    })
    
    test('product detail has no violations', async ({ page }) => {
      await page.goto('http://localhost:4000/products/123')
      
      const results = await new AxeBuilder({ page }).analyze()
      
      if (results.violations.length > 0) {
        console.log('Violations:', JSON.stringify(results.violations, null, 2))
      }
      
      expect(results.violations).toEqual([])
    })
  })
  ```

- **GitHub Actions Workflow**:
  ```yaml
  # .github/workflows/accessibility.yml
  name: Accessibility Tests
  
  on: [push, pull_request]
  
  jobs:
    a11y:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        
        - name: Install dependencies
          run: npm install
        
        - name: Run accessibility tests
          run: npm run test:a11y
        
        - name: Upload reports
          if: failure()
          uses: actions/upload-artifact@v3
          with:
            name: accessibility-reports
            path: test/reports/accessibility/
  ```

- **npm Script Configuration**:
  ```json
  {
    "scripts": {
      "test:a11y": "playwright test test/accessibility",
      "test:a11y:report": "playwright test test/accessibility --reporter=html"
    }
  }
  ```

**Timeline**: 4 hours

### 4. Color Contrast Validation

**When to use:**
- New design implementation
- Brand color updates
- Reported low vision issues

**Example:**
```bash
/accessibility-audit Audit all color combinations for WCAG AA contrast compliance:
- Primary buttons (blue background, white text)
- Secondary buttons (gray background, dark text)  
- Text links (blue text on white)
- Error messages (red text/background)
- Success messages (green text/background)
- Disabled states
- Generate contrast report with pass/fail and remediation suggestions
```

**What you'll get:**
- **Color Contrast Report**:
  ```markdown
  ## Color Contrast Audit Results
  
  ### Primary Button
  - Background: #5DADE2
  - Text: #FFFFFF
  - Contrast: 2.9:1 ❌ FAIL (requires 4.5:1)
  - Recommendation: Use #0066CC (4.54:1) ✅
  
  ### Text Links
  - Color: #007BFF
  - Background: #FFFFFF  
  - Contrast: 4.5:1 ✅ PASS
  
  ### Error Messages
  - Background: #FFEBEE
  - Text: #C62828
  - Contrast: 6.2:1 ✅ PASS (exceeds 4.5:1)
  ```

- **CSS Fixes**:
  ```css
  /* Before (FAIL) */
  .btn-primary {
    background: #5DADE2; /* 2.9:1 */
    color: #ffffff;
  }
  
  /* After (PASS) */
  .btn-primary {
    background: #0066CC; /* 4.54:1 */
    color: #ffffff;
  }
  ```

- **Automated Contrast Test**:
  ```javascript
  test('all buttons meet contrast requirements', async ({ page }) => {
    await page.goto('http://localhost:4000')
    
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()
    
    expect(results.violations).toEqual([])
  })
  ```

**Timeline**: 2 hours

### 5. Screen Reader Testing Report

**When to use:**
- Verifying screen reader compatibility
- Testing dynamic content announcements
- Validating ARIA implementation

**Example:**
```bash
/accessibility-audit Test product checkout flow with NVDA screen reader. Validate:
- Form labels announce correctly
- Error messages are announced when validation fails
- Success message announced after order submission
- Dynamic cart updates announced
- Progress indicator states announced
- Document testing procedure for future reference
```

**What you'll get:**
- **NVDA Testing Report**:
  ```markdown
  ## Screen Reader Test Results - NVDA 2023.3 + Firefox
  
  ### Product Checkout Form
  
  **Email Field**:
  - Focus: "Email, edit, blank" ✅ (label announced)
  - Invalid: "Email, invalid entry, edit" ✅ (error state)
  - Error message: "Invalid email format" ✅ (aria-describedby)
  
  **Payment Information**:
  - Fieldset: "Payment Information, grouping" ✅
  - Card number: "Credit card number, edit, blank" ✅
  - CVV: "CVV, edit, required, blank" ✅
  
  **Dynamic Updates**:
  - Add to cart: "Product added to cart" ✅ (aria-live polite)
  - Validation error: "Please correct the errors below" ✅ (role=alert)
  - Order success: "Order confirmed, reference 12345" ✅
  
  **Issues Found**:
  - ❌ Shipping options not announced when changed
  - ❌ Cart item count update silent
  ```

- **Remediation for Issues**:
  ```html
  <!-- Fix: Add aria-live to shipping options -->
  <div role="radiogroup" aria-labelledby="shipping-label">
    <div id="shipping-label">Shipping Method</div>
    <div aria-live="polite" aria-atomic="true">
      <input type="radio" id="standard" name="shipping" />
      <label for="standard">Standard Shipping - $5.99</label>
    </div>
  </div>
  
  <!-- Fix: Announce cart count updates -->
  <div aria-live="polite" aria-atomic="true">
    <a href="/cart">
      Cart (<span id="cart-count">2</span>)
    </a>
  </div>
  ```

- **Testing Checklist**:
  ```markdown
  ## NVDA Testing Procedure
  
  1. **Navigation (Browse Mode)**:
     - [ ] H key navigates headings in logical order
     - [ ] K key navigates all links
     - [ ] B key navigates all buttons
     - [ ] F key navigates all form fields
  
  2. **Form Interaction (Focus Mode)**:
     - [ ] Tab moves between form fields
     - [ ] Labels announced when fields focused
     - [ ] Error messages announced
     - [ ] Required fields indicated
  
  3. **Dynamic Content**:
     - [ ] aria-live regions announce updates
     - [ ] Loading states announced
     - [ ] Success/error messages announced
  ```

**Timeline**: 3 hours

### 6. Keyboard Navigation Validation

**When to use:**
- Testing interactive components
- Validating custom widgets
- Ensuring no keyboard traps

**Example:**
```bash
/accessibility-audit Validate keyboard navigation for:
- Main navigation menu (dropdown on hover/focus)
- Product image carousel (arrow keys)
- Tabs component (arrow keys, Home/End)
- Autocomplete search (arrow keys, Enter, Escape)
- Ensure all interactive elements keyboard accessible
- Document keyboard shortcuts
```

**What you'll get:**
- **Keyboard Navigation Report**:
  ```markdown
  ## Keyboard Navigation Test Results
  
  ### Main Navigation Menu ✅
  - Tab: Focuses top-level menu items ✅
  - Arrow Down: Opens submenu ✅
  - Arrow Up/Down: Navigate submenu items ✅
  - Escape: Closes submenu ✅
  - Focus indicator: Visible (3px blue outline) ✅
  
  ### Product Carousel ❌
  - Arrow Left/Right: Changes slides ❌ (not working)
  - Tab: Focuses carousel controls ✅
  - Space/Enter: Activates control ✅
  - Issue: Arrow keys require focus on carousel first
  
  ### Search Autocomplete ✅
  - Type: Shows suggestions ✅
  - Arrow Down: Highlights first suggestion ✅
  - Arrow Up/Down: Navigate suggestions ✅
  - Enter: Selects highlighted suggestion ✅
  - Escape: Closes autocomplete ✅
  ```

- **Carousel Fix**:
  ```javascript
  // Add arrow key support to carousel
  function Carousel({ slides }) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const carouselRef = useRef(null)
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setCurrentSlide((i) => (i - 1 + slides.length) % slides.length)
          break
        case 'ArrowRight':
          e.preventDefault()
          setCurrentSlide((i) => (i + 1) % slides.length)
          break
      }
    }
    
    return (
      <div 
        ref={carouselRef}
        role="region"
        aria-label="Product images"
        aria-roledescription="carousel"
        onKeyDown={handleKeyDown}
        tabIndex="0"
      >
        {/* Carousel content */}
      </div>
    )
  }
  ```

- **Keyboard Shortcuts Documentation**:
  ```markdown
  ## Keyboard Shortcuts
  
  ### Global
  - Tab: Next interactive element
  - Shift+Tab: Previous interactive element
  - Enter/Space: Activate button/link
  
  ### Navigation Menu
  - Arrow Down: Open submenu
  - Arrow Up/Down: Navigate submenu
  - Escape: Close submenu
  
  ### Carousel
  - Arrow Left: Previous slide
  - Arrow Right: Next slide
  - Tab: Focus carousel controls
  
  ### Search
  - Type: Show suggestions
  - Arrow Down: Next suggestion
  - Arrow Up: Previous suggestion
  - Enter: Select suggestion
  - Escape: Close suggestions
  ```

**Timeline**: 4 hours

### 7. WCAG 2.2 New Criteria Validation

**When to use:**
- Updating from WCAG 2.1 to 2.2
- Ensuring compliance with latest standards
- Before accessibility certification

**Example:**
```bash
/accessibility-audit Validate compliance with new WCAG 2.2 AA criteria:
- 2.4.11 Focus Not Obscured (Minimum) - Check fixed headers don't hide focus
- 2.5.7 Dragging Movements - Provide alternatives to drag-only interactions
- 2.5.8 Target Size (Minimum) - Verify all targets ≥24×24px
- 3.2.6 Consistent Help - Ensure help links in same position
- 3.3.7 Redundant Entry - Auto-populate previously entered data
- 3.3.8 Accessible Authentication - Alternatives to CAPTCHA
```

**What you'll get:**
- **WCAG 2.2 New Criteria Report**:
  ```markdown
  ## WCAG 2.2 AA New Criteria Validation
  
  ### 2.4.11 Focus Not Obscured (Minimum) ✅
  - Fixed header height: 60px
  - Focus indicators have scroll-margin-top: 80px
  - Test: Focused button scrolled into view, not obscured ✅
  
  ### 2.5.7 Dragging Movements ❌
  - Sortable list requires drag-only reordering
  - No keyboard alternative (arrow keys or buttons)
  - Fix needed: Add up/down buttons for reordering
  
  ### 2.5.8 Target Size (Minimum) ✅
  - All buttons: ≥32px (exceeds 24px) ✅
  - Icon-only buttons: 24×24px ✅
  - Close button: Expanded to 32px with padding ✅
  
  ### 3.3.7 Redundant Entry ✅
  - Checkout auto-fills saved addresses ✅
  - Payment method remembered ✅
  - Shipping preferences pre-selected ✅
  ```

- **Fixes for Violations**:
  ```javascript
  // Fix 2.5.7: Add keyboard alternative to drag-only list
  function SortableList({ items, onReorder }) {
    const moveUp = (index) => {
      if (index === 0) return
      const newItems = [...items]
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]]
      onReorder(newItems)
    }
    
    const moveDown = (index) => {
      if (index === items.length - 1) return
      const newItems = [...items]
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
      onReorder(newItems)
    }
    
    return (
      <ul>
        {items.map((item, index) => (
          <li key={item.id} draggable onDragStart={...}>
            {item.name}
            <button onClick={() => moveUp(index)} aria-label="Move up">↑</button>
            <button onClick={() => moveDown(index)} aria-label="Move down">↓</button>
          </li>
        ))}
      </ul>
    )
  }
  ```

**Timeline**: 3 hours

### 8. Accessibility Testing Training

**When to use:**
- Onboarding new team members
- Establishing testing standards
- Creating internal documentation

**Example:**
```bash
/accessibility-audit Create accessibility testing guide for team including:
- How to run axe-core tests locally
- NVDA basic usage and testing procedure
- Keyboard navigation checklist
- Color contrast checking tools
- Common accessibility issues and fixes
- Links to WCAG 2.2 resources
```

**What you'll get:**
- **Team Accessibility Testing Guide** (markdown):
  ```markdown
  # Accessibility Testing Guide
  
  ## Running Automated Tests
  
  ### axe-core with Playwright
  ```bash
  # Install dependencies
  npm install @axe-core/playwright --save-dev
  
  # Run all accessibility tests
  npm run test:a11y
  
  # Run specific page test
  npx playwright test test/accessibility/product_pages.spec.js
  ```
  
  ### Interpreting Results
  - **Violations**: Must fix (breaks WCAG)
  - **Passes**: Confirmed accessible
  - **Incomplete**: Manual verification needed
  - **Inapplicable**: Rule doesn't apply to page
  
  ## Manual Testing
  
  ### NVDA Screen Reader (Windows)
  1. Download: https://www.nvaccess.org/download/
  2. Start NVDA: Ctrl+Alt+N
  3. Navigate page: Arrow keys (browse mode)
  4. Switch modes: NVDA+Space
  5. Headings: H key
  6. Links: K key
  7. Buttons: B key
  8. Form fields: F key
  
  ### Keyboard Navigation
  - [ ] Tab through all interactive elements
  - [ ] Verify focus indicators visible
  - [ ] Enter/Space activates buttons/links
  - [ ] Escape closes modals/menus
  - [ ] Arrow keys navigate custom widgets
  - [ ] No keyboard traps
  
  ## Common Issues & Fixes
  
  ### Issue: Form without labels
  ```html
  <!-- Before (FAIL) -->
  <input type="email" placeholder="Email" />
  
  <!-- After (PASS) -->
  <label for="email">Email</label>
  <input type="email" id="email" />
  ```
  
  ### Issue: Low color contrast
  ```css
  /* Before (2.9:1 - FAIL) */
  color: #5DADE2;
  
  /* After (4.54:1 - PASS) */
  color: #0066CC;
  ```
  
  ## Resources
  - WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
  - axe DevTools: https://www.deque.com/axe/devtools/
  - WebAIM Contrast: https://webaim.org/resources/contrastchecker/
  ```

**Timeline**: 4 hours

## What You'll Get

Every accessibility audit includes:

### 1. **Comprehensive Audit Report**
   - Executive summary with compliance percentage
   - Issues categorized by severity (critical, serious, moderate, minor)
   - WCAG 2.2 criteria mapping for each issue
   - Remediation roadmap with time estimates
   - Testing methodology documentation

### 2. **Automated Test Suite**
   - Playwright + axe-core integration
   - Tests for all major pages/components
   - CI/CD configuration (GitHub Actions)
   - HTML reports on failures
   - Zero-violation enforcement

### 3. **Remediation Guidance**
   - Before/after code examples
   - WCAG criterion references
   - Screen reader impact explanation
   - Validation test cases
   - Estimated effort per fix

### 4. **Testing Documentation**
   - NVDA testing procedures
   - Keyboard navigation checklists
   - Color contrast validation tools
   - Manual testing guidelines
   - Team training materials

### 5. **Neo4j Knowledge Graph**
   - Accessibility patterns stored for reuse
   - WCAG violations and fixes cataloged
   - Audit history for trend analysis
   - Relationships between issues and solutions

### 6. **Compliance Metrics**
   - WCAG 2.2 Level AA percentage
   - Issues by severity breakdown
   - Testing coverage statistics
   - Trend analysis over time

## Related Commands

- `/qa-engineer` - Comprehensive testing strategy including accessibility
- `/elixir-wallaby` - E2E testing with Wallaby (can include accessibility checks)
- `/playwright-automation` - Advanced Playwright patterns for accessibility testing
- `/code-review` - Review code for accessibility best practices

## Key Capabilities

This command leverages the accessibility_auditor agent, which provides:

- **WCAG 2.2 Validation**: All 75+ Level A and AA criteria (including 6 new 2.2 criteria)
- **Automated Testing**: axe-core integration with Playwright, Jest, React Testing Library
- **Screen Reader Testing**: NVDA, VoiceOver, JAWS compatibility validation
- **Keyboard Navigation**: Tab order, focus management, skip links, focus trapping
- **Color Contrast**: 4.5:1 for text, 3:1 for UI components, automated checking
- **ARIA Validation**: Semantic HTML first, proper ARIA usage, no redundant roles
- **Manual Testing**: Beyond automation (~60% of issues require manual testing)
- **Remediation Guidance**: Code examples, WCAG references, validation tests
- **Compliance Reporting**: Detailed reports, metrics tracking, roadmaps

## Tips for Best Results

1. **Provide Context**: Share specific pages, components, or user flows to audit
2. **Specify Standards**: Mention if targeting WCAG 2.1 vs 2.2, Level A vs AA vs AAA
3. **Include URLs**: Provide localhost URLs or deployed URLs for live testing
4. **Share Known Issues**: Mention any reported accessibility bugs or user feedback
5. **Clarify Priorities**: Indicate if certain pages/features are higher priority
6. **Mention Deadlines**: Note if compliance deadline or release date approaching
7. **Include Tech Stack**: Mention React, Phoenix LiveView, or other frameworks used

## Technical Details

**Powered by:** `.opencode/agent/testing/accessibility_auditor.md`  
**MCP Servers:** context7 (WCAG docs, axe-core API), neo4j (pattern storage), sequential-thinking (analysis), playwright (browser automation), supabase (false)  
**Knowledge Graph:** Stores accessibility patterns, WCAG violations, remediation strategies, and audit history

---

**Note:** This command specializes in accessibility auditing and WCAG compliance. For general E2E testing use `/elixir-wallaby`, for comprehensive test strategy use `/qa-engineer`, and for API testing use `/api-tester`.

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
