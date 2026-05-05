---
description: Design Rust system architecture with Axum, Tokio, and SQLx
agent: rust-specific/rust-architecture-agent
subtask: true
---

Design comprehensive Rust system architecture for the application.

!`ls -la ./src/`
!`cat Cargo.toml 2>/dev/null | head -30`

1. **Domain Modeling**: Design idiomatic Rust domain models and repository traits with #[async_trait]. Use newtype patterns, enums for state machines, and type-safe validation.

2. **Tokio Architecture**: Plan the async runtime with task spawning, mpsc/oneshot channels for communication, and graceful shutdown. Manage shared state safely with Arc<Mutex<T>> or Arc<RwLock<T>>.

3. **Data Layer**: Configure PostgreSQL with SQLx - PgPool, compile-time checked queries (query!), and migrations. Use transaction management and optimize indices.

4. **Service Boundaries**: Define Functional Core (pure business logic) vs Imperative Shell (I/O and side effects). Use service layers for orchestration and thiserror for error mapping.

5. **Web Integration**: Design Axum routers, handlers, and extractors. Integrate Tower middleware for logging, timeouts, and CORS.


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
