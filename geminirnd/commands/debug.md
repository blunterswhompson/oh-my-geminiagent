---
description: Debug and analyze errors with root cause analysis
agent: core/code-analyzer-debugger
subtask: true
---

Perform root cause analysis and remediation for the following error:

$ARGUMENTS

!cat package.json mix.exs 2>/dev/null | head -50
!ls -la ./lib/ 2>/dev/null
!ls -la ./logs/ 2>/dev/null

1. Analyze the stack trace and use Neo4j to map the exact path of the error through the codebase. Identify the 'Entry Point' and 'Failure Point'.

2. Generate 3 distinct hypotheses for the failure. For each hypothesis, cite the specific log evidence that supports it.

3. If the error involves a third-party library, use Context7 to search for known issues.

4. Query Neo4j for the 'Blast Radius' - which other modules depend on the function being changed?

5. Propose the code fix with explanation of *why* this fixes the root cause.

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
