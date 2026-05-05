---
name: playwright-automation
description: Expert Playwright automation for E2E, accessibility, API mocking, visual regression, and performance testing
license: MIT
compatibility: opencode
metadata:
  version: "2.0"
  playwright_version: "1.41+"
  testing_types: "e2e, accessibility, api-mocking, visual-regression, performance"
  tools: "axe-core, trace-viewer"
---

# 1. Introduction

Playwright is a comprehensive end-to-end testing framework that enables reliable cross-browser automation for modern web applications. Built by Microsoft, Playwright provides a single API to test across Chromium (Chrome, Edge, Brave), Firefox, and WebKit (Safari) browsers, with native support for headless execution, mobile emulation, and network interception.

## Core Capabilities

Playwright excels at multiple testing paradigms:

- **End-to-End Testing**: Automate complete user workflows across all major browsers with auto-waiting mechanisms that eliminate flakiness
- **Accessibility Testing**: Integrate @axe-core/playwright for WCAG 2.2 Level AA compliance checks embedded within test suites
- **API Mocking**: Intercept and modify network requests for testing edge cases, offline scenarios, and third-party service dependencies
- **Visual Regression**: Capture and compare screenshots with built-in diff reporting for UI consistency across releases
- **Performance Testing**: Measure page load metrics, Core Web Vitals, and resource timing with detailed tracing capabilities

## Key Features

- **Auto-Waiting**: Intelligent element state detection automatically waits for elements to be actionable, eliminating the need for manual waits
- **Multi-Browser Support**: Test against Chrome, Firefox, Safari, and Edge with identical test code
- **Fast Execution**: Run tests in parallel across multiple browsers and viewports with zero-configuration
- **Trace Viewer**: Capture detailed execution traces for debugging failed tests with timeline visualization
- **Code Generation**: Generate test code interactively by recording browser actions
- **Network Interception**: Mock, throttle, and monitor network traffic for comprehensive testing scenarios
- **Headless & Headed**: Run tests in headless mode for CI/CD or headed mode for debugging
- **Device Emulation**: Test mobile and tablet experiences with predefined device descriptors

## Use Cases

Playwright is ideal for:

- Complex single-page applications (React, Vue, Angular, Svelte)
- Multi-browser compatibility testing
- Accessibility compliance verification
- API integration testing with request/response mocking
- Visual regression testing for design systems
- Performance monitoring and regression detection
- User journey testing across authenticated sessions
- Multi-tenant and role-based testing scenarios

## Benefits

- **Reliability**: Auto-waiting and retry mechanisms dramatically reduce flaky tests
- **Speed**: Parallel test execution across browsers and contexts reduces total test time
- **Maintainability**: Role-based selectors align with how users perceive UI elements
- **Comprehensive Coverage**: Single framework handles E2E, accessibility, visual, and performance testing
- **Developer Experience**: TypeScript-first API with excellent IDE support and debugging tools
- **CI/CD Ready**: Native GitHub Actions integration with Docker container support
- **Extensible**: Custom reporters, fixtures, and plugins for team-specific workflows

# 2. Installation and Setup

## Prerequisites

Before installing Playwright, ensure you have:

- **Node.js**: Version 16.0 or higher
- **Package Manager**: npm (6.x+), yarn (1.22+), or pnpm (7.x+)
- **System Dependencies**: Required browser dependencies for your operating system

## Installation

### Initialize New Project

Create a new Playwright project with the interactive setup wizard:

```bash
npm init playwright@latest
# or
yarn create playwright
# or
pnpm create playwright
```

The wizard prompts for:
- Language (TypeScript or JavaScript)
- Test directory name (default: tests or e2e)
- GitHub Actions workflow setup
- Browser binary installation

### Add to Existing Project

Install Playwright as a development dependency in an existing project:

```bash
npm install -D @playwright/test@latest
# or
yarn add --dev @playwright/test@latest
# or
pnpm install --save-dev @playwright/test@latest
```

## Browser Installation

After package installation, download browser binaries:

```bash
npx playwright install
```

Include system dependencies for all browsers:

```bash
npx playwright install --with-deps
```

For CI/CD environments, install only required browsers:

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Configuration

Create a `playwright.config.ts` (or `.js`) file in your project root:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## First Test

Create your first test in `tests/example.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

Run tests with:

```bash
npx playwright test
```

View HTML report:

```bash
npx playwright show-report
```

## TypeScript Setup

For TypeScript projects, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "lib": ["ESNext", "DOM"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["@playwright/test"]
  },
  "include": ["tests"]
}
```

# 3. End-to-End Testing

## Test Structure

Playwright tests follow a consistent structure with fixtures, actions, and assertions:

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('successful login with valid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password', { exact: true }).fill('securePassword123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('wrongPassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });
});
```

## Selectors

Playwright provides user-centric locators that reflect how users perceive elements:

### Role-Based Selectors (Recommended)

Use ARIA roles and accessible names for resilient tests:

```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('link', { name: /Get started/i }).click();
await page.getByRole('heading', { name: 'Installation', level: 2 });
await page.getByRole('checkbox', { name: 'Subscribe' }).check();
await page.getByRole('textbox', { name: 'Email address' }).fill('test@example.com');
await page.getByRole('combobox').selectOption('Option 1');
await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
```

### Text-Based Selectors

Locate elements by text content:

```typescript
await page.getByText('Hello world').click();
await page.getByText('Submit', { exact: true }).click();
await page.getByText(/sign in/i).click();
```

### Label-Based Selectors

Find form controls by associated labels:

```typescript
await page.getByLabel('Email address').fill('user@example.com');
await page.getByLabel('Password').fill('secret');
await page.getByLabel('I agree to terms').check();
```

### Test ID Selectors

For elements without accessible names, use `data-testid` attributes:

```typescript
// HTML: <button data-testid="submit-button">Submit</button>
await page.getByTestId('submit-button').click();
```

### Placeholder and Alt Text

```typescript
await page.getByPlaceholder('Search documentation').fill('playwright');
await page.getByAltText('Playwright logo').click();
```

### CSS and XPath (Use Sparingly)

When necessary, use CSS or XPath selectors:

```typescript
await page.locator('.submit-button').click();
await page.locator('#username').fill('testuser');
await page.locator('xpath=//button[contains(text(), "Submit")]').click();
```

## Assertions

Playwright provides web-first assertions with auto-waiting:

```typescript
import { test, expect } from '@playwright/test';

test('element state assertions', async ({ page }) => {
  await page.goto('/page');
  const locator = page.locator('.element');

  // Visibility
  await expect(locator).toBeVisible();
  await expect(locator).toBeHidden();

  // Attachment
  await expect(locator).toBeAttached();
  await expect(locator).toBeDetached();

  // Enabled/Disabled
  await expect(locator).toBeEnabled();
  await expect(locator).toBeDisabled();
  await expect(locator).isEditable();

  // Checked/Unchecked
  await expect(locator).toBeChecked();
  await expect(locator).toBeUnchecked();

  // Focus
  await expect(locator).toBeFocused();
  await expect(locator).isInViewport();

  // Content
  await expect(locator).toHaveText('Expected Text');
  await expect(locator).toContainText('Partial');
  await expect(locator).toHaveValue('input value');
  await expect(locator).toHaveCount(3);
  await expect(locator).toHaveAttribute('href', '/about');
  await expect(locator).toHaveClass('active btn-primary');
  await expect(locator).toHaveCSS('display', 'none');
  await expect(locator).hasId('unique-id');
  await expect(locator).isEmpty();

  // Page-level
  await expect(page).toHaveTitle(/Page Title/);
  await expect(page).toHaveURL(/dashboard/);
});
```

## Page Interactions

### Clicking and Typing

```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('link', { name: 'Learn more' }).click();
await page.getByRole('textbox').type('Hello world', { delay: 100 });
await page.getByRole('textbox').fill('Complete text');
await page.getByRole('textbox').press('Enter');
await page.getByRole('textbox').pressSequentially('Text', { delay: 50 });
```

### Form Interaction

```typescript
// Checkboxes and radio buttons
await page.getByRole('checkbox', { name: 'Subscribe' }).check();
await page.getByRole('checkbox', { name: 'Terms' }).uncheck();
await page.getByRole('radio', { name: 'Option A' }).check();

// Dropdowns
await page.getByRole('combobox').selectOption('Option 1');
await page.getByRole('combobox').selectOption({ label: 'Option 2' });
await page.getByRole('combobox').selectOption('value1');

// File uploads
await page.getByLabel('Upload').setInputFiles('/path/to/file.pdf');
await page.getByLabel('Upload').setInputFiles(['/file1.pdf', '/file2.pdf']);
```

### Mouse Interactions

```typescript
await page.getByRole('button').hover();
await page.getByRole('button').dblclick();
await page.getByRole('button').click({ button: 'right' });
await page.getByRole('button').click({ modifiers: ['Shift'] });
```

## Multiple Pages and Contexts

### Multiple Pages in Same Context

```typescript
test('manages multiple tabs', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto('/dashboard');
  await page2.goto('/settings');

  await expect(page1).toHaveURL(/dashboard/);
  await expect(page2).toHaveURL(/settings/);

  // Get all pages in context
  const allPages = context.pages();
  console.log(`Total pages: ${allPages.length}`);
});
```

### Separate Browser Contexts

```typescript
test('multi-user scenario', async ({ browser }) => {
  const adminContext = await browser.newContext();
  const userContext = await browser.newContext();

  const adminPage = await adminContext.newPage();
  const userPage = await userContext.newPage();

  // Simulate admin and user actions simultaneously
  await adminPage.goto('/admin');
  await userPage.goto('/user');

  await adminPage.getByRole('button', { name: 'Approve' }).click();
  await expect(userPage.getByText('Request approved')).toBeVisible();
});
```

### Handling New Pages/Tabs

```typescript
test('handles new page from link', async ({ page, context }) => {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Open in new tab' }).click(),
  ]);

  await expect(newPage).toHaveURL(/new-page/);
  await expect(newPage.getByRole('heading')).toBeVisible();
});
```

## Best Practices

- **Prefer role-based selectors** over CSS/XPath for resilient tests
- **Use data-testid** for elements without accessible names
- **Avoid arbitrary waits** - Playwright auto-waits automatically
- **Test in isolation** - each test should be independent
- **Use page fixtures** instead of manual page creation
- **Group related tests** with `test.describe()`
- **Run tests in parallel** for faster execution
- **Use trace viewer** for debugging failed tests
- **Implement Page Object Model** for complex applications

# 4. Accessibility Testing

## @axe-core/playwright Integration

Install the accessibility testing library:

```bash
npm install -D @axe-core/playwright
```

## Basic Accessibility Testing

Inject accessibility checks into your E2E tests:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('login form meets WCAG 2.2 AA', async ({ page }) => {
    await page.goto('/login');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

## WCAG 2.2 Level AA Compliance

Configure axe-core to check specific WCAG levels:

```typescript
test('WCAG 2.2 Level AA compliance', async ({ page }) => {
  await page.goto('/product-page');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
    .disableRules(['color-contrast']) // Disable if testing with visual regression
    .analyze();

  if (results.violations.length > 0) {
    console.log('Accessibility violations found:');
    results.violations.forEach(violation => {
      console.log(`\n${violation.id}: ${violation.description}`);
      console.log(`Impact: ${violation.impact}`);
      console.log(`Help: ${violation.helpUrl}`);
      violation.nodes.forEach(node => {
        console.log(`  Target: ${node.target.join(', ')}`);
        console.log(`  HTML: ${node.html}`);
      });
    });
  }

  expect(results.violations).toEqual([]);
});
```

## Specific Rule Testing

Run only specific accessibility rules:

```typescript
test('form labels and focus management', async ({ page }) => {
  await page.goto('/contact-form');

  const results = await new AxeBuilder({ page })
    .include('#contact-form')
    .withRules([
      'label',
      'form-field-multiple-labels',
      'focus-order-semantics',
      'tabindex'
    ])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('keyboard navigation', async ({ page }) => {
  await page.goto('/navigation');

  const results = await new AxeBuilder({ page })
    .withRules([
      'keyboard',
      'focus-trap',
      'focus-management',
      'tabindex',
      'focusable-content',
      'focus-order-semantics'
    ])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## Contrast Testing

Ensure text meets color contrast requirements:

```typescript
test('color contrast meets WCAG AA standards', async ({ page }) => {
  await page.goto('/article');

  const results = await new AxeBuilder({ page })
    .withRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('custom contrast thresholds', async ({ page }) => {
  await page.goto('/dashboard');

  const results = await new AxeBuilder({ page })
    .withRules([
      {
        id: 'color-contrast',
        enabled: true
      }
    ])
    .options({
      colorContrast: {
        enforceLargeText: true,
        enforceBackgroundImage: false
      }
    })
    .analyze();

  const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
  expect(contrastViolations).toEqual([]);
});
```

## Keyboard Navigation Testing

Test keyboard accessibility with explicit checks:

```typescript
test('full keyboard navigation', async ({ page }) => {
  await page.goto('/checkout');

  // Test tab order
  const focusableElements = await page.locator(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ).all();

  for (let i = 0; i < focusableElements.length; i++) {
    await page.keyboard.press('Tab');

    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    const elementText = await focusedElement.textContent();
    console.log(`Focus ${i + 1}: ${elementText || elementText ? 'empty' : elementText}`);
  }

  // Test Enter and Space for interactive elements
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
});
```

## ARIA Testing

Validate ARIA attributes and roles:

```typescript
test('ARIA attributes are correct', async ({ page }) => {
  await page.goto('/modal');

  const results = await new AxeBuilder({ page })
    .withRules([
      'aria-valid-attr',
      'aria-valid-attr-value',
      'aria-allowed-attr',
      'aria-hidden-body',
      'aria-required-attr',
      'aria-required-children',
      'aria-roles',
      'aria-unsupported-attr',
      'invalid-role',
      'no-implicit-explicit-label'
    ])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('dialog has proper ARIA attributes', async ({ page }) => {
  await page.goto('/modal');
  await page.getByRole('button', { name: 'Open Modal' }).click();

  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  await expect(page.getByRole('dialog')).toHaveAttribute('aria-labelledby');
});
```

## Comprehensive Accessibility Test Suite

Create a dedicated accessibility test suite:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
    { path: '/products', name: 'Products' },
  ];

  pages.forEach(({ path, name }) => {
    test(`${name} page meets WCAG 2.2 AA`, async ({ page }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['cat.keyboard'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('all images have alt text', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withRules(['image-alt', 'image-redundant-alt'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('form fields have labels', async ({ page }) => {
    await page.goto('/contact');

    const results = await new AxeBuilder({ page })
      .withRules(['label', 'form-field-multiple-labels'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('heading hierarchy is logical', async ({ page }) => {
    await page.goto('/article');

    const results = await new AxeBuilder({ page })
      .withRules(['empty-heading', 'heading-order'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

## Reporting and Remediation

Generate detailed accessibility reports:

```typescript
test('generates accessibility report', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .analyze();

  const report = {
    url: page.url(),
    timestamp: new Date().toISOString(),
    violations: results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags,
      nodes: v.nodes.map(n => ({
        target: n.target,
        html: n.html,
        failureSummary: n.failureSummary,
      }))
    })),
    passes: results.passes.length,
    incomplete: results.incomplete.length,
    wcagLevel: 'AA',
  };

  console.log(JSON.stringify(report, null, 2));

  // Fail test if critical or serious violations found
  const criticalViolations = results.violations.filter(v =>
    v.impact === 'critical' || v.impact === 'serious'
  );

  expect(criticalViolations).toEqual([]);
});
```

## Best Practices

- **Run accessibility tests in CI** alongside E2E tests
- **Test all major user flows** for accessibility issues
- **Use WCAG 2.2 AA** as minimum compliance standard
- **Test keyboard navigation** separately from automated scans
- **Review violations manually** to understand context and impact
- **Fix critical and serious violations** before moderate and minor
- **Document accessibility requirements** for all features
- **Test with screen readers** for comprehensive coverage
- **Regular audits** schedule to catch regressions early

# 5. API Testing and Mocking

## 5.1 Network Interception with Playwright Routes

Playwright's Route API provides powerful network interception capabilities for testing API behavior without depending on real backends.

**Basic Route Interception**

```typescript
import { test, expect } from '@playwright/test';

test('mock API response', async ({ page }) => {
  await page.route('**/api/users', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.users.push({ id: 3, name: 'Test User' });
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(json),
    });
  });

  await page.goto('/users');
  await expect(page.getByText('Test User')).toBeVisible();
});
```

**Blocking Requests**

```typescript
test('block analytics tracking', async ({ page }) => {
  await page.route('**/analytics/**', route => route.abort());
  await page.goto('/');
  // Verify analytics requests were blocked
});
```

**Modifying Request Headers**

```typescript
test('add auth header to requests', async ({ page }) => {
  await page.route('**/api/**', async route => {
    const headers = route.request().headers();
    headers['Authorization'] = 'Bearer token123';
    await route.continue({ headers });
  });

  await page.goto('/protected');
});
```

## 5.2 HAR File Recording and Replay

HAR (HTTP Archive) files capture complete network traffic for reliable offline testing and debugging.

**Recording Network Traffic**

```typescript
import { test } from '@playwright/test';

test('record API interactions', async ({ context }) => {
  await context.routeFromHAR('api-traffic.har', {
    path: './hars/',
    update: true,  // Update HAR file with new responses
    url: /api\//
  });

  const page = await context.newPage();
  await page.goto('/dashboard');
});
```

**Replaying from HAR Files**

```typescript
test('replay API requests from HAR', async ({ page }) => {
  await page.routeFromHAR('./hars/api-traffic.har', {
    update: false,  // Read-only mode
    url: /.*\/api\/.*/
  });

  await page.goto('/dashboard');
  // All API calls served from HAR file
});
```

**Recording with CLI**

```bash
# Record network traffic to HAR file
npx playwright codegen --save-har=traffic.har.zip https://example.com

# Replay HAR file
npx playwright open --load-har=traffic.har.zip
```

## 5.3 GraphQL Mocking

Mocking GraphQL requires handling query parsing and response structure matching.

**GraphQL Query Interception**

```typescript
test('mock GraphQL response', async ({ page }) => {
  await page.route('**/graphql', async route => {
    const request = route.request();
    const postData = request.postDataJSON();
    
    if (postData.query.includes('GetUser')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            user: { id: '1', name: 'Mocked User', email: 'test@example.com' }
          }
        }),
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('/profile');
  await expect(page.getByText('Mocked User')).toBeVisible();
});
```

**GraphQL Mutation Mocking**

```typescript
test('mock GraphQL mutation', async ({ page }) => {
  await page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    
    if (postData.operationName === 'CreateUser') {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            createUser: {
              id: 'new-123',
              name: postData.variables.name,
              success: true
            }
          }
        }),
      });
    }
  });

  await page.goto('/create-user');
  await page.fill('[name="name"]', 'New User');
  await page.click('[type="submit"]');
});
```

## 5.4 MSW Integration

Mock Service Worker (MSW) provides seamless API mocking that works in both browser and Node.js environments.

**Setup MSW with Playwright**

```typescript
import { test } from '@playwright/test';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ]);
  })
);

test.beforeAll(() => server.listen());
test.afterAll(() => server.close());
test.afterEach(() => server.resetHandlers());

test('use MSW in Playwright', async ({ page }) => {
  await page.goto('/users');
  // Responses served by MSW
});
```

**Browser Environment Setup**

```typescript
import { test } from '@playwright/test';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

test.use({
  contextOptions: async ({}, use) => {
    const worker = setupWorker(
      http.get('/api/data', () => HttpResponse.json({ status: 'mocked' }))
    );
    await worker.start();
    await use({});
    await worker.stop();
  }
});

test('MSW in browser context', async ({ page }) => {
  await page.goto('/');
});
```

**Shared Request Handlers**

```typescript
// handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json({ products: [] });
  }),
  http.post('/api/checkout', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, orderId: 'ORD-123' });
  }),
];

// Use in both Node.js and browser
import { setupServer } from 'msw/node';
export const server = setupServer(...handlers);
```

## 5.5 API Response Validation

Validate API responses for correctness, performance, and schema compliance.

**Schema Validation**

```typescript
test('validate API response schema', async ({ page, request }) => {
  const response = await request.get('/api/users/1');
  const data = await response.json();
  
  // Validate structure
  expect(data).toMatchObject({
    id: expect.any(String),
    name: expect.any(String),
    email: expect.any(String),
    createdAt: expect.any(String)
  });
});
```

**Response Time Assertions**

```typescript
test('measure API response time', async ({ page, request }) => {
  const startTime = Date.now();
  const response = await request.get('/api/data');
  const duration = Date.now() - startTime;
  
  expect(response.status()).toBe(200);
  expect(duration).toBeLessThan(500); // 500ms threshold
});
```

**Error Handling Scenarios**

```typescript
test('handle API errors gracefully', async ({ page }) => {
  await page.route('**/api/endpoint', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' })
    });
  });

  await page.goto('/page-with-api');
  await expect(page.getByText('An error occurred')).toBeVisible();
});
```

---

# 6. Visual Regression Testing

## 6.1 Screenshot Capture Techniques

Playwright provides multiple screenshot capture methods for comprehensive visual testing.

**Full Page Screenshots**

```typescript
import { test, expect } from '@playwright/test';

test('capture full page screenshot', async ({ page }) => {
  await page.goto('/landing-page');
  await page.screenshot({
    path: 'screenshots/full-page.png',
    fullPage: true,
    animations: 'disabled'
  });
});

test('visual regression with expect', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png', {
    fullPage: true,
    maxDiffPixels: 100
  });
});
```

**Element Screenshots**

```typescript
test('screenshot specific element', async ({ page }) => {
  await page.goto('/pricing');
  const pricingCard = page.locator('.pricing-card').first();
  await expect(pricingCard).toHaveScreenshot('pricing-card.png');
});
```

**Viewport-Specific Screenshots**

```typescript
test('screenshot across viewports', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.screenshot({ path: 'desktop.png' });

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.reload();
  await page.screenshot({ path: 'tablet.png' });

  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  await page.screenshot({ path: 'mobile.png' });
});
```

## 6.2 Image Comparison Strategies

Advanced comparison techniques handle dynamic content and minimize false positives.

**Masking Dynamic Content**

```typescript
test('screenshot with masking', async ({ page }) => {
  await page.goto('/user-profile');
  await expect(page).toHaveScreenshot('profile-masked.png', {
    mask: [
      page.locator('#user-avatar'),
      page.locator('.random-id'),
      page.locator('[data-dynamic="true"]')
    ],
    maskColor: '#ff0000'
  });
});
```

**Custom Comparison Options**

```typescript
test('strict visual comparison', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page).toHaveScreenshot('checkout.png', {
    threshold: 0.2,  // Allow 20% pixel difference
    maxDiffPixels: 50,
    animations: 'disabled',
    clip: { x: 0, y: 0, width: 800, height: 600 }  // Clip region
  });
});
```

**Handling Animations**

```typescript
test('screenshot after animations', async ({ page }) => {
  await page.goto('/animated-component');
  
  // Wait for animations to complete
  await page.waitForFunction(() => {
    const element = document.querySelector('.animated');
    return getComputedStyle(element).animationPlayState === 'idle';
  });
  
  await expect(page).toHaveScreenshot('after-animation.png');
});
```

## 6.3 Chromatic Integration

Chromatic provides cloud-based visual regression testing with powerful review workflows.

**Setting up Chromatic**

```bash
# Install Chromatic
npm install -D chromatic

# Run Chromatic with project token
npx chromatic --project-token=YOUR_TOKEN
```

**Playwright Integration**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [
    ['html'],
    ['list'],
    ['chromatic']
  ]
});
```

## 6.4 Responsive Visual Testing

Test visual consistency across all device sizes and breakpoints.

**Breakpoint Testing**

```typescript
const breakpoints = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const breakpoint of breakpoints) {
  test(`visual regression at ${breakpoint.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: breakpoint.width,
      height: breakpoint.height
    });
    await page.goto('/');
    await expect(page).toHaveScreenshot(`${breakpoint.name}.png`);
  });
}
```

## 6.5 Handling Dynamic Content

Strategies for handling time-sensitive or random data in visual tests.

**Fixing Time-Based Elements**

```typescript
test('freeze timestamps', async ({ page }) => {
  await page.addInitScript(() => {
    Date.now = () => new Date('2024-01-01T00:00:00.000Z').getTime();
  });
  
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('fixed-time.png');
});
```

**Replacing Random Data**

```typescript
test('replace random IDs', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.5;
    crypto.randomUUID = () => 'fixed-uuid-12345';
  });
  
  await page.goto('/data-grid');
  await expect(page).toHaveScreenshot('consistent-data.png');
});
```

---

# 7. Performance Testing

## 7.1 Core Web Vitals Measurement

Measure and validate key performance metrics that impact user experience.

**LCP (Largest Contentful Paint)**

```typescript
import { test, expect } from '@playwright/test';

test('measure LCP', async ({ page }) => {
  await page.goto('/');
  
  const lcp = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        resolve(lcpEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });
  
  expect(lcp).toBeLessThan(2500); // 2.5s threshold
});
```

**CLS (Cumulative Layout Shift)**

```typescript
test('measure CLS', async ({ page }) => {
  await page.goto('/');
  
  const cls = await page.evaluate(() => {
    return new Promise(resolve => {
      let clsValue = 0;
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        resolve(clsValue);
      }).observe({ type: 'layout-shift', buffered: true });
    });
  });
  
  expect(cls).toBeLessThan(0.1); // Good CLS threshold
});
```

**TTFB (Time to First Byte)**

```typescript
test('measure TTFB', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  
  const ttfb = await page.evaluate(() => {
    const perfEntries = performance.getEntriesByType('navigation');
    return perfEntries[0]?.responseStart - perfEntries[0]?.startTime;
  });
  
  expect(ttfb).toBeLessThan(600); // 600ms threshold
});
```

**FCP (First Contentful Paint)**

```typescript
test('measure FCP', async ({ page }) => {
  await page.goto('/');
  
  const fcp = await page.evaluate(() => {
    const perfEntries = performance.getEntriesByType('paint');
    const fcpEntry = perfEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry?.startTime;
  });
  
  expect(fcp).toBeLessThan(1800); // 1.8s threshold
});
```

**All Performance Metrics**

```typescript
test('comprehensive performance audit', async ({ page }) => {
  const metrics = await page.evaluate(() => {
    const perfEntries = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: perfEntries.domContentLoadedEventEnd,
      loadComplete: perfEntries.loadEventEnd,
      fcp: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime,
      resources: performance.getEntriesByType('resource').length
    };
  });
  
  console.log('Performance Metrics:', metrics);
  expect(metrics.domContentLoaded).toBeLessThan(2000);
});
```

## 7.2 Performance Thresholds and Baselines

Set and enforce performance budgets to maintain quality standards.

**Performance Budgets**

```typescript
const performanceThresholds = {
  lcp: 2500,
  fcp: 1800,
  cls: 0.1,
  ttfb: 600,
  domContentLoaded: 2000,
};

test('enforce performance budget', async ({ page }) => {
  await page.goto('/');
  
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: nav.domContentLoadedEventEnd,
      fcp: paint.find(e => e.name === 'first-contentful-paint')?.startTime,
    };
  });
  
  for (const [key, value] of Object.entries(metrics)) {
    const threshold = performanceThresholds[key];
    if (threshold && value) {
      expect(value).toBeLessThan(threshold);
    }
  }
});
```

## 7.3 Resource Loading Analysis

Identify and optimize resource loading for better performance.

**Analyze Resource Sizes**

```typescript
test('analyze resource loading', async ({ page, request }) => {
  const resources: any[] = [];
  
  await page.route('**/*', async route => {
    const response = await route.fetch();
    const size = (await response.body()).length;
    resources.push({
      url: route.request().url(),
      size,
      type: response.headers()['content-type']
    });
    route.continue();
  });
  
  await page.goto('/');
  
  const largeResources = resources.filter(r => r.size > 100000);
  expect(largeResources.length).toBe(0); // No resources > 100KB
});
```

## 7.4 Lazy Loading Verification

Ensure images and content are loaded only when needed.

```typescript
test('verify lazy loading', async ({ page }) => {
  await page.goto('/');
  
  const initialRequests: string[] = [];
  page.on('request', request => {
    if (request.resourceType() === 'image') {
      initialRequests.push(request.url());
    }
  });
  
  await page.waitForLoadState('networkidle');
  const imageCount = initialRequests.length;
  
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  
  const finalRequests = initialRequests.length;
  expect(finalRequests).toBeGreaterThan(imageCount); // More images loaded
});
```

---

# 8. CI/CD Integration

## 8.1 GitHub Actions Workflows

Automate Playwright test execution in CI/CD pipelines.

**Basic GitHub Actions Setup**

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## 8.2 Parallel Test Execution

Maximize CI efficiency through parallel test execution and sharding.

**Test Sharding**

```yaml
# GitHub Actions with sharding
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests on shard
        run: npx playwright test --shard=${{ matrix.shard }}/4
      
      - name: Upload shard results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: shard-results-${{ matrix.shard }}
          path: playwright-report/
```

## 8.3 Artifact Collection

Collect and preserve test artifacts for debugging and reporting.

```yaml
- name: Upload test artifacts
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-artifacts
    path: |
      playwright-report/
      test-results/
    retention-days: 7
```

## 8.4 Flaky Test Management

Detect and handle flaky tests to maintain CI reliability.

**Retry Strategy**

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
});
```

---

# 9. Multi-Agent Workflows

OpenCode's multi-agent architecture enables sophisticated testing workflows that can parallelize test execution, coordinate distributed testing, and hand off tasks between specialized agents.

## 9.1 Parallel Testing with Sessions

Use OpenCode's session `fork` mode to run parallel test suites across multiple agents:

```javascript
// Fork parallel test suites in different agents
await session({
  mode: "fork",
  agent: "chromium-tester",
  text: "Run authentication tests on Chromium browser using Playwright"
});

await session({
  mode: "fork",
  agent: "firefox-tester", 
  text: "Run authentication tests on Firefox browser using Playwright"
});

await session({
  mode: "fork",
  agent: "webkit-tester",
  text: "Run authentication tests on WebKit browser using Playwright"
});
```

## 9.2 Agent Handoff Patterns

Use `message` mode to hand off test results between agents:

```javascript
// Agent 1: Execute tests and capture results
await playwright_browser_navigate({ url: "https://example.com" });
const testResults = await runTestSuite();

// Hand off to review agent
await session({
  mode: "message",
  agent: "test-reviewer",
  text: `Review these test results and identify flaky tests:\n${JSON.stringify(testResults, null, 2)}`
});
```

---

# 10. OpenCode Integration

The opencode-playwright-skill integrates deeply with OpenCode's architecture through MCP (Model Context Protocol).

## 10.1 MCP Server Configuration

Configure the Playwright MCP server in your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "playwright": {
      "type": "local",
      "command": ["node", "/path/to/opencode-playwright-mcp/server.js"],
      "enabled": true
    }
  }
}
```

## 10.2 Tool Permissions

Control which agents can access Playwright tools:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "test-runner": {
      "tools": {
        "playwright_*": true
      }
    }
  }
}
```

---

# 11. Session Navigation and Management

Effective session management is critical for stable, efficient Playwright tests.

## 11.1 Browser Context Management

Browser contexts are isolated browser sessions:

```javascript
// Create multiple isolated contexts for parallel user testing
const browser = await chromium.launch();

const adminContext = await browser.newContext();
await adminContext.addCookies([{
  name: 'auth_token',
  value: 'admin-token-123',
  domain: 'example.com',
  path: '/'
}]);

const userContext = await browser.newContext();
await userContext.addCookies([{
  name: 'auth_token',
  value: 'user-token-456',
  domain: 'example.com',
  path: '/'
}]);
```

## 11.2 State Preservation with Storage API

Use Playwright's storage state API to save and restore complete session state:

```javascript
// Save session state
async function saveSessionState(context, filePath) {
  const state = await context.storageState();
  await fs.writeFile(filePath, JSON.stringify(state, null, 2));
}

// Restore session state
async function loadSessionState(browser, filePath) {
  const state = JSON.parse(await fs.readFile(filePath, 'utf8'));
  const context = await browser.newContext({
    storageState: state
  });
  return context;
}
```

---

# 12. Advanced Features

Playwright offers powerful advanced features for debugging, test generation, and more.

## 12.1 Trace Viewer for Debugging

Record detailed traces of test execution:

```javascript
// Record trace for debugging
const browser = await chromium.launch();
const context = await browser.newContext();

await context.tracing.start({ 
  screenshots: true, 
  snapshots: true,
  sources: true
});

const page = await context.newPage();
await page.goto('https://example.com');
await page.click('#submit-button');

await context.tracing.stop({ path: 'trace.zip' });
await browser.close();

// View trace: npx playwright show-trace trace.zip
```

## 12.2 Codegen for Test Generation

Use Playwright's codegen to generate tests by recording browser interactions:

```bash
# Start codegen interactively
npx playwright codegen

# Generate tests for specific URL
npx playwright codegen https://example.com
```

## 12.3 Device Emulation

Emulate mobile devices to test responsive designs:

```javascript
const { chromium, devices } = require('playwright');

const iPhone = devices['iPhone 13'];
const browser = await chromium.launch();
const context = await browser.newContext({
  ...iPhone
});

const page = await context.newPage();
await page.goto('https://example.com');
```

## 12.4 Download Handling

Intercept and verify file downloads in tests:

```javascript
// Set up download handler
const downloadPromise = page.waitForEvent('download');

// Trigger download
await page.click('#download-button');

// Wait for download to complete
const download = await downloadPromise;

// Get download path
const path = await download.path();
console.log('Downloaded to:', path);
```

---

# 13. Best Practices

## 13.1 Selector Strategies

**Use Role-Based Locators**

Role-based selectors are the most resilient to DOM changes:

```javascript
// ✅ Recommended - Role-based
page.getByRole('button', { name: 'Submit' }).click();
page.getByRole('textbox', { name: 'Username' }).fill('test@example.com');

// ❌ Avoid - CSS classes that change
page.locator('button.btn-primary.submit-button').click();
```

**Use Test IDs for Testing Contracts**

```javascript
// ✅ Good - Testing contract
<input data-testid="email-input" />
<input data-testid="password-input" />
<button data-testid="submit-button" />

page.getByTestId('email-input').fill('user@example.com');
page.getByTestId('password-input').fill('password');
page.getByTestId('submit-button').click();
```

## 13.2 Test Isolation

**Each Test Must Be Independent**

```javascript
// ✅ Good - Isolated tests
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/);
});

test('user can view profile', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto('/profile');
  await expect(page.getByText('John Doe')).toBeVisible();
});
```

## 13.3 Auto-Waiting and Smart Retries

**Leverage Playwright's Auto-Waiting**

```javascript
// Playwright automatically waits for element to be:
// - Visible
// - Stable (not animating)
// - Receives events
// - Enabled (for inputs)

await page.getByRole('button', { name: 'Submit' }).click();
// No manual waits needed!
```

## 13.4 Page Object Model

**Encapsulate Page Logic**

```typescript
// pages/LoginPage.ts
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// tests/login.spec.ts
test('user can login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL(/dashboard/);
});
```

---

# 14. Migration Guide

## 14.1 From Selenium

**Driver Differences**

```javascript
// Selenium
const driver = await new Builder().forBrowser('chrome').build();
await driver.get('https://example.com');
const element = await driver.findElement(By.css('#submit'));
await element.click();
await driver.quit();

// Playwright
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://example.com');
await page.locator('#submit').click();
await browser.close();
```

## 14.2 From Cypress

**Syntax Differences**

```javascript
// Cypress
cy.visit('/login');
cy.get('[data-testid="email"]').type('user@example.com');
cy.get('[data-testid="password"]').type('password');
cy.contains('Submit').click();
cy.url().should('include', '/dashboard');

// Playwright
await page.goto('/login');
await page.getByTestId('email').fill('user@example.com');
await page.getByTestId('password').fill('password');
await page.getByText('Submit').click();
await expect(page).toHaveURL(/dashboard/);
```

## 14.3 From Puppeteer

**API Changes**

```javascript
// Puppeteer
await page.waitForSelector('.button');
await page.click('.button');
const text = await page.$eval('.result', el => el.textContent);

// Playwright
await page.locator('.button').click();
await expect(page.locator('.result')).toContainText('expected text');
```

---

# 15. Troubleshooting

## 15.1 Flaky Tests

**Common Causes**

- Race conditions from insufficient waits
- Dynamic selectors that change
- Network timeouts and slow responses
- Browser inconsistencies

**Detection and Fixes**

```javascript
// Use retries to detect flakiness
test.describe.configure({ retries: 3 });

test('potentially flaky test', async ({ page }) => {
  // Add proper waits instead of hard-coded timeouts
  await expect(page.getByText('Loaded')).toBeVisible();
  
  // Use more stable selectors
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Use web-first assertions with built-in retries
  await expect(page.locator('.result')).toBeAttached();
});
```

**Use Trace Viewer**

```bash
# Enable tracing in playwright.config.ts
use: {
  trace: 'on-first-retry',
}

# View traces
npx playwright show-trace trace.zip
```

## 15.2 Timeout Issues

**Configure Timeouts Properly**

```javascript
// playwright.config.ts
export default defineConfig({
  timeout: 60000,              // Global test timeout
  expect: {
    timeout: 5000,             // Assertion timeout
  },
  use: {
    actionTimeout: 10000,      // Individual action timeout
    navigationTimeout: 30000,   // Navigation timeout
  },
});
```

## 15.3 Selector Problems

**Debug Selectors**

```javascript
// Use browser dev tools
await page.pause();

// Check if element exists
const count = await page.locator('.button').count();
console.log(`Found ${count} elements`);

// Get all matching elements
const elements = await page.locator('.button').all();
for (const element of elements) {
  console.log(await element.textContent());
}
```

---

# 16. Examples

## 16.1 Login Authentication

```javascript
import { test, expect } from '@playwright/test';

test('user can login with valid credentials', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('Welcome back!')).toBeVisible();
});
```

## 16.2 Form Submission

```javascript
test('contact form submission', async ({ page }) => {
  await page.goto('/contact');
  
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  await page.getByLabel('Message').fill('This is a test message');
  await page.getByRole('button', { name: 'Send Message' }).click();
  
  await expect(page.getByText('Message sent successfully')).toBeVisible();
});
```

## 16.3 Navigation and Routing

```javascript
test('navigation between pages', async ({ page }) => {
  await page.goto('/');
  
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/about/);
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
  
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL(/\//);
});
```

## 16.4 File Upload

```javascript
test('file upload', async ({ page }) => {
  await page.goto('/upload');
  
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('test-files/sample.pdf');
  
  await page.getByRole('button', { name: 'Upload' }).click();
  await expect(page.getByText('File uploaded successfully')).toBeVisible();
});
```

---

# 17. Resources

## 17.1 Official Documentation

- **Main Documentation**: https://playwright.dev
- **Getting Started**: https://playwright.dev/docs/intro
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Locators Guide**: https://playwright.dev/docs/locators
- **API Reference**: https://playwright.dev/docs/api/class-playwright
- **Trace Viewer**: https://playwright.dev/docs/trace-viewer

## 17.2 Community Resources

- **GitHub Repository**: https://github.com/microsoft/playwright
- **Discord Community**: https://discord.gg/playwright
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/playwright
- **Twitter/X**: https://twitter.com/playwrightweb

## 17.3 Plugins and Tools

- **VS Code Extension**: Official Playwright extension for VS Code with debugging, test runner, and code generation
- **Codegen**: Generate tests by recording browser interactions (`npx playwright codegen`)
- **Playwright Inspector**: Debug tests step-by-step
- **Reporter Plugins**: HTML, JSON, JUnit, Allure, and custom reporters

## 17.4 Learning Paths

**Beginner**
1. Read Getting Started guide
2. Install Playwright CLI: `npm init playwright@latest`
3. Run example tests
4. Explore VS Code extension
5. Generate your first test with Codegen

**Intermediate**
1. Learn locators and selectors
2. Implement Page Object Model
3. Set up authentication handling
4. Configure CI/CD integration
5. Use Trace Viewer for debugging

**Advanced**
1. Create custom reporters
2. Build custom fixtures
3. API testing integration
4. Performance testing
5. Multi-browser testing strategies
