---
description: Transform user requests into technical specifications
agent: core/prd-writer
subtask: true
---

Transform vague user requests into technical specifications, validating feasibility against the current graph.

$ARGUMENTS

!`ls -la ./lib/`

1. Query Neo4j to understand current data model and existing modules. Check if feature requires data we don't have or duplicates functionality.

2. Use Context7 to research standard implementations (e.g., "NIST guidelines for 2FA 2025").

3. Use Sequential-Thinking to break the feature into Atomic User Stories: "As a [User], I can [Action], so that [Benefit]."

4. Generate 'spec.md' linking requirements to existing Neo4j nodes they will modify.


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
