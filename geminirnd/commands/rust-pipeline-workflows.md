---
description: Design async pipeline workflows with Tokio channels, fan-out/fan-in, and backpressure strategies
agent: rust-specific/rust-pipeline-workflows-specialist
subtask: true
---

Expert guidance on building high-throughput async data pipeline workflows in Rust using Tokio channels, Flume, and structured concurrency patterns with robust backpressure and error propagation.

!`cat Cargo.toml | grep -E "(tokio|flume|async-channel|crossbeam)"`
!`cat Cargo.toml | grep -A5 '\[dependencies\]'`

1. **Channel Selection**:
   - Use `tokio::sync::mpsc` for async single-producer/multi-consumer pipelines
   - Choose `flume` for high-performance bounded/unbounded multi-producer/multi-consumer scenarios
   - Apply `tokio::sync::broadcast` for fan-out to multiple independent consumers
   - Use `tokio::sync::watch` for latest-value propagation (config updates, signals)

2. **Fan-Out / Fan-In Patterns**:
   - Implement fan-out with `broadcast::channel` or by cloning `mpsc::Sender` handles
   - Build fan-in using `tokio::select!` across multiple receivers or `futures::stream::select_all`
   - Use `JoinSet` to spawn N workers and collect results as they complete
   - Structure pipelines as `producer → buffer → [worker_0..N] → aggregator`

3. **Backpressure Strategies**:
   - Always prefer bounded channels (`mpsc::channel(capacity)`) over unbounded to apply backpressure
   - Tune channel capacity to `2 × batch_size` as a starting heuristic
   - Drop or shed load gracefully with `try_send` and `Permit`-based flow control
   - Instrument queue depth with `metrics` crate gauges to detect saturation in production

4. **Error Propagation**:
   - Propagate errors via `Result<T, E>` payloads in channel messages rather than panicking workers
   - Use a dedicated error channel or `tokio::sync::oneshot` for fatal pipeline errors
   - Implement graceful shutdown with `CancellationToken` from `tokio-util`
   - Ensure all `JoinHandle`s are awaited to surface panics and avoid silent failures

5. **Testing Pipelines**:
   - Write deterministic unit tests using `tokio::test` with controlled inputs and expected outputs
   - Use `tokio::time::pause()` and `advance()` for time-dependent stage testing
   - Stress-test with `cargo nextest` parallelism to catch race conditions under load
   - Benchmark end-to-end throughput with Criterion to validate pipeline capacity targets


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
