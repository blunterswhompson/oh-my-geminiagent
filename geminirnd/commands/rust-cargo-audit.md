---
description: Audit Rust dependencies for CVEs with cargo-audit, enforce policies with cargo-deny, and scan unsafe code with cargo-geiger
agent: rust-specific/rust-cargo-audit-specialist
subtask: true
---

Perform comprehensive Rust dependency security auditing using cargo-audit for CVE scanning, cargo-deny for policy enforcement, and cargo-geiger for unsafe code analysis.

!`cargo audit 2>&1 | head -30`
!`ls -la deny.toml 2>/dev/null || echo "No deny.toml — cargo-deny not configured"`

1. **cargo-audit Setup and Scanning**:
   - Install with `cargo install cargo-audit` and run `cargo audit` to scan against RustSec Advisory DB
   - Use `cargo audit --json` for machine-readable output in CI/CD pipelines
   - Add `audit.ignore` entries in `Cargo.toml` or `.cargo/audit.toml` for accepted false positives with justification
   - Schedule `cargo audit fetch && cargo audit` in weekly CI cron to catch newly published advisories

2. **deny.toml Configuration**:
   - Run `cargo install cargo-deny && cargo deny init` to generate starter `deny.toml`
   - Configure `[advisories]` section: set `vulnerability = "deny"`, `unmaintained = "warn"`, `yanked = "deny"`
   - Add `[licenses]` section to allowlist approved SPDX identifiers (e.g., `allow = ["MIT", "Apache-2.0"]`)
   - Define `[bans]` to block specific crates or duplicate dependency versions across the workspace

3. **cargo-deny Policy Enforcement**:
   - Run `cargo deny check` to validate all policy categories (advisories, licenses, bans, sources)
   - Use `cargo deny check advisories` in pre-merge CI gates to block vulnerable dependency merges
   - Configure `[sources]` to restrict crate sources to crates.io and approved git repositories
   - Generate SARIF output with `cargo deny check --format json` for GitHub Code Scanning integration

4. **cargo-geiger Unsafe Code Audit**:
   - Install with `cargo install cargo-geiger` and run `cargo geiger` for unsafe usage inventory
   - Review output for `unsafe` in direct dependencies vs transitive dependencies
   - Target zero unsafe in application code — use `#![forbid(unsafe_code)]` at crate root
   - Identify crates with high unsafe counts and evaluate safer alternatives or sandboxing

5. **CI/CD Security Pipeline**:
   - Add security job to GitHub Actions: run `cargo audit`, `cargo deny check`, and `cargo geiger` sequentially
   - Fail the build on any `cargo audit` vulnerability or `cargo deny` policy violation
   - Upload `cargo audit --json` output as workflow artifact for vulnerability tracking
   - Configure Dependabot for `Cargo.toml` to automate dependency update PRs on new advisories


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
