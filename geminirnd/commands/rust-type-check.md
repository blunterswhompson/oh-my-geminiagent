---
description: Run Clippy lint groups, fix violations, and configure clippy.toml for compile-time type safety
agent: rust-specific/rust-type-checker-specialist
subtask: true

!cat Cargo.toml 2>/dev/null | head -50
---

Implement comprehensive static analysis using Clippy with full lint group enforcement, systematic violation remediation, and a shared `clippy.toml` configuration to maintain type safety and code quality standards across the codebase.

!`cargo clippy -- -D warnings 2>&1 | head -30`
!`cargo check 2>&1 | head -20`

1. **Clippy Configuration**:
   - Create `clippy.toml` at workspace root with `msrv`, `cognitive-complexity-threshold`, and `too-many-arguments-threshold`
   - Enable lint groups in `.cargo/config.toml` or per-file: `clippy::pedantic`, `clippy::nursery`, `clippy::cargo`
   - Set `#![deny(clippy::all, clippy::pedantic)]` in `lib.rs`/`main.rs` to enforce as compile errors
   - Allow specific lints inline with `#[allow(clippy::lint_name)]` only when justified by a comment

2. **Common Violation Fixes**:
   - Replace `unwrap()` / `expect()` in production code with `?` operator or structured error types
   - Convert `if let Some(x) = ... { x } else { default }` to `Option::unwrap_or` / `map_or` idioms
   - Fix `clippy::needless_pass_by_value` by switching `fn f(s: String)` to `fn f(s: &str)` where appropriate
   - Address `clippy::wildcard_imports` by replacing glob `use super::*` with explicit imports

3. **Type Safety Patterns**:
   - Use the newtype pattern (`struct UserId(Uuid)`) to prevent primitive obsession and misuse
   - Model exhaustive state machines with enums rather than boolean flags or string constants
   - Leverage `#[must_use]` on functions returning `Result`/`Option` to prevent silently dropped errors
   - Use `std::num::NonZeroU32` and similar types to encode invariants in the type system

4. **Cargo Check Integration**:
   - Run `cargo check --workspace --all-targets` in CI to catch compile errors across all targets
   - Use `cargo check --message-format=json` to parse diagnostics in custom tooling or editors
   - Run `cargo clippy --workspace --all-targets --all-features -- -D warnings` for maximum coverage
   - Add `cargo fmt --all --check` as a gate before Clippy to separate formatting from logic issues

5. **Continuous Enforcement**:
   - Add a dedicated `clippy` job in GitHub Actions that runs on every pull request
   - Use `#![warn(...)]` in libraries and `#![deny(...)]` in binaries to match severity expectations
   - Annotate intentional `unsafe` blocks with `// SAFETY:` comments explaining the invariant upheld
   - Review Clippy release notes with each toolchain update to adopt new lints proactively


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
