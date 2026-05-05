---
description: Generate parallelized implementation plan for upcoming phases
agent: project-management/studio-producer
subtask: true
---

Analyze architecture versus current code to generate a parallelized implementation plan.

$ARGUMENTS

!cat package.json 2>/dev/null | head -50
!ls -la ./docs/ 2>/dev/null
!ls -la ./app/ 2>/dev/null

1. Review architectural documentation in 'docs' folder and compare against current codebase to determine implementation phase status.

2. Create a comprehensive implementation plan for next phases using available MCP servers.

3. Review the plan for parallelization opportunities - identify tasks that can run simultaneously.

4. Tag specific tasks with appropriate agents from '.opencode/agent'.

5. If no specialized agent is found, review '.opencode/skill' for general task agent suitability.

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
