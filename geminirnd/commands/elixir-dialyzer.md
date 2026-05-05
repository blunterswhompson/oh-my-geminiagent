---
description: Configure Dialyzer static analysis and implement comprehensive typespecs for improved type safety
agent: elixir-specific/elixir-dialyzer-specialist
subtask: true
---

Implement Dialyzer configuration, comprehensive typespec coverage, success typing analysis, and gradual typing adoption strategies for Elixir applications.

!`cat mix.exs 2>/dev/null | grep -A10 "dialyzer:"`
!`ls -la priv/plts/ 2>/dev/null`
!`grep -r "@spec\|@type" lib/ 2>/dev/null | wc -l`

1. **Dialyzer Setup**:
   - Add dialyxir dependency to mix.exs
   - Configure dialyzer options (PLT file, flags, ignore warnings)
   - Build PLT for project and dependencies
   - Set up CI integration with PLT caching

2. **Typespec Implementation**:
   - Define custom types for domain models with @type
   - Add @spec annotations to all public functions
   - Use union types, guards, and opaque types appropriately
   - Document complex types with @typedoc

3. **Warning Resolution**:
   - Run mix dialyzer and categorize warnings
   - Fix pattern matching exhaustiveness issues
   - Resolve underspecified functions and contract violations
   - Handle unmatched returns and no_match warnings

4. **Gradual Adoption**:
   - Create adoption plan prioritizing critical paths
   - Use @dialyzer attribute for temporary warning suppression
   - Track progress with metrics (spec coverage percentage)
   - Establish team guidelines for typespec usage

5. **Advanced Patterns**:
   - Define behaviours with typespecs
   - Implement protocol specs correctly
   - Use remote types from dependencies
   - Create parameterized types for generic functions


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
