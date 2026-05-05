---
description: Expert Rust CI/CD pipelines, Docker builds, cross-compilation, and production infrastructure management
agent: rust-specific/rust-devops
subtask: true
---

Comprehensive expertise in Rust CI/CD automation, cargo-nextest test execution, Docker multi-stage builds, cross-compilation targets, and production-readiness validation for Rust applications.

!cat Cargo.toml 2>/dev/null | head -50
!cat rust-toolchain.toml 2>/dev/null || echo 'No rust-toolchain.toml'
!cat Dockerfile 2>/dev/null | head -30 || echo 'No Dockerfile'
!ls -la .github/workflows/ 2>/dev/null || echo 'No GitHub workflows'

1. **CI Pipeline with cargo-nextest**:
   - Use `cargo nextest run` instead of `cargo test` for parallel test execution and better failure output
   - Configure `.config/nextest.toml` with `retries`, `fail-fast`, and test partitioning for large suites
   - Run `cargo clippy -- -D warnings`, `cargo fmt --check`, and `cargo audit` as separate CI stages
   - Cache `~/.cargo/registry`, `~/.cargo/git`, and `target/` keyed on `Cargo.lock` hash for fast CI

2. **Docker Multi-Stage Builds**:
   - Use `cargo-chef` in the builder stage to cache dependency compilation as a separate layer
   - Copy only the release binary into a distroless or Alpine runtime image for minimal size
   - Set `ARG RUST_VERSION` at the top of the Dockerfile and pin it in `rust-toolchain.toml`
   - Push images tagged with both `git-sha` (immutable) and `latest`/`main` (mutable) tags

3. **Cross-Compilation**:
   - Install `cross` (`cargo install cross`) for hermetic cross-compilation via Docker
   - Use `cross build --release --target aarch64-unknown-linux-gnu` for ARM server targets
   - Configure `Cross.toml` with pre/post-build hooks and custom Docker images per target
   - Validate cross-compiled binaries in CI with QEMU emulation (`runs-on: ubuntu-latest` with binfmt)

4. **Health Endpoints & Readiness**:
   - Implement `GET /health/live` (process alive) and `GET /health/ready` (deps connected) endpoints
   - Return JSON `{"status":"ok","version":"1.2.3","db":"connected"}` for observability
   - Wire readiness probe to Kubernetes or Fly.io health checks with a 5s interval and 3-failure threshold
   - Log startup duration and first-request latency to detect slow initialization in production

5. **Release Automation**:
   - Automate version bumping with `cargo-release` and conventional commit parsing
   - Publish binaries to GitHub Releases using `actions/upload-release-asset` on tag push
   - Build multi-platform Docker manifests (`docker buildx bake`) for `linux/amd64` and `linux/arm64`
   - Run `cargo deny check` for license compliance and `cargo audit` for CVE scanning on every release

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
