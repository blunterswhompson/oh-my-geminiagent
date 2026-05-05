---
description: Audit code-to-documentation parity and enrich technical guides
agent: core/technical-mentor-guide
subtask: true
---

Audit code-to-doc parity, identify undocumented features, and enrich technical guides with external context.

!`ls -la ./docs/`
!`ls -la ./lib/`

1. Query Neo4j to retrieve the current map of all public modules and API endpoints. Compare against './docs' folder to find 'Orphan Nodes'.

2. For key technologies identified in the code, use Context7 to fetch official best-practice summaries.

3. Structure new documentation for 'Orphan Nodes' with: The Why, The How, The Gotchas, and Dependencies.

4. Generate updated Markdown content with cross-links matching Neo4j relationships.


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
