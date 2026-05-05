---
description: Expert guidance on PropCheck property-based testing for Elixir applications
agent: elixir-propcheck-specialist
subtask: true
---

# PropCheck Property-Based Testing Command

Expert assistance for PropCheck property-based testing in Elixir applications. Get comprehensive guidance on property test design, StateM for stateful systems, custom generators, PropCheck vs StreamData comparison, and team adoption strategies.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather relevant context about your testing needs:

**Project Testing Context:**
```bash
!`find test -name '*properties*' -o -name '*generators*' -o -name '*state_machines*'`
!`grep -r 'use PropCheck\|use ExUnitProperties' test/`
!`grep 'propcheck\|stream_data' mix.exs`
```

**Stateful Systems to Test:**
```bash
!`grep -r 'use GenServer\|use GenStateMachine' lib/`
!`grep -r 'defmodule.*Server\|defmodule.*Worker' lib/`
```

**Current Test Coverage:**
```bash
!`mix test --cover`
!`find test -type f -name '*_test.exs' | wc -l`
```

## Usage Examples

### 1. Choosing Between PropCheck and StreamData

**When to use:**
- Evaluating property testing frameworks for your project
- Need to decide between PropCheck and StreamData
- Considering hybrid approach (using both)

**Example:**
```bash
/elixir-propcheck analyze our codebase and recommend whether to use PropCheck or StreamData. We have:
- 5 GenServers that manage application state
- 15 pure data transformation modules
- Team is new to property-based testing
- Corporate license policy requires Apache 2.0
```

**What you'll get:**
- Framework comparison based on your specific needs
- Recommendation with detailed reasoning
- Licensing considerations
- Migration plan if switching frameworks
- Team training recommendations

### 2. Designing Property Tests for Pure Functions

**When to use:**
- Writing property tests for the first time
- Need to identify properties for existing functions
- Want to improve test coverage with properties

**Example:**
```bash
/elixir-propcheck design property tests for our JSON encoder/decoder module. The module has:
- encode/1 - converts Elixir terms to JSON
- decode/1 - parses JSON to Elixir terms
- validate/1 - checks JSON structure
```

**What you'll get:**
- Round-trip property tests (encode → decode → identity)
- Invariant properties (type safety, structure validation)
- Custom generators for domain-specific types
- Shrinking optimization guidance
- Complete test module implementation

### 3. Implementing StateM for GenServer Testing

**When to use:**
- Testing stateful GenServers or GenStateMachines
- Need to validate complex state transitions
- Want to catch concurrency bugs

**Example:**
```bash
/elixir-propcheck create StateM test for our CacheServer. Operations:
- put(key, value) - stores entry
- get(key) - retrieves entry
- delete(key) - removes entry
- clear() - removes all entries
- size() - returns count

Invariant: cache never exceeds max_size of 100
```

**What you'll get:**
- Complete StateM module implementation
- Command generator with realistic frequency
- State model tracking expected behavior
- Preconditions for valid transitions
- Postconditions validating invariants
- Property test harness

### 4. Creating Custom Generators for Domain Types

**When to use:**
- Need realistic test data for your domain
- Built-in generators are too generic
- Want frequency-based generation patterns

**Example:**
```bash
/elixir-propcheck create generators for our e-commerce domain:
- Product (name, price, category, inventory_count)
- Order (products list, customer_id, status)
- Customer (email, name, address)

Products should be 70% in stock, 20% low stock, 10% out of stock
```

**What you'll get:**
- Custom generators matching your domain model
- Frequency-based realistic data distribution
- Constraints ensuring data validity
- Reusable generator module
- Usage examples in property tests

### 5. Migrating from StreamData to PropCheck

**When to use:**
- Current StreamData tests insufficient for stateful systems
- Need advanced StateM or FSM capabilities
- Want better shrinking for complex types

**Example:**
```bash
/elixir-propcheck create migration plan from StreamData to PropCheck. We have:
- 45 StreamData property tests (mostly pure functions)
- 3 GenServers needing stateful testing
- Team of 4 developers, 2 new to property testing
- 6 weeks available for migration
```

**What you'll get:**
- Detailed 6-week migration plan
- Phase-by-phase conversion strategy
- Syntax migration examples
- Team training schedule
- Hybrid approach recommendations
- Success metrics to track

### 6. FSM Testing for Protocol State Machines

**When to use:**
- Testing network protocols or connection pools
- Validating state machine implementations
- Need to verify state transition correctness

**Example:**
```bash
/elixir-propcheck create FSM test for our WebSocket connection manager with states:
- :disconnected - initial state
- :connecting - establishing connection
- :connected - active connection
- :reconnecting - connection lost, attempting reconnect

Valid transitions and commands for each state needed.
```

**What you'll get:**
- Complete FSM module implementation
- State transition definitions
- State-specific command generators
- Postconditions for each transition
- Protocol violation detection
- Property test integration

### 7. Debugging Failed Property Tests

**When to use:**
- Property test failing with large counterexample
- Too many discarded values (such_that issues)
- Stateful test behaving flakily

**Example:**
```bash
/elixir-propcheck help debug our failing property test. Issues:
1. Counterexample is huge (200-line map)
2. Shrinking produces non-minimal examples
3. Test passes sometimes, fails other times

[Paste failing test code]
```

**What you'll get:**
- Root cause analysis of failures
- Generator redesign for better shrinking
- Flakiness fixes (synchronization issues)
- Deterministic test reproduction
- Troubleshooting best practices

### 8. Optimizing Property Test Performance

**When to use:**
- Test suite taking too long to run
- Need to balance coverage vs execution time
- CI/CD pipeline timing out

**Example:**
```bash
/elixir-propcheck optimize our property test suite. Current status:
- 120 property tests
- Average run time: 8 minutes
- Target: under 3 minutes
- Some stateful tests hang occasionally
```

**What you'll get:**
- numtests optimization recommendations
- Parallel execution strategy
- Timeout configuration
- Stateful vs pure test separation
- CI/CD integration improvements
- Performance benchmarking approach

## What You'll Get

Every response includes:

### 1. **Comprehensive Implementation**
   - Complete, working PropCheck test modules
   - Custom generators tailored to your domain
   - StateM or FSM implementations for stateful systems
   - Property test harnesses with proper setup/teardown

### 2. **Framework Guidance**
   - PropCheck vs StreamData comparison for your use case
   - Clear recommendation with reasoning
   - Migration strategy if switching frameworks
   - Hybrid approach patterns when applicable

### 3. **Best Practices**
   - Property patterns (inverse, idempotent, round-trip, invariants)
   - Generator design principles (avoid such_that, use frequency)
   - Shrinking optimization techniques
   - StateM modeling best practices
   - Neo4j knowledge graph integration

### 4. **Team Enablement**
   - 6-week adoption plan (education → pair programming → adoption)
   - Training materials and exercises
   - Code review checklist
   - Internal documentation templates
   - Success metrics tracking

### 5. **Troubleshooting Support**
   - Common issue diagnosis (discards, shrinking, flakiness)
   - Root cause analysis of failing tests
   - Performance optimization strategies
   - CI/CD integration guidance

### 6. **Production-Ready Code**
   - Deterministic tests (reproducible with seed)
   - Proper error handling and validation
   - Documentation with clear property explanations
   - Integration with existing test suite

## Related Commands

- `/elixir-test` - General Elixir testing strategies (ExUnit, mocking, fixtures)
- `/elixir-coverage` - Test coverage analysis and improvement
- `/elixir-faker` - Test data generation with Faker library
- `/elixir-proper` - PropEr property testing (alternative to PropCheck)
- `/elixir-e2e` - End-to-end testing with Wallaby
- `/code-refactor` - Refactoring code to be more testable

## Key Capabilities

This command leverages the elixir-propcheck-specialist agent, which provides:

- **Property Test Design**: Identify and implement mathematical, round-trip, and invariant properties
- **StateM Expertise**: Model stateful systems with accurate state transitions, preconditions, and postconditions
- **FSM Testing**: Validate finite state machines and protocol implementations
- **Custom Generators**: Design realistic, domain-specific generators with proper shrinking
- **Framework Comparison**: Expert analysis of PropCheck vs StreamData trade-offs
- **Migration Strategies**: Detailed plans for converting between frameworks or adopting hybrid approaches
- **Team Training**: Comprehensive 6-week adoption plan with exercises and success metrics
- **Optimization**: Performance tuning for fast test execution and minimal shrinking
- **Troubleshooting**: Debug common issues (discards, poor shrinking, flaky stateful tests)
- **Neo4j Integration**: Store patterns, generators, and counterexamples in knowledge graph

## Tips for Best Results

1. **Provide Context**: Share existing test code, module structure, and system characteristics
2. **Be Specific**: Describe exact operations, state transitions, and invariants
3. **Share Constraints**: Mention team experience, timeline, and licensing requirements
4. **Include Failures**: Paste failing test output when debugging
5. **Clarify Goals**: Specify whether you need StateM, FSM, simple properties, or migration
6. **Mention Domain**: Explain your business domain for realistic generator design

## Technical Details

**Powered by:** `.opencode/agent/elixir-specific/elixir-propcheck-specialist.md`  
**MCP Servers:** context7 (PropCheck docs), neo4j (pattern storage), sequential-thinking (analysis)  
**Knowledge Graph:** Stores PropCheck patterns, generators, migration strategies, and counterexamples

---

**Note:** This command specializes in PropCheck property-based testing. For general Elixir testing use `/elixir-test`, for PropEr (alternative framework) use `/elixir-proper`, and for test data generation use `/elixir-faker`.

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
