---
description: Generate UX remediation plan with parallelized agent execution
agent: design/ui-designer
subtask: true
---

Generate a parallelized remediation plan for UX improvements based on audit findings.

$ARGUMENTS

!`ls -la ./docs/ux_review/ 2>/dev/null || echo "No ux_review directory yet"`

1. Retrieve latest UX standards for 2024-2025 modern web applications using Context7. Focus on:
   - Server-side rendering latency patterns (Phoenix LiveView)
   - Accessibility (WCAG 2.2)
   - Mobile-first responsive design
   - Micro-interactions and state feedback

2. Scan '.opencode/agent' to identify QA, Frontend, or Accessibility specialists.

3. Generate Playwright script to crawl application, capture screenshots, record video traces. Save to docs/ux_review/.

4. Analyze artifacts against Modern Standards checklist. Maintain core Design Specs - do not suggest rebrand.

5. Output to docs/plans/ux_remediation_plan.md with:
   - Executive Summary
   - Critical UX Failures
   - Parallel Execution Plan (Task ID, Description, Assigned Agent, Dependency, Parallel Block)


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
