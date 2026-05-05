---
description: Design production caching strategies with Moka TTL/TTI and DashMap for concurrent Rust apps
agent: rust-specific/rust-cache-specialist
subtask: true
---

Implement production-ready caching strategies in Rust using Moka for async TTL/TTI-aware caches and DashMap for lock-free concurrent hash maps, including cache-aside patterns and stampede prevention.

!`cat Cargo.toml | grep -E "(moka|dashmap|cached|quick_cache)"`
!`cat Cargo.toml | grep -A5 '\[dependencies\]'`

1. **Moka Cache Setup**:
   - Add `moka` with `future` feature for async-compatible caching
   - Configure `Cache::builder().max_capacity(n).time_to_live(Duration).time_to_idle(Duration).build()`
   - Use `cache.get_with(key, async_loader)` to implement atomic cache-aside with stampede prevention
   - Enable `eviction_listener` to track evictions and warm replacement caches proactively

2. **DashMap for Concurrent Maps**:
   - Use `DashMap<K, V>` as a drop-in concurrent `HashMap` without manual locking
   - Wrap shared instances in `Arc<DashMap<K, V>>` and clone the Arc across tasks/threads
   - Prefer `entry(key).or_insert_with(|| value)` for atomic read-modify-write operations
   - Avoid holding `Ref`/`RefMut` guards across `.await` points to prevent deadlocks

3. **Cache-Aside Pattern**:
   - Structure lookups as: check cache → on miss, load from DB → insert into cache → return value
   - Use `moka::future::Cache` for async workloads; `moka::sync::Cache` for synchronous contexts
   - Implement write-through by updating both cache and persistent store atomically
   - Invalidate on writes using `cache.invalidate(&key)` or `cache.invalidate_all()`

4. **Stampede & Consistency**:
   - Rely on `get_with` / `try_get_with` to coalesce concurrent cache misses into a single load
   - Set `time_to_idle` shorter than `time_to_live` for hot-key recency eviction
   - Use `cache.entry(key).or_insert_with_if(loader, replace_fn)` for conditional refresh logic
   - Log hit/miss ratios via `tracing` counters and expose as Prometheus metrics

5. **Memory & Eviction Tuning**:
   - Set `max_capacity` based on available heap budget (profile with `heaptrack` or `dhat`)
   - Use `weigher(|k, v| estimated_bytes)` to evict by byte weight instead of entry count
   - Monitor eviction rates; high rates indicate under-provisioned cache or poor key distribution
   - Benchmark cold-start latency and p99 hit latency with Criterion under realistic load


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
