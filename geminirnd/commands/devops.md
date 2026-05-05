---
description: Generate Dockerfiles, CI pipelines, and Infrastructure as Code
agent: core/devops
subtask: true
---

Generate infrastructure and CI/CD automation tailored to the application's runtime needs.

!`ls -la ./`
!`ls -la ./config/`
!cat package.json 2>/dev/null | head -50

1. Query Neo4j to analyze the application's connectivity. Identify all 'External Service' nodes (Databases, Redis, Third-party APIs) and 'Environment Variable' nodes.

2. Use Context7 to fetch the latest syntax and best practices for the target infrastructure.

3. Design an efficient CI pipeline using Sequential-Thinking.

4. Generate the required files (Dockerfile, docker-compose.yml, pipeline.yml) with 'Least Privilege' principles.


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
