---
description: Analyze and improve system performance through data-driven optimization
agent: core/performance-optimizer
subtask: true
---

Systematic performance optimization to identify bottlenecks, improve response times, and reduce resource usage across frontend, backend, and infrastructure.

!`find . -name "*.ex" -o -name "*.exs" -o -name "*.ts" -o -name "*.js" 2>/dev/null | head -20`
!`mix deps | grep -E "(telemetry|cachex|oban)" || echo "No performance deps found"`
!`cat config/config.exs 2>/dev/null | grep -E "(pool_size|queue)" || echo "No pool config found"`

1. **Performance Baseline and Profiling**:
   - Measure baseline: FCP, LCP, TBT, CLS (frontend), API/DB response times (backend)
   - Profile with :eprof (Elixir), Chrome DevTools (frontend), EXPLAIN ANALYZE (database)
   - Set up APM/telemetry (Phoenix, Ecto, Oban metrics)
   - Define performance budgets (FCP <1.8s, API p95 <100ms, DB p95 <50ms)

2. **Frontend Optimization**:
   - Reduce bundle size through code splitting and tree shaking
   - Optimize images (WebP/AVIF), implement lazy loading
   - Use Web Workers for CPU-intensive tasks
   - Implement caching (service workers, CDN)
   - Inline critical CSS, defer non-critical JS

3. **Backend Optimization**:
   - Add database indexes (verify with EXPLAIN ANALYZE)
   - Eliminate N+1 queries (use Repo.preload or Ash.Query.load)
   - Implement connection pooling (pool_size formula: (cpus * 2) + 1)
   - Add caching layers (Cachex, Redis) with TTL
   - Move non-critical tasks to Oban background jobs

4. **Elixir/OTP Optimization**:
   - Use ETS for read-heavy data (1μs vs GenServer 10-100μs)
   - Monitor GenServer mailbox size (<1000 messages)
   - Optimize Ash queries with select/limit/pagination
   - Tune Oban queues (max_jobs, retry_backoff with jitter)
   - Size Ecto connection pools appropriately

5. **Telemetry and Monitoring**:
   - Add :telemetry events for critical paths
   - Attach handlers to forward to APM
   - Monitor Phoenix/Ecto/Oban metrics
   - Set alerts for budget violations

6. **Load Testing and Validation**:
   - Create k6/JMeter load test scenarios
   - Compare before/after metrics (throughput, latency, errors)
   - Validate against performance budgets
   - Document improvements with evidence


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
