---
description: Design and implement reliable backend APIs with security, scalability, and data integrity
agent: core/backend-reliability-engineer
subtask: true
---

Comprehensive backend development covering RESTful/GraphQL APIs, database design, security, Elixir/OTP patterns with Ash Framework, and production reliability.

!`find ./lib -name "*_controller.ex" -o -name "*_resource.ex" 2>/dev/null | head -20`
!`cat config/config.exs 2>/dev/null | grep -E "(pool_size|port|database)" || echo "No backend config found"`
!`ls -la priv/repo/migrations/ 2>/dev/null | head -10`

1. **API Design and Development**:
   - Follow RESTful conventions (GET /users, POST /users, PATCH /users/:id)
   - Use proper HTTP status codes (201 Created, 404 Not Found, 422 Unprocessable)
   - Add pagination for list endpoints with metadata (page, page_size, total_count)
   - Implement rate limiting (Hammer library for Elixir)
   - Version APIs from v1 (/api/v1/users)
   - Comprehensive error handling with FallbackController

2. **Database Design and Optimization**:
   - Design normalized schemas with foreign key constraints
   - Add strategic indexes for query patterns (verify with EXPLAIN ANALYZE)
   - Implement optimistic locking with version fields
   - Configure connection pooling (pool_size: (cpus * 2) + 1)
   - Prevent N+1 queries with Repo.preload or Ash.Query.load

3. **Security Implementation**:
   - Implement JWT authentication (Guardian for Elixir)
   - Add authorization with Ash policies (authorize_if, relates_to_actor_via)
   - Validate all inputs at API boundary
   - Apply security headers (CSP, HSTS, X-Frame-Options, CORS)
   - Never expose sensitive data (mark fields as private?: true, sensitive?: true)

4. **Elixir/OTP Reliability**:
   - Design supervision trees (one_for_one, rest_for_one strategies)
   - Use GenServer ONLY for infrastructure (pools, caches) - NEVER for domain entities
   - Store domain entities in database with Ash resources
   - Use Oban for background jobs (emails, async processing)
   - Implement circuit breakers for external services (Fuse library)

5. **Observability and Monitoring**:
   - Add :telemetry events for critical operations
   - Configure structured logging with metadata
   - Create health check endpoints (/health)
   - Export metrics to Prometheus/Datadog


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
