---
description: Design and implement high-throughput Broadway-style data processing pipelines in Rust
agent: rust-specific/rust-concurrent-pipelines
subtask: true
---

Comprehensive Broadway-style pipeline architecture for concurrent data processing in Rust with producer-processor-batcher patterns, backpressure management, and message queue integrations.

!`ls -la ./src/pipelines/ 2>/dev/null || echo "No pipelines directory"`
!`cat Cargo.toml 2>/dev/null | grep -E "(tokio|rayon|futures|async-channel|tracing)"`

1. **Pipeline Architecture**:
   - Design producer-processor-batcher topology using bounded Tokio channels
   - Select appropriate producer (NATS, Kafka, SQS, RabbitMQ)
   - Configure concurrency and backpressure (channel capacity, buffer_unordered)
   - Plan multi-stage pipelines and fan-out/fan-in patterns

2. **Message Processing**:
   - Implement asynchronous message handlers using Tokio and Rayon
   - Design conditional routing with channel-based dispatching
   - Handle failures with Result-based error flows and DLQ tasks
   - Configure acknowledgment strategies for reliable processing

3. **Batch Operations**:
   - Implement efficient bulk processing using Vec and timeout-based flushing
   - Optimize batch sizes and timeouts for throughput/latency balance
   - Handle partial batch failures gracefully
   - Add tracing and metrics for monitoring and observability

4. **Error Handling & DLQ**:
   - Implement dead letter queue patterns with dedicated channels
   - Configure retry strategies with exponential backoff
   - Use JoinHandle and oneshot to catch and handle task panics
   - Implement circuit breakers for external service resilience

5. **Performance Tuning**:
   - Optimize Tokio and Rayon thread pool settings
   - Add comprehensive telemetry using tracing and metrics
   - Monitor channel depth and processing latency
   - Load testing and verification of backpressure mechanisms


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
