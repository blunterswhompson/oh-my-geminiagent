---
description: Security analysis and hardening for Rust applications
agent: rust-specific/rust-security-specialist
subtask: true
---

Comprehensive security analysis and hardening for Rust applications using Cargo, RustSec, and best practices.

!`cargo --version`
!`cat Cargo.toml | head -30`
!`ls -la .cargo/`

1. **Dependency Auditing**:
   - Run `cargo audit` for known vulnerabilities (RustSec)
   - Run `cargo deny check` for advisories, licenses, bans, and sources
   - Run `cargo machete` to find and remove unused dependencies

2. **Static Analysis**:
   - Run `cargo clippy -- -W clippy::security_lint_group` for security-focused lints
   - Run `cargo clippy -- -D unsafe_code` to audit unsafe usage
   - Run `cargo geiger` to quantify unsafe code in the dependency tree

3. **Code Review**:
   - Analyze `unsafe` blocks for soundness and `// SAFETY:` documentation
   - Review injection vulnerabilities (SQL, Command, Path traversal)
   - Review input validation using `validator` or `serde` patterns
   - Review secret handling and `secrecy` crate usage

4. **Configuration Audit**:
   - Audit web headers (Axum, Actix-web) for HSTS, CSP, and CSRF protection
   - Review `Cargo.toml` hardening (overflow checks, panic strategy)
   - Review PGRX boundary security for Postgres extensions

5. **Advanced Testing**:
   - Run `cargo miri test` for undefined behavior detection
   - Implement fuzz tests with `cargo-fuzz` for complex parsers
   - Use LLVM sanitizers (ASan, TSan) during test execution


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
