---
description: Systematic debugging and root cause analysis for bugs and performance issues
agent: core/code-analyzer-debugger
subtask: true
---

Evidence-based debugging methodology following Observe → Hypothesize → Test → Analyze → Conclude process for identifying root causes.

!`find lib test -type f \( -name "*.ex" -o -name "*.exs" \) 2>/dev/null | head -20`
!`tail -50 log/dev.log 2>/dev/null || echo "No dev log found"`
!`grep -r "TODO\|FIXME\|XXX\|HACK" lib/ 2>/dev/null | head -10 || echo "No code comments found"`
!`mix deps 2>/dev/null | grep -E "(observer|recon|telemetry)" || echo "No debugging deps found"`

## Overview

Systematic investigation specialist that analyzes code issues, traces execution paths, and identifies root causes. Follows the principle "Every symptom has multiple potential causes" and operates on evidence-based conclusions rather than assumptions.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

The commands above provide:
- Application structure and modules
- Recent log entries for errors
- Code comments marking potential issues
- Debugging tools available (Observer, Recon, Telemetry)

## Usage Examples

### 1. Investigate Production Bug

Systematic investigation of errors or unexpected behavior:

```bash
@code-analyze-debug "Users are getting timeout errors on checkout page - investigate why"
```

**What you'll get:**
- Complete error message and stack trace analysis
- Hypothesis generation (3-5 potential causes)
- Targeted experiments to test each hypothesis
- Five Whys analysis to find root cause
- Prevention strategies to avoid recurrence

### 2. Performance Bottleneck Analysis

Profile slow endpoints or operations:

```bash
@code-analyze-debug "The /api/orders endpoint is taking 500ms - identify the bottleneck"
```

**What you'll get:**
- Profiling data (:eprof, :observer)
- Database query analysis (EXPLAIN ANALYZE)
- N+1 query detection
- Memory usage analysis
- Specific optimization recommendations

### 3. Race Condition Investigation

Debug intermittent failures and concurrency issues:

```bash
@code-analyze-debug "Counter increments are being lost under high load - possible race condition"
```

**What you'll get:**
- Concurrent test reproduction
- Execution path tracing
- Identification of race window
- Atomic operation solution
- Regression test to prevent recurrence

### 4. Memory Leak Detection

Identify processes or data structures causing memory growth:

```bash
@code-analyze-debug "Application memory grows over time and eventually crashes"
```

**What you'll get:**
- Memory profiling with :recon
- Top processes by memory usage
- ETS table size analysis
- GenServer mailbox inspection
- Specific leak source and fix

### 5. Database Query Performance

Investigate slow database queries:

```bash
@code-analyze-debug "Query to fetch user orders is slow - 2 seconds for 100 orders"
```

**What you'll get:**
- EXPLAIN ANALYZE output
- Index recommendations
- N+1 query identification
- Preloading strategy
- Before/after performance comparison

### 6. Integration Failure Analysis

Debug failures between components or external services:

```bash
@code-analyze-debug "Payment processing fails intermittently with external API"
```

**What you'll get:**
- Network request/response inspection
- Timeout and retry analysis
- External service status check
- Circuit breaker recommendation
- Error handling improvements

### 7. Test Failure Investigation

Diagnose flaky or failing tests:

```bash
@code-analyze-debug "Tests pass individually but fail when run together - investigate"
```

**What you'll get:**
- Test isolation analysis
- Shared state identification
- Setup/teardown review
- Database cleanup verification
- Test ordering investigation

### 8. Error Pattern Recognition

Identify common bug patterns in error logs:

```bash
@code-analyze-debug "Seeing frequent ArithmeticError crashes - what's the pattern?"
```

**What you'll get:**
- Stack trace analysis
- Common failure paths identification
- Data validation gaps
- Null/nil check recommendations
- Edge case handling improvements

## What You'll Get

The code-analyzer-debugger delivers:

1. **Systematic Observation**: Complete error messages, stack traces, reproducible steps, minimal examples
2. **Hypothesis Generation**: 3-5 potential causes spanning different layers with prioritization
3. **Targeted Testing**: Binary search problem space, instrumentation, assumption validation
4. **Root Cause Analysis**: Five Whys technique, distinction between symptoms and causes
5. **Performance Profiling**: CPU, memory, I/O bottleneck identification with evidence
6. **Pattern Recognition**: Race conditions, memory leaks, N+1 queries, timezone issues, encoding problems
7. **Verification**: Regression tests, documentation, knowledge base updates

## Investigation Process

1. **Observe** - Gather evidence: errors, logs, stack traces, reproduction steps
2. **Hypothesize** - Generate multiple potential causes (minimum 3-5)
3. **Test** - Design targeted experiments, change one variable at a time
4. **Analyze** - Apply Five Whys, trace execution paths, identify root cause
5. **Conclude** - Document findings, write regression tests, update knowledge base

## Anti-Patterns Prevented

- ❌ Making changes without reproducing issue
- ❌ Assuming first symptom is root cause
- ❌ Changing multiple variables simultaneously
- ❌ Trusting documentation over code behavior
- ❌ Fixing symptoms without identifying causes
- ❌ Skipping verification after implementing fixes

## Common Bug Patterns Detected

- **Race Conditions**: Concurrent access to shared state
- **Memory Leaks**: Unbounded ETS tables, mailbox buildup
- **N+1 Queries**: Loading associations individually
- **Off-by-One Errors**: Incorrect range boundaries
- **Timezone Issues**: Naive datetime vs UTC comparison
- **Encoding Problems**: UTF-8 vs Latin-1 mismatches

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
