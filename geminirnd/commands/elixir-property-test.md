---
description: Implement advanced property-based testing with ExUnitProperties and StreamData for robust validation
agent: elixir-specific/elixir-property-testing-specialist
subtask: true
---

Implement comprehensive property-based testing strategies using ExUnitProperties, StreamData, and advanced generators to validate complex business invariants and edge cases.

!`cat mix.exs 2>/dev/null | grep -E "(stream_data|propcheck|proper)"`
!`grep -r "property\|check all" test/ 2>/dev/null | head -10`

1. **Property Testing Setup**:
   - Add stream_data dependency to mix.exs
   - Configure ExUnit for property tests (@tag :property)
   - Create property testing utilities module
   - Set up test module pattern with use ExUnitProperties

2. **Generator Design**:
   - Build composite generators for complex domain structures
   - Implement conditional generators with dependencies
   - Create recursive generators for tree/graph structures
   - Design stateful generators for sequences
   - Ensure shrinking-friendly generator composition

3. **Invariant Testing**:
   - Test mathematical properties (commutativity, associativity, idempotence)
   - Verify round-trip properties (encode/decode, serialize/deserialize)
   - Validate business rules and constraints
   - Test state machine invariants
   - Check boundary conditions automatically

4. **Stateful Testing**:
   - Model systems as command sequences
   - Generate valid command sequences based on state
   - Test concurrent operations with race conditions
   - Implement state machine models with next_state/3

5. **Advanced Techniques**:
   - Configure max_runs, generation_size, shrinking_steps
   - Debug with counterexamples and minimal failing cases
   - Use targeted testing for edge case discovery
   - Integrate PropCheck for advanced stateful testing


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
