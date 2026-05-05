---
description: Expert guidance on ConCache for concurrent testing and cache coordination
agent: elixir-concache-specialist
subtask: true
---

# ConCache Concurrent Testing Command

Expert assistance for ConCache concurrent testing and cache coordination in Elixir applications. Get comprehensive guidance on multi-process testing, race condition prevention, cache synchronization, and performance optimization.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

```bash
!`find test -name '*cache*_test.exs'`
!`grep -r 'ConCache' lib/ test/`
!`grep 'con_cache' mix.exs`
```

## Usage Examples

### 1. Set Up ConCache Infrastructure

**Example:**
```bash
/elixir-concache set up ConCache for our application with:
- Main application cache (10 min TTL)
- Session cache (1 hour TTL)
- Rate limit cache (5 min TTL)

Need supervision tree integration and test helpers.
```

### 2. Test Concurrent Cache Operations

**Example:**
```bash
/elixir-concache create tests for concurrent cache access:
- 50 processes reading simultaneously
- 20 processes writing simultaneously
- Test data consistency under load

Need performance benchmarks and latency measurements.
```

### 3. Implement Cache Coordination Patterns

**Example:**
```bash
/elixir-concache implement atomic counter increment using ConCache.isolated/3.
Also need cache stampede prevention for expensive database queries.
```

## Related Commands

- `/elixir-cachex` - Cachex caching patterns
- `/elixir-test` - General Elixir testing
- `/performance-optimize` - Performance optimization

**Powered by:** `.opencode/agent/elixir-specific/elixir-concache-specialist.md`  

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
