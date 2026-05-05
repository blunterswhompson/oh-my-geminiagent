---
description: Create performance benchmarks with Criterion and detect performance regressions in Rust
agent: rust-specific/rust-benchmarking-specialist
subtask: true
---

Implement comprehensive performance benchmarking using Criterion.rs to measure, compare, and track performance across code changes and optimizations in Rust applications.

!`cargo bench 2>&1 | head -20`
!`cat Cargo.toml | grep -A5 '\[dev-dependencies\]'`

1. **Criterion Setup**:
   - Add `criterion` to `[dev-dependencies]` in Cargo.toml with features = ["html_reports"]
   - Create `benches/` directory with benchmark files
   - Configure `[[bench]]` entries in Cargo.toml with `harness = false`
   - Set up `Criterion::default().sample_size()` and `measurement_time()`

2. **Benchmark Design**:
   - Use `criterion_group!` and `criterion_main!` macros for benchmark registration
   - Create focused benchmarks for critical hot paths and algorithms
   - Compare implementation alternatives side-by-side with `BenchmarkGroup`
   - Use `black_box()` to prevent compiler optimizations from skewing results

3. **Advanced Features**:
   - Configure parameterized benchmarks with `bench_with_input` and varied input sizes
   - Enable throughput reporting with `group.throughput(Throughput::Bytes(n))`
   - Use `--save-baseline` and `--load-baseline` flags for regression detection
   - Generate HTML reports in `target/criterion/` for visual flame graph analysis

4. **Performance Analysis**:
   - Interpret IPS (iterations per second), mean, and standard deviation output
   - Identify bottlenecks using `cargo flamegraph` or `perf` integration
   - Compare before/after optimization results with Criterion's regression detection
   - Profile allocations with `dhat` or `heaptrack` for memory-bound benchmarks

5. **CI Integration**:
   - Run `cargo bench --no-run` on every PR to verify compilation
   - Store baseline results as CI artifacts for cross-PR comparison
   - Use `critcmp` tool to diff benchmark results automatically
   - Fail CI when regression exceeds defined threshold percentage


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
