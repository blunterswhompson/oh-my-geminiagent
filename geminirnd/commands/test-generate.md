---
description: Generate automated test suites (E2E & Unit) with Playwright
agent: testing/e2e-tester
subtask: true
---

Generate comprehensive tests using Neo4j for scope, Context7 for syntax, and Playwright for selector validation.

$ARGUMENTS

!cat package.json 2>/dev/null | head -50
!ls -la ./test/ 2>/dev/null
!ls -la ./e2e/ 2>/dev/null

1. Query Neo4j to identify upstream/downstream dependencies. Determine if the module touches the UI layer.

2. Use Context7 to fetch latest documentation for the testing framework.

3. If UI task, activate Playwright MCP to launch browser, inspect DOM, and extract robust selectors.

4. Use Sequential-Thinking to plan test logic including failure conditions and security inputs.

5. Write the test suite using verified Playwright selectors or mocked dependencies.

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
