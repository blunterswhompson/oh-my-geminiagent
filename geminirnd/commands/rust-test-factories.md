---
description: Build builder-pattern test factories with fake-rs for random data and async SQLx insert helpers
agent: rust-specific/rust-test-factory-specialist
subtask: true
---

Implement maintainable test data factories for Rust using the builder pattern, `fake` crate for realistic random data, and async SQLx helpers for database-integrated testing.

!`cat Cargo.toml 2>/dev/null | grep -E "(fake|sqlx|uuid|chrono|serde)"`
!`ls -la tests/support/ tests/factories/ src/testing/ 2>/dev/null || echo "No test factory directory found"`

1. **Builder-Pattern Factory Setup**:
   - Define factory structs with `derive(Default)` and optional fields using `Option<T>` overrides
   - Implement `UserFactory::new()` returning `Self::default()` with `fake`-generated sensible defaults
   - Chain setter methods `fn with_email(mut self, email: impl Into<String>) -> Self` for overrides
   - Add `fn build(self) -> User` to construct the domain type from the factory state

2. **Integrating fake-rs for Realistic Data**:
   - Add `fake = { version = "2", features = ["derive"] }` to `[dev-dependencies]`
   - Use `Faker.fake::<String>()`, `Name().fake::<String>()`, `SafeEmail().fake::<String>()` from `fake::faker`
   - Derive `#[derive(Dummy)]` on domain structs for zero-boilerplate automatic fake generation
   - Combine `fake` with `rand::thread_rng()` seeding for deterministic CI test runs when needed

3. **Async SQLx Insert Helpers**:
   - Define `async fn insert_user(pool: &PgPool, factory: UserFactory) -> User` returning the inserted row
   - Use `sqlx::query_as!(User, "INSERT INTO users ... RETURNING *", ...)` for type-safe inserts
   - Accept `&PgPool` or `&mut PgTransaction` for transaction-scoped test isolation
   - Return the fully hydrated domain struct (with DB-generated `id`, `inserted_at`, etc.) from helpers

4. **Relationship and Association Factories**:
   - Build dependent objects automatically: `OrderFactory::new()` calls `insert_user(pool)` if no `user_id` given
   - Use `once_cell::sync::Lazy<PgPool>` or test fixture pattern to share pool across tests
   - Implement `fn with_items(mut self, count: usize) -> Self` to generate nested collections
   - Handle circular dependencies with explicit `user_id: Option<Uuid>` override slots

5. **Best Practices and Test Integration**:
   - Keep factories in `tests/support/factories.rs` or a `testing` feature-gated module
   - Use `#[cfg(test)]` or `#[cfg(feature = "testing")]` to prevent factory code entering production builds
   - Create `params_for` equivalents returning `HashMap<&str, Value>` for API-level handler tests
   - Document each factory with `///` doc comments including example usage snippets


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
