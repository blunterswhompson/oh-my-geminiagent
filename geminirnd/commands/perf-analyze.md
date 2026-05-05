---
description: Systematic performance investigation and bottleneck analysis across all application layers
agent: core/performance-optimizer
subtask: true
---

Identify and eliminate performance bottlenecks through systematic profiling, measurement, and data-driven optimization across Elixir/OTP, Phoenix, database, and frontend layers.

!`mix deps | grep -E "(telemetry|cachex|oban)" 2>/dev/null || echo "No performance deps found"`
!`cat config/config.exs 2>/dev/null | grep -E "(pool_size|queue)" | head -5 || echo "No pool config found"`
!`find lib -name "*.ex" | head -10`

## Overview

The Performance Optimizer follows a **"measure first, optimize critical path"** philosophy. Every optimization is data-driven with before/after metrics. Changes are made one at a time to attribute improvements accurately.

**Core Principle**: User-perceived performance > micro-optimizations

## Usage Scenarios

### 1. Performance Baseline Establishment
Before any optimization, measure everything:

```bash
@perf-analyze Establish performance baseline across all layers

# Measures:
# - Frontend: FCP, LCP, TBT, CLS (Lighthouse)
# - Backend: API response times (p50, p95, p99)
# - Database: Query times, connection pool stats
# - Elixir: GenServer latency, Ash queries, Oban queues
```

**What you'll get:**
- Comprehensive baseline report
- Performance budget definitions
- Outliers identified (queries >100ms, API p95 >200ms)
- Budget violations marked
- Telemetry setup recommendations
- APM configuration guidance

### 2. Critical Path Profiling
Identify exact bottlenecks in hot code paths:

```bash
@perf-analyze Profile slow endpoint: POST /api/orders (p95: 850ms)

# Agent profiles:
# - Controller with :eprof
# - Context functions
# - Database queries with EXPLAIN ANALYZE
# - External API calls
```

**What you'll get:**
- Flame graph showing time distribution
- Bottleneck identification (e.g., "60% in database trigger")
- Root cause analysis
- N+1 query detection
- Optimization recommendations ranked by impact

### 3. Elixir/OTP Specific Analysis
Investigate Elixir-specific performance issues:

```bash
@perf-analyze Check GenServer performance in lib/my_app/cache_server.ex

# Analyzes:
# - GenServer call latency
# - Mailbox buildup
# - State size
# - Pattern matching efficiency
# - Blocking operations
```

**What you'll get:**
- GenServer call time measurements
- Mailbox size monitoring setup
- ETS vs GenServer recommendation
- Blocking operation identification
- Optimization patterns with code examples

### 4. Database Query Optimization
Deep dive into slow queries:

```bash
@perf-analyze Optimize slow query: SELECT * FROM orders WHERE user_id = ?

# Runs:
# - EXPLAIN ANALYZE
# - Index analysis
# - Cardinality check
# - Join optimization
# - Connection pool analysis
```

**What you'll get:**
- EXPLAIN ANALYZE output interpretation
- Missing index recommendations
- Query rewrite suggestions
- N+1 elimination strategies
- Connection pool sizing guidance

### 5. Ash Framework Performance Tuning
Optimize Ash queries and aggregates:

```bash
@perf-analyze Profile Ash query performance in lib/my_app/posts.ex

# Analyzes:
# - Load strategy efficiency
# - Aggregate performance
# - Select field optimization
# - Relationship loading
```

**What you'll get:**
- Query time breakdown
- Loading strategy recommendations
- Aggregate optimization patterns
- N+1 detection in Ash context
- Code examples with before/after

### 6. Oban Queue Analysis
Tune background job performance:

```bash
@perf-analyze Analyze Oban queue performance

# Checks:
# - Queue depth by queue
# - Job execution time
# - Retry patterns
# - Worker concurrency
# - Database impact
```

**What you'll get:**
- Queue depth trends
- Slow job identification
- Concurrency recommendations
- Retry strategy optimization
- Database connection impact

### 7. Frontend Performance Analysis
Optimize Core Web Vitals:

```bash
@perf-analyze Profile frontend performance at /dashboard

# Uses Playwright + Lighthouse:
# - Bundle size analysis
# - JavaScript execution time
# - Render-blocking resources
# - Long tasks (>50ms)
```

**What you'll get:**
- Core Web Vitals report (FCP, LCP, TBT, CLS)
- Bundle size breakdown
- Code splitting recommendations
- Lazy loading opportunities
- Critical CSS extraction suggestions

### 8. Load Testing Validation
Verify optimizations under production load:

```bash
@perf-analyze Load test endpoint: GET /api/users (target: 500 req/s)

# Creates k6 scenario:
# - Ramp up to target load
# - Sustained load for 5 minutes
# - Spike test (2x target)
# - Ramp down
```

**What you'll get:**
- Load test results (p50, p95, p99, throughput)
- Before/after comparison
- Resource utilization during load
- Performance budget validation
- Failure scenario analysis

## Performance Investigation Workflow

### Phase 1: Measure Baseline
```bash
# Step 1: Define budgets
@perf-analyze Define performance budgets for my application

# Step 2: Measure current state
@perf-analyze Measure baseline across all layers

# Step 3: Document outliers
# Agent identifies: POST /api/orders p95: 850ms (8.5x over budget)
```

### Phase 2: Profile Bottlenecks
```bash
# Profile the slow endpoint
@perf-analyze Profile POST /api/orders endpoint

# Agent finds:
# - 60% time in database trigger
# - Trigger does sequential scan on inventory table
# - Missing index on inventory.product_id
```

### Phase 3: Optimize (One Change at a Time)
```bash
# Optimization 1: Add index
@perf-analyze Test adding index: CREATE INDEX idx_inventory_product_id

# Agent measures:
# - Before: 850ms query time
# - After: 12ms query time (70x improvement)
# - API p95: 850ms → 45ms

# If still over budget, continue...
@perf-analyze What's the next bottleneck in POST /api/orders?
```

### Phase 4: Validate Under Load
```bash
# Load test with optimization
@perf-analyze Load test POST /api/orders (500 req/s)

# Agent validates:
# - p95 stays under 100ms budget ✅
# - No error rate increase ✅
# - Throughput doubled (500 → 1000 req/s) ✅
```

### Phase 5: Monitor and Document
```bash
# Set up ongoing monitoring
@perf-analyze Set up telemetry for POST /api/orders

# Agent creates:
# - Telemetry events for critical operations
# - Dashboard configuration
# - Alerting thresholds
# - Optimization log documentation
```

## Elixir/OTP Optimization Patterns

### GenServer Bottlenecks
```bash
@perf-analyze Check if lib/my_app/config_server.ex should use ETS

# Agent analyzes:
# - Read/write ratio (90% reads)
# - Call latency (100μs)
# - Access patterns (simple key-value)
# 
# Recommendation: Convert to ETS for 100x speedup
```

### Mailbox Buildup
```bash
@perf-analyze Monitor mailbox sizes for GenServers

# Agent sets up monitoring:
# - Periodic :message_queue_len checks
# - Alerting on >1000 messages
# - Pattern matching optimization
# - Rate limiting recommendations
```

### Ash Query Optimization
```bash
@perf-analyze Optimize Ash query in lib/my_app/posts.ex:42

# Agent finds:
# - Loading all fields (SELECT *)
# - Missing pagination
# - Eager loading unnecessary relationships
#
# Provides optimized version:
# - select([:id, :title])
# - limit(20)
# - load(:author) only
```

### Oban Queue Tuning
```bash
@perf-analyze Tune Oban queue configuration

# Agent analyzes:
# - Queue depth: 2500 (2.5x limit)
# - Worker concurrency: 10 (may be too low)
# - Job execution time: p95 8s
#
# Recommends:
# - Increase concurrency to 20 for I/O-bound jobs
# - Add exponential backoff to retries
# - Split long-running jobs
```

## What You'll Get

**From Baseline Analysis:**
- Performance budget definitions for all layers
- Current metrics vs budgets
- Outlier identification (slow queries, endpoints)
- Profiling data with flame graphs
- Prioritized optimization recommendations

**From Bottleneck Profiling:**
- Exact time breakdown by function/query
- Root cause identification
- Specific optimization recommendations
- Code examples (before/after)
- Expected improvement estimates

**From Optimization Implementation:**
- Benchmark results (before/after)
- Load test validation
- Resource utilization analysis
- Performance budget compliance
- Comprehensive optimization log

**From Monitoring Setup:**
- Telemetry event configuration
- Dashboard recommendations
- Alert threshold definitions
- Performance review schedule

## Optimization Targets

### Frontend
- FCP: <1.8s
- LCP: <2.5s
- TBT: <300ms
- CLS: <0.1
- TTFB: <600ms

### Backend
- API p50: <50ms
- API p95: <100ms
- API p99: <500ms
- Error rate: <0.1%

### Database
- Query p50: <10ms
- Query p95: <50ms
- Query p99: <200ms
- Pool checkout: <50ms

### Elixir/OTP
- GenServer call: <10ms
- Ash query: <50ms
- Oban job: <5s (unless async)
- Mailbox size: <1000 messages

## Anti-Patterns to Avoid

❌ **Don't optimize without measuring**:
```bash
# Bad: "I think this is slow, let me cache it"
```

✅ **Do measure first**:
```bash
@perf-analyze Profile function_name to identify bottleneck
# Then optimize based on data
```

❌ **Don't change multiple things**:
```bash
# Bad: Add index + caching + increase pool size all at once
```

✅ **Do one change at a time**:
```bash
@perf-analyze Test adding index on users.email
# Measure improvement
# Then decide if more optimization needed
```

❌ **Don't ignore performance budgets**:
```bash
# Bad: "This is faster, ship it"
```

✅ **Do validate against budgets**:
```bash
@perf-analyze Validate optimization against performance budgets
# Ensure p95 <100ms, error rate <0.1%, etc.
```

❌ **Don't skip load testing**:
```bash
# Bad: "Works in dev, must be fine"
```

✅ **Do test under production load**:
```bash
@perf-analyze Load test with 500 req/s to validate optimization
```

## Multi-Agent Coordination

### With elixir-tester
```bash
# Create benchmark tests
@elixir-tester Create benchmark for Orders.create_order

# Then profile
@perf-analyze Benchmark Orders.create_order and identify bottlenecks
```

### With elixir-reviewer
```bash
# Review architecture
@elixir-reviewer Review GenServer call patterns for bottlenecks

# Then optimize
@perf-analyze Optimize identified GenServer bottlenecks
```

### With explore
```bash
# Find performance-critical files
@explore Find GenServers with :call in hot paths

# Then analyze
@perf-analyze Profile GenServers found by @explore
```

## Success Criteria

**Optimization is successful when:**
- Baseline measured before changes
- Bottleneck identified with profiling evidence
- One optimization applied at a time
- Improvement measured and documented
- Performance budgets validated
- Load tested under production conditions
- Monitoring configured for ongoing visibility
- Optimization log updated

**Red flags indicating poor optimization:**
- No before measurements
- Multiple simultaneous changes
- Improvement not measured
- No load testing
- Optimization not documented


See also: `./commands/optimize.md` for complementary optimization workflows.

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
