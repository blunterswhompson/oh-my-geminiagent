---
description: Implement complex features with production-ready code, architectural thinking, and comprehensive testing
agent: core/senior-software-engineer
subtask: true
---

Production-grade feature implementation requiring architectural decisions, cross-functional leadership, and pragmatic trade-offs. Use this command for complex features spanning multiple contexts, performance-critical implementations, and system-wide architectural work.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

!find app -name "*.tsx" -o -name "*.ts" | head -10
!ls -la app/ 2>/dev/null
!cat docs/architecture/*.md 2>/dev/null | head -50
!git log --oneline --graph --all -10 2>/dev/null

## Usage Examples

### 1. Implement Complex Feature (Next.js 15+)

Build complete feature with Server Actions, Zod validation, and Playwright tests:

```bash
@senior-software-engineer Implement real-time dashboard with:
- Server Actions for data mutations
- Zod validation for all inputs
- Dynamic segments for dashboard routing
- Revalidation logic (revalidatePath)
- Playwright E2E tests covering auth flows
- Responsive UI using Tailwind and Shadcn
```

**What you'll get**:
- Next.js 15 App Router implementation
- Server Actions with robust error handling
- Zod schemas for form and API validation
- Optimized layouts and loading states
- Comprehensive Playwright test suite
- Responsive Tailwind CSS components
- Operational runbook for Vercel deployment

### 2. Architectural Decision with Trade-off Analysis

Make evidence-based architectural decisions:

```bash
@senior-software-engineer We need to scale beyond 10k users. Analyze:
- Current monolith vs microservices
- Phoenix.PubSub vs Redis Pub/Sub
- Event-sourcing vs CRUD+Events

Provide:
- Trade-off matrix with weighted criteria
- Prototype of uncertain aspects
- ADR with alternatives and consequences
- Migration roadmap
```

**What you'll get**:
- 3+ architectural options evaluated
- Trade-off matrix with scoring
- Working prototype validating assumptions
- ADR-###-decision-name.md
- Phased migration plan
- Risk assessment and mitigation

### 3. Refactor Legacy Code for Maintainability

Improve existing code quality without breaking functionality:

```bash
@senior-software-engineer Refactor Accounts context:
- Extract pure business logic to impl/
- Separate data access (repository pattern)
- Remove circular dependencies
- Add missing test coverage
- Document public API

Constraints:
- Zero downtime
- Backward compatible
- Incremental (reviewable chunks)
```

**What you'll get**:
- Refactored module structure
- Pure functions extracted
- Repository pattern for queries
- Comprehensive test suite
- Module documentation
- Before/after comparison
- Git commits in logical steps

### 4. Performance Optimization

Improve performance of critical paths:

```bash
@senior-software-engineer Optimize user dashboard query:
- Current: 2.5s load time
- Target: <500ms
- Profile query execution
- Add database indexes
- Implement caching strategy
- Add performance tests

Document:
- Baseline metrics
- Optimization approach
- Performance impact
- Cache invalidation strategy
```

**What you'll get**:
- Query execution plan analysis
- N+1 query fixes
- Database index recommendations
- Caching implementation (Cachex/ETS)
- Performance benchmarks (before/after)
- Monitoring dashboards
- Performance regression tests

### 5. Design Multi-Context Feature

Feature spanning multiple bounded contexts:

```bash
@senior-software-engineer Implement user activity feed showing:
- Content posts (Content context)
- Notifications (Notifications context)
- User actions (Accounts context)

Design:
- Event-based communication between contexts
- Aggregate query pattern
- Caching strategy
- Real-time updates

Ensure:
- Clear context boundaries
- No circular dependencies
- Testable in isolation
```

**What you'll get**:
- Event bus architecture
- Broadway pipeline for aggregation
- Context integration via events
- Aggregate query implementation
- Cache invalidation strategy
- Neo4j dependency graph validation
- Integration tests per context boundary

### 6. Build Background Job System

Implement reliable async processing:

```bash
@senior-software-engineer Create email digest background job:
- Daily digest of unread notifications
- Scheduled via Oban cron
- Batch processing (1000 users/batch)
- Retry logic for failures
- Progress tracking
- Monitoring and alerting

Features:
- Idempotent job execution
- Rate limiting (respect email provider limits)
- Template rendering
- Link tracking
```

**What you'll get**:
- Oban worker with proper configuration
- Batch processing implementation
- Retry strategy with exponential backoff
- Idempotency guarantees
- Job progress tracking
- Email templates
- Oban dashboard integration
- Monitoring queries and alerts

### 7. Add Real-Time Collaboration Features

Implement LiveView-based collaborative features:

```bash
@senior-software-engineer Add collaborative document editing:
- Phoenix.Presence for user tracking
- Operational Transform for conflict resolution
- LiveView with optimistic updates
- Auto-save with debouncing
- Cursor position sharing
- Undo/redo support

Requirements:
- <100ms update latency
- Handle 50 concurrent editors
- Conflict-free resolution
- Offline support
```

**What you'll get**:
- Phoenix.Presence integration
- Operational Transform implementation
- LiveView with JS hooks
- Conflict resolution algorithm
- Debounced auto-save
- Local storage sync
- Load test suite (concurrent editors)
- Operational runbook

### 8. Integrate External API

Reliable external service integration:

```bash
@senior-software-engineer Integrate Stripe payment processing:
- Webhook handlers
- Payment intent flow
- Subscription management
- Circuit breaker for failures
- Idempotent webhook processing
- Audit trail

Security:
- Webhook signature verification
- PCI compliance
- Secure credential storage

Testing:
- Mock external calls (Mox)
- Webhook replay tests
- Failure scenario tests
```

**What you'll get**:
- Stripe client module with Req
- Webhook verification
- Idempotent webhook handlers
- Circuit breaker implementation (Fuse)
- Subscription lifecycle management
- Mox mocks for testing
- Webhook replay infrastructure
- Security audit checklist
- PCI compliance documentation

## What You'll Get

### Production-Ready Implementation

1. **Clean Code Structure**
   ```
   lib/chronodrip_app/feature_name/
     feature_name.ex          # Public API
     impl/
       business_logic.ex      # Pure functions
       calculator.ex
     schema.ex                # Ecto schema
     queries.ex               # Repository pattern
     worker.ex                # Oban background job
   ```

2. **Comprehensive Testing**
   - Unit tests (pure logic)
   - Integration tests (database, PubSub)
   - LiveView tests (user interactions)
   - Property-based tests (StreamData)
   - >80% code coverage

3. **Database Migrations**
   - Schema changes with proper types
   - Indexes for common queries
   - Zero-downtime deployment strategy
   - Backfill scripts if needed

4. **Monitoring & Observability**
   - Telemetry metrics
   - Structured logging with correlation IDs
   - Error tracking
   - Performance dashboards

5. **Documentation**
   - Module @moduledoc with examples
   - Function @doc with type specs
   - ADRs for key decisions
   - Operational runbooks
   - API documentation

### Architecture Decision Record (ADR)

```markdown
# ADR-###: Decision Title

## Status
Accepted | Proposed | Deprecated

## Context
Business requirements and technical constraints

## Decision
What we decided to do and why

## Alternatives Considered
- Option A: Pros/Cons
- Option B: Pros/Cons

## Consequences
Positive, negative, and neutral impacts

## Implementation Notes
Code examples and migration strategy
```

### Operational Runbook

- Architecture overview
- Key metrics to monitor
- Common issues and resolutions
- Deployment checklist
- Rollback procedures

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
