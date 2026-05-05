---
description: Systematic performance profiling and bottleneck elimination with Benchee, :eprof, and load testing
agent: testing/performance-benchmarker
subtask: true
---

Identify and eliminate performance bottlenecks through systematic profiling, measurement, and data-driven optimization across Elixir/OTP, Phoenix, database, and frontend layers.

$ARGUMENTS

!`mix deps | grep -E "(benchee|telemetry)" 2>/dev/null || echo "No benchmarking deps"`
!`cat config/config.exs 2>/dev/null | grep -E "(pool_size|queue)" | head -5 || echo "No pool config"`

## What This Command Does

The Performance Benchmarker provides systematic performance investigation:
- **Baseline Establishment**: Measures current performance across all layers before optimization
- **Elixir Profiling**: Uses :eprof, :fprof, Benchee to identify exact bottlenecks
- **Database Optimization**: EXPLAIN ANALYZE, index addition, N+1 elimination
- **Ash Framework Tuning**: Query optimization, selective loading, aggregate efficiency
- **GenServer/Oban Optimization**: Mailbox monitoring, ETS migration, queue tuning
- **Load Testing**: k6 validation under production-like conditions
- **Monitoring Setup**: Telemetry events, dashboards, alerting

## When to Use This Command

✅ **Use Performance Benchmarker For**:
- Establishing performance baselines
- Identifying bottlenecks in hot code paths
- Optimizing slow database queries
- Tuning GenServer and Oban performance
- Load testing optimizations
- Setting up performance monitoring

❌ **Don't Use For**:
- Frontend-only performance (use `perf-test`)
- Writing tests (use `qa-engineer`)
- E2E user journeys (use `e2e-test`)

## Usage Examples

### Example 1: Establish Performance Baseline
```bash
perf-benchmark "Establish performance baseline across all layers"
```

**What you'll get**:
```
═══════════════════════════════════════════════════════════
📊 PERFORMANCE BASELINE REPORT
═══════════════════════════════════════════════════════════

🖥️  FRONTEND METRICS (Lighthouse)
FCP: 2.1s (budget: <1.8s) ❌ OVER
LCP: 3.2s (budget: <2.5s) ❌ OVER
TBT: 450ms (budget: <300ms) ❌ OVER
CLS: 0.05 (budget: <0.1) ✅ PASS
Performance Score: 72/100

🔌 BACKEND METRICS (API Endpoints)
GET /api/users:
  p50: 45ms | p95: 120ms | p99: 850ms ❌
POST /api/orders:
  p50: 80ms | p95: 250ms | p99: 1200ms ❌

🗄️  DATABASE METRICS
Top Slow Queries:
  SELECT * FROM orders WHERE user_id = ?
    Calls: 1250 | Mean: 125ms | Max: 850ms ❌

⚡ ELIXIR/OTP METRICS
GenServers (Top 10 by queue size):
  CacheServer: Queue: 2500 | Memory: 1024 KB ❌
Oban Queue Depth:
  default: 1200 jobs ❌
═══════════════════════════════════════════════════════════
```

**Timeline**: 30 minutes

### Example 2: Profile Slow Endpoint
```bash
perf-benchmark "Profile POST /api/orders endpoint (p95: 850ms, target: <100ms)"
```

**What you'll get**:
```elixir
# Profiling with :eprof
🔍 Profiling POST /api/orders...

FUNCTION                                CALLS  %   TIME  [uS / CALLS]
--------                                -----  -  -----  [----------]
MyApp.Repo.insert/2                        1  60  12000  [12000.00]
MyApp.Orders.validate_inventory/1          1  20   4000  [4000.00]
MyApp.Email.send_confirmation/1            1  15   3000  [3000.00]
MyApp.Orders.calculate_total/1             1   5   1000  [1000.00]

✅ Bottleneck identified: Repo.insert/2 (60% of time)
   → Database trigger executing sequential scan
   → Missing index on inventory.product_id

📊 EXPLAIN ANALYZE shows:
Seq Scan on inventory (cost=0.00..1000.00 rows=1000)
(actual time=0.050..150.250 rows=1 loops=1)

💡 Recommended Fix:
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
```

**Timeline**: 1 hour

### Example 3: Optimize Database Query
```bash
perf-benchmark "Optimize slow query: SELECT * FROM orders WHERE user_id = ?"
```

**What you'll get**:
```sql
-- Before (Sequential Scan)
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE user_id = 123;

Seq Scan on orders (cost=0.00..1000.00 rows=48 width=200)
  (actual time=0.050..850.250 rows=48 loops=1)
Planning Time: 0.100 ms
Execution Time: 850.350 ms ❌
```

```elixir
# Migration created
defmodule MyApp.Repo.Migrations.AddIndexOrdersUserId do
  use Ecto.Migration
  
  def change do
    create index(:orders, [:user_id])
  end
end
```

```sql
-- After (Index Scan)
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE user_id = 123;

Index Scan using orders_user_id_idx on orders
  (cost=0.29..8.31 rows=48 width=200)
  (actual time=0.015..12.250 rows=48 loops=1)
Planning Time: 0.080 ms
Execution Time: 12.280 ms ✅

🎯 Improvement: 70x faster (850ms → 12ms)
```

**Timeline**: 2 hours (includes validation)

### Example 4: Benchee Comparison
```bash
perf-benchmark "Compare order creation: current vs optimized implementation"
```

**What you'll get**:
```elixir
# Benchmark results
Name                           ips        average  deviation         median
Optimized (cached)          1000.00        1.00 ms     ±5.2%        0.98 ms
Optimized (preload)          500.00        2.00 ms     ±8.1%        1.95 ms
Current (baseline)           100.00       10.00 ms    ±12.3%        9.80 ms

Comparison:
Optimized (cached)          1000.00
Optimized (preload)          500.00 - 2.00x slower +1.00 ms
Current (baseline)           100.00 - 10.00x slower +9.00 ms

💡 Recommendation: Use cached implementation (10x faster)
```

**Timeline**: 1 hour

### Example 5: Load Test Validation
```bash
perf-benchmark "Load test POST /api/orders at 500 req/s after optimization"
```

**What you'll get**:
```javascript
// k6 load test results
═══════════════════════════════════════
📊 LOAD TEST RESULTS
═══════════════════════════════════════

Requests:
  Total: 150000
  Rate: 1000.00 req/s ✅ (target: 500)

Response Times:
  p50: 35.00ms ✅
  p95: 85.00ms ✅ (budget: <100ms)
  p99: 350.00ms ✅ (budget: <500ms)

Error Rate: 0.30% ✅ (budget: <1%)

Virtual Users:
  Max: 200

🎯 BEFORE/AFTER COMPARISON:
  p95: 850ms → 85ms (10x faster)
  Throughput: 500 req/s → 1000 req/s (2x)
  Error Rate: 2.5% → 0.3% (8x lower)
═══════════════════════════════════════
```

**Timeline**: 2 hours

### Example 6: GenServer → ETS Migration
```bash
perf-benchmark "Migrate ConfigServer from GenServer to ETS for 100x speedup"
```

**What you'll get**:
```elixir
# Before: GenServer (100μs per call)
defmodule MyApp.ConfigServer do
  use GenServer
  def get(key), do: GenServer.call(__MODULE__, {:get, key})
end

# After: ETS (1μs per lookup)
defmodule MyApp.Config do
  @table :config
  
  def start_link(_opts) do
    :ets.new(@table, [:set, :public, :named_table, read_concurrency: true])
    load_config_from_db()
    :ignore
  end
  
  def get(key) do
    case :ets.lookup(@table, key) do
      [{^key, value}] -> value
      [] -> nil
    end
  end
end

# Benchmark comparison
GenServer.call: ~100μs per call
ETS lookup: ~1μs per lookup
🎯 Improvement: 100x faster
```

**Timeline**: 2 hours

## What You'll Get

### 1. Performance Baseline Report
- Frontend metrics (Lighthouse scores)
- Backend API metrics (p50, p95, p99)
- Database query stats (slow queries, pool utilization)
- Elixir/OTP metrics (GenServers, Oban, memory)
- Budget violations identified

### 2. Profiling Results
- :eprof function-level time breakdown
- :fprof call graph analysis
- Bottleneck identification with percentages
- Root cause analysis

### 3. Optimization Recommendations
- Specific code changes with examples
- Expected improvement estimates
- Risk assessment
- Implementation priority

### 4. Load Test Validation
- Before/after comparison
- Performance budget compliance
- Resource utilization analysis
- Failure scenario results

### 5. Monitoring Setup
- Telemetry events configured
- Dashboard recommendations
- Alert thresholds defined
- Historical tracking enabled

### 6. Documentation
- Optimization log with metrics
- Lessons learned
- Neo4j pattern storage

## Profiling Tools Reference

### :eprof (Function-Level Timing)
```elixir
:eprof.start()
:eprof.start_profiling([self()])
YourModule.slow_function()
:eprof.stop_profiling()
:eprof.analyze(:total, sort: :time)
```

### :fprof (Call Graph)
```elixir
:fprof.trace([:start, {:procs, [self()]}])
YourModule.slow_function()
:fprof.trace(:stop)
:fprof.profile()
:fprof.analyse([dest: "fprof_results.txt"])
```

### Benchee (Micro-Benchmarking)
```elixir
Benchee.run(%{
  "Current" => fn -> current_impl() end,
  "Optimized" => fn -> optimized_impl() end
}, time: 10, memory_time: 2)
```

## Database Optimization Checklist

- [ ] Run EXPLAIN ANALYZE on slow queries
- [ ] Add indexes on frequently queried columns
- [ ] Use composite indexes for compound queries
- [ ] Eliminate N+1 queries with preload
- [ ] Optimize joins (check cardinality)
- [ ] Add pagination for large result sets
- [ ] Use database aggregations vs Enum

## Elixir/OTP Optimization Checklist

- [ ] Monitor GenServer mailbox sizes
- [ ] Move blocking I/O to Oban workers
- [ ] Replace read-heavy GenServers with ETS
- [ ] Tune Oban queue concurrency per workload
- [ ] Keep GenServer state bounded
- [ ] Use Connection pools appropriately

## Performance Budgets

**Frontend**: FCP <1.8s, LCP <2.5s, TBT <300ms, CLS <0.1
**Backend**: p50 <50ms, p95 <100ms, p99 <500ms
**Database**: p50 <10ms, p95 <50ms, p99 <200ms
**Elixir**: GenServer <10ms, Mailbox <1000, Oban queue <500

## Related Commands

- `/perf-test` - Core Web Vitals and frontend performance
- `/e2e-test` - End-to-end user journey testing
- `/qa-engineer` - Unit and integration testing

## Reference


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
