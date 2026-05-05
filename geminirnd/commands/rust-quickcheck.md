---
description: Implement quickcheck property tests with custom Arbitrary instances for Rust types
agent: rust-specific/rust-quickcheck-specialist
subtask: true
---

Implement QuickCheck property-based testing for Rust — defining custom `Arbitrary` instances, writing property functions, and running shrinking-enabled tests with `cargo test`.

!`cat Cargo.toml 2>/dev/null | grep -E "(quickcheck|quickcheck_macros)"`
!`grep -r "quickcheck!\|#\[quickcheck\]\|impl Arbitrary" src/ tests/ 2>/dev/null | head -10`

1. **quickcheck Setup**:
   - Add `quickcheck = "1"` and `quickcheck_macros = "1"` to `[dev-dependencies]` in `Cargo.toml`
   - Use the `#[quickcheck]` attribute macro from `quickcheck_macros` for concise property functions
   - Or use the `quickcheck!` macro block for grouping multiple properties in one test module
   - Run with `cargo test` — QuickCheck generates 100 test cases by default per property

2. **Defining Arbitrary for Custom Types**:
   - Implement `impl Arbitrary for MyType` with `fn arbitrary(g: &mut Gen) -> Self` using `g.size()`
   - Compose from existing `Arbitrary` implementations: `String::arbitrary(g)`, `u32::arbitrary(g)`
   - Use `g.choose(&variants)` for enum generation weighted by `g.size()` for proportional depth
   - Implement `fn shrink(&self) -> Box<dyn Iterator<Item = Self>>` for meaningful counterexample minimization

3. **Writing Property Functions**:
   - Return `bool` from property functions — `true` means the property holds for that input
   - Return `TestResult::discard()` to skip inputs that violate preconditions without counting as failure
   - Return `TestResult::failed()` with `TestResult::error("message")` for rich failure diagnostics
   - Use `#[quickcheck]` on `fn prop_name(input: MyType) -> bool { invariant_holds(input) }`

4. **Running and Configuring Tests**:
   - Set `QUICKCHECK_TESTS=10000` env var to increase coverage for CI runs
   - Set `QUICKCHECK_MAX_TESTS=100000` for exhaustive edge-case exploration on critical modules
   - Use `QuickCheck::new().tests(500).max_tests(10000).quickcheck(prop as fn(T) -> bool)` for programmatic config
   - Run specific property tests with `cargo test prop_` to filter by name prefix

5. **Shrinking and Debugging Failures**:
   - QuickCheck auto-shrinks counterexamples — implement `shrink()` on complex types for minimal reproduction
   - Print the shrunk counterexample to diagnose bugs: QuickCheck reports smallest failing input automatically
   - Reproduce specific failures by seeding with `QUICKCHECK_GENERATOR_SIZE=10` for constrained input sizes
   - Combine with `#[derive(Debug)]` on all test types to enable readable failure output


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
