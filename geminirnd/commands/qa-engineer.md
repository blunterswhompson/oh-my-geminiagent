---
description: Generate comprehensive test strategies and automated test suites (unit, integration, E2E)
agent: core/qa-test-engineer
subtask: true
---

Design and implement robust test strategies following the testing pyramid with comprehensive edge case coverage, E2E automation with Playwright, and quality metrics tracking.

$ARGUMENTS

!`cat mix.exs | grep -A 10 "defp deps"`
!`ls -la ./test/`
!`mix test --cover 2>/dev/null | tail -20 || echo "No test results yet"`

## What This Command Does

The QA Test Engineer creates comprehensive test strategies and automated test suites:
- **Test Strategy**: Designs risk-based testing approach following 70/20/10 pyramid (unit/integration/E2E)
- **Unit Tests**: Writes extensive unit tests with Arrange-Act-Assert pattern, covering edge cases and boundary conditions
- **Integration Tests**: Validates API endpoints, database interactions, and external service integrations
- **E2E Tests**: Uses Playwright MCP to verify selectors and write reliable browser automation tests
- **Edge Cases**: Systematically identifies and tests edge cases (empty inputs, race conditions, security vulnerabilities)
- **Quality Metrics**: Tracks coverage (>90% target), flakiness (<5%), execution time (<5min), defect escape rate (<10%)

## When to Use This Command

✅ **Use QA Engineer For**:
- Designing comprehensive test strategies for new features
- Writing automated test suites (unit, integration, E2E)
- Identifying and testing edge cases and failure scenarios
- Analyzing test coverage and quality metrics
- Debugging flaky tests or test failures
- Implementing security testing (SQL injection, XSS, CSRF)
- Setting up regression test automation

❌ **Don't Use For**:
- Manual testing or exploratory testing (requires human judgment)
- Performance load testing (use specialized performance tools)
- Accessibility audits (use `playwright-accessibility-auditor` agent)

## Usage Examples

### Example 1: New Feature Test Suite
```bash
# Feature: User authentication with email/password
qa-engineer "Generate comprehensive test suite for user authentication including login, registration, password reset, and account locking"
```

**What you'll get**:
- **Test Strategy** (`test/test_strategy_authentication.md`):
  - Risk level: CRITICAL (security-sensitive)
  - Coverage target: >95%
  - Test pyramid: 45 unit (65%), 18 integration (26%), 6 E2E (9%)
- **Unit Tests** (`test/myapp/accounts_test.exs`):
  - 45 tests covering `register_user/1`, `authenticate/2`, `lock_account/1`
  - Edge cases: concurrent auth, boundary values, race conditions
  - Coverage: 96.2%
- **Integration Tests** (`test/myapp_web/auth_controller_test.exs`):
  - 18 tests for POST /api/auth/login, POST /api/auth/register
  - API contracts validated, rate limiting tested
  - Coverage: 88.7%
- **E2E Tests** (`test/myapp_web/e2e/auth_flow_test.exs`):
  - 6 tests for login flow, registration flow, account lockout
  - Playwright selectors verified against live DOM
  - Execution time: 1m 29s

**Timeline**: 1 day for test strategy + implementation

### Example 2: Bug Fix Verification
```bash
# Bug: Users can access other users' data
qa-engineer "Write tests to verify authorization bug is fixed - users should only access their own data"
```

**What you'll get**:
- **Security Tests** (`test/myapp/authorization_test.exs`):
  - Test: User cannot GET /api/users/{other_user_id}
  - Test: User cannot UPDATE other user's profile
  - Test: User cannot DELETE other user's data
  - Test: Admin CAN access all users (positive case)
- **Regression Tag**: Tests tagged with `@tag :regression` for future CI runs

**Timeline**: 2 hours

### Example 3: Coverage Gap Analysis
```bash
# Current coverage: 73% (target: >90%)
qa-engineer "Analyze test coverage gaps and generate tests to reach 90% coverage for Accounts context"
```

**What you'll get**:
- **Coverage Report Analysis**:
  ```
  lib/myapp/accounts.ex: 73% (96/132 lines)
  Missing coverage:
    - Line 45: OAuth error case (invalid provider)
    - Lines 78-82: Network timeout retry logic
    - Lines 105-110: Concurrent session creation
  ```
- **New Tests** (targeting gaps):
  - Test: OAuth with invalid provider returns {:error, :unsupported_provider}
  - Test: Network timeout triggers 3 retries
  - Test: Concurrent session creation doesn't cause race conditions
- **Updated Coverage**: 92.3% ✅

**Timeline**: 3 hours

### Example 4: E2E Test with Playwright
```bash
# Feature: Checkout flow
qa-engineer "Write E2E test for checkout flow: add item to cart → enter payment info → complete purchase → see confirmation"
```

**What you'll get**:
- **Playwright Selector Discovery** (using MCP):
  ```
  Navigate to http://localhost:4000/products
  Selectors verified:
    - [data-testid='add-to-cart-btn'] ✅
    - [data-testid='cart-icon'] ✅
    - input[name='card_number'] ✅
    - button[type='submit'] ✅
    - [data-testid='order-confirmation'] ✅
  ```
- **E2E Test** (`test/myapp_web/e2e/checkout_flow_test.exs`):
  ```elixir
  test "user can complete checkout flow", %{browser: browser} do
    page = Browser.new_page(browser)
    
    # Add item to cart
    Page.goto(page, "http://localhost:4000/products")
    Page.click(page, "[data-testid='add-to-cart-btn']")
    
    # Go to checkout
    Page.click(page, "[data-testid='cart-icon']")
    Page.click(page, "[data-testid='checkout-btn']")
    
    # Enter payment info (Stripe test card)
    Page.fill(page, "input[name='card_number']", "4242424242424242")
    Page.fill(page, "input[name='exp_month']", "12")
    Page.fill(page, "input[name='exp_year']", "2030")
    Page.fill(page, "input[name='cvc']", "123")
    
    # Submit payment
    Page.click(page, "button[type='submit']")
    
    # Wait for confirmation
    Page.wait_for_selector(page, "[data-testid='order-confirmation']")
    confirmation = Page.text_content(page, "[data-testid='order-confirmation']")
    assert confirmation =~ "Thank you for your order"
  end
  ```
- **Test Reliability**: Selectors verified via Playwright MCP (no guessing)

**Timeline**: 4 hours (includes selector verification)

### Example 5: Edge Case Testing
```bash
# Feature: User registration
qa-engineer "Identify and test all edge cases for user registration including boundary values, concurrent registrations, and malicious inputs"
```

**What you'll get**:
- **Edge Case Catalog** (identified):
  - **Empty/Null Inputs**: nil email, empty string password
  - **Boundary Values**: min password (12 chars), max email (254 chars)
  - **Concurrent Operations**: 10 simultaneous registrations with same email
  - **Security**: SQL injection in email, XSS in name field
  - **Network Issues**: Email service timeout, database connection failure
- **Tests** (`test/myapp/accounts_edge_cases_test.exs`):
  - 15 edge case tests covering all identified scenarios
  - Property-based testing for password validation (ExUnitProperties)
  - Race condition testing with Task.async
- **Coverage**: Edge cases now at 100%

**Timeline**: 4 hours

### Example 6: Performance Testing
```bash
# Feature: Analytics dashboard
qa-engineer "Write performance tests to verify dashboard loads in <1s for 1M user records"
```

**What you'll get**:
- **Performance Test Setup**:
  - Seed script: Generate 1M test records
  - Benchmark tests with :timer.tc
- **Performance Tests** (`test/myapp/analytics_performance_test.exs`):
  ```elixir
  test "dashboard metrics query completes in <1s with 1M records" do
    # Seed 1M records (one-time setup)
    seed_analytics_data(1_000_000)
    
    # Benchmark query
    {elapsed_microseconds, _result} = :timer.tc(fn ->
      Analytics.get_dashboard_metrics()
    end)
    
    elapsed_ms = elapsed_microseconds / 1000
    assert elapsed_ms < 1000, "Query took #{elapsed_ms}ms, expected <1000ms"
  end
  ```
- **Optimization Recommendations**:
  - Add database index on analytics.user_id
  - Use Ecto aggregations instead of Enum
  - Cache results with Cachex (5min TTL)

**Timeline**: 1 day (including performance optimization)

## What You'll Get

After running this command, the QA Test Engineer will deliver:

### 1. Test Strategy Document
```markdown
## Test Strategy: Authentication Feature

**Risk Level**: CRITICAL
**Coverage Target**: >95%
**Test Pyramid**:
- Unit: 45 tests (65%)
- Integration: 18 tests (26%)
- E2E: 6 tests (9%)

**Priority Scenarios**:
- P0: Successful login, registration
- P1: Invalid credentials, account lockout
- P2: Edge cases (concurrent auth, boundary values)

**Edge Cases**:
- Empty/null inputs
- Boundary values (min/max password length)
- Race conditions (concurrent login attempts)
- Security (SQL injection, XSS)
```

### 2. Comprehensive Test Suites
**Unit Tests** (`test/myapp/{context}_test.exs`):
- Arrange-Act-Assert pattern
- Both positive and negative cases
- Edge cases and boundary conditions
- Property-based testing for complex logic
- >90% coverage for critical modules

**Integration Tests** (`test/myapp_web/{controller}_test.exs`):
- API endpoint validation (request → response)
- Database relationship testing
- External service integration (mocked with Mox)
- Transaction and rollback behavior

**E2E Tests** (`test/myapp_web/e2e/{flow}_test.exs`):
- Critical user journeys (login, checkout, onboarding)
- Playwright with verified selectors
- Error scenario coverage
- <5% flakiness rate

### 3. Test Coverage Report
```
Coverage Summary:
  Overall: 92.3% (target: >90%) ✅
  
  lib/myapp/accounts.ex: 96.2% ✅
  lib/myapp/accounts/user.ex: 88.5% ⚠️
    Missing coverage: Lines 34-38 (edge case validation)
  
  lib/myapp_web/controllers/auth_controller.ex: 94.1% ✅

Recommendations:
- Add tests for user.ex lines 34-38 (international email validation)
- Integration tests below target (88.7%), add 2 more tests
```

### 4. Quality Metrics Dashboard
```markdown
## Quality Metrics - Sprint 10

**Coverage**: 92.3% ✅ (target: >90%)
**Flakiness**: 2.3% ✅ (target: <5%)
  - 2 flaky tests identified: auth_flow_test.exs:45, oauth_test.exs:78
**Execution Time**: 3m 42s ✅ (target: <5min)
  - Unit: 45s
  - Integration: 1m 28s
  - E2E: 1m 29s
**Defect Escape Rate**: 7.7% ✅ (target: <10%)
  - Bugs in production: 1
  - Bugs caught in testing: 12

**Test Pyramid Compliance**:
- Unit: 52% ⚠️ (target: 70% - need more unit tests)
- Integration: 41% ⚠️ (target: 20% - too many, move to unit)
- E2E: 7% ✅ (target: 10%)
```

### 5. Edge Case Test Matrix
| Category | Test Count | Examples |
|----------|-----------|----------|
| Empty/Null Inputs | 8 | nil email, empty password |
| Boundary Values | 6 | min password (12 chars), max email (254 chars) |
| Race Conditions | 4 | concurrent auth, concurrent session creation |
| Network Failures | 5 | OAuth timeout, email service down |
| Security | 7 | SQL injection, XSS, CSRF validation |
| Permission | 5 | user access control, admin privileges |

### 6. Neo4j Knowledge Graph Updates
**Stored Patterns**:
- Test strategy for authentication (reusable for other auth features)
- Edge case patterns (concurrent operations, boundary values)
- Quality metrics snapshot (trend analysis over time)
- Playwright selector verification pattern

## How It Works

1. **Strategy Development**: Analyzes risk, defines coverage targets, determines test pyramid ratios
2. **Dependency Analysis**: Uses Neo4j to understand module dependencies and identify integration points
3. **Selector Verification** (E2E): Activates Playwright MCP to verify selectors against live DOM
4. **Unit Test Generation**: Writes extensive unit tests with edge cases and boundary conditions
5. **Integration Test Generation**: Validates API contracts, database interactions, external services
6. **E2E Test Generation**: Writes Playwright tests for critical user journeys with verified selectors
7. **Edge Case Testing**: Systematically identifies and tests empty inputs, race conditions, security
8. **Coverage Analysis**: Measures coverage, identifies gaps, tracks quality metrics
9. **Documentation**: Documents test strategy, maintenance procedures, troubleshooting

## Testing Pyramid Guidelines

**70% Unit Tests** (Fast, isolated, extensive):
- Pure business logic in contexts
- Validation functions
- Utility modules
- Target: <1s execution time for all unit tests

**20% Integration Tests** (API, DB, services):
- Controller endpoints
- Database relationships and transactions
- External service integrations (mocked)
- Target: <2min execution time

**10% E2E Tests** (Critical user journeys only):
- Login/registration flow
- Checkout/payment flow
- Core feature workflows
- Target: <2min execution time

## Quality Metrics Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Coverage** | >90% for critical modules | `mix coveralls` |
| **Flakiness** | <5% failure rate | Run tests 10x, count failures |
| **Execution Time** | <5min full suite | `mix test --slowest 10` |
| **Defect Escape Rate** | <10% | (Production bugs / Total bugs) × 100 |
| **Test Pyramid** | 70/20/10 ratio | Count tests by category |

## Tips for Best Results

- **Specify feature clearly**: "User authentication with email/password" is better than "test auth"
- **Include acceptance criteria**: Provide PRD or user stories if available
- **Mention risk level**: "Critical security feature" guides coverage targets
- **Request specific test types**: "Focus on E2E tests" or "Need edge case coverage"
- **Provide context**: "Current coverage 73%, need to reach 90%" helps prioritization

## Common Edge Cases Checklist

✅ **Input Validation**:
- Empty strings, nil values, undefined
- Boundary values (min/max length, numeric limits)
- Special characters, unicode, whitespace
- SQL injection attempts, XSS payloads

✅ **Concurrency**:
- Race conditions (concurrent updates to same record)
- Deadlocks (circular dependencies)
- Stale data (optimistic locking)

✅ **Network/External**:
- Timeouts, network failures
- API rate limiting (429 responses)
- Partial responses, malformed data

✅ **State Management**:
- Session expiry during operation
- Invalidated tokens/credentials
- Resource exhaustion (connection pool)

✅ **Authorization**:
- User access control (can't access other user's data)
- Permission escalation attempts
- Expired or revoked permissions

## Related Commands

- `/prd-write` - Generate PRD with acceptance criteria first, then use qa-engineer to implement tests
- `/orchestrate-product` - For complex features, orchestrator coordinates QA testing phase
- `/playwright-accessibility-auditor` - Specialized accessibility testing with Playwright

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
