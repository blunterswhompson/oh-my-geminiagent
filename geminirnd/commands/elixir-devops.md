---
description: Expert Elixir deployment, releases, clustering, and production infrastructure management
agent: elixir-devops
subtask: true
---

# Elixir DevOps & Deployment Command

Comprehensive expertise in Elixir deployment strategies, Mix releases, hot upgrades, distributed clustering, CI/CD pipelines, database migrations, monitoring, and production operations for BEAM applications.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather deployment and infrastructure context:

**Release Configuration:**
```bash
!`cat config/runtime.exs | head -50`
!`ls -la rel/ 2>/dev/null`
```

**Deployment Infrastructure:**
```bash
!`cat fly.toml 2>/dev/null`
!`cat Dockerfile 2>/dev/null`
!`ls -la .github/workflows/ 2>/dev/null`
```

**Application Configuration:**
```bash
!`cat config/prod.exs 2>/dev/null`
!`grep -r "cluster\|libcluster" config/`
```

## Usage Examples

### 1. Configure Production Mix Release

**When to use:**
- Setting up first production deployment
- Migrating from Distillery to Mix releases
- Optimizing release configuration

**Example:**
```bash
/elixir-devops Configure production Mix release for our Phoenix app with:
- Runtime configuration for DATABASE_URL, SECRET_KEY_BASE
- Release lifecycle hooks (migrate, rollback, seed)
- Strip beams for smaller release size
- Copy migrations and assets to release
- Exclude ERTS for Docker deployment

Target platform: Fly.io with PostgreSQL
```

**What you'll get:**
- Complete mix.exs release configuration
- config/runtime.exs with environment variable loading
- rel/overlays/ with migration and startup scripts
- lib/my_app/release.ex with migration tasks
- Dockerfile optimized for releases
- Documentation on building and testing releases

### 2. Implement Hot Code Upgrades

**When to use:**
- Zero-downtime deployment requirement
- Long-running stateful processes (GenServers)
- High-availability production systems

**Example:**
```bash
/elixir-devops Implement hot code upgrade strategy for:
- CacheServer GenServer (needs code_change callback)
- OrderProcessor worker (state migration required)
- Upgrading from v1.2.0 to v1.3.0

Changes:
- Added :metadata field to CacheServer state
- Renamed OrderProcessor.process/1 to process_order/1
- New NotificationService module

Platform: Fly.io with 2 machines for HA
```

**What you'll get:**
- .appup file with upgrade/downgrade instructions
- code_change/3 callbacks for GenServers
- State migration logic
- Testing procedure for hot upgrade
- Fly.io deployment strategy (rolling update)
- Rollback procedure
- Monitoring during upgrade

### 3. Set Up Distributed Cluster with libcluster

**When to use:**
- Multi-node deployment for scalability
- Distributed PubSub for real-time features
- Distributed Oban job processing

**Example:**
```bash
/elixir-devops Configure distributed cluster for our LiveView app with:
- 3-5 Fly.io machines across regions
- Phoenix PubSub distributed across nodes
- Oban job distribution
- Automatic node discovery

Features:
- Real-time notifications (Phoenix.Presence)
- Background job processing (Oban)
- Distributed cache (Cachex)
```

**What you'll get:**
- libcluster configuration (Fly.io DNS strategy)
- Phoenix.PubSub setup for distributed messaging
- Oban configuration for distributed job processing
- Node discovery and health monitoring
- Network partition handling
- Testing multi-node setup locally
- Deployment configuration

### 4. Design CI/CD Pipeline

**When to use:**
- Automating deployment workflow
- Setting up multi-environment deployments
- Implementing automated testing and security scanning

**Example:**
```bash
/elixir-devops Create GitHub Actions CI/CD pipeline with:

Stages:
1. Test: ExUnit, Credo, formatting, coverage
2. Security: deps.audit, Sobelow
3. Deploy Staging: On push to develop branch
4. Deploy Production: On push to main (manual approval)

Environments:
- Staging: my-app-staging.fly.dev
- Production: my-app.com (with rollback)

Requirements:
- Run migrations before deployment
- Health check validation
- Automated rollback on failure
- Slack notifications
```

**What you'll get:**
- .github/workflows/ci.yml with complete pipeline
- Staging and production deployment jobs
- Security scanning integration
- Automated migration execution
- Health check validation
- Rollback automation
- Notification configuration
- Secrets management guide

### 5. Implement Database Migration Strategy

**When to use:**
- Zero-downtime migration requirements
- Large table alterations
- Ash Framework resource migrations

**Example:**
```bash
/elixir-devops Create zero-downtime migration strategy for:
- Add 'priority' column to 'notifications' table (5M rows)
- Backfill priority based on notification type
- Make column NOT NULL after backfill

Constraints:
- Table locked <100ms per operation
- Migrations during business hours
- Using Ash Framework resources
```

**What you'll get:**
- Multi-step migration plan (nullable → backfill → NOT NULL)
- Concurrent index creation
- Batch backfill strategy
- Ash resource migration configuration
- Migration testing procedure
- Monitoring and validation
- Rollback plan

### 6. Set Up Production Monitoring

**When to use:**
- Deploying to production for first time
- Need observability and alerting
- Debugging production issues

**Example:**
```bash
/elixir-devops Configure monitoring and observability with:
- OpenTelemetry distributed tracing
- Phoenix LiveDashboard
- Structured JSON logging
- Custom business metrics (orders, users)

Targets:
- New Relic for APM (preferred)
- OR DataDog
- OR self-hosted (Prometheus + Grafana)

Key metrics:
- Request latency (p50, p95, p99)
- Error rate
- Database query performance
- Oban job processing times
- Active WebSocket connections
```

**What you'll get:**
- OpenTelemetry configuration and setup
- Custom telemetry events for business metrics
- Phoenix LiveDashboard integration
- LoggerJSON structured logging
- APM integration (New Relic/DataDog)
- Health check endpoints
- Alerting rules and runbooks

### 7. Troubleshoot Deployment Failures

**When to use:**
- Deployment succeeds but app unhealthy
- Hot upgrade fails
- Cluster nodes not connecting
- Migrations hanging

**Example:**
```bash
/elixir-devops Debug deployment failure:

Symptoms:
- Deployment succeeds (exit code 0)
- Health check returns 503 Unhealthy
- Logs show: "Database connection failed"
- fly status shows all machines stopped

Environment:
- Fly.io with 2 machines
- PostgreSQL database
- Phoenix 1.7 + LiveView

Recent changes:
- Added DATABASE_URL environment variable
- Updated to Elixir 1.16
```

**What you'll get:**
- Root cause analysis
- Step-by-step debugging procedure
- Configuration fixes
- Testing validation
- Prevention strategies
- Monitoring improvements

### 8. Optimize Release Size and Boot Time

**When to use:**
- Large release packages (>100MB)
- Slow application boot (>30s)
- Container image size concerns

**Example:**
```bash
/elixir-devops Optimize release for:
- Current release size: 145MB
- Boot time: 45 seconds
- Target: <80MB, <15s boot

Application:
- Phoenix LiveView
- 50+ dependencies
- Tailwind CSS compiled
- Deployed to Fly.io
```

**What you'll get:**
- Release optimization techniques (strip_beams, compression)
- Dependency analysis and cleanup
- Asset compilation optimization
- Multi-stage Dockerfile improvements
- Boot time profiling
- Lazy loading strategies
- Benchmark results

## What You'll Get

Every response includes:

### 1. **Production-Ready Configuration**
   - Complete Mix release setup
   - Runtime configuration with environment variables
   - Deployment scripts and lifecycle hooks
   - Platform-specific optimization (Fly.io, K8s, etc.)

### 2. **Deployment Automation**
   - CI/CD pipeline configuration (GitHub Actions)
   - Automated testing and security scanning
   - Multi-environment deployment strategy
   - Rollback automation and health checks

### 3. **Clustering & Distribution**
   - libcluster setup for node discovery
   - Distributed PubSub configuration
   - Distributed Oban job processing
   - Network partition handling

### 4. **Migration Strategy**
   - Zero-downtime migration patterns
   - Ash Framework migration integration
   - Backfill strategies for large datasets
   - Migration testing and validation

### 5. **Monitoring & Observability**
   - OpenTelemetry distributed tracing
   - Custom telemetry metrics
   - Phoenix LiveDashboard setup
   - Structured logging (JSON)
   - APM integration (New Relic/DataDog)

### 6. **Troubleshooting Support**
   - Root cause analysis
   - Debugging procedures
   - Configuration fixes
   - Prevention strategies

### 7. **Documentation**
   - Deployment runbooks
   - Rollback procedures
   - Monitoring dashboards
   - Incident response guides

## Related Commands

- `/senior-engineer` - Complex feature implementation with deployment considerations
- `/elixir-tester` - Testing strategies including deployment testing
- `/backend-reliability` - API design, database optimization, and security
- `/systems-architect` - Overall system architecture and design
- `/security-threat-analyst` - Security review for deployment configuration

## Key Capabilities

This command leverages the elixir-devops agent, which provides:

- **Mix Releases**: Production-ready release configuration with runtime config
- **Hot Upgrades**: Zero-downtime deployments with appup files and code_change callbacks
- **Clustering**: Distributed Erlang with libcluster (Kubernetes, Fly.io, DNS strategies)
- **CI/CD Pipelines**: GitHub Actions workflows for automated deployment
- **Database Migrations**: Zero-downtime patterns with Ash Framework integration
- **Monitoring**: OpenTelemetry, telemetry metrics, LiveDashboard, structured logging
- **Platform Expertise**: Fly.io, Kubernetes, Render, Gigalixir deployment strategies
- **Security**: Secrets management, environment configuration, security scanning
- **Troubleshooting**: Deployment failures, cluster issues, migration problems
- **Performance**: Release optimization, boot time reduction, resource efficiency

## Tips for Best Results

1. **Provide Platform Details**: Specify deployment target (Fly.io, K8s, AWS, etc.)
2. **Share Configuration**: Include mix.exs, config files, Dockerfile, fly.toml
3. **Describe Environment**: Staging vs production, multi-region, traffic patterns
4. **Include Constraints**: Zero-downtime requirement, deployment windows, team size
5. **Mention Monitoring**: Existing APM tools, alerting preferences
6. **Share Recent Changes**: What changed that might affect deployment
7. **Specify Application Type**: Phoenix LiveView, API-only, umbrella project, etc.

## Technical Details

**Powered by:** `.opencode/agent/elixir-specific/elixir-devops.md`  
**MCP Servers:** context7 (BEAM deployment docs), neo4j (deployment patterns), sequential-thinking (troubleshooting)  
**Knowledge Graph:** Stores deployment strategies, migration patterns, cluster configurations

---

**Note:** This command specializes in Elixir/BEAM deployment and operations. For general backend reliability use `/backend-reliability`, for testing strategies use `/elixir-tester`, and for overall architecture use `/systems-architect`.

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
