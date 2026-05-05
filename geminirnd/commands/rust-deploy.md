---
description: Deploy Rust applications with optimized release builds, Docker multi-stage images, and sqlx migrations
agent: rust-specific/rust-devops
subtask: true
---

Comprehensive guidance for deploying Rust applications with fully optimized release builds, minimal Docker multi-stage images, sqlx database migrations, and production health check endpoints.

!`cat rust-toolchain.toml 2>/dev/null`
!`cargo build --release 2>&1 | tail -5`

1. **Optimized Release Build**:
   - Configure `[profile.release]` in Cargo.toml with `lto = "thin"`, `codegen-units = 1`, `opt-level = 3`, `strip = "symbols"`
   - Enable `panic = "abort"` for smaller binaries when unwinding is not required
   - Use `RUSTFLAGS="-C target-cpu=native"` locally; `target-cpu=x86-64-v3` for modern server targets in CI
   - Pin the Rust edition and toolchain in `rust-toolchain.toml` for reproducible builds

2. **Docker Multi-Stage Build**:
   - Stage 1 (`builder`): use `rust:1.xx-slim` with `cargo build --release`; leverage `cargo-chef` for layer-cached dependency compilation
   - Stage 2 (`runtime`): copy the single binary into `gcr.io/distroless/cc-debian12` or `alpine:3.xx` for minimal attack surface
   - Set `COPY --from=builder /app/target/release/my_app /usr/local/bin/my_app` as the sole artifact
   - Add `HEALTHCHECK CMD ["/usr/local/bin/my_app", "healthcheck"]` or use curl against the health endpoint

3. **Database Migrations**:
   - Use `sqlx migrate run` at container startup via an `ENTRYPOINT` script before launching the server
   - Store migrations in `migrations/` and verify with `sqlx migrate info` during CI
   - Set `DATABASE_URL` via environment variable; never bake credentials into the image
   - Use `sqlx::migrate!()` macro for compile-time verified embedded migrations in the binary

4. **Environment & Secrets**:
   - Load configuration with `config` crate or `envy` for type-safe environment variable deserialization
   - Inject `DATABASE_URL`, `SECRET_KEY`, and feature flags via container environment or Kubernetes Secrets
   - Use `dotenvy` in development only; never ship a `.env` file in the production image
   - Validate all required environment variables at startup and fail fast with a clear error message

5. **Health Checks & Rollback**:
   - Expose `GET /health` returning `200 OK` with JSON status of DB connectivity and version info
   - Configure Kubernetes readiness/liveness probes or Fly.io health checks against the health endpoint
   - Implement graceful shutdown with `tokio::signal::ctrl_c()` and a drain timeout before process exit
   - Tag images with git SHA for immutable artifacts; use deployment rollback to the previous SHA on failure


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
