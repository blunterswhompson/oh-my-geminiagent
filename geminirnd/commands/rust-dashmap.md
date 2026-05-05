---
description: Implement concurrent hash maps with DashMap, entry API patterns, and Arc sharing across threads
agent: rust-specific/rust-dashmap-specialist
subtask: true
---

Expert guidance on implementing high-performance concurrent hash maps in Rust using DashMap, leveraging the entry API for atomic operations, and sharing state safely across threads and async tasks with Arc.

!`cat Cargo.toml | grep -E "(dashmap|parking_lot|scc)"`
!`cat Cargo.toml | grep -A5 '\[dependencies\]'`

1. **DashMap Fundamentals**:
   - Add `dashmap` dependency and import `DashMap` for sharded concurrent HashMap access
   - Understand DashMap's internal shard locking: each shard is an `RwLock<HashMap<K, V>>`
   - Prefer `DashMap<K, V>` over `Mutex<HashMap<K, V>>` when reads significantly outnumber writes
   - Use `DashSet<T>` for concurrent set semantics without a separate value type

2. **Entry API Patterns**:
   - Use `map.entry(key).or_insert(value)` for atomic insert-if-absent operations
   - Apply `map.entry(key).and_modify(|v| *v += 1).or_insert(1)` for atomic counters
   - Use `map.entry(key).or_insert_with(expensive_fn)` to lazily initialize costly values
   - Avoid calling `.entry()` inside async code while holding the returned guard across await points

3. **Arc<DashMap> Sharing**:
   - Wrap the map in `Arc<DashMap<K, V>>` and `.clone()` the Arc for each thread or task
   - Pass `Arc::clone(&map)` to `tokio::spawn` closures — DashMap is `Send + Sync` by default
   - Use `Arc<DashMap<K, V>>` as a field in `AppState` structs for Axum/Actix-Web handlers
   - Avoid `Arc<Mutex<DashMap<...>>>` — the outer Mutex defeats DashMap's concurrency benefits

4. **Safe Guard Usage**:
   - `Ref<K, V>` and `RefMut<K, V>` guards borrow from the shard lock — release them promptly
   - Never store guards in struct fields or hold them across await points (use `.clone()` the value instead)
   - Prefer `map.get(&key).map(|r| r.value().clone())` to extract owned values without long-held guards
   - Use `map.remove(&key)` which returns `Option<(K, V)>` atomically without a dangling guard

5. **Performance & Alternatives**:
   - Tune shard count at construction: `DashMap::with_shard_amount(64)` for high-contention workloads
   - Consider `papaya` or `scc::HashMap` for wait-free semantics under extreme write contention
   - Benchmark with Criterion under concurrent load to verify shard count and access pattern choices
   - Use `map.iter()` sparingly on hot paths — iteration holds per-shard read locks sequentially


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
