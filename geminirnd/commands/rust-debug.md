---
description: Debug Rust applications with GDB/LLDB, tracing, tokio-console, and profiling
agent: rust-specific/rust-debugging-agent
subtask: true
---

Debug and troubleshoot Rust applications using structured tracing, deep debugger integration, and performance profiling.

$ARGUMENTS

!`ls -la Cargo.toml 2>/dev/null || echo "No Cargo.toml"`
!`cargo --version 2>/dev/null | head -1`
!`rustc --version 2>/dev/null | head -1`

1.  **Structured Tracing**: Use the `tracing` crate for production-safe observability.
    - Initialize `tracing_subscriber` in `main.rs`.
    - Use `#[tracing::instrument]` on critical functions.
    - Export traces to external backends if needed (Jaeger, Honeycomb).

2.  **Debugger Integration**: Use GDB/LLDB for deep inspection.
    - `rust-lldb ./target/debug/myapp`
    - Set breakpoints: `b src/main.rs:50`
    - Frame variables: `fr v`

3.  **Async Debugging**: Use `tokio-console` for async task monitoring.
    - Build with `RUSTFLAGS="--cfg tokio_unstable" cargo build`.
    - Run `tokio-console` to identify stuck or inefficient tasks.

4.  **Panic Analysis**: Enable and capture backtraces.
    - `export RUST_BACKTRACE=1`
    - Use `std::backtrace::Backtrace::capture()` in custom panic hooks.

5.  **Macro Expansion**: Use `cargo expand` to debug complex macro output.
    - `cargo expand my_module`

6.  **Performance Profiling**: Identify bottlenecks.
    - `cargo flamegraph --bin myapp`
    - Use `heaptrack` for memory profiling.


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
