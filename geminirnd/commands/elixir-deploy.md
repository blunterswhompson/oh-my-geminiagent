---
description: Deploy Elixir applications with Mix releases, clustering, and hot upgrades
agent: elixir-specific/elixir-devops
subtask: true
---

Comprehensive guidance for deploying Elixir applications with Mix releases, distributed Erlang clustering, and zero-downtime deployments.

!`ls -la ./rel/ 2>/dev/null || echo "No rel directory"`
!`ls -la ./config/`

1. **Release Building**:
   - Run `mix release.init` for vm.args.eex and env.sh.eex
   - Configure runtime.exs for environment-specific settings
   - Set RELEASE_DISTRIBUTION and RELEASE_NODE
   - Build with MIX_ENV=prod mix release

2. **Distributed Setup**:
   - Add libcluster dependency and configure Kubernetes DNS strategy
   - Set up Phoenix.PubSub for distributed messaging
   - Configure distributed tracing with correlation IDs

3. **Database Migration**:
   - Generate migrations with `mix ash_postgres.generate_migrations`
   - Review migrations for safety
   - Plan deployment sequence: generate → test staging → apply prod

4. **Monitoring Setup**:
   - Set up Telemetry for Phoenix, Ecto, BEAM metrics
   - Configure health check endpoints
   - Implement OpenTelemetry tracing

5. **Hot Upgrade Planning**:
   - Plan for compatible Erlang/OTP versions
   - Configure phx-track-static for asset changes
   - Implement rolling deployment with connection draining


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
