---
description: Analyze codebase architecture and map dependencies to Neo4j knowledge graph
agent: core/systems-architect
subtask: true
---

Analyze the system architecture by mapping the codebase dependencies to Neo4j and validating against external architectural patterns.

!`ls -la ./src/`
!`ls -la ./lib/`

1. Scan the './src' directory and use Neo4j to create nodes for every module/class and relationships for imports/dependencies. Tag nodes with their layer (e.g., 'Presentation', 'Domain', 'Data').

2. Identify the primary frameworks used and use Context7 to retrieve current official architectural best practices.

3. Compare the Neo4j graph structure against Context7 best practices. List specific files that violate boundary rules.

4. Generate a markdown report with 'High Coupling' nodes that need refactoring.


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
