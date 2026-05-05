---
description: Debug Elixir applications with OTP, LiveView, and Ash tracing
agent: elixir-specific/elixir-debugger
subtask: true
---

Debug and troubleshoot Elixir applications using OTP processes, Phoenix LiveView, and Ash Framework.

$ARGUMENTS

!`ls -la ./logs/ 2>/dev/null || echo "No logs directory"`
!`mix deps 2>/dev/null | head -20`

1. **Error Tracing**: Use Neo4j to trace execution paths through OTP processes. Use Cypher queries to find supervisor chains and message flow.

2. **Process Debugging**: Use :sys module for GenServer debugging:
   - :sys.statistics(pid, true) / :sys.trace(pid, true)
   - :sys.get_state(pid), :sys.get_status(pid)
   - :sys.no_debug(pid) for cleanup

3. **LiveView Debugging**:
   - Socket state inspection with IO.inspect
   - Component debugging with update/handle_info
   - Form changeset debugging

4. **Ash Action Debugging**: Trace Ash resource action failures with Ash.ActionInput.for_action/3 and error handlers.

5. **Performance Profiling**: Use :observer, :erlang.memory(), Telemetry handlers, and CPU profiling.


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
