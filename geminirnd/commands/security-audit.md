---
description: Analyze codebase for security vulnerabilities and threats
agent: core/security-threat-analyst
subtask: true
---

Analyze codebase for security flaws using taint analysis and external vulnerability databases.

!cat package.json 2>/dev/null | head -50
!`ls -la ./lib/`

1. Use Neo4j to trace data flow paths from 'Public Inputs' (API controllers, forms) to 'Sensitive Sinks' (Database queries, shell commands, logs). Flag paths without sanitization.

2. Use Context7 to look up CVE vulnerabilities for dependencies in mix.lock or package.json.

3. Use Sequential-Thinking to simulate attack scenarios (DoS, Broken Access Control, etc.)

4. Generate 'security_audit.md' prioritized by Risk (Likelihood x Impact).


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
