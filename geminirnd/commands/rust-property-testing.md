---
description: Expert guidance on property-based testing for Rust with proptest and quickcheck
agent: rust-specific/rust-property-testing-specialist
subtask: true
---

# Rust Property Testing Command

Implement comprehensive property-based testing strategies using `proptest`, `quickcheck`, and `proptest-state-machine` to validate complex business invariants and edge cases in Rust applications.

!`cat Cargo.toml 2>/dev/null | grep -E "(proptest|quickcheck|arbitrary)"`
!`grep -r "proptest!\|quickcheck!\|#\[proptest\]" tests/ src/ 2>/dev/null | head -10`

## Usage Examples

### 1. Design a proptest Strategy

**When to use:**
- Need to test a function across a wide range of inputs
- Want automatic shrinking of failing cases
- Testing parsers, validators, or data transformations

**Example:**
```bash
/rust-property-testing design a proptest strategy for generating valid URLs with query parameters.
```

**What you'll get:**
- `Strategy` definition using `proptest::strategy`
- Composable strategies (e.g., `prop::string::string_regex`)
- `proptest!` macro usage with the strategy
- Shrinking behavior explanation

### 2. State Machine Testing

**When to use:**
- Testing stateful data structures (queues, caches, FSMs)
- Want to verify concurrent or sequential operation sequences
- Need model-based testing against a reference implementation

**Example:**
```bash
/rust-property-testing implement a state machine test for our ThreadSafeQueue.
- Reference state: VecDeque<i32>
- Transitions: Push(i32), Pop, Clear
- Invariants: size never negative, contents match reference model
```

**What you'll get:**
- `proptest_state_machine!` or manual command-sequence approach
- Reference model implementation in pure Rust
- Command enum (Push, Pop, Clear) with `Strategy` derivation
- Invariant assertions after each transition
- Shrinking to minimal failing command sequence

### 3. QuickCheck Property

**When to use:**
- Need lightweight properties with `Arbitrary` derive
- Testing pure mathematical or encoding properties
- Quick validation of round-trip invariants

**Example:**
```bash
/rust-property-testing write a quickcheck property to verify that our base64 encoder is the inverse of the decoder.
```

**What you'll get:**
- `#[quickcheck]` attribute usage
- `Arbitrary` implementation or use of built-in instances
- Round-trip property assertion
- Comparison to proptest approach with trade-off analysis

### 4. Property Testing Setup

**When to use:**
- Adding proptest to an existing project
- Configuring test budgets and failure persistence
- Setting up regression corpus

**Example:**
```bash
/rust-property-testing Set up proptest infrastructure for our service with:
- Domain structs: User, Order, Product
- Custom strategies for domain types
- Regression file corpus in tests/proptest-regressions/
- CI configuration for deterministic runs
```

**What you'll get:**
- `proptest` added to `[dev-dependencies]` in Cargo.toml
- `ProptestConfig` configuration (cases, max_shrink_iters, etc.)
- `.proptest-regressions` corpus setup
- Custom `Strategy` and `Arbitrary` implementations
- Integration with `#[tokio::test]` for async properties

### 5. Generator Design for Complex Domain Types

**When to use:**
- Need custom `Strategy` for your domain structs
- Standard proptest generators insufficient for business rules
- Testing with constrained or correlated inputs

**Example:**
```bash
/rust-property-testing build composite strategies for:
- ValidEmail: must match RFC 5321, unique per test run
- OrderAmount: u64 in range 1..=1_000_000 (cents)
- DateRange: start <= end, both within last 5 years
- NonEmptyVec<Product>: 1–50 products, each with valid SKU
```

**What you'll get:**
- `prop_compose!` macro-based strategy definitions
- `Strategy::prop_filter` for constrained generation
- `(strategy_a, strategy_b).prop_map(...)` for correlated inputs
- Shrinking-friendly composition guidelines

### 6. Invariant Testing

**When to use:**
- Testing mathematical properties (commutativity, associativity, idempotence)
- Verifying round-trip properties (serialize/deserialize, encode/decode)
- Validating business rules and data constraints

**Example:**
```bash
/rust-property-testing create invariant tests for our money calculation module:
- Addition is commutative: a + b == b + a
- Round-trip: Amount::from_str(&a.to_string()) == Ok(a)
- No overflow: sum of positive amounts is always positive
- Tax calculation: result always >= base amount
```

**What you'll get:**
- `proptest!` blocks for each invariant
- Custom `Strategy` for monetary amounts
- Overflow detection and boundary assertions
- Integration with `thiserror`-based error types

### 7. Advanced Techniques

**When to use:**
- Fine-tuning test budgets for CI performance
- Debugging complex shrinking behavior
- Targeted property testing for edge case discovery

**Example:**
```bash
/rust-property-testing configure advanced proptest settings:
- Run 1000 cases in local dev, 100 in CI
- Persist regression corpus to disk
- Debug shrinking for a complex failing case
- Profile which strategies generate edge cases
```

**What you'll get:**
- `ProptestConfig` with environment-based case counts
- `PROPTEST_CASES` env var integration
- Regression file format explanation
- `prop_assert!` vs `assert!` trade-off analysis
- Strategy debugging with `Just` and `sample_values`

## What You'll Get

Every response includes:

### 1. **Complete Property Test Implementations**
   - `proptest!` / `#[quickcheck]` test definitions
   - Custom `Strategy` implementations for domain types
   - State machine tests with reference models
   - Invariant assertions with clear failure messages

### 2. **Strategy Design Patterns**
   - `prop_compose!` for multi-field struct strategies
   - Filtered strategies with `prop_filter`
   - Correlated inputs with `prop_flat_map`
   - Recursive strategies for tree/graph types

### 3. **Testing Patterns**
   - Setup for `#[tokio::test]` async properties
   - Integration with `rstest` parameterized tests
   - Shared fixtures with `proptest` configuration
   - Regression corpus management

### 4. **Framework Integration**
   - **proptest**: Primary recommendation for most use cases
   - **quickcheck**: Lightweight alternative for simple properties
   - **arbitrary**: `#[derive(Arbitrary)]` for basic cases
   - **proptest-state-machine**: Stateful command sequence testing

### 5. **Performance Optimization**
   - Case count tuning (`PROPTEST_CASES`)
   - Strategy complexity and shrinking performance
   - CI vs local configuration
   - Parallelism with `cargo nextest`

### 6. **Best Practices**
   - When to use property tests vs example-based tests
   - Shrinking-friendly strategy design
   - Meaningful failure messages
   - Corpus regression management
   - Anti-patterns to avoid

## Related Commands

- `/rust-test` - Comprehensive Rust testing strategies
- `/rust-faker` - fake-rs for realistic test data generation
- `/rust-factories` - factori for structured test data factories
- `/rust-security` - Security fuzzing with cargo-fuzz

## Key Capabilities

This command leverages the rust-property-testing-specialist agent, which provides:

- **proptest Expertise**: Deep knowledge of strategies, shrinking, configuration
- **quickcheck Integration**: `Arbitrary` trait, `#[quickcheck]` attribute
- **State Machine Testing**: Command sequences, reference models, invariants
- **Custom Strategy Design**: `prop_compose!`, filtered and correlated strategies
- **Async Properties**: `#[tokio::test]` integration with proptest
- **Invariant Testing**: Mathematical properties, round-trips, business rules
- **Corpus Management**: Regression files, deterministic CI runs
- **Debugging**: Shrinking analysis, minimal failing case extraction

## Tips for Best Results

1. **Describe the Invariant**: State what property should always hold
2. **Share Domain Types**: Include your structs and their constraints
3. **Specify Valid Ranges**: Describe what constitutes valid inputs
4. **Mention Stack**: SQLx, Axum, Tokio — async context matters
5. **Include Existing Tests**: Share current test examples to build from
6. **Describe Failures**: If debugging, paste the failing proptest output

## Technical Details

**Powered by:** `.opencode/agent/rust-specific/rust-property-testing-specialist.md`
**MCP Servers:** context7 (proptest docs), sequential-thinking (complex scenarios)
**Key Crates:** `proptest`, `quickcheck`, `arbitrary`, `proptest-state-machine`

---

**Note:** This command specializes in property-based testing with `proptest` and `quickcheck`. For factory-based test data use `/rust-factories`, for realistic fake data use `/rust-faker`, and for general testing strategies use `/rust-test`.

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
