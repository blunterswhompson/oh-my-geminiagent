---
description: Create comprehensive Rust test suites with cargo test, rstest, mockall, and proptest
agent: specialized-agents/rust-tester
subtask: true
---

Comprehensive Rust testing strategies covering cargo test patterns, parameterized testing, mocking, and property-based testing.

!`ls -la ./src/`
!`ls -la ./tests/ 2>/dev/null`
!`cat Cargo.toml 2>/dev/null | grep -A20 "dev-dependencies"`

1. **Test Architecture**:
   - Organize tests: `#[cfg(test)]` mod in `src/` for unit tests, `tests/` for integration.
   - Set up `tests/common/mod.rs` for shared fixtures.
   - Configure dev-dependencies: `rstest`, `mockall`, `proptest`, `tokio`.

2. **Unit & Parameterized Testing**:
   - Use `#[test]` for standard unit tests.
   - Use `rstest` for table-based tests with `#[case]`.
   - Leverage fixtures for common setup.

3. **Mocking with Mockall**:
   - Define traits for dependencies.
   - Use `#[automock]` and set expectations (`expect_...`, `returning`, `with`).
   - Inject mocks into components.

4. **Property-Based Testing**:
   - Use `proptest!` for verifying invariants across random inputs.
   - Define custom strategies for complex domain types.

5. **Async Testing**:
   - Use `#[tokio::test]` for async code.
   - Test streams, channels, and async trait implementations.


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
