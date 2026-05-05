---
description: Analyze and optimize Cachex/ETS cache performance and distributed caching strategies
agent: elixir-specific/elixir-cachex-specialist
subtask: true
---

Expert in ETS cache analysis, Cachex performance optimization, memory management, and distributed caching patterns for Elixir applications. Use this command to improve cache hit rates, reduce memory overhead, and implement production-ready caching strategies.

!`grep -r "Cachex" lib/ --include="*.ex" | head -10`
!`grep -r "use GenServer" lib/ --include="*.ex" | grep -i cache | head -5`

## Core Capabilities

1. **Cache Performance Assessment**:
   - Analyze hit/miss rates with Cachex.Stats
   - Identify hot/cold key patterns
   - Monitor access patterns via telemetry

2. **ETS Table Optimization**:
   - Table type selection (:set, :ordered_set, :duplicate_bag)
   - Concurrency flags (:read_concurrency, :write_concurrency)
   - Memory and access pattern optimization

3. **Cache Invalidation Strategies**:
   - Time-based expiration with janitor service
   - Size-based eviction (LRW, LRU policies)
   - Distributed invalidation via Phoenix PubSub
   - Tag-based invalidation for related data

4. **Memory & GC Optimization**:
   - Binary reference counting (avoid unnecessary copies)
   - Process heap size analysis
   - Generational GC-aware patterns

5. **Prevent Cache Stampedes**:
   - Use `Cachex.fetch/4` (NOT manual get/put)
   - Proactive cache warming
   - Thundering herd prevention

6. **Distributed Caching**:
   - Consistent hash routing
   - Dynamic node discovery
   - Multi-node invalidation patterns

## Quick Wins Checklist

- [ ] Enable :read_concurrency on read-heavy tables
- [ ] Add Cachex.Stats hook for monitoring
- [ ] Switch from :bag to :duplicate_bag if no deduplication needed
- [ ] Configure janitor interval based on cache size
- [ ] Use Cachex.fetch/4 instead of get/put pattern
- [ ] Implement cache warming for hot paths

## Common Anti-Patterns to Avoid

❌ **Using GenServer for simple caching** → Use Cachex with ETS
❌ **Manual get/put pattern** → Use fetch/4 to prevent stampedes
❌ **Unnecessary binary copying** → Use reference counting
❌ **Ignoring cache stats** → Enable Cachex.Stats in production
❌ **No size limits** → Configure eviction policy

## Performance Targets

- **Hit Rate**: >70% for frequently accessed data
- **Miss Rate**: <30% indicates good cache efficiency
- **Janitor Interval**: 30-60s low memory, 2-5min high memory
- **Read:Write Ratio**: >10:1 justifies :read_concurrency


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
