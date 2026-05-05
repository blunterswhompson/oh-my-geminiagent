---
description: Generate HTML coverage reports, enforce thresholds, and upload to Codecov or Coveralls for Rust projects
agent: rust-specific/rust-coverage-reporting-specialist
subtask: true

!cat Cargo.toml 2>/dev/null | head -50
---

Implement comprehensive code coverage reporting for Rust projects using cargo-tarpaulin or cargo-llvm-cov, enforce coverage thresholds, and integrate with Codecov or Coveralls in CI/CD pipelines.

!`cargo tarpaulin --version 2>/dev/null || echo "tarpaulin not installed"`
!`cargo llvm-cov --version 2>/dev/null || echo "llvm-cov not installed"`

1. **Coverage Tool Setup**:
   - Install `cargo-tarpaulin` via `cargo install cargo-tarpaulin` (Linux/macOS)
   - Or install `cargo-llvm-cov` via `cargo install cargo-llvm-cov && rustup component add llvm-tools-preview`
   - Configure `tarpaulin.toml` or pass flags: `--exclude-files`, `--timeout`, `--workspace`
   - Use `cargo llvm-cov --html` for LLVM-accurate branch and line coverage

2. **HTML Report Generation**:
   - Run `cargo tarpaulin --out Html --output-dir coverage/` for interactive HTML report
   - Or run `cargo llvm-cov --html --output-dir coverage/` for LLVM-based report
   - Open `coverage/tarpaulin-report.html` or `coverage/html/index.html` to inspect uncovered lines
   - Filter integration tests from unit coverage with `--test-threads 1` and feature flags

3. **Threshold Enforcement**:
   - Enforce minimum coverage with `cargo tarpaulin --fail-under 80`
   - Use `cargo llvm-cov --fail-under-lines 80` for line-level enforcement
   - Gate CI merges on coverage regression via exit code `1` on threshold failure
   - Configure per-module thresholds in `tarpaulin.toml` under `[coverage]` section

4. **Codecov and Coveralls Upload**:
   - Generate LCOV report: `cargo tarpaulin --out Lcov` → `lcov.info`
   - Upload to Codecov: `bash <(curl -s https://codecov.io/bash) -f lcov.info`
   - Upload to Coveralls via `cargo tarpaulin --coveralls $COVERALLS_TOKEN`
   - Configure `.codecov.yml` with `coverage.status.patch.threshold` and `project.threshold`

5. **CI/CD Integration**:
   - Add GitHub Actions step after `cargo test` to run coverage and upload report
   - Cache `~/.cargo/registry` and `target/` to speed up coverage builds
   - Store HTML coverage reports as workflow artifacts with `actions/upload-artifact`
   - Schedule weekly full-workspace coverage runs with `cron:` trigger in GitHub Actions


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
