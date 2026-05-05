---
description: Configure comprehensive code coverage analysis with cargo-tarpaulin and CI/CD enforcement
agent: rust-specific/rust-coverage-specialist
subtask: true
---

Configure comprehensive test coverage measurement, analysis, and enforcement using cargo-tarpaulin with CI/CD integration, HTML report generation, and coverage threshold gates for Rust projects.

!`cargo tarpaulin --version 2>/dev/null || echo 'not installed'`
!`cargo test -- --list 2>&1 | head -20`

1. **Tarpaulin Setup**:
   - Install with `cargo install cargo-tarpaulin` or via `cargo binstall`
   - Run `cargo tarpaulin --out Html --output-dir coverage/` for a full HTML report
   - Configure `[package.metadata.tarpaulin]` in Cargo.toml for persistent options
   - Exclude generated code, build scripts, and test helpers with `--exclude-files`

2. **Coverage Analysis**:
   - Run `cargo tarpaulin --out Lcov` to generate `lcov.info` for editor integration
   - Use `--ignore-tests` flag to measure production code coverage separately from test utilities
   - Identify uncovered branches in critical business logic and error-handling paths
   - Open `coverage/tarpaulin-report.html` to view line-by-line coverage annotations

3. **CI/CD Integration**:
   - Add tarpaulin step to GitHub Actions after `cargo test` succeeds
   - Upload LCOV report to Codecov or Coveralls using their respective GitHub Actions
   - Enforce minimum coverage with `--fail-under 80` flag — exit code 1 on threshold miss
   - Cache `~/.cargo/bin/cargo-tarpaulin` in CI to avoid reinstalling on every run

4. **Coverage Strategy**:
   - Target 80%+ overall; 90%+ for core domain and data-access modules
   - Use `#[cfg(not(tarpaulin))]` or `// coverage: off` markers sparingly for unreachable code
   - Prioritize branch coverage over line coverage for `match` arms and `if let` chains
   - Track coverage trends with Codecov's PR comments to catch regressions early

5. **Workspace Support**:
   - Run `cargo tarpaulin --workspace` to aggregate coverage across all crates
   - Set per-crate thresholds using separate `tarpaulin.toml` configurations
   - Merge LCOV reports from multiple crates with `lcov --add-tracefile` for unified reporting
   - Exclude integration-test crates from coverage calculations with `--exclude crate_name`


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
