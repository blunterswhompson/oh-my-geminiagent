---
description: Create end-to-end browser tests with fantoccini WebDriver client and CI Docker Compose setup
agent: rust-specific/rust-e2e-testing-specialist
subtask: true
---

Implement comprehensive end-to-end browser testing in Rust using the fantoccini WebDriver client to validate complete user workflows, form interactions, and JavaScript-driven UI behavior with CI/CD integration.

!`cat Cargo.toml | grep -E "(fantoccini|thirtyfour|webdriver)"`
!`which geckodriver chromedriver 2>/dev/null || echo 'No WebDriver binary found in PATH'`

1. **fantoccini Setup**:
   - Add `fantoccini` to `[dev-dependencies]` with `tokio` runtime feature enabled
   - Start `geckodriver` (Firefox) or `chromedriver` (Chrome) before running tests; assert port availability
   - Create `tests/e2e/` directory and mark each test with `#[tokio::test]`
   - Connect with `ClientBuilder::native().connect("http://localhost:4444").await?`

2. **Page Interaction Patterns**:
   - Navigate with `client.goto("http://localhost:8080/path").await?`
   - Locate elements using CSS selectors: `client.find(Locator::Css("button[data-test='submit']")).await?`
   - Prefer `data-testid` / `data-test` attributes in markup for stable, refactor-proof selectors
   - Use `element.click().await?` and `element.send_keys("text").await?` for user interactions

3. **Test Workflow Structure**:
   - Test complete user journeys: registration → login → core action → logout
   - Validate form submissions, validation error messages, and success states
   - Use `client.wait().for_element(Locator::Css(".success-banner")).await?` for async UI updates
   - Take screenshots on failure with `client.screenshot().await?` and save to `target/e2e-screenshots/`

4. **Advanced Scenarios**:
   - Handle authentication by setting cookies or JWT headers via `client.set_named_cookie()` 
   - Test file uploads with `element.send_keys("/absolute/path/to/file.txt").await?`
   - Simulate multiple concurrent sessions by spawning parallel `fantoccini::Client` instances
   - Inject JavaScript with `client.execute("return document.title", vec![]).await?` for deep assertions

5. **CI Integration with Docker Compose**:
   - Define a `docker-compose.e2e.yml` with services: `app`, `postgres`, and `selenium/standalone-firefox`
   - Run `docker compose -f docker-compose.e2e.yml up --wait` before `cargo test --test e2e`
   - Set `WEBDRIVER_URL=http://selenium:4444` and `APP_URL=http://app:8080` as environment variables
   - Tear down with `docker compose down -v` in CI post-step to ensure clean state between runs


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
