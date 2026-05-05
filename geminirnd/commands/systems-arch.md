---
description: Design scalable system architectures with evidence-based decisions and long-term evolution planning
agent: core/systems-architect
subtask: true
---

Long-term architectural thinking with trade-off analysis, proven patterns research, and sustainable system evolution. Use this command for architecture design, technology evaluations, migration planning, and creating Architecture Decision Records (ADRs).

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

!`ls -la lib/ docs/architecture/ docs/decisions/ 2>/dev/null`
!`find lib -name "*.ex" | head -20`
!`cat docs/architecture/*.md 2>/dev/null | head -30`
!`cat docs/decisions/ADR-*.md 2>/dev/null | head -20`

## Usage Examples

### 1. Design New System Architecture

Create comprehensive architecture from requirements:

```bash
@systems-arch Design architecture for real-time analytics system:
- Ingest 10k events/second
- Real-time dashboards (<1s latency)
- 90-day retention
- Export to data warehouse

Provide:
- Multiple architectural options
- Trade-off analysis matrix
- Technology recommendations
- Scalability projections (10x scenario)
- ADR documenting decision
- C4 diagrams (context, container, component)
```

**What you'll get**:
- 3+ architectural options evaluated
- Trade-off matrix with evidence
- Proven pattern research (via Context7)
- Neo4j architecture graph
- ADR with alternatives and consequences
- C4 model diagrams (ASCII)
- Scalability analysis (10x, 100x)
- Migration roadmap

### 2. Evaluate Technology Choices

Evidence-based technology comparison:

```bash
@systems-arch Evaluate database options for notification system:
- PostgreSQL vs TimescaleDB vs Cassandra
- Requirements: 100k writes/sec, 30-day retention
- Analyze: Performance, operational complexity, cost, team familiarity

Use Context7 to research:
- Production case studies
- Performance benchmarks
- Operational patterns
- Migration strategies
```

**What you'll get**:
- Technology comparison matrix
- Performance benchmarks (research-backed)
- Operational complexity analysis
- Cost projections per option
- Team skill gap analysis
- Recommended choice with rationale
- Proof-of-concept implementation
- Migration path from current state

### 3. Plan Monolith Decomposition

Incremental migration to microservices:

```bash
@systems-arch Plan migration from monolith to microservices:
- Current: Phoenix monolith, 50k users
- Target: Scalable microservices, 500k users
- Constraints: Zero downtime, incremental migration

Provide:
- Service boundary analysis (DDD)
- Strangler fig migration plan
- Data decomposition strategy
- Communication patterns (sync vs async)
- Deployment strategy
```

**What you'll get**:
- Bounded context identification (DDD)
- Service extraction priority (value vs effort)
- Strangler fig implementation plan
- Database decomposition strategy
- Event-driven communication design
- Phase-by-phase roadmap (6-12 months)
- Rollback strategy per phase
- Success metrics per milestone

### 4. Analyze Current Architecture

Map and evaluate existing system:

```bash
@systems-arch Analyze current system architecture:
- Map all modules to Neo4j graph
- Identify circular dependencies
- Find high coupling (>10 dependencies)
- Detect layer violations
- Generate dependency diagram
- Document anti-patterns

Output:
- Current state documentation
- Architecture issues report
- Refactoring recommendations
```

**What you'll get**:
- Neo4j knowledge graph of all modules
- Circular dependency report with fixes
- Coupling metrics per module
- Layer violation detection
- ASCII architecture diagram
- docs/architecture/01_current_state.md
- Prioritized refactoring backlog
- Architectural fitness functions (tests)

### 5. Create Architecture Decision Record

Document major architectural decisions:

```bash
@systems-arch Create ADR for choosing Phoenix.PubSub vs Redis Pub/Sub for notifications:
- Research both options (Context7)
- Compare scalability, ops complexity, cost
- Prototype both approaches
- Document decision with evidence
- Include migration strategy
```

**What you'll get**:
- Research findings from Context7
- Working prototypes (both options)
- Trade-off analysis matrix
- docs/decisions/ADR-###-pubsub-choice.md
- Implementation timeline
- Success criteria
- Review date for reassessment

### 6. Design Event-Driven Architecture

Move from synchronous to event-based:

```bash
@systems-arch Design event-driven architecture:
- Replace direct context calls with events
- Choose event bus (Broadway vs GenStage vs Kafka)
- Design event schemas
- Handle eventual consistency
- Plan backward compatibility

Research via Context7:
- Event sourcing patterns
- CQRS implementation
- Saga patterns for distributed transactions
```

**What you'll get**:
- Event storming workshop results
- Domain event catalog
- Event bus technology choice (justified)
- Broadway/GenStage pipeline design
- Event schema versioning strategy
- Eventual consistency patterns
- Backward compatibility plan
- Migration from sync to async

### 7. Plan System Scalability Evolution

Long-term scalability roadmap:

```bash
@systems-arch Create scalability roadmap from 10k to 1M users:
- Current capacity analysis
- Bottleneck identification
- Scaling strategies per component
- Cost projections
- Timeline with milestones

Phases:
- 10k → 100k (vertical scaling)
- 100k → 500k (horizontal scaling)
- 500k → 1M (distributed architecture)
```

**What you'll get**:
- Current capacity assessment
- Bottleneck analysis (database, PubSub, etc.)
- Phase-by-phase scaling plan
- Infrastructure evolution timeline
- Cost analysis per phase
- Load testing strategy
- Monitoring and alerting strategy
- When to migrate to microservices

### 8. Design Multi-Region Architecture

Global distribution for low latency:

```bash
@systems-arch Design multi-region architecture:
- Deploy to US-West, US-East, EU, Asia
- <100ms latency per region
- Active-active or active-passive?
- Data replication strategy
- Failure handling (region outage)

Constraints:
- PostgreSQL (no distributed DB)
- Phoenix LiveView (WebSocket affinity)
- Regulatory compliance (GDPR)
```

**What you'll get**:
- Multi-region deployment architecture
- Database replication strategy (primary-replica)
- Geographic routing (DNS, load balancer)
- WebSocket affinity solution
- Failure mode analysis (region outage)
- Data sovereignty compliance (GDPR)
- Cost analysis per region
- Disaster recovery procedures

## What You'll Get

### Architecture Decision Record (ADR)

Complete ADR following this template:

```markdown
# ADR-###: Decision Title

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Context
- Business requirements
- Technical constraints
- Current system state
- Architectural drivers

## Decision
What we decided and why

## Alternatives Considered

### Option A: Description
**Pros**:
- Benefit 1
- Benefit 2

**Cons**:
- Drawback 1
- Drawback 2

**Effort**: X weeks | **Risk**: LOW/MEDIUM/HIGH

### Option B: Description
[Same structure]

## Trade-off Analysis Matrix

| Criterion | Weight | Option A | Option B | Option C |
|-----------|--------|----------|----------|----------|
| Scalability | 25% | 4/5 | 5/5 | 3/5 |
| Complexity | 20% | 5/5 | 2/5 | 4/5 |
| Cost | 15% | 5/5 | 3/5 | 4/5 |
| **Total** | | **4.35** | **3.75** | **3.65** |

## Consequences

### Positive
- Benefit with evidence

### Negative
- Trade-off accepted

### Neutral
- Neither good nor bad

## Migration Strategy
Step-by-step implementation plan

## Validation Criteria
- [ ] Success metric 1
- [ ] Success metric 2

## Review Date
When to reassess this decision
```

### Architecture Diagrams

**C4 Model - Level 1: System Context**
```
┌─────────────┐
│   Mobile    │
│     App     │────────────┐
└─────────────┘            │
                           ↓
                 ┌──────────────────┐
                 │  ChronoDrip      │
                 │   Platform       │
                 └────────┬─────────┘
                          │
                          ↓
                 ┌──────────────────┐
                 │  External APIs   │
                 │ (Stripe, SendGrid)│
                 └──────────────────┘
```

**C4 Model - Level 2: Container Diagram**
Shows major deployable units (web app, database, workers)

**C4 Model - Level 3: Component Diagram**
Shows internal structure of each container

### Neo4j Architecture Graph

```cypher
// Modules and their dependencies
MATCH (m:Module)-[r:DEPENDS_ON]->(dep:Module)
RETURN m, r, dep

// Circular dependencies
MATCH path = (a:Module)-[:DEPENDS_ON*]->(a)
RETURN path

// High coupling
MATCH (m:Module)-[:DEPENDS_ON]->(dep)
WITH m, count(dep) as dep_count
WHERE dep_count > 10
RETURN m.name, dep_count
ORDER BY dep_count DESC
```

### Migration Roadmap

```markdown
## Phase 1: Establish Boundaries (Q2 2024)
**Goal**: Clear context boundaries
**Tasks**:
- [ ] Audit dependencies
- [ ] Document context APIs
- [ ] Remove circular dependencies
**Success Criteria**:
- Zero circular dependencies
- All contexts have public API docs
- No direct cross-context schema access

## Phase 2: Data Separation (Q3 2024)
[Similar structure]

## Phase 3: Event Communication (Q4 2024)
[Similar structure]
```

### Architectural Guidelines

```markdown
# Architecture Guidelines

## Dependency Rules
1. Presentation → Domain → Data
2. No circular dependencies
3. Explicit boundaries via public APIs

## When to Extract Service
- [ ] >100k active users
- [ ] Independent scaling needed
- [ ] Different tech requirements
- [ ] Team can handle distributed complexity

## Patterns Library
- Strangler Fig: Incremental migration
- CQRS: Separate read/write models
- Event Sourcing: Audit trail, time travel
- Repository: Abstract data access
```

## Reference

- Neo4j graph mapping procedures
- Context7 pattern research techniques
- Trade-off analysis frameworks
- Domain-Driven Design principles
- System evolution strategies
- Architecture documentation standards
- C4 modeling guidelines
- Fitness function patterns

## Integration with Other Agents

- **@senior-software-engineer**: Implements architectural decisions
- **@security-threat-analyst**: Security architecture review
- **@technical-mentor-guide**: Architecture onboarding docs
- **@explore**: Analyze existing architectural patterns
- **@general**: Research external architectural case studies

## Core Principles

### Evidence-Based Decisions
- NEVER claim "best" without data
- ALWAYS compare multiple options
- Research proven patterns (Context7)
- Prototype uncertain assumptions
- Document trade-offs explicitly

### Long-Term Thinking
- Design for change, not perfection
- Plan 2-year evolution roadmap
- Consider 10x scale scenarios
- Build extension points
- Delay irreversible decisions

### Maintainability First
- Clear boundaries and interfaces
- Minimize coupling between components
- Document why, not just what
- Design for team capabilities
- Keep it as simple as possible

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
