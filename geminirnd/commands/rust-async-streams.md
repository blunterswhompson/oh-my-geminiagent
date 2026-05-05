---
description: Build pull-based async streaming pipelines with backpressure using async-stream and tokio channels
agent: rust-specific/rust-async-stream-specialist
subtask: true
---

Design and implement pull-based async data pipelines with proper backpressure, concurrent processing, and high-throughput ETL patterns using Rust async primitives.

!`cat Cargo.toml 2>/dev/null | grep -E "(async-stream|tokio|futures)"`
!`grep -r "async_stream\|Stream\|mpsc" src/ 2>/dev/null | head -20`

1. **Pipeline Architecture**:
   - Design producer, transformer, and consumer stages using `async_stream::stream!` macro
   - Wire async stages with bounded `tokio::sync::mpsc` channels
   - Implement `Stream` trait consumers with `StreamExt` combinators
   - Configure channel buffer sizes for natural backpressure

2. **Backpressure Management**:
   - Enforce backpressure via bounded `mpsc::channel(capacity)` — sender blocks when buffer full
   - Implement `tokio::time::timeout` wrappers for slow consumer protection
   - Use `futures::stream::buffer_unordered(n)` for concurrent bounded fan-out
   - Monitor channel fill levels with `mpsc::Sender::capacity()` and emit metrics

3. **Stream Combinators and Flow Control**:
   - Apply `StreamExt::chunks(n)` for micro-batching before downstream IO
   - Use `StreamExt::throttle(duration)` for rate-limited production
   - Implement windowed aggregations with `StreamExt::scan` and time triggers
   - Configure partition strategies with `futures::stream::select_all`

4. **Migration from GenStage Push Patterns**:
   - Identify push-based loops and replace with `stream!` pull generators
   - Convert `handle_demand` logic to `yield` expressions inside `stream!`
   - Replace Broadway batcher configs with `StreamExt::ready_chunks(max)`
   - Implement graceful shutdown via `CancellationToken` from `tokio-util`

5. **Performance and Observability**:
   - Profile pipeline with `tokio-console` for async task analysis
   - Tune concurrency with `buffer_unordered` and `FuturesUnordered`
   - Implement connection pooling via `deadpool` or `bb8` for external resources
   - Emit throughput and latency histograms with the `metrics` crate


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
