# Rust Testing Specialist

## Skill Purpose

Expert-level Rust testing strategies and implementation specialist providing comprehensive guidance on modern Rust application testing, from advanced `#[test]` and `cargo test` patterns to cutting-edge property-based testing approaches. This skill covers the full Rust testing ecosystem: unit tests, integration tests, database testing with SQLx, async job worker testing with Apalis, HTTP API testing with Axum, property-based testing with proptest, and production-grade CI/CD pipelines using `cargo nextest` and `cargo-tarpaulin`.

## Core Capabilities

### Advanced `#[test]` and `cargo test` Patterns
- **Custom Test Macros**: Develop proc-macro-based test macros for complex scenario repetition
- **Advanced Setup/Teardown**: `rstest` fixtures with nested scoping and parameterized contexts
- **Async Testing Patterns**: Optimize `#[tokio::test]` parallelism with proper isolation
- **Test Factories**: Builder-pattern test data generation using the `fake` crate and `#[derive(Dummy)]`
- **Mocking and Stubbing**: Advanced `mockall` strategies with `#[automock]`, `mock!`, and async trait support
- **Doc Tests**: `///` examples as living, compiled documentation tests

### SQLx / Database Testing Patterns
- **`#[sqlx::test]` Macro**: Automatic test database provisioning and per-test pool injection
- **Transaction Rollback Isolation**: Each test runs in an isolated transaction rolled back on completion
- **Test Fixtures**: SQL fixture files applied before tests via `#[sqlx::test(fixtures(...))]`
- **TestContainers**: Ephemeral Postgres/MySQL containers via `testcontainers` crate
- **Migration Testing**: Verify migration forward/rollback correctness in isolated environments
- **Query Coverage**: Ensure every SQL query path is exercised without shared state pollution

### Apalis / Async Job Worker Testing
- **Worker Unit Testing**: Isolated job handler logic with mocked storage and service dependencies
- **Integration Testing**: End-to-end job processing with in-memory or SQLx-backed Apalis storage
- **Retry Behavior**: Validate exponential backoff, max attempts, and failure classification
- **Cron Job Testing**: Time-controlled scheduling tests using mock clocks
- **Queue Management**: Priority, concurrency limits, and dead-letter queue verification
- **Performance Testing**: Worker throughput and concurrency under load with `criterion`

### Axum / Leptos Frontend Testing
- **Axum Test Client**: `tower::ServiceExt::oneshot` for lightweight handler-level integration tests
- **Request Building**: Full HTTP request construction with headers, bodies, and auth tokens
- **Response Assertions**: Status codes, JSON body matching, and header verification
- **Middleware Testing**: Auth middleware, rate limiting, and tracing in isolated test setups
- **Leptos Component Testing**: `leptos_test` harness for reactive component isolation
- **State Management**: Testing signal-driven UI state transitions deterministically

### Property-Based Testing with `proptest`
- **Strategy Design**: Custom `Strategy` implementations for complex domain types
- **Property Definition**: Identifying invariants and encoding them as `proptest!` blocks
- **`prop_flat_map`**: Dependent strategy composition for correlated test inputs
- **`#[derive(Arbitrary)]`**: Automatic strategy derivation via `proptest-derive`
- **State Machine Testing**: `prop::collection::vec` of commands driving stateful models
- **Shrinking**: Automatic minimal failure reproduction with configurable `ProptestConfig`

### Test-Driven Development (TDD) Methodology in Rust
- **Red-Green-Refactor**: Master the TDD cycle leveraging Rust's type system as a design oracle
- **Test-First API Design**: Write tests to discover the right abstractions before implementation
- **Incremental Development**: Build functionality behind trait interfaces, test by test
- **Refactoring Safety**: Comprehensive test suites as a refactoring harness
- **Specification by Example**: Tests as executable, always-verified specifications

### CI/CD Integration for Automated Testing
- **`cargo nextest`**: Faster parallel test execution with per-test process isolation
- **Profile Management**: `ci` profile with `fail-fast = false` and JUnit XML output
- **Coverage with `cargo-tarpaulin`**: Line and branch coverage reporting to Codecov/LCOV
- **`cargo-llvm-cov`**: LLVM-instrumented coverage as an alternative to tarpaulin
- **`cargo audit`**: Supply-chain vulnerability scanning integrated into pipelines
- **Test Filtering**: `--test-threads`, `--filter-expr`, and `cargo nextest run -E` DSL
- **Environment Management**: `dotenv`-based test environment, service containers in GitHub Actions

## MCP Server Requirements

### context7
- **Purpose**: Access latest Rust testing crate documentation (`proptest`, `mockall`, `rstest`, `sqlx`, `fake`, `axum`)
- **Usage**: Research current best practices, API signatures, and emerging testing methodologies
- **Integration**: Verify crate version compatibility and retrieve up-to-date code examples

### neo4j
- **Purpose**: Store and analyze testing relationships, dependency graphs, and coverage topology
- **Usage**: Track which tests cover which modules, identify coverage gaps, and model test architecture
- **Integration**: Maintain a knowledge graph of testing strategies and their cross-module relationships

### sequential-thinking
- **Purpose**: Analyze complex testing scenarios and design comprehensive, multi-step strategies
- **Usage**: Break down intricate testing requirements (e.g., async state machines) into actionable phases
- **Integration**: Design testing architectures for complex Rust applications with concurrent workloads

### playwright
- **Purpose**: End-to-end testing of Leptos/Axum web applications in a real browser
- **Usage**: Browser automation for full-stack Rust application testing (WASM frontends, API backends)
- **Integration**: Complement unit and integration tests with real browser scenarios and visual regression

### supabase
- **Purpose**: Integration testing against a real Postgres instance with Row Level Security
- **Usage**: Validate Rust applications that depend on Supabase APIs and database behaviour
- **Integration**: Test data persistence, real-time subscriptions, and auth flows in realistic scenarios

## When to Use

### Comprehensive Testing Strategy Design
- **New Projects**: Design a complete testing architecture from scratch, including module layout, fixture strategy, and CI pipeline
- **Legacy Applications**: Modernize existing `#[test]` suites with property-based coverage, database isolation, and async-safe patterns
- **Complex Domains**: Design testing strategies for sophisticated business logic involving state machines, concurrent operations, or distributed workflows

### Test Architecture Reviews
- **Test Suite Audits**: Evaluate existing test coverage quality, isolation guarantees, and false-positive risk
- **Performance Optimization**: Improve test execution speed using `cargo nextest`, test parallelism, and fixture reuse
- **Maintainability**: Enhance test organization, eliminate test inter-dependency, and improve failure diagnostics

### Advanced Testing Scenarios
- **Property-Based Testing**: Implement sophisticated `proptest` suites to uncover edge cases invisible to example-based tests
- **Integration Testing**: Design database and HTTP integration tests that are isolated, fast, and deterministic
- **Performance Regression**: Establish `criterion` benchmarks in CI to detect throughput regressions automatically

## Testing Patterns and Best Practices

### Unit Testing Fundamentals

#### Standard `#[cfg(test)]` Module
```rust
// src/math.rs
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn divide(a: i32, b: i32) -> i32 {
    if b == 0 {
        panic!("division by zero");
    }
    a / b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_positive_numbers() {
        assert_eq!(add(2, 3), 5, "2 + 3 should equal 5");
    }

    #[test]
    fn test_add_negative_numbers() {
        assert_eq!(add(-1, -1), -2);
    }

    #[test]
    fn test_add_zero_identity() {
        assert_eq!(add(42, 0), 42);
        assert_eq!(add(0, 42), 42);
    }

    #[test]
    #[should_panic(expected = "division by zero")]
    fn test_divide_by_zero_panics() {
        divide(10, 0);
    }

    #[test]
    fn test_divide_evenly() {
        assert_eq!(divide(10, 2), 5);
    }
}
```

#### Catching Panics Without `#[should_panic]`
```rust
use std::panic;

#[test]
fn test_panic_with_catch_unwind() {
    let result = panic::catch_unwind(|| divide(10, 0));
    assert!(result.is_err(), "Expected a panic for division by zero");
    
    // Inspect the panic message
    if let Err(e) = result {
        if let Some(msg) = e.downcast_ref::<&str>() {
            assert!(msg.contains("division by zero"));
        }
    }
}
```

#### Doc Tests as Living Documentation
```rust
/// Calculates the factorial of a non-negative integer.
///
/// # Examples
///
/// ```
/// use myapp::math::factorial;
///
/// assert_eq!(factorial(0), 1);
/// assert_eq!(factorial(5), 120);
/// ```
///
/// # Panics
///
/// Panics if `n` overflows `u64`.
pub fn factorial(n: u64) -> u64 {
    (1..=n).product()
}
```

### Async Testing with Tokio

#### Basic Async Unit Test
```rust
#[tokio::test]
async fn test_fetch_user() {
    let pool = setup_test_db().await;
    let user = fetch_user(&pool, 1).await.unwrap();
    assert_eq!(user.email, "test@example.com");
}
```

#### Controlling Tokio Runtime Flavour
```rust
// Single-threaded runtime for deterministic testing
#[tokio::test(flavor = "current_thread")]
async fn test_sequential_operations() {
    let result = sequential_workflow().await;
    assert!(result.is_ok());
}

// Multi-threaded runtime for concurrency tests
#[tokio::test(flavor = "multi_thread", worker_threads = 4)]
async fn test_concurrent_writes() {
    let handles: Vec<_> = (0..10)
        .map(|i| tokio::spawn(async move { write_record(i).await }))
        .collect();

    for handle in handles {
        assert!(handle.await.unwrap().is_ok());
    }
}
```

#### Async Timeout Assertions
```rust
use tokio::time::{timeout, Duration};

#[tokio::test]
async fn test_operation_completes_within_sla() {
    let result = timeout(Duration::from_millis(100), fast_operation()).await;
    assert!(result.is_ok(), "Operation exceeded 100ms SLA");
}
```

### SQLx Database Testing

#### Automatic Pool Injection with `#[sqlx::test]`
```rust
use sqlx::PgPool;

// sqlx::test automatically:
// 1. Creates an isolated test database
// 2. Runs all migrations
// 3. Injects a PgPool
// 4. Drops the database after the test completes
#[sqlx::test]
async fn test_create_user(pool: PgPool) -> sqlx::Result<()> {
    let user = sqlx::query!(
        "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name",
        "alice@example.com",
        "Alice"
    )
    .fetch_one(&pool)
    .await?;

    assert_eq!(user.email, "alice@example.com");
    assert_eq!(user.name, "Alice");
    Ok(())
}
```

#### Using SQL Fixture Files
```rust
// tests/fixtures/users.sql
// INSERT INTO users (email, name) VALUES ('seed@test.com', 'Seeded User');

#[sqlx::test(fixtures("users", "posts"))]
async fn test_create_comment(pool: PgPool) -> sqlx::Result<()> {
    // Fixtures are applied before this test runs.
    // Supports: fixtures("name") → looks up tests/fixtures/name.sql
    // Or:        fixtures(path = "./tests/data", scripts("users", "posts"))

    let count = sqlx::query_scalar!("SELECT COUNT(*) FROM users")
        .fetch_one(&pool)
        .await?
        .unwrap_or(0);

    assert!(count > 0, "Fixture data should be present");
    Ok(())
}
```

#### Manual Transaction Rollback for Isolation
```rust
#[sqlx::test]
async fn test_user_update_isolation(pool: PgPool) -> sqlx::Result<()> {
    // Begin a transaction that we can roll back to restore state
    let mut tx = pool.begin().await?;

    sqlx::query!("UPDATE users SET name = 'Temporary' WHERE id = 1")
        .execute(&mut *tx)
        .await?;

    let name = sqlx::query_scalar!("SELECT name FROM users WHERE id = 1")
        .fetch_one(&mut *tx)
        .await?;

    assert_eq!(name, "Temporary");

    // Explicitly roll back — though sqlx::test handles cleanup automatically,
    // this pattern is useful for mid-test state verification.
    tx.rollback().await?;
    Ok(())
}
```

### Mockall Trait Mocking

#### Basic Sync Trait Mock with `#[automock]`
```rust
use mockall::*;
use mockall::predicate::*;
use uuid::Uuid;

#[automock]
trait UserRepository {
    fn find_by_id(&self, id: Uuid) -> Result<User, DbError>;
    fn save(&self, user: &User) -> Result<User, DbError>;
    fn delete(&self, id: Uuid) -> Result<(), DbError>;
}

#[test]
fn test_user_service_find() {
    let test_id = Uuid::new_v4();
    let expected_user = User { id: test_id, email: "alice@test.com".into() };

    let mut mock = MockUserRepository::new();
    mock.expect_find_by_id()
        .with(eq(test_id))
        .times(1)
        .returning(move |_| Ok(expected_user.clone()));

    let service = UserService::new(Box::new(mock));
    let result = service.get_user(test_id);
    assert!(result.is_ok());
    assert_eq!(result.unwrap().email, "alice@test.com");
}
```

#### Async Trait Mocking (requires `async_trait`)
```rust
use async_trait::async_trait;
use mockall::*;
use mockall::predicate::*;
use std::sync::Arc;
use uuid::Uuid;

// IMPORTANT: #[automock] must come BEFORE #[async_trait]
#[automock]
#[async_trait]
trait UserRepository: Send + Sync {
    async fn find_by_id(&self, id: Uuid) -> Result<User, DbError>;
    async fn save(&self, user: User) -> Result<User, DbError>;
}

#[tokio::test]
async fn test_user_service_async() {
    let test_id = Uuid::new_v4();

    let mut mock = MockUserRepository::new();
    mock.expect_find_by_id()
        .with(eq(test_id))
        .times(1)
        .returning(move |id| {
            Ok(User { id, email: "test@test.com".into() })
        });

    let service = UserService::new(Arc::new(mock));
    let result = service.get_user(test_id).await;

    assert!(result.is_ok());
    assert_eq!(result.unwrap().email, "test@test.com");
}
```

#### Advanced Expectations: Sequences and Call Counts
```rust
use mockall::Sequence;

#[test]
fn test_operations_execute_in_order() {
    let mut seq = Sequence::new();
    let mut mock = MockEventPublisher::new();

    mock.expect_publish()
        .with(eq("user.created"))
        .times(1)
        .in_sequence(&mut seq)
        .returning(|_| Ok(()));

    mock.expect_publish()
        .with(eq("email.queued"))
        .times(1)
        .in_sequence(&mut seq)
        .returning(|_| Ok(()));

    let service = NotificationService::new(Box::new(mock));
    service.on_user_created("user-123").unwrap();
    // mock verifies call order on drop
}
```

#### Mocking with `withf` for Complex Argument Matching
```rust
#[test]
fn test_complex_argument_matching() {
    let mut mock = MockEmailService::new();

    mock.expect_send()
        .withf(|email| {
            email.to.contains('@') && email.subject.len() > 0
        })
        .times(1)
        .returning(|_| Ok(()));

    let service = UserService::new(Box::new(mock));
    service.welcome_user("alice@example.com").unwrap();
}
```

### Mockito for HTTP Mocking
```rust
use mockito::{Server, Matcher};

#[tokio::test]
async fn test_external_api_client() {
    let mut server = Server::new_async().await;

    let mock = server.mock("GET", "/api/users/1")
        .with_status(200)
        .with_header("content-type", "application/json")
        .with_body(r#"{"id": 1, "name": "Alice"}"#)
        .create_async()
        .await;

    let client = ApiClient::new(server.url());
    let user = client.get_user(1).await.unwrap();

    assert_eq!(user.name, "Alice");
    mock.assert_async().await;
}
```

### Property-Based Testing with `proptest`

#### Basic Property Tests
```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_email_validation(s in "[a-z]{1,10}@[a-z]{1,10}\\.(com|org|net)") {
        let result = validate_email(&s);
        prop_assert!(result.is_ok(), "Valid email format should pass: {}", s);
    }

    #[test]
    fn test_sort_idempotent(mut v in prop::collection::vec(any::<i32>(), 0..100)) {
        v.sort();
        let sorted_once = v.clone();
        v.sort();
        prop_assert_eq!(sorted_once, v, "Sorting twice must equal sorting once");
    }

    #[test]
    fn test_string_round_trip(s in "\\PC*") {
        let encoded = base64_encode(&s);
        let decoded = base64_decode(&encoded).unwrap();
        prop_assert_eq!(s, decoded);
    }
}
```

#### Custom Domain Strategies
```rust
use proptest::prelude::*;

fn email_strategy() -> impl Strategy<Value = String> {
    (
        "[a-z]{1,15}",
        "[a-z]{1,10}",
        prop::sample::select(vec!["com", "org", "net", "io", "dev"]),
    )
        .prop_map(|(local, domain, tld)| format!("{}@{}.{}", local, domain, tld))
}

fn user_strategy() -> impl Strategy<Value = CreateUserRequest> {
    (email_strategy(), "[A-Za-z ]{2,50}", 18u32..120u32).prop_map(|(email, name, age)| {
        CreateUserRequest { email, name, age }
    })
}

proptest! {
    #[test]
    fn test_user_creation_with_valid_data(user in user_strategy()) {
        let result = create_user(user);
        prop_assert!(result.is_ok());
    }

    #[test]
    fn test_engagement_rate_bounded(
        likes in 0u64..1_000_000,
        retweets in 0u64..1_000_000,
        views in 1u64..10_000_000,
    ) {
        let rate = calculate_engagement_rate(likes, retweets, views);
        prop_assert!(rate >= 0.0, "Engagement rate must be non-negative");
        prop_assert!(rate <= 100.0, "Engagement rate must not exceed 100%");
    }
}
```

#### Dependent Strategies with `prop_flat_map`
```rust
use proptest::prelude::*;

fn vec_and_valid_index() -> impl Strategy<Value = (Vec<String>, usize)> {
    prop::collection::vec("[a-z]{1,10}", 1..50).prop_flat_map(|vec| {
        let len = vec.len();
        (Just(vec), 0..len)
    })
}

proptest! {
    #[test]
    fn test_index_always_in_bounds((items, idx) in vec_and_valid_index()) {
        // This strategy guarantees idx < items.len() — no bound check failures
        let _item = &items[idx];
    }
}
```

#### `#[derive(Arbitrary)]` with `proptest-derive`
```rust
use proptest::prelude::*;
use proptest_derive::Arbitrary;

#[derive(Debug, Clone, Arbitrary)]
struct UserProfile {
    #[proptest(strategy = "\"[a-z]{1,15}@[a-z]{1,10}\\.com\".prop_map(|s| s)")]
    email: String,

    #[proptest(strategy = "1u32..120")]
    age: u32,

    #[proptest(strategy = "prop::bool::ANY")]
    is_active: bool,
}

proptest! {
    #[test]
    fn test_profile_serialization(profile in any::<UserProfile>()) {
        let json = serde_json::to_string(&profile).unwrap();
        let restored: UserProfile = serde_json::from_str(&json).unwrap();
        prop_assert_eq!(profile.age, restored.age);
        prop_assert_eq!(profile.email, restored.email);
    }
}
```

#### State Machine Property Testing
```rust
use proptest::prelude::*;

#[derive(Debug, Clone, PartialEq)]
enum OrderStatus { Pending, Processing, Shipped, Delivered, Cancelled }

#[derive(Debug, Clone, Arbitrary)]
enum OrderCommand { Process, Ship, Deliver, Cancel }

fn order_command_strategy() -> impl Strategy<Value = OrderCommand> {
    prop_oneof![
        3 => Just(OrderCommand::Process),
        3 => Just(OrderCommand::Ship),
        3 => Just(OrderCommand::Deliver),
        1 => Just(OrderCommand::Cancel),
    ]
}

proptest! {
    #[test]
    fn test_order_state_machine(
        commands in prop::collection::vec(order_command_strategy(), 1..20)
    ) {
        let mut order = Order::new(); // Starts as Pending

        for cmd in commands {
            // Errors on invalid transitions are acceptable — they're part of the state machine
            let _ = order.apply(cmd);
        }

        // Core invariant: state is always a known valid variant
        prop_assert!(
            matches!(
                order.status(),
                OrderStatus::Pending
                    | OrderStatus::Processing
                    | OrderStatus::Shipped
                    | OrderStatus::Delivered
                    | OrderStatus::Cancelled
            ),
            "Order ended in an unknown state: {:?}",
            order.status()
        );
    }

    #[test]
    fn test_delivered_order_cannot_be_cancelled(
        commands in prop::collection::vec(order_command_strategy(), 1..15)
    ) {
        let mut order = Order::new();

        for cmd in commands {
            let _ = order.apply(cmd);
        }

        if order.status() == OrderStatus::Delivered {
            let result = order.apply(OrderCommand::Cancel);
            prop_assert!(result.is_err(), "Delivered orders cannot be cancelled");
        }
    }
}
```

### Parameterized Tests with `rstest`

#### Basic Case-Based Parameterization
```rust
use rstest::rstest;

#[rstest]
#[case(0, "zero")]
#[case(1, "one")]
#[case(42, "forty-two")]
#[case(-1, "negative one")]
fn test_number_to_word(#[case] input: i32, #[case] expected: &str) {
    assert_eq!(number_to_word(input), expected);
}
```

#### Fixtures and Cross-Product Cases
```rust
use rstest::{fixture, rstest};

#[fixture]
fn default_config() -> AppConfig {
    AppConfig {
        max_connections: 10,
        timeout_ms: 1000,
        retry_count: 3,
    }
}

#[rstest]
#[case("admin@example.com", Role::Admin)]
#[case("user@example.com", Role::User)]
#[case("guest@example.com", Role::Guest)]
fn test_role_assignment(
    default_config: AppConfig,
    #[case] email: &str,
    #[case] expected_role: Role,
) {
    let result = assign_role(&default_config, email);
    assert_eq!(result, expected_role);
}
```

#### Async rstest with Tokio
```rust
use rstest::rstest;

#[fixture]
async fn test_pool() -> PgPool {
    setup_test_db().await
}

#[rstest]
#[tokio::test]
#[case("alice@example.com", true)]
#[case("not-an-email", false)]
#[case("", false)]
async fn test_async_email_validation(
    #[case] email: &str,
    #[case] should_succeed: bool,
) {
    let result = validate_and_register_email(email).await;
    assert_eq!(result.is_ok(), should_succeed, "Email: {}", email);
}
```

### Test Data Factories with `fake` Crate

#### Builder Pattern Replacing ExMachina
```rust
use fake::{Fake, Faker};
use fake::faker::internet::raw::*;
use fake::faker::name::raw::*;
use fake::locales::EN;

/// A builder for `CreateUserRequest` that uses realistic fake data as defaults.
/// Mirrors ExMachina factory patterns from Elixir.
struct UserBuilder {
    email: Option<String>,
    name: Option<String>,
    role: Option<Role>,
}

impl UserBuilder {
    fn new() -> Self {
        Self { email: None, name: None, role: None }
    }

    fn email(mut self, email: impl Into<String>) -> Self {
        self.email = Some(email.into());
        self
    }

    fn name(mut self, name: impl Into<String>) -> Self {
        self.name = Some(name.into());
        self
    }

    fn role(mut self, role: Role) -> Self {
        self.role = Some(role);
        self
    }

    fn admin(self) -> Self {
        self.role(Role::Admin)
    }

    fn build(self) -> CreateUserRequest {
        CreateUserRequest {
            email: self.email.unwrap_or_else(|| SafeEmail(EN).fake()),
            name: self.name.unwrap_or_else(|| Name(EN).fake()),
            role: self.role.unwrap_or(Role::User),
        }
    }
}

// Usage in tests:
#[test]
fn test_admin_can_delete_user() {
    let admin = UserBuilder::new().admin().build();
    let target = UserBuilder::new().build();
    
    let result = delete_user(&admin, target.id);
    assert!(result.is_ok());
}
```

#### `#[derive(Dummy)]` for Automatic Fake Data
```rust
use fake::{Dummy, Fake, Faker};

#[derive(Debug, Clone, Dummy)]
pub struct Order {
    #[dummy(faker = "1000..9999")]
    pub order_id: u32,

    #[dummy(faker = "Name()")]
    pub customer_name: String,

    #[dummy(faker = "Boolean(70)")]  // 70% chance of true
    pub paid: bool,

    #[dummy(expr = "\"USD\".into()")]
    pub currency: String,
}

#[test]
fn test_order_processing_with_fake_data() {
    let order: Order = Faker.fake();
    let result = process_order(&order);
    assert!(result.is_ok(), "Processing should succeed for any valid Order");
}

#[test]
fn test_batch_order_processing() {
    let orders: Vec<Order> = (0..100).map(|_| Faker.fake()).collect();
    for order in orders {
        let result = process_order(&order);
        assert!(result.is_ok());
    }
}
```

### Axum HTTP Integration Testing

#### Handler-Level Test with `tower::ServiceExt`
```rust
use axum::{
    body::Body,
    http::{Request, StatusCode},
    Router,
};
use tower::ServiceExt;
use serde_json::{json, Value};

fn create_test_app() -> Router {
    create_router()  // Your production router
}

#[tokio::test]
async fn test_create_user_endpoint() {
    let app = create_test_app();

    let request = Request::builder()
        .method("POST")
        .uri("/users")
        .header("content-type", "application/json")
        .body(Body::from(r#"{"email":"test@test.com","name":"Test User"}"#))
        .unwrap();

    let response = app.oneshot(request).await.unwrap();

    assert_eq!(response.status(), StatusCode::CREATED);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let json: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(json["email"], "test@test.com");
}

#[tokio::test]
async fn test_get_user_not_found() {
    let app = create_test_app();

    let request = Request::builder()
        .method("GET")
        .uri("/users/99999")
        .body(Body::empty())
        .unwrap();

    let response = app.oneshot(request).await.unwrap();
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_create_user_validation_failure() {
    let app = create_test_app();

    let request = Request::builder()
        .method("POST")
        .uri("/users")
        .header("content-type", "application/json")
        .body(Body::from(r#"{"email":"not-an-email"}"#))
        .unwrap();

    let response = app.oneshot(request).await.unwrap();
    assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);
}
```

#### Testing with Authentication Middleware
```rust
use axum::http::header;

#[tokio::test]
async fn test_protected_endpoint_requires_auth() {
    let app = create_test_app();

    // Without auth header
    let request = Request::builder()
        .method("GET")
        .uri("/admin/users")
        .body(Body::empty())
        .unwrap();

    let response = app.clone().oneshot(request).await.unwrap();
    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);

    // With valid auth header
    let token = generate_test_jwt("user-123", Role::Admin);
    let request = Request::builder()
        .method("GET")
        .uri("/admin/users")
        .header(header::AUTHORIZATION, format!("Bearer {}", token))
        .body(Body::empty())
        .unwrap();

    let response = app.oneshot(request).await.unwrap();
    assert_eq!(response.status(), StatusCode::OK);
}
```

### Apalis Job Worker Testing

#### Unit Testing an Apalis Job Handler
```rust
use apalis::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct WelcomeEmail {
    user_id: String,
    email: String,
}

async fn send_welcome_email(
    job: WelcomeEmail,
    email_service: Data<Arc<dyn EmailService>>,
) -> Result<(), Error> {
    email_service.send_welcome(&job.email).await?;
    Ok(())
}

#[tokio::test]
async fn test_welcome_email_job_success() {
    let mut mock_email = MockEmailService::new();
    mock_email
        .expect_send_welcome()
        .with(eq("alice@example.com"))
        .times(1)
        .returning(|_| Ok(()));

    let job = WelcomeEmail {
        user_id: "user-1".into(),
        email: "alice@example.com".into(),
    };

    // Directly call the handler function for pure unit testing
    let result = send_welcome_email(
        job,
        Data::new(Arc::new(mock_email) as Arc<dyn EmailService>),
    )
    .await;

    assert!(result.is_ok());
}

#[tokio::test]
async fn test_welcome_email_job_handles_missing_user() {
    let mut mock_email = MockEmailService::new();
    mock_email
        .expect_send_welcome()
        .returning(|_| Err(EmailError::UserNotFound));

    let job = WelcomeEmail {
        user_id: "nonexistent".into(),
        email: "ghost@example.com".into(),
    };

    let result = send_welcome_email(
        job,
        Data::new(Arc::new(mock_email) as Arc<dyn EmailService>),
    )
    .await;

    // Job should fail gracefully — the worker runtime handles retries
    assert!(result.is_err());
}
```

### Test Helpers and Shared Fixtures

#### `tests/common/mod.rs` — Shared Test Infrastructure
```rust
// tests/common/mod.rs
use sqlx::PgPool;
use std::sync::OnceLock;

/// Initialize tracing for tests. Call at the start of integration test suites.
pub fn init_test_tracing() {
    static TRACING: OnceLock<()> = OnceLock::new();
    TRACING.get_or_init(|| {
        tracing_subscriber::fmt()
            .with_env_filter("debug")
            .with_test_writer()
            .init();
    });
}

/// Create a test application with an injected database pool.
pub async fn create_test_app(pool: PgPool) -> axum::Router {
    let state = AppState { pool, /* ... */ };
    crate::router::create_router(state)
}

/// Assert a JSON response body matches expected fields.
pub async fn assert_json_body(
    response: axum::response::Response,
    expected: serde_json::Value,
) {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let actual: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(actual, expected);
}
```

#### Custom Test Assertion Macros
```rust
/// Asserts that a Result is Ok and returns the inner value, with a helpful error message.
#[macro_export]
macro_rules! assert_ok {
    ($result:expr) => {
        match $result {
            Ok(val) => val,
            Err(e) => panic!("Expected Ok, got Err: {:?}", e),
        }
    };
    ($result:expr, $msg:literal) => {
        match $result {
            Ok(val) => val,
            Err(e) => panic!("{}: {:?}", $msg, e),
        }
    };
}

/// Asserts that a Result is Err with a specific error variant.
#[macro_export]
macro_rules! assert_err_kind {
    ($result:expr, $pattern:pat) => {
        match $result {
            Err($pattern) => {}
            other => panic!("Expected specific Err variant, got: {:?}", other),
        }
    };
}

// Usage:
#[test]
fn test_macros_in_action() {
    let user = assert_ok!(create_user("alice@test.com"), "User creation failed");
    assert_eq!(user.email, "alice@test.com");
    
    let result = create_user("bad-email");
    assert_err_kind!(result, AppError::ValidationError(_));
}
```

### Advanced Testing Patterns

#### Testing Error Propagation Chains
```rust
#[test]
fn test_error_context_preserved() {
    let result = service_that_wraps_errors();
    
    let err = result.unwrap_err();
    
    // With `anyhow`: verify the error chain
    assert!(format!("{:?}", err).contains("database connection failed"));
    
    // With thiserror enums: pattern match
    match err {
        AppError::Database(db_err) => {
            assert!(matches!(db_err, DbError::ConnectionFailed(_)));
        }
        other => panic!("Unexpected error type: {:?}", other),
    }
}
```

#### Testing Concurrent Access Safety
```rust
use std::sync::Arc;
use tokio::sync::Barrier;

#[tokio::test]
async fn test_concurrent_cache_access_is_safe() {
    let cache = Arc::new(UserCache::new());
    let barrier = Arc::new(Barrier::new(20));

    let handles: Vec<_> = (0..20)
        .map(|i| {
            let cache = Arc::clone(&cache);
            let barrier = Arc::clone(&barrier);
            tokio::spawn(async move {
                barrier.wait().await; // All goroutines start simultaneously
                cache.get_or_insert(i, || async { fetch_user(i).await }).await
            })
        })
        .collect();

    let results: Vec<_> = futures::future::join_all(handles).await;
    for result in results {
        assert!(result.unwrap().is_ok(), "Concurrent cache access should be safe");
    }
}
```

#### Testing with `insta` for Snapshot Testing
```rust
// Add `insta` to dev-dependencies for snapshot testing
use insta::assert_json_snapshot;

#[test]
fn test_user_serialization_snapshot() {
    let user = User {
        id: Uuid::parse_str("550e8400-e29b-41d4-a716-446655440000").unwrap(),
        email: "alice@example.com".into(),
        created_at: fixed_timestamp(),
    };

    // On first run, creates a snapshot file.
    // On subsequent runs, compares against it.
    assert_json_snapshot!(user, {
        ".created_at" => "[timestamp]"  // Redact dynamic fields
    });
}
```

## Performance Testing Integration

### Criterion Benchmarks
```rust
// benches/performance.rs
use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion, Throughput};

fn bench_user_creation(c: &mut Criterion) {
    c.bench_function("create_user_single", |b| {
        b.iter(|| create_user(black_box("bench@example.com")))
    });
}

fn bench_batch_processing(c: &mut Criterion) {
    let mut group = c.benchmark_group("batch_processing");

    for size in [10, 100, 1_000, 10_000].iter() {
        group.throughput(Throughput::Elements(*size as u64));
        group.bench_with_input(
            BenchmarkId::from_parameter(size),
            size,
            |b, &size| {
                let batch: Vec<_> = (0..size)
                    .map(|i| format!("user{}@bench.com", i))
                    .collect();
                b.iter(|| process_batch(black_box(&batch)))
            },
        );
    }
    group.finish();
}

fn bench_hash_algorithms(c: &mut Criterion) {
    let mut group = c.benchmark_group("password_hashing");
    let password = "correct-horse-battery-staple";

    group.bench_function("bcrypt_cost_10", |b| {
        b.iter(|| hash_password_bcrypt(black_box(password), 10))
    });

    group.bench_function("argon2_default", |b| {
        b.iter(|| hash_password_argon2(black_box(password)))
    });

    group.finish();
}

criterion_group!(benches, bench_user_creation, bench_batch_processing, bench_hash_algorithms);
criterion_main!(benches);
```

### Async Performance Testing
```rust
#[tokio::test]
#[ignore = "run with: cargo test --release -- --include-ignored perf"]
async fn test_registration_throughput() {
    let pool = setup_perf_test_db().await;
    let start = std::time::Instant::now();
    let user_count = 1_000;

    let handles: Vec<_> = (0..user_count)
        .map(|i| {
            let pool = pool.clone();
            tokio::spawn(async move {
                register_user(&pool, format!("user{}@perf.com", i)).await
            })
        })
        .collect();

    let results = futures::future::join_all(handles).await;
    let duration = start.elapsed();

    let successes = results.iter().filter(|r| r.as_ref().unwrap().is_ok()).count();
    assert_eq!(successes, user_count);

    let throughput = user_count as f64 / duration.as_secs_f64();
    println!("Throughput: {:.1} registrations/sec", throughput);

    // Assert minimum throughput SLA
    assert!(throughput > 100.0, "Expected >100 reg/sec, got {:.1}", throughput);
}
```

## CI/CD Integration

### GitHub Actions Configuration
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_USER: postgres
          POSTGRES_DB: myapp_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    env:
      DATABASE_URL: postgres://postgres:postgres@localhost:5432/myapp_test
      SQLX_OFFLINE: true  # Use pre-generated query metadata in CI

    steps:
      - uses: actions/checkout@v4

      - name: Install Rust toolchain
        uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt, clippy

      - name: Cache Rust dependencies
        uses: Swatinem/rust-cache@v2

      - name: Check formatting
        run: cargo fmt --all -- --check

      - name: Run Clippy
        run: cargo clippy --all-targets --all-features -- -D warnings

      - name: Install cargo-nextest
        uses: taiki-e/install-action@nextest

      - name: Run tests
        run: cargo nextest run --profile ci

      - name: Run doc tests
        run: cargo test --doc

      - name: Install cargo-tarpaulin
        uses: taiki-e/install-action@cargo-tarpaulin

      - name: Generate coverage report
        run: >
          cargo tarpaulin
          --all-features
          --workspace
          --timeout 120
          --out Xml
          --exclude-files "tests/*" "benches/*"

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          file: cobertura.xml
          fail_ci_if_error: true

      - name: Run security audit
        run: cargo audit

  bench:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: Swatinem/rust-cache@v2
      - name: Run benchmarks
        run: cargo bench --all -- --output-format bencher | tee bench_output.txt
```

### `cargo nextest` Configuration (`.config/nextest.toml`)
```toml
[profile.default]
# Maximum parallel test threads
test-threads = "num-cpus"

[profile.ci]
# Don't cancel the whole suite on the first failure — see all failures
fail-fast = false

# Retry flaky tests up to 2 times before marking as failed
retries = 2

# Emit JUnit XML for CI reporting
[profile.ci.junit]
path = "junit.xml"

[profile.default.default-filter]
# Exclude slow integration tests from default runs
# Run them explicitly with: cargo nextest run -E 'package(myapp-integration)'
# (Uncomment if needed)
# expression = 'not test(/slow_/)'
```

### Running Tests Locally
```bash
# Run all tests (faster than cargo test)
cargo nextest run

# Run a specific test by name filter
cargo nextest run test_create_user

# Run tests with a specific profile
cargo nextest run --profile ci

# Run only unit tests (in-crate #[cfg(test)] modules)
cargo nextest run --lib

# Run only integration tests
cargo nextest run --test '*'

# Run doc tests
cargo test --doc

# Run with coverage
cargo tarpaulin --out Html --open

# Run benchmarks
cargo bench

# Run benchmarks for a specific function
cargo bench -- bench_user_creation
```

## Testing Architecture Patterns

### Directory Structure
```
.
├── Cargo.toml
├── .config/
│   └── nextest.toml              # cargo-nextest configuration
├── src/
│   ├── lib.rs                    # Doc tests (/// examples)
│   ├── main.rs                   # Application entry point
│   ├── domain/
│   │   ├── user.rs               # #[cfg(test)] mod tests { ... }
│   │   └── order.rs              # Unit tests alongside source
│   ├── repository/
│   │   ├── user_repo.rs          # Unit tests with mock DB
│   │   └── order_repo.rs
│   └── service/
│       └── user_service.rs       # Unit tests with mockall
├── tests/                        # Integration tests (separate crate boundary)
│   ├── common/
│   │   └── mod.rs                # Shared helpers: init_tracing, test_app, builders
│   ├── api/
│   │   ├── users_test.rs         # Axum endpoint integration tests
│   │   └── orders_test.rs
│   ├── database/
│   │   └── user_repo_test.rs     # sqlx::test integration tests
│   └── workers/
│       └── email_worker_test.rs  # Apalis job integration tests
├── tests/fixtures/               # SQL fixture files for sqlx::test
│   ├── users.sql
│   └── posts.sql
└── benches/
    └── performance.rs            # Criterion benchmarks
```

### Test Module Naming Conventions
```rust
// src/service/user_service.rs

pub struct UserService { /* ... */ }

impl UserService {
    pub fn new(/* ... */) -> Self { /* ... */ }
    pub async fn get_user(&self, id: Uuid) -> Result<User, AppError> { /* ... */ }
    pub async fn create_user(&self, req: CreateUserRequest) -> Result<User, AppError> { /* ... */ }
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockall::predicate::*;

    // Helper function — not a test itself
    fn make_test_request() -> CreateUserRequest {
        CreateUserRequest {
            email: "test@example.com".into(),
            name: "Test User".into(),
        }
    }

    mod get_user {
        use super::*;

        #[tokio::test]
        async fn returns_user_when_found() { /* ... */ }

        #[tokio::test]
        async fn returns_not_found_error_for_unknown_id() { /* ... */ }
    }

    mod create_user {
        use super::*;

        #[tokio::test]
        async fn creates_user_with_valid_data() { /* ... */ }

        #[tokio::test]
        async fn rejects_duplicate_email() { /* ... */ }

        #[tokio::test]
        async fn rejects_invalid_email_format() { /* ... */ }
    }
}
```

## Review Checklist

Before marking a test suite as production-ready, verify:

### Correctness
- [ ] Tests written for the happy path, edge cases (empty, zero, max), and error paths
- [ ] Property-based tests cover invariants for any data-intensive logic
- [ ] State machine tests verify all valid and invalid transitions

### Isolation
- [ ] No `static` mutable state shared between tests without proper synchronization
- [ ] Database tests use `#[sqlx::test]` (isolated pool) or explicit rollback
- [ ] Mock expectations are verified on drop — no silently unsatisfied mocks

### Code Quality
- [ ] No `unwrap()` in tests without a comment explaining why panicking is acceptable
- [ ] `assert!` calls include meaningful failure messages: `assert!(cond, "Expected X because Y")`
- [ ] Test names describe behaviour, not implementation: `returns_not_found_for_deleted_user` not `test_get_2`

### Coverage
- [ ] Core business logic: 95%+ line coverage
- [ ] Public API surface: 90%+ line coverage
- [ ] Overall project: 85%+ line coverage
- [ ] `cargo tarpaulin` or `cargo-llvm-cov` integrated into CI

### Performance
- [ ] Unit tests run in < 1ms each (no I/O, no sleeps)
- [ ] Integration tests use connection pooling and avoid unnecessary setup overhead
- [ ] `cargo nextest` used in CI for parallel execution and process isolation
- [ ] `#[ignore]` tag applied to slow tests; run explicitly with `--include-ignored`

### Documentation
- [ ] Doc tests provided for all public functions
- [ ] Complex test scenarios have comments explaining the scenario being verified
- [ ] `tests/common/mod.rs` documents shared helpers

This comprehensive Rust testing specialist skill provides expert-level guidance for designing, implementing, and maintaining robust testing strategies across the entire Rust ecosystem, from fast unit tests leveraging the borrow checker to complex async integration scenarios, property-based testing with `proptest`, and automated CI/CD pipelines with `cargo nextest` and `cargo-tarpaulin`.
