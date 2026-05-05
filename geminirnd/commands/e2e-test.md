---
description: Execute comprehensive end-to-end user journey tests with Playwright across browsers
agent: testing/e2e-tester
subtask: true
---

Execute complete user journey tests using Playwright with verified selectors, cross-browser validation, multi-user scenarios, and comprehensive debugging tools.

$ARGUMENTS

!`cat playwright.config.js 2>/dev/null | head -20 || echo "No Playwright config found"`
!`ls -la ./test/e2e/ 2>/dev/null || echo "No E2E test directory"`
!`npx playwright test --list 2>/dev/null | head -15 || echo "No Playwright tests found"`

## What This Command Does

The E2E Testing Specialist executes comprehensive end-to-end user journey tests:
- **User Journey Testing**: Complete workflows from entry to exit (login → action → logout)
- **Selector Verification**: Uses Playwright MCP to verify selectors against live DOM (no guessing)
- **Cross-Browser Testing**: Validates across Chromium, Firefox, WebKit for compatibility
- **Multi-User Scenarios**: Tests concurrent users, real-time updates, collaborative features
- **Page Objects**: Creates reusable page object models for maintainable tests
- **Test Isolation**: Fresh browser contexts per test prevent state pollution
- **Debugging Tools**: Screenshots, video, traces, console logs for failure diagnosis

## When to Use This Command

✅ **Use E2E Tester For**:
- Testing complete user journeys end-to-end
- Validating cross-browser compatibility
- Testing real-time features (LiveView, WebSocket)
- Multi-user interaction scenarios
- Authentication and session management flows
- Critical path smoke tests for deployments

❌ **Don't Use For**:
- Unit testing business logic (use `qa-engineer`)
- Performance load testing (use `perf-benchmark`)
- Accessibility audits (use specialized accessibility tools)

## Usage Examples

### Example 1: E-Commerce Checkout Flow
```bash
# Test: User completes full purchase journey
e2e-test "Test checkout flow: browse products → add to cart → enter payment → complete purchase → see confirmation"
```

**What you'll get**:
- **Selector Verification** (via Playwright MCP):
  ```
  Navigating to http://localhost:4000/products
  Verifying selectors:
    ✅ [data-testid='product-card']
    ✅ button:has-text('Add to Cart')
    ✅ [data-testid='cart-icon']
    ✅ input[name='card_number']
    ✅ button:has-text('Complete Purchase')
  ```
- **E2E Test** (`test/e2e/checkout-flow.spec.js`):
  ```javascript
  test('user can complete full checkout', async ({ page }) => {
    // Navigate to products
    await page.goto('http://localhost:4000/products');
    
    // Select product
    await page.locator('[data-testid="product-card"]').first().click();
    await expect(page.locator('h1')).toBeVisible();
    
    // Add to cart
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');
    
    // Checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('button:has-text("Proceed to Checkout")');
    
    // Payment (Stripe test card)
    await page.fill('input[name="card_number"]', '4242424242424242');
    await page.fill('input[name="exp_month"]', '12');
    await page.fill('input[name="exp_year"]', '2030');
    await page.fill('input[name="cvc"]', '123');
    
    // Submit
    await page.click('button:has-text("Complete Purchase")');
    
    // Confirmation
    await expect(page.locator('[data-testid="confirmation"]')).toContainText('Thank you');
  });
  ```
- **Cross-Browser Results**:
  ```
  ✅ Chromium: Passed (2.3s)
  ✅ Firefox: Passed (2.8s)
  ✅ WebKit: Passed (3.1s)
  ```

**Timeline**: 4 hours (includes selector verification + cross-browser testing)

### Example 2: Multi-User Real-Time Chat
```bash
# Test: Two users can chat in real-time
e2e-test "Test real-time chat: User A sends message → User B receives instantly via LiveView WebSocket"
```

**What you'll get**:
- **Test with Multiple Contexts** (`test/e2e/chat-multi-user.spec.js`):
  ```javascript
  test('users can chat in real-time', async ({ browser }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();
    
    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();
    
    try {
      // User 1 logs in
      await loginAs(user1Page, 'alice@example.com', 'AlicePass123');
      await user1Page.goto('http://localhost:4000/chat');
      
      // User 2 logs in
      await loginAs(user2Page, 'bob@example.com', 'BobPass123');
      await user2Page.goto('http://localhost:4000/chat');
      
      // User 1 sends message
      await user1Page.fill('input[name="message"]', 'Hello from Alice!');
      await user1Page.click('button:has-text("Send")');
      
      // User 2 receives message instantly (LiveView)
      await expect(user2Page.locator('.message').last()).toHaveText('Hello from Alice!');
      
      // User 2 replies
      await user2Page.fill('input[name="message"]', 'Hi Alice!');
      await user2Page.click('button:has-text("Send")');
      
      // User 1 receives reply
      await expect(user1Page.locator('.message').last()).toHaveText('Hi Alice!');
      
    } finally {
      await user1Context.close();
      await user2Context.close();
    }
  });
  ```
- **Debug Artifacts** (if failure occurs):
  - Screenshot: `test-results/screenshots/chat-multi-user-failed.png`
  - Video: `test-results/videos/chat-multi-user.webm`
  - Trace: `test-results/traces/chat-multi-user.zip` (view with `npx playwright show-trace`)

**Timeline**: 3 hours

### Example 3: Authentication Flow Across Browsers
```bash
# Test: Login flow works on all major browsers
e2e-test "Test login flow across Chromium, Firefox, and WebKit: enter credentials → submit → redirect to dashboard"
```

**What you'll get**:
- **Cross-Browser Test** (`test/e2e/login.critical.spec.js`):
  ```javascript
  test('user can log in with valid credentials', async ({ page, browserName }) => {
    console.log(`Testing on ${browserName}`);
    
    await page.goto('http://localhost:4000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'UserPass123');
    
    await Promise.all([
      page.waitForURL(/.*dashboard/),
      page.click('button[type="submit"]'),
    ]);
    
    await expect(page.locator('h1')).toHaveText('Dashboard');
  });
  ```
- **Test Results**:
  ```
  Running 3 tests using 3 workers
  
  [chromium] › login.critical.spec.js:5:3 › user can log in with valid credentials
    Testing on chromium
    ✅ Passed (1.2s)
  
  [firefox] › login.critical.spec.js:5:3 › user can log in with valid credentials
    Testing on firefox
    ✅ Passed (1.5s)
  
  [webkit] › login.critical.spec.js:5:3 › user can log in with valid credentials
    Testing on webkit
    ✅ Passed (1.8s)
  
  3 passed (4.5s)
  ```

**Timeline**: 2 hours

### Example 4: Page Object Model for Reusability
```bash
# Create reusable page objects for checkout workflow
e2e-test "Create page objects for checkout flow with verified selectors and reusable methods"
```

**What you'll get**:
- **CheckoutPage Object** (`test/e2e/pages/checkout.page.js`):
  ```javascript
  class CheckoutPage {
    constructor(page) {
      this.page = page;
      
      // Verified selectors
      this.cardNumberInput = page.getByLabel('Card Number');
      this.expiryInput = page.getByLabel('Expiry Date');
      this.cvcInput = page.getByLabel('CVC');
      this.submitButton = page.getByRole('button', { name: 'Complete Purchase' });
      this.confirmation = page.locator('[data-testid="confirmation"]');
    }
    
    async goto() {
      await this.page.goto('http://localhost:4000/checkout');
    }
    
    async fillPaymentDetails({ cardNumber, expiry, cvc }) {
      await this.cardNumberInput.fill(cardNumber);
      await this.expiryInput.fill(expiry);
      await this.cvcInput.fill(cvc);
    }
    
    async submit() {
      await this.submitButton.click();
    }
    
    async waitForConfirmation() {
      return await this.confirmation.textContent();
    }
  }
  ```
- **Test Using Page Object**:
  ```javascript
  const { CheckoutPage } = require('./pages/checkout.page');
  
  test('checkout with valid payment', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    
    await checkout.goto();
    await checkout.fillPaymentDetails({
      cardNumber: '4242424242424242',
      expiry: '12/30',
      cvc: '123'
    });
    await checkout.submit();
    
    const confirmation = await checkout.waitForConfirmation();
    expect(confirmation).toContain('Thank you for your order');
  });
  ```

**Timeline**: 3 hours (page object design + implementation)

### Example 5: Concurrent User Scenario (Race Condition)
```bash
# Test: Multiple users purchasing limited inventory
e2e-test "Test 10 users trying to buy last 3 tickets concurrently - only 3 should succeed, rest get sold out message"
```

**What you'll get**:
- **Concurrent Test** (`test/e2e/concurrent-purchase.spec.js`):
  ```javascript
  test('concurrent ticket purchases handle inventory correctly', async ({ browser }) => {
    const numUsers = 10;
    const contexts = await Promise.all(
      Array(numUsers).fill(null).map(() => browser.newContext())
    );
    const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));
    
    try {
      // All users navigate to event page
      await Promise.all(
        pages.map(page => page.goto('http://localhost:4000/events/concert-123'))
      );
      
      // All users try to purchase simultaneously
      const results = await Promise.all(
        pages.map(async (page) => {
          try {
            await page.click('button:has-text("Buy Ticket")');
            await page.waitForURL(/.*checkout/, { timeout: 5000 });
            await page.click('button:has-text("Confirm Purchase")');
            await page.waitForSelector('.success-message', { timeout: 5000 });
            return 'success';
          } catch (error) {
            const errorMsg = await page.locator('.error-message').textContent();
            return errorMsg.includes('sold out') ? 'sold_out' : 'error';
          }
        })
      );
      
      // Verify only 3 succeeded
      const successCount = results.filter(r => r === 'success').length;
      const soldOutCount = results.filter(r => r === 'sold_out').length;
      
      expect(successCount).toBe(3);
      expect(soldOutCount).toBe(7);
      
    } finally {
      await Promise.all(contexts.map(ctx => ctx.close()));
    }
  });
  ```
- **Result**: Validates inventory management under concurrent load

**Timeline**: 4 hours

### Example 6: Mobile Responsiveness Test
```bash
# Test: Mobile navigation works correctly
e2e-test "Test mobile hamburger menu and swipe gestures on iPhone 13 viewport"
```

**What you'll get**:
- **Mobile Test** (`test/e2e/mobile-navigation.mobile.spec.js`):
  ```javascript
  test('hamburger menu opens on mobile', async ({ page }) => {
    // Mobile viewport configured in playwright.config.js
    await page.goto('http://localhost:4000');
    
    await expect(page.locator('.hamburger-menu')).toBeVisible();
    await page.click('.hamburger-menu');
    
    await expect(page.locator('.mobile-nav-drawer')).toBeVisible();
    await page.click('.mobile-nav-drawer a:has-text("About")');
    
    await expect(page).toHaveURL(/.*about/);
  });
  ```
- **Viewport Config** (playwright.config.js):
  ```javascript
  {
    name: 'mobile-safari',
    use: { ...devices['iPhone 13'] }
  }
  ```

**Timeline**: 2 hours

## What You'll Get

After running this command, the E2E Testing Specialist will deliver:

### 1. Playwright Test Suite
**File Structure**:
```
test/e2e/
├── *.spec.js                    # E2E test files
├── *.critical.spec.js           # Critical tests (run on all browsers)
├── *.mobile.spec.js             # Mobile-specific tests
├── pages/                       # Page Object Models
│   ├── login.page.js
│   ├── checkout.page.js
│   └── product.page.js
├── helpers/
│   ├── journey-steps.js         # Reusable journey helpers
│   ├── wait-helpers.js          # Custom wait functions
│   └── auth-helpers.js          # Login/logout helpers
└── fixtures/
    └── contexts.js              # Custom context fixtures

playwright.config.js             # Playwright configuration
```

### 2. Test Execution Report
```
Running 15 tests using 3 workers

✅ Passed: 14
❌ Failed: 1
⚠️  Flaky: 0

Duration: 3m 45s

Browser Coverage:
  Chromium: 15/15 passed
  Firefox: 5/5 passed (critical tests only)
  WebKit: 5/5 passed (critical tests only)

Failed Tests:
  [chromium] › checkout-flow.spec.js:45:3 › user can complete checkout
    Error: Timeout 5000ms exceeded waiting for selector ".confirmation"
    Screenshot: test-results/screenshots/checkout-flow-failed.png
    Video: test-results/videos/checkout-flow.webm
    Trace: test-results/traces/checkout-flow.zip
```

### 3. Debug Artifacts (on failure)
- **Screenshots**: Visual snapshot at failure point
- **Video**: Full test execution recording
- **Trace**: Detailed timeline with network, DOM, console logs (view with `npx playwright show-trace`)

### 4. Page Object Library
Reusable page objects with verified selectors:
- **LoginPage**: login(), logout(), fillCredentials()
- **ProductPage**: selectProduct(), addToCart(), viewDetails()
- **CheckoutPage**: fillPaymentDetails(), submit(), waitForConfirmation()
- **DashboardPage**: navigateToSection(), getStats(), logout()

### 5. Neo4j Knowledge Graph Updates
**Stored Patterns**:
- E2E test workflows (journey breakdown, duration, browser coverage)
- Page objects (methods, selectors, reusability)
- Selector strategies (role-based preferred, data-testid for dynamic content)
- Multi-user patterns (context setup, real-time validation)
- Debug strategies (screenshot, video, trace usage)

## How It Works

1. **Journey Analysis**: Breaks down user journey into testable steps with entry/exit conditions
2. **Selector Verification**: Uses Playwright MCP to verify all selectors against live DOM
3. **Context Setup**: Creates fresh browser contexts for isolation, custom contexts for auth
4. **Page Objects**: Encapsulates page-specific interactions in reusable classes
5. **Auto-Waiting**: Uses Playwright's auto-waiting instead of manual timeouts
6. **Cross-Browser**: Runs critical tests on Chromium, Firefox, WebKit
7. **Multi-User**: Creates separate contexts for concurrent user testing
8. **Debugging**: Captures screenshots, video, traces on failures
9. **Knowledge Storage**: Stores patterns in Neo4j for team reuse

## Test Execution Commands

```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test test/e2e/checkout-flow.spec.js

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests in headed mode (see browser)
npx playwright test --headed

# Debug specific test
npx playwright test --debug test/e2e/login.spec.js

# Run tests matching pattern
npx playwright test test/e2e/*.critical.spec.js

# View test report
npx playwright show-report

# View trace for failed test
npx playwright show-trace test-results/traces/checkout-flow.zip
```

## Tips for Best Results

- **Specify complete journey**: "Login → add product to cart → checkout → confirmation" is better than "test checkout"
- **Mention browser coverage**: "Test on all browsers" or "Chromium only"
- **Include multi-user if needed**: "Test 2 users chatting in real-time"
- **Request page objects**: "Create page objects for reusability"
- **Specify mobile if needed**: "Test on iPhone 13 viewport"

## Selector Priority

1. **getByRole** (best - matches accessibility tree)
   ```javascript
   page.getByRole('button', { name: 'Submit' })
   page.getByRole('textbox', { name: 'Email' })
   ```

2. **data-testid** (good - stable, test-specific)
   ```javascript
   page.locator('[data-testid="user-profile"]')
   ```

3. **getByText** (acceptable - user-visible text)
   ```javascript
   page.getByText('Welcome to our site')
   ```

4. **CSS selectors** (avoid - fragile)
   ```javascript
   page.locator('.btn-primary') // ❌ Classes change
   ```

## Common Pitfalls to Avoid

❌ **Don't use waitForTimeout**:
```javascript
await page.click('button');
await page.waitForTimeout(2000); // ❌ Brittle
```

✅ **Do use semantic waits**:
```javascript
await page.click('button');
await expect(page.locator('.success')).toBeVisible(); // ✅ Auto-waits
```

❌ **Don't share state between tests**:
```javascript
let sharedPage; // ❌ Causes flakiness

test('test 1', async () => {
  sharedPage = ...; // ❌ State pollution
});
```

✅ **Do use fresh contexts**:
```javascript
test('test 1', async ({ page }) => {
  // Fresh context per test ✅
});
```

## Related Commands

- `/qa-engineer` - For unit and integration tests
- `/perf-benchmark` - For performance benchmarking
- `/perf-test` - For Core Web Vitals measurement

## Reference

Best practices: `./.opencode/docs/Best_Practices_2025.md`

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
