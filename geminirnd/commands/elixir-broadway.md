---
description: Design and implement high-throughput Broadway data processing pipelines
agent: elixir-specific/elixir-broadway
subtask: true
---

Comprehensive Broadway pipeline architecture for concurrent data processing with producer-processor-batcher patterns, backpressure management, and message queue integrations.

!`ls -la ./lib/*/workers/ 2>/dev/null || echo "No workers directory"`
!`cat mix.exs 2>/dev/null | grep -A20 "deps"`

1. **Pipeline Architecture**:
   - Design producer-processor-batcher topology
   - Select appropriate producer (RabbitMQ, SQS, Kafka, Pub/Sub)
   - Configure concurrency and backpressure (max_demand, prefetch_count)
   - Plan multi-stage pipelines and fan-out/fan-in patterns

2. **Message Processing**:
   - Implement handle_message/3 for data transformation
   - Design conditional routing with Message.put_batcher/2
   - Handle failures with Message.failed/2
   - Configure acknowledgment strategies

3. **Batch Operations**:
   - Implement handle_batch/4 for efficient bulk processing
   - Optimize batch sizes and timeouts
   - Handle partial batch failures
   - Add telemetry for monitoring

4. **Error Handling & DLQ**:
   - Implement handle_failed/2 for failed messages
   - Set up dead letter queue pattern
   - Configure circuit breakers
   - Design retry strategies

5. **Performance Tuning**:
   - Optimize concurrency settings
   - Add comprehensive telemetry
   - Monitor key metrics
   - Load testing and verification


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
