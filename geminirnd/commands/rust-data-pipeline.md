---
description: Build async dataflow and streaming pipelines in Rust with proper backpressure and Rayon integration
agent: rust-specific/rust-data-pipeline
subtask: true
---

Implement Rust async dataflow patterns, stream processing, backpressure management, and high-performance data pipeline architectures using Tokio, Rayon, and Futures.

!`grep -r "Stream\|mpsc\|rayon" src/ 2>/dev/null | head -20`
!`cat Cargo.toml 2>/dev/null | grep -E "(tokio|rayon|futures|sqlx|rdkafka)"`

1. **Stream Architecture**:
   - Design producer, transformer, and consumer stages using StreamExt
   - Wire stages with bounded channels and proper demand propagation
   - Implement custom Stream traits for manual control when needed
   - Configure buffer_unordered and for_each_concurrent for parallelism

2. **Backpressure Management**:
   - Configure channel capacities and overflow handling strategies
   - Implement rate limiting patterns (e.g., using tokio::time::interval)
   - Use dispatcher strategies for fan-out (broadcast, watch, or mpmc)
   - Monitor memory usage and queue depths via instrumentation

3. **Rayon Integration**:
   - Identify CPU-bound tasks and offload to Rayon thread pools
   - Bridge Tokio async tasks with Rayon using oneshot channels
   - Use Rayon parallel iterators for bulk data processing
   - Implement partitioning strategies for parallel throughput

4. **I/O and Message Queues**:
   - Integrate with Kafka, Redis Streams, or RabbitMQ using async clients
   - Implement cursor-based fetching for database streams
   - Design file system processing with tokio-util codecs
   - Ensure reliable acknowledgment and delivery guarantees

5. **Performance Optimization**:
   - Profile pipelines with tokio-console and tracing-flame
   - Tune batch sizes and concurrency parameters
   - Implement connection pooling for external services
   - Optimize memory layout with Arc and Pin when necessary


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
