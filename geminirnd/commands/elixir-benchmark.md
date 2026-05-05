---
description: Create performance benchmarks with Benchee and detect performance regressions
agent: elixir-specific/elixir-benchmarking-specialist
subtask: true
---

Implement comprehensive performance benchmarking using Benchee to measure, compare, and track performance across code changes and optimizations.

!`cat mix.exs 2>/dev/null | grep -E "(benchee)"`
!`ls -la bench/ benchmarks/ 2>/dev/null`
!`grep -r "Benchee.run" . 2>/dev/null | head -5`

1. **Benchee Setup**:
   - Add benchee and benchee_html dependencies
   - Create benchmarks/ directory structure
   - Configure Benchee with warmup, time, memory_time
   - Set up formatters (console, HTML, JSON)

2. **Benchmark Design**:
   - Create focused benchmarks for critical operations
   - Compare implementation alternatives side-by-side
   - Use realistic input data sets
   - Benchmark with various input sizes

3. **Advanced Features**:
   - Configure inputs for parameterized benchmarks
   - Enable memory measurements
   - Use save/load for regression detection
   - Generate HTML reports for visualization

4. **Performance Analysis**:
   - Analyze IPS (iterations per second) and memory usage
   - Identify performance bottlenecks
   - Compare before/after optimization
   - Profile with :fprof or :eprof for deep analysis

5. **CI Integration**:
   - Run benchmarks on performance-critical PRs
   - Store baseline results for comparison
   - Detect regressions automatically
   - Track performance trends over time

Run benchmarks: `mix run benchmarks/my_benchmark.exs`
Generate HTML report with console output and detailed analysis.
