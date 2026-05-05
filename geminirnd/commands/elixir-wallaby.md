---
description: Expert guidance on Wallaby and Playwright E2E testing for Elixir/Phoenix applications
agent: elixir-wallaby-specialist
subtask: true
---

# Elixir Wallaby & Playwright E2E Testing Command

Expert assistance for end-to-end testing of Elixir/Phoenix applications using Wallaby and Playwright. Get comprehensive guidance on browser automation, LiveView testing, authentication flows, multi-step workflows, and production-ready test automation.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather relevant context about your testing setup:

**Current Test Configuration:**
```bash
!`grep 'wallaby\|playwright' mix.exs`
!`grep 'server: true' config/test.exs`
!`ls -la test/support/ | grep -i acceptance`
```

**Existing E2E Tests:**
```bash
!`find test -name '*acceptance*' -o -name '*e2e*' | head -10`
!`grep -r 'use Wallaby.Feature\|use PlaywrightTest' test/`
```

**Application Endpoints:**
```bash
!`grep 'defmodule.*Endpoint' lib/*/endpoint.ex`
!`grep 'SQL.Sandbox' lib/*/endpoint.ex`
```

## Usage Examples

### 1. Set Up Wallaby for E2E Testing

**When to use:**
- Starting E2E testing for Phoenix application
- Need browser automation for acceptance tests
- Testing LiveView real-time features
- Validating complete user workflows

**Example:**
```bash
/elixir-wallaby set up Wallaby for our Phoenix app. We need:
- SQL Sandbox integration for database isolation
- ChromeDriver configuration
- AcceptanceCase module with helpers
- Screenshot capture on failures
- Basic test structure examples
```

**What you'll get:**
- **Dependency Configuration** (mix.exs):
  ```elixir
  def deps do
    [
      {:wallaby, "~> 0.30", only: :test}
    ]
  end
  ```
- **Test Configuration** (config/test.exs):
  ```elixir
  config :wallaby,
    screenshot_on_failure: true,
    driver: Wallaby.Chrome
  
  config :my_app, MyAppWeb.Endpoint,
    server: true,
    http: [port: 4001]
  
  config :my_app, :sql_sandbox, true
  ```
- **Endpoint Configuration**:
  ```elixir
  if Application.compile_env(:my_app, :sql_sandbox, false) do
    plug Phoenix.Ecto.SQL.Sandbox
  end
  ```
- **AcceptanceCase Module** with SQL Sandbox setup
- **Example Feature Test**
- **Installation Instructions**

**Timeline**: 2 hours

### 2. Test LiveView Real-Time Features

**When to use:**
- Testing LiveView applications
- Validating real-time updates via PubSub
- Testing streams and dynamic content
- Multi-user collaboration features

**Example:**
```bash
/elixir-wallaby create E2E tests for our chat LiveView. Features:
- Users can send messages
- Messages appear in real-time for all users
- User presence is tracked
- Messages can be edited and deleted
- Test with 2 concurrent users
```

**What you'll get:**
- **Feature Test Module**:
  ```elixir
  defmodule MyAppWeb.ChatFeature do
    use MyApp.AcceptanceCase
  
    feature "users can chat in real-time", %{session: session} do
      {:ok, user1_session} = Wallaby.start_session()
      {:ok, user2_session} = Wallaby.start_session()
      
      user1 = insert(:user, name: "Alice")
      user2 = insert(:user, name: "Bob")
      
      # User 1 sends message
      user1_session
      |> log_in_user(user1)
      |> visit("/chat")
      |> fill_in(text_field("Message"), with: "Hello Bob!")
      |> click(button("Send"))
      |> assert_has(css(".message", text: "Hello Bob!"))
      
      # User 2 receives message in real-time
      user2_session
      |> log_in_user(user2)
      |> visit("/chat")
      |> assert_has(css(".message", text: "Hello Bob!"))
      |> assert_has(css(".presence", text: "Alice"))
    end
  end
  ```
- **PubSub Test Patterns**
- **Presence Tracking Assertions**
- **Multi-User Scenario Tests**

**Timeline**: 4 hours

### 3. Test Multi-Step User Workflows

**When to use:**
- Testing complete user journeys
- E-commerce checkout flows
- Onboarding processes
- Authentication flows

**Example:**
```bash
/elixir-wallaby test complete purchase workflow:
1. Browse products
2. Add item to cart
3. Proceed to checkout
4. Enter payment info (Stripe test mode)
5. Verify order confirmation
6. Check order appears in user's orders list
```

**What you'll get:**
- **Purchase Flow Test**:
  ```elixir
  feature "user completes purchase", %{session: session} do
    product = insert(:product, name: "Widget", price: 19.99)
    user = insert(:user)
    session = log_in_user(session, user)
    
    session
    |> visit("/products")
    |> click(link("Widget"))
    |> click(button("Add to Cart"))
    |> visit("/cart")
    |> assert_has(css(".cart-item", text: "Widget"))
    |> click(button("Checkout"))
    |> fill_in(text_field("Credit Card"), with: "4242424242424242")
    |> fill_in(text_field("Expiry"), with: "12/30")
    |> fill_in(text_field("CVC"), with: "123")
    |> click(button("Pay"))
    |> assert_has(css(".confirmation", text: "Order confirmed"))
    |> visit("/orders")
    |> assert_has(css(".order", text: "Widget"))
  end
  ```
- **Navigation Validation**
- **Form Submission Patterns**
- **Payment Integration Testing**
- **Order Verification**

**Timeline**: 5 hours

### 4. Implement Page Object Pattern

**When to use:**
- Reducing test code duplication
- Creating reusable page interactions
- Building maintainable test suites
- Team standardization

**Example:**
```bash
/elixir-wallaby create page objects for:
- LoginPage (visit, fill credentials, submit, assertions)
- ProductPage (view product, add to cart, check availability)
- CartPage (view items, update quantities, proceed to checkout)
- All page objects should be reusable and well-documented
```

**What you'll get:**
- **LoginPage Module**:
  ```elixir
  defmodule MyApp.Pages.LoginPage do
    import Wallaby.DSL
    import Wallaby.Query
    
    @email_field text_field("Email")
    @password_field text_field("Password")
    @submit_button button("Log In")
    
    def visit_page(session), do: visit(session, "/login")
    
    def fill_credentials(session, email, password) do
      session
      |> fill_in(@email_field, with: email)
      |> fill_in(@password_field, with: password)
    end
    
    def submit(session), do: click(session, @submit_button)
    
    def assert_logged_in(session) do
      session |> assert_has(css(".dashboard"))
    end
  end
  ```
- **ProductPage Module**
- **CartPage Module**
- **Usage Examples in Tests**
- **Page Object Documentation**

**Timeline**: 3 hours

### 5. Test Authentication and Protected Routes

**When to use:**
- Testing login/logout flows
- Validating session persistence
- Testing protected route access
- Authorization scenarios

**Example:**
```bash
/elixir-wallaby test authentication flows:
- Successful login with valid credentials
- Failed login with invalid credentials
- Protected routes redirect to login
- Session persists across page loads
- Logout invalidates session
- User cannot access other user's data
```

**What you'll get:**
- **Authentication Tests**:
  ```elixir
  feature "user can log in", %{session: session} do
    user = insert(:user, email: "user@example.com", password: "password123")
    
    session
    |> visit("/login")
    |> fill_in(text_field("Email"), with: "user@example.com")
    |> fill_in(text_field("Password"), with: "password123")
    |> click(button("Log In"))
    |> assert_has(css(".flash", text: "Logged in successfully"))
    |> assert_path("/dashboard")
  end
  
  feature "invalid credentials show error", %{session: session} do
    session
    |> visit("/login")
    |> fill_in(text_field("Email"), with: "wrong@example.com")
    |> fill_in(text_field("Password"), with: "wrong")
    |> click(button("Log In"))
    |> assert_has(css(".error", text: "Invalid credentials"))
  end
  
  feature "protected route redirects", %{session: session} do
    session
    |> visit("/admin")
    |> assert_path("/login")
  end
  ```
- **Login Helper Functions**
- **Session Cookie Setup** (fast auth)
- **Authorization Tests**
- **Multi-User Scenarios**

**Timeline**: 4 hours

### 6. Optimize Test Selectors for Reliability

**When to use:**
- Tests failing due to UI changes
- Need more reliable selectors
- Improving test maintainability
- Reducing test flakiness

**Example:**
```bash
/elixir-wallaby review and optimize our test selectors. Current issues:
- Many tests use CSS class selectors that break when styling changes
- Fragile XPath selectors
- No consistent selector strategy
- Want to use semantic attributes (data-testid, aria-label)
```

**What you'll get:**
- **Selector Best Practices Guide**
- **Migration Examples**:
  ```elixir
  # BEFORE: Fragile CSS class selectors
  css(".btn-primary.user-profile-edit")
  
  # AFTER: Semantic data-testid
  css("[data-testid='edit-profile-button']")
  
  # BEFORE: Positional selector
  css(".form > div:nth-child(3) > input")
  
  # AFTER: Semantic label
  text_field("Email Address")
  
  # BEFORE: Generic XPath
  Query.xpath("//div[@class='modal']//button[2]")
  
  # AFTER: ARIA label
  css("[aria-label='Close modal']")
  ```
- **Template Updates** (add data-testid attributes)
- **Selector Constants** (@email_field, @submit_button)
- **Refactored Tests**

**Timeline**: 6 hours for 50+ tests

### 7. Integrate Playwright for Advanced Features

**When to use:**
- Need cross-browser testing (Chrome, Firefox, Safari)
- Testing JavaScript-heavy features
- Screenshot comparison testing
- Network request interception

**Example:**
```bash
/elixir-wallaby add Playwright for our JavaScript-heavy dashboard. Requirements:
- Test with Chromium, Firefox, and WebKit
- Verify network requests (API calls)
- Capture screenshots for visual regression
- Test real-time data updates
```

**What you'll get:**
- **Playwright Configuration**:
  ```elixir
  # mix.exs
  {:playwright, "~> 1.40", only: :test}
  
  # config/test.exs
  config :phoenix_test,
    playwright: [
      browser: :chromium,
      headless: true
    ]
  ```
- **Playwright Test Examples**:
  ```elixir
  test "dashboard loads data", %{browser: browser} do
    page = Browser.new_page(browser)
    
    Page.goto(page, "http://localhost:4000/dashboard")
    Page.wait_for_selector(page, "[data-testid='chart']")
    
    # Verify network request
    Page.wait_for_response(page, ~r/api\/metrics/)
    
    # Screenshot
    Page.screenshot(page, %{path: "dashboard.png"})
    
    Page.close(page)
  end
  ```
- **Cross-Browser Test Setup**
- **Network Interception Patterns**
- **Visual Regression Setup**

**Timeline**: 1 day

### 8. Debug Flaky Tests

**When to use:**
- Tests pass sometimes, fail other times
- Race conditions or timing issues
- Intermittent failures in CI
- Need to improve test reliability

**Example:**
```bash
/elixir-wallaby debug flaky test that fails ~20% of the time. Issues:
- "Element not found" errors
- Sometimes passes, sometimes fails on same code
- Fails more often in CI than locally
- Test: User can submit feedback form
```

**What you'll get:**
- **Root Cause Analysis**:
  - Asynchronous content loading without proper waits
  - Race condition in form submission
  - SQL Sandbox not isolating properly
- **Fixes**:
  ```elixir
  # BEFORE: Unreliable
  session
  |> visit("/feedback")
  |> click(button("Submit"))
  |> assert_has(css(".success"))
  
  # AFTER: Reliable with proper wait
  session
  |> visit("/feedback")
  |> fill_in(text_field("Message"), with: "Great app!")
  |> click(button("Submit"))
  |> find(css(".success", timeout: 5000))  # Wait for async
  |> assert_has(css(".success", text: "Thank you"))
  ```
- **Wait Strategy Improvements**
- **SQL Sandbox Verification**
- **CI Configuration Tweaks**

**Timeline**: 3 hours

### 9. Set Up CI/CD Pipeline

**When to use:**
- Integrating E2E tests into CI/CD
- Running tests on every commit
- Automated screenshot capture
- Cross-browser testing in CI

**Example:**
```bash
/elixir-wallaby configure GitHub Actions for E2E tests. Requirements:
- Run on every PR
- Use headless Chrome
- Capture screenshots on failure
- Upload artifacts
- Run in parallel with unit tests
```

**What you'll get:**
- **GitHub Actions Workflow**:
  ```yaml
  name: E2E Tests
  on: [push, pull_request]
  
  jobs:
    e2e:
      runs-on: ubuntu-latest
      services:
        postgres:
          image: postgres:15
      
      steps:
        - uses: actions/checkout@v3
        - uses: erlef/setup-beam@v1
        - name: Install ChromeDriver
          run: sudo apt-get install chromium-chromedriver
        - name: Run tests
          run: mix test --only e2e
        - name: Upload screenshots
          if: failure()
          uses: actions/upload-artifact@v3
          with:
            name: screenshots
            path: test/screenshots/
  ```
- **Headless Configuration**
- **Screenshot Management**
- **Test Retry Logic**
- **Performance Optimization**

**Timeline**: 4 hours

## What You'll Get

Every response includes:

### 1. **Production-Ready Test Code**
   - Complete feature test modules
   - SQL Sandbox integration
   - Page object implementations
   - Custom assertions and helpers
   - Authentication patterns

### 2. **Reliable Test Strategies**
   - Semantic selectors (data-testid, aria-label)
   - Proper wait patterns (no sleep())
   - SQL Sandbox for isolation
   - Screenshot capture on failures
   - Flakiness mitigation techniques

### 3. **Test Organization**
   - Page object pattern
   - Custom helper modules
   - Test fixtures and factories
   - Feature-based organization
   - Tags for selective execution

### 4. **CI/CD Integration**
   - GitHub Actions workflows
   - Headless browser configuration
   - Screenshot artifact management
   - Test retry strategies
   - Parallel execution setup

### 5. **Best Practices**
   - Prefer semantic selectors over CSS classes
   - Use find/2 with timeout for async content
   - Page objects for reusable interactions
   - Session cookies for fast authentication
   - Neo4j knowledge graph updates

### 6. **Documentation**
   - Test suite README
   - Page object documentation
   - Troubleshooting guide
   - Selector strategy guide
   - Team training materials

## Related Commands

- `/elixir-liveview-1-1` - LiveView 1.1+ specific testing
- `/elixir-test` - Unit and integration testing
- `/qa-engineer` - Comprehensive test strategy
- `/playwright-automation` - Advanced Playwright patterns
- `/code-review` - Review E2E tests for best practices

## Key Capabilities

This command leverages the elixir-wallaby-specialist agent, which provides:

- **Wallaby Configuration**: SQL Sandbox setup, ChromeDriver config, AcceptanceCase module
- **LiveView E2E Testing**: Real-time updates, PubSub integration, multi-user scenarios
- **Workflow Testing**: Multi-step user journeys, form submissions, navigation validation
- **Page Object Pattern**: Reusable page interactions, custom assertions, test organization
- **Authentication Testing**: Login/logout flows, session management, protected routes
- **Selector Optimization**: Semantic selectors, reliability improvements, maintainability
- **Playwright Integration**: Cross-browser testing, network interception, screenshots
- **Flakiness Resolution**: Wait strategies, race condition fixes, CI reliability
- **CI/CD Integration**: GitHub Actions, headless mode, artifact management
- **Neo4j Integration**: Store E2E patterns and selector strategies

## Tips for Best Results

1. **Provide Context**: Share existing tests, failing scenarios, or application features
2. **Be Specific**: Describe exact user workflows, authentication requirements, or flakiness patterns
3. **Share Errors**: Include error messages, stack traces, or test output
4. **Mention Environment**: Local vs CI, browser versions, async operations
5. **Clarify Goals**: New tests, debugging, optimization, or CI integration?
6. **Include Constraints**: Test execution time limits, parallel execution needs

## Technical Details

**Powered by:** `.opencode/agent/elixir-specific/elixir-wallaby-specialist.md`  
**MCP Servers:** context7 (Wallaby/Playwright docs), neo4j (pattern storage), sequential-thinking (analysis), playwright (browser automation)  
**Knowledge Graph:** Stores E2E patterns, selector strategies, page objects, and reliability techniques

---

**Note:** This command specializes in E2E testing with Wallaby and Playwright. For LiveView-specific testing use `/elixir-liveview-1-1`, for unit tests use `/elixir-test`, and for comprehensive test strategy use `/qa-engineer`.

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
