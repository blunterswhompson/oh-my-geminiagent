---
description: Implement comprehensive observability and monitoring for Elixir applications
agent: elixir-specific/elixir-observability
subtask: true
---

Complete observability strategy with Phoenix LiveDashboard, Telemetry, OpenTelemetry, and APM integration for production Elixir applications.

!`ls -la ./lib/*_web/telemetry.ex 2>/dev/null || echo "No telemetry module"`
!`cat config/config.exs 2>/dev/null | grep -i "telemetry\|dashboard\|observability"`

1. **Phoenix LiveDashboard**:
   - Configure LiveDashboard with authentication
   - Set up custom metrics for business intelligence
   - Create custom dashboard pages (Oban, Ash, Broadway)
   - Secure dashboard access

2. **Telemetry Configuration**:
   - Design telemetry event architecture
   - Implement Telemetry.Metrics definitions
   - Attach custom telemetry handlers
   - Create telemetry pollers for periodic measurements

3. **OpenTelemetry Integration**:
   - Configure OpenTelemetry for distributed tracing
   - Set up automatic instrumentation (Phoenix, Ecto, Oban)
   - Implement custom spans for business operations
   - Configure trace sampling and export

4. **APM Integration**:
   - Select and configure APM provider (AppSignal, Honeybadger, etc.)
   - Set up custom instrumentation
   - Configure error tracking with context
   - Implement performance monitoring

5. **BEAM VM Monitoring**:
   - Configure VM metrics collection
   - Set up observer tools for development
   - Implement automated VM health checks
   - Monitor distribution health for clusters

6. **Alerting & Incident Response**:
   - Define SLOs and error budgets
   - Configure alerting rules
   - Set up notification channels
   - Document incident response procedures


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
