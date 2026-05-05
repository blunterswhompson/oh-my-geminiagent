---
description: Create comprehensive Elixir test suites with ExUnit, Ash, Oban, and LiveView testing
agent: elixir-specific/elixir-tester
subtask: true
---

Comprehensive Elixir testing strategies covering ExUnit patterns, Ash framework testing, Oban background jobs, Phoenix LiveView testing, and property-based testing.

!`ls -la ./test/`
!`cat mix.exs 2>/dev/null | grep -A20 "deps"`

1. **Test Architecture**:
   - Organize tests: test/APP_NAME_web/, test/APP_NAME/, features/, integration/
   - Create test support modules and fixtures
   - Establish test data factories using ExMachina

2. **Ash Resource Testing**:
   - Use Ash.Generator.action_input for property-based testing
   - Create authorization tests for different actor scenarios
   - Test calculations, aggregates, error handling

3. **Oban Worker Testing**:
   - Configure Oban for testing: inline for simple, manual for complex
   - Test job retries, errors, scheduled jobs
   - Create integration tests for multi-step workflows

4. **LiveView Testing**:
   - Test mounting and initial state
   - Test form interactions with form()/render_change()/render_submit()
   - Test events with render_hook()
   - Test real-time updates and broadcasting

5. **Property Testing**:
   - Use StreamData for property-based testing
   - Create custom generators for domain types
   - Test invariants and edge cases


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
