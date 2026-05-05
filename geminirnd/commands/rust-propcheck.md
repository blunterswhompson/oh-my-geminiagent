---
description: Design proptest strategies, identify invariants, and write property-based tests for Rust with proptest
agent: rust-specific/rust-proptest-specialist
subtask: true
---

Implement property-based testing for Rust using proptest — designing strategies, identifying mathematical invariants, writing `proptest!` blocks, and integrating with the standard test suite.

!`cat Cargo.toml 2>/dev/null | grep -E "(proptest|arbitrary|quickcheck)"`
!`find tests/ src/ -name "*.rs" 2>/dev/null | xargs grep -l "proptest!\|prop_assert" 2>/dev/null | head -10`

1. **proptest Strategy Design**:
   - Define value strategies with `prop::collection::vec(element_strategy, size_range)` for collections
   - Use `prop_oneof![a_strategy, b_strategy]` for weighted variant generation with `Just(...)` for constants
   - Compose domain types with `(strategy_a, strategy_b).prop_map(|(a, b)| MyType { a, b })`
   - Apply `prop_filter` sparingly — prefer strategy composition over rejection sampling to avoid discard waste

2. **Identifying Invariants**:
   - Round-trip properties: `decode(encode(x)) == x` for serialization, parsing, and compression
   - Idempotent properties: `f(f(x)) == f(x)` for normalization, formatting, and deduplication
   - Monotonic properties: if `a <= b` then `f(a) <= f(b)` for sorted structures and comparators
   - Structural invariants: length preserved, elements non-negative, sorted order maintained after mutation

3. **Writing proptest! Blocks**:
   - Use `proptest! { #[test] fn name(input in strategy) { prop_assert_eq!(...) } }` for inline tests
   - Place property tests in `#[cfg(test)]` modules alongside unit tests or in `tests/properties.rs`
   - Use `prop_assume!(condition)` to skip invalid inputs (prefer filtering at strategy level)
   - Combine with `#[derive(Debug, Clone, Arbitrary)]` via `proptest-derive` for automatic strategy generation

4. **PROPTEST_CASES and Configuration**:
   - Set `PROPTEST_CASES=10000` environment variable for CI thorough runs
   - Configure per-test case counts in `ProptestConfig::with_cases(1000).into()`
   - Use `PROPTEST_MAX_SHRINK_ITERS` to tune shrinking depth for complex counterexamples
   - Store failing seeds in `proptest-regressions/` directory — commit these files to reproduce CI failures

5. **Integration with ExUnit and Stateful Testing**:
   - Combine proptest with `#[test]` using `TestRunner::default().run(&strategy, |input| { ... })`
   - Test stateful systems by generating sequences of operations and verifying invariants after each step
   - Use `prop::collection::vec(operation_strategy, 0..50)` to model command sequences
   - Integrate `proptest` with `mockall` stubs for testing code with external dependencies


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
