---
description: Crawl website and identify UX errors and inconsistencies
agent: testing/playwrite-accessibility-auditor
subtask: true
---

Automated comprehensive site crawl using Playwright to identify technical errors and inconsistent UX implementation.

$ARGUMENTS

!`ls -la ./lib/chronodrip_app_web/router.ex 2>/dev/null || ls -la ./src/`

1. Utilize Playwright MCP to traverse the target website starting from root. Map entire site structure.

2. For every visited page, capture: console errors/warnings, network failures (404, 500), JavaScript failures.

3. Compare rendered pages against ux_standards documentation. Identify "Ubiquitous Experience Gaps".

4. Compile "Frontend UX Error Remediation Plan" prioritized by severity.

5. Compile "UX Implementation Review" for consistency gaps.


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
