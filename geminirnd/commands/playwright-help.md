---
description: Expert assistance with Playwright CLI, Codegen, debugging, browser management, and test utilities
agent: testing/playwright-helper
subtask: true
---

# Playwright Helper Command

Get expert guidance on Playwright CLI operations, test generation with Codegen, debugging with Inspector and Trace Viewer, browser installation management, and creating reusable test utilities.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

```bash
!`which playwright || which npx`
!`playwright --version 2>/dev/null || npx playwright --version`
!`cat playwright.config.js || cat playwright.config.ts || echo 'No config found'`
!`ls -la test-results/ 2>/dev/null | head -20 || echo 'No test results'`
```

## What This Command Does

The Playwright Helper provides comprehensive support for:
- **CLI Operations**: Execute Playwright commands (install, test, codegen, show-report)
- **Test Generation**: Use Codegen to generate test scaffolding, then optimize for production
- **Debugging**: Analyze trace files and use Inspector for step-by-step debugging
- **Browser Management**: Install, update, and troubleshoot browser binaries
- **Test Utilities**: Create reusable fixtures, page objects, and helper functions
- **Configuration**: Set up optimal playwright.config.js for your project

## When to Use This Command

✅ **Use Playwright Helper For**:
- Installing or updating Playwright browsers
- Generating test code from user interactions with Codegen
- Debugging test failures using Trace Viewer or Inspector
- Setting up test configurations and reporters
- Creating reusable test utilities and page objects
- Troubleshooting browser installation or execution issues
- Optimizing test execution performance

❌ **Don't Use For**:
- Accessibility testing (use `playwright-a11y` instead)
- Test result analysis (use `test-analyze` instead)
- Writing complete test suites (use `qa-engineer` instead)

## Usage Examples

### Example 1: Install Browsers for CI
```bash
playwright-help "Install Playwright browsers for GitHub Actions with system dependencies"
```

**What you'll get**:
- GitHub Actions workflow snippet:
  ```yaml
  - name: Install Playwright browsers
    run: npx playwright install --with-deps chromium
  ```
- Browser installation verification steps
- Troubleshooting tips for common CI issues
- Docker configuration (if applicable)

**Timeline**: 30 minutes

### Example 2: Generate Tests with Codegen
```bash
playwright-help "Use Codegen to generate test for login flow at http://localhost:4000/login, then optimize the code"
```

**What you'll get**:
1. **Codegen Command**:
   ```bash
   npx playwright codegen --browser=chromium http://localhost:4000/login
   ```
2. **Generated Code** (raw from Codegen):
   ```javascript
   await page.goto('http://localhost:4000/login');
   await page.locator('#email').click();
   await page.locator('#email').fill('user@example.com');
   await page.locator('#password').click();
   await page.locator('#password').fill('password123');
   await page.getByRole('button', { name: 'Login' }).click();
   ```
3. **Optimized Code**:
   ```javascript
   test('user can login', async ({ page }) => {
     await page.goto('/login');
     await page.getByLabel('Email').fill('user@example.com');
     await page.getByLabel('Password').fill('password123');
     await page.getByRole('button', { name: 'Login' }).click();
     
     await expect(page).toHaveURL('/dashboard');
     await expect(page.getByText('Welcome')).toBeVisible();
   });
   ```
4. **Best Practices**:
   - Use semantic selectors (getByRole, getByLabel)
   - Add assertions for verification
   - Structure with describe/test blocks

**Timeline**: 1 hour

### Example 3: Debug Test with Trace Viewer
```bash
playwright-help "My test is failing - help me debug using the trace file at test-results/login-test/trace.zip"
```

**What you'll get**:
1. **Open Trace Command**:
   ```bash
   npx playwright show-trace test-results/login-test/trace.zip
   ```
2. **Analysis Guidance**:
   - Check timeline for slow operations (>1s actions highlighted)
   - Review network tab for failed API calls (4xx, 5xx status)
   - Inspect console for JavaScript errors
   - View DOM snapshots at failure point
3. **Root Cause Identification**:
   - "Timeline shows: Wait for selector '.loaded' timeout after 30s"
   - "Element never appeared in DOM snapshots"
4. **Fix Recommendation**:
   ```javascript
   // BEFORE (fails)
   await page.locator('.loaded').click();
   
   // AFTER (fixed)
   await page.waitForLoadState('networkidle');
   await expect(page.locator('.loaded')).toBeVisible({ timeout: 10000 });
   await page.locator('.loaded').click();
   ```

**Timeline**: 1-2 hours

### Example 4: Debug with Inspector
```bash
playwright-help "Run my test in Inspector mode so I can step through and find the issue"
```

**What you'll get**:
1. **Launch Command**:
   ```bash
   PLAYWRIGHT_INSPECTOR=1 npx playwright test tests/checkout.spec.ts
   # Or: npx playwright test tests/checkout.spec.ts --debug
   ```
2. **Inspector Usage Guide**:
   - Step Over (F10): Execute current line
   - Step Into (F11): Step into function
   - Resume (F8): Continue execution
   - Pick Locator: Test selectors interactively
3. **Debugging Workflow**:
   - Add `await page.pause()` to pause at specific point
   - Test selectors in console
   - Inspect page state when test fails
   - Modify selectors on the fly

**Timeline**: 30 minutes

### Example 5: Create Reusable Auth Fixture
```bash
playwright-help "Create an authentication fixture so I don't have to login via UI in every test"
```

**What you'll get**:
- **Fixture File** (`fixtures/auth.js`):
  ```javascript
  const base = require('@playwright/test');
  
  exports.test = base.test.extend({
    authenticatedPage: async ({ browser }, use) => {
      const context = await browser.newContext({
        storageState: 'auth-state.json'
      });
      const page = await context.newPage();
      await use(page);
      await context.close();
    }
  });
  ```
- **Setup Script** (runs once to create auth state):
  ```javascript
  // setup/auth.setup.js
  const { test as setup } = require('@playwright/test');
  
  setup('authenticate', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('/dashboard');
    
    await page.context().storageState({ path: 'auth-state.json' });
  });
  ```
- **Usage in Tests**:
  ```javascript
  const { test } = require('./fixtures/auth');
  
  test('view profile', async ({ authenticatedPage: page }) => {
    await page.goto('/profile');
    await expect(page.getByRole('heading')).toContainText('Profile');
  });
  ```

**Timeline**: 1 hour

### Example 6: Set Up Optimal Config
```bash
playwright-help "Create playwright.config.js for our project - we need CI support, multiple browsers, and HTML reports"
```

**What you'll get**:
- **Configuration File** (`playwright.config.js`):
  ```javascript
  const { defineConfig, devices } = require('@playwright/test');
  
  module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    
    reporter: [
      ['html'],
      ['junit', { outputFile: 'test-results/junit.xml' }],
      ['list']
    ],
    
    use: {
      baseURL: 'http://localhost:4000',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure'
    },
    
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } }
    ],
    
    webServer: {
      command: 'npm run start',
      url: 'http://localhost:4000',
      reuseExistingServer: !process.env.CI
    }
  });
  ```
- **CI Configuration** (GitHub Actions)
- **Usage Documentation**

**Timeline**: 1 hour

### Example 7: Create Page Object
```bash
playwright-help "Create a page object for our login page to reduce duplication across tests"
```

**What you'll get**:
- **Page Object** (`pages/LoginPage.js`):
  ```javascript
  class LoginPage {
    constructor(page) {
      this.page = page;
      this.emailInput = page.getByLabel('Email');
      this.passwordInput = page.getByLabel('Password');
      this.loginButton = page.getByRole('button', { name: 'Login' });
      this.errorMessage = page.locator('.error-message');
    }
    
    async navigate() {
      await this.page.goto('/login');
    }
    
    async login(email, password) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
    
    async assertSuccess() {
      await expect(this.page).toHaveURL('/dashboard');
    }
    
    async assertError(message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }
  
  module.exports = { LoginPage };
  ```
- **Usage Example**:
  ```javascript
  const { LoginPage } = require('./pages/LoginPage');
  
  test('login success', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('user@example.com', 'password123');
    await loginPage.assertSuccess();
  });
  ```

**Timeline**: 1 hour

### Example 8: Troubleshoot Browser Installation
```bash
playwright-help "Playwright can't find Chromium - help me fix browser installation"
```

**What you'll get**:
- **Diagnosis Steps**:
  ```bash
  # Check browsers
  npx playwright list-browsers
  
  # Clean reinstall
  rm -rf ~/.cache/ms-playwright
  npx playwright install --with-deps chromium
  
  # Verify installation
  npx playwright screenshot https://example.com test.png
  ```
- **Common Issues & Fixes**:
  - Missing system dependencies (Linux): Run `npx playwright install-deps`
  - Version mismatch: Update Playwright and reinstall browsers
  - Permission issues: Check file permissions on `~/.cache/ms-playwright`
- **Docker Setup** (if needed)

**Timeline**: 30 minutes - 1 hour

## What You'll Get

Every response includes:

### 1. **CLI Command Guidance**
   - Exact commands to run with all necessary flags
   - Expected output and how to verify success
   - Troubleshooting steps for common errors

### 2. **Codegen Optimization**
   - Raw generated code from Playwright Codegen
   - Optimized version with best practices
   - Selector improvements (semantic vs CSS)
   - Added assertions for verification

### 3. **Debugging Support**
   - Trace Viewer analysis walkthrough
   - Inspector usage instructions
   - Root cause identification
   - Specific fixes with code examples

### 4. **Browser Management**
   - Installation commands for all environments
   - CI/CD integration (GitHub Actions, GitLab CI, Docker)
   - Version management
   - Troubleshooting common installation issues

### 5. **Test Utilities**
   - Reusable fixtures for auth, API setup, etc.
   - Page object implementations
   - Custom helper functions
   - Configuration templates

### 6. **Best Practices**
   - Optimal selector strategies
   - Proper wait patterns (no hardcoded sleeps)
   - Trace and screenshot configuration
   - Reporter setup for CI

## Related Commands

- `/qa-engineer` - Comprehensive test strategy and implementation
- `/playwright-a11y` - Accessibility testing with axe-core/playwright
- `/test-analyze` - Analyze test results and identify patterns
- `/code-review` - Review Playwright tests for best practices

## Key Capabilities

This command leverages the playwright-helper agent, which provides:

- **CLI Expertise**: All Playwright CLI commands and options
- **Codegen Mastery**: Generate and optimize test code from user interactions
- **Trace Analysis**: Debug failures using Trace Viewer timeline, network, console
- **Inspector Debugging**: Step-by-step test execution with live browser inspection
- **Browser Management**: Install, update, troubleshoot across all environments
- **Utility Creation**: Build reusable fixtures, page objects, helpers
- **Configuration**: Optimal config for timeouts, retries, parallelization, reporting

## Tips for Best Results

1. **Provide Context**: Share existing config, test files, or error messages
2. **Be Specific**: "Debug login test failure" vs "My test doesn't work"
3. **Share Artifacts**: Include trace files, error logs, or screenshots
4. **Mention Environment**: Local vs CI, browser versions, OS
5. **Clarify Goals**: Quick fix vs long-term solution?

## Technical Details

**Powered by:** `.opencode/agent/testing/playwright-helper.md`  
**MCP Servers:** context7 (Playwright docs), neo4j (pattern storage), sequential-thinking (analysis), playwright (browser automation)  
**Knowledge Graph:** Stores CLI patterns, debugging strategies, utilities, and configurations

---

**Note:** This command specializes in Playwright tooling and utilities. For accessibility testing use `/playwright-a11y`, for test analysis use `/test-analyze`, and for comprehensive QA strategy use `/qa-engineer`.

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
