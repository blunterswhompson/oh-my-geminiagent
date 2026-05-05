---
description: Build GenStage/Flow streaming pipelines with proper backpressure and concurrency management
agent: elixir-specific/elixir-genstage-specialist
subtask: true
---

Implement GenStage streaming patterns, Flow control, backpressure management, and data pipeline architectures for high-throughput ETL and real-time processing systems.

!`grep -r "GenStage\|Flow\|Broadway" lib/ 2>/dev/null | head -20`
!`cat mix.exs 2>/dev/null | grep -E "(gen_stage|flow|broadway)"`

1. **GenStage Architecture**:
   - Design producer, producer-consumer, and consumer stages
   - Wire stages in supervision tree with proper demand configuration
   - Implement proper handle_demand and handle_events callbacks
   - Configure min_demand and max_demand for backpressure

2. **Backpressure Management**:
   - Configure buffer strategies and overflow handling
   - Implement rate limiting patterns
   - Use dispatcher strategies (Broadcast, Partition, DemandDispatcher)
   - Monitor queue depths and memory usage

3. **Flow Integration**:
   - Convert pipelines to Flow for concurrent batch processing
   - Implement window-based aggregations for time-series data
   - Configure partition strategies for optimal concurrency
   - Use Flow for ETL pipelines with error handling

4. **Broadway Migration**:
   - Assess GenStage pipelines for Broadway compatibility
   - Migrate to Broadway producers (RabbitMQ, SQS, Kafka)
   - Configure processors and batchers with telemetry
   - Implement graceful shutdown and error handling

5. **Performance Optimization**:
   - Profile pipeline with :observer and :fprof
   - Tune concurrency and batch sizes
   - Implement connection pooling for external resources
   - Monitor memory and throughput metrics


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
