---
description: Set up WebDriver browser automation with fantoccini or thirtyfour for E2E testing Rust web applications
agent: rust-specific/rust-e2e-testing-specialist
subtask: true
---

Implement end-to-end browser automation tests for Rust web applications using fantoccini or thirtyfour WebDriver clients, with Docker Compose CI configuration and SQL-safe test isolation.

!`cat Cargo.toml 2>/dev/null | grep -E "(fantoccini|thirtyfour|tokio|serde_json)"`
!`which geckodriver 2>/dev/null || which chromedriver 2>/dev/null || echo "No WebDriver binary found in PATH"`

1. **WebDriver Client Setup with fantoccini**:
   - Add `fantoccini = "0.21"` and `tokio = { features = ["full"] }` to `[dev-dependencies]`
   - Start a `ClientBuilder::native()` connection to `http://localhost:4444` in `#[tokio::test]`
   - Use `client.goto("http://localhost:8080/login")` to navigate and `client.find(Locator::Css(".btn"))` to locate elements
   - Tear down sessions with `client.close().await` in test cleanup — always wrap in `scopeguard::defer!`

2. **thirtyfour Alternative**:
   - Add `thirtyfour = "0.31"` for a higher-level API with built-in wait utilities
   - Use `WebDriver::new("http://localhost:4444", DesiredCapabilities::chrome()).await?` for initialization
   - Query elements with `driver.find(By::Css(".submit-btn")).await?` and `element.click().await?`
   - Implement `driver.query(By::Css(".toast")).first().await?` with built-in polling and timeout

3. **Browser Automation Test Patterns**:
   - Write login flow: `find(email) → send_keys → find(password) → send_keys → find(submit) → click`
   - Assert page state with `element.text().await?` and `element.attr("class").await?`
   - Handle async content with `client.wait().for_element(Locator::Css(".loaded")).await`
   - Capture screenshots on failure: `client.screenshot().await?` → write to `test-artifacts/`

4. **Docker Compose for CI**:
   - Define `services.selenium` using `selenium/standalone-chrome:latest` on port `4444`
   - Add `services.app` with your Rust web server image, health check on `/health`
   - Set `depends_on: [selenium, app]` on the test runner service
   - Configure `RUST_LOG=debug` and `WEBDRIVER_URL=http://selenium:4444` env vars in test service

5. **Test Isolation and Reliability**:
   - Reset database state between tests using `sqlx::migrate!` rollback or truncation helpers
   - Use unique test user credentials per test to avoid cross-test state pollution
   - Implement retry logic for flaky WebDriver commands with `tokio::time::timeout` wrappers
   - Tag slow E2E tests with `#[ignore]` and run explicitly in CI with `cargo test --ignored`


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
