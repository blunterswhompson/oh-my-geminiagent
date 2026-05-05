---
description: Design Elixir system architecture with Ash Framework, OTP, and Phoenix LiveView
agent: elixir-specific/elixir-architect
subtask: true
---

Design comprehensive Elixir system architecture for the application.

!`ls -la ./lib/`
!`cat mix.exs 2>/dev/null | head -30`

1. **Domain Modeling**: Design Ash Framework resources with proper relationships, actions, and validations. Use explicit attribute acceptance, manage_relationship changes, filters, sorts, and Ash policies.

2. **OTP Architecture**: Plan supervision trees with one_for_one, one_for_all, rest_for_one strategies. Implement GenServer patterns with handle_call, handle_cast, handle_info.

3. **Data Layer**: Configure PostgreSQL with AshPostgres - schema design, indexing, migrations, connection pooling.

4. **Service Boundaries**: Define Functional Core (pure functions) vs Imperative Shell (side effects). Use context modules and protocols.

5. **Integration Patterns**: Design Phoenix LiveView with AshPhoenix.Form, real-time updates, RESTful APIs, GraphQL.


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
