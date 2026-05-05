# Elixir Agents Integration Guide

**Version**: 1.0  
**Date**: 2025-01-16

---

## Overview

This guide provides comprehensive workflows for using 21 Elixir specialized agents together for complete SDLC coverage. Includes multi-agent coordination patterns, sequential workflows, and best practices for agent collaboration.

---

## Multi-Agent Coordination Principles

### 1. Agent Selection Strategy

**When to Use Agents**:

| Agent Category | Primary Use Case | Secondary Use Cases |
|----------------|-------------------|----------------------|
| **Architecture** | System design, data modeling | Planning, implementation support |
| **Development** | Feature implementation, UI development | Architecture, testing support |
| **Testing** | Quality assurance, test design | Implementation, code review support |
| **Code Review** | Security, quality, architectural validation | Testing, operations support |
| **Operations** | Deployment, monitoring | Architecture, implementation support |

### 2. Sequential vs Parallel Execution

**Sequential Execution**:
```
Requirements → Architecture → Implementation → Testing → Code Review → Operations
```

**Use When**:
- Linear feature development workflow
- Clear dependencies between phases
- Single team or developer

**Parallel Execution**:
```
Architecture ──┬─→ Implementation ──┬─→ Testing ──┬─→ Code Review ──┬─→ Operations
              └─→ Code Review ───┘             └─→ Operations
```

**Use When**:
- Multiple teams working in parallel
- Different phases can work independently
- Time-critical development cycles

### 3. Agent Handoff Patterns

**Handoff Requirements**:
1. **Output Specification**: Clear deliverables from each agent
2. **Input Requirements**: Clear requirements for next agent
3. **Knowledge Graph Integration**: Store patterns in Neo4j for reuse
4. **Context7 Citation**: Reference specific library versions and docs
5. **Best Practices**: Consolidate patterns into shared knowledge base

---

## Phase 1: Requirements & Planning Workflows

### Workflow 1.1: Data Pipeline Requirements

**Agents**: elixir-broadway.md, elixir-genstage-specialist.md, elixir-devops.md

**Sequential Workflow**:
```elixir
# Step 1: Requirements Analysis (elixir-genstage-specialist.md)
- Analyze existing GenStage systems
- Identify data processing requirements
- Define message sources and sinks
- Output: Requirements document with GenStage patterns

# Step 2: Broadway Architecture Design (elixir-broadway.md)
- Design Broadway producer-processor-batcher patterns
- Plan message queue integration
- Define backpressure and flow control strategies
- Output: Broadway architecture design document

# Step 3: Deployment Planning (elixir-devops.md)
- Plan Mix releases configuration
- Design distributed Erlang clustering
- Plan CI/CD pipeline for Broadway
- Output: Deployment architecture document
```

**Parallel Workflow**:
```elixir
# Step 1: Parallel Analysis
┌─> elixir-genstage-specialist.md (Requirements & Legacy Analysis)
│   - Analyze GenStage patterns
│   - Identify modernization opportunities
│   - Output: Legacy system analysis
│
├─> elixir-broadway.md (Broadway Architecture)
│   - Design modern Broadway patterns
│   - Plan migration from GenStage
│   - Output: Broadway architecture
│
└─> elixir-devops.md (Infrastructure)
    - Plan deployment infrastructure
    - Design clustering strategy
    - Output: Infrastructure design

# Step 2: Synthesis
- elixir-genstage-specialist.md reviews Broadway architecture
- elixir-broadway.md reviews deployment strategy
- Combined output: Complete data pipeline plan
```

**Handoff to Next Phase**:
- **Architecture**: elixir-broadway-workflows-specialist.md receives data pipeline requirements
- **Implementation**: elixir-liveview-1_1-specialist.md receives integration requirements
- **Testing**: elixir-tester.md receives testing requirements

---

### Workflow 1.2: LiveView UI Requirements

**Agents**: elixir-liveview-1_1-specialist.md, elixir-hooks-specialist.md, elixir-observability.md

**Sequential Workflow**:
```elixir
# Step 1: LiveView Architecture (elixir-liveview-1_1-specialist.md)
- Design LiveView 1.1+ streaming architecture
- Define colocated hooks requirements
- Design HEEx component structure
- Output: LiveView architecture document

# Step 2: JavaScript Integration (elixir-hooks-specialist.md)
- Design colocated hooks architecture
- Define JavaScript interop patterns
- Plan state management across JS/Elixir boundary
- Output: Hooks integration design document

# Step 3: Monitoring Strategy (elixir-observability.md)
- Design telemetry strategy for LiveView
- Plan LiveDashboard integration
- Define performance metrics
- Output: Monitoring architecture document
```

**Handoff to Next Phase**:
- **Architecture**: elixir-broadway-workflows-specialist.md receives UI requirements
- **Implementation**: elixir-liveview-1_1-specialist.md receives implementation guidance
- **Testing**: elixir-tester.md receives testing requirements

---

## Phase 2: Architecture & Design Workflows

### Workflow 2.1: Complex Broadway Design

**Agents**: elixir-broadway-workflows-specialist.md, elixir-devops.md, elixir-liveview-1_1-specialist.md

**Sequential Workflow**:
```elixir
# Step 1: Multi-Stage Pipeline Design (elixir-broadway-workflows-specialist.md)
- Design fan-out/fan-in patterns
- Design multi-stage pipeline transformations
- Define dynamic pipeline configuration
- Output: Complex pipeline architecture

# Step 2: Integration Design (elixir-liveview-1_1-specialist.md)
- Design LiveView integration for pipeline monitoring
- Plan streaming UI for pipeline status
- Design real-time updates via WebSocket
- Output: Integration architecture

# Step 3: Deployment Design (elixir-devops.md)
- Design deployment strategy for complex pipelines
- Plan hot upgrade strategies
- Design clustering for high availability
- Output: Deployment architecture
```

**Handoff to Next Phase**:
- **Implementation**: elixir-liveview-1_1-specialist.md receives pipeline integration requirements
- **Testing**: elixir-tester.md receives pipeline testing requirements
- **Operations**: elixir-observability.md receives monitoring requirements

---

### Workflow 2.2: Full-Stack Architecture

**Agents**: All architecture agents (Broadway, LiveView, Hooks, DevOps, Observability)

**Parallel Workflow**:
```elixir
# Step 1: Parallel Architecture Design
┌─> elixir-broadway-workflows-specialist.md (Data Pipeline)
│   - Design multi-stage pipelines
│   - Output: Pipeline architecture
│
├─> elixir-liveview-1_1-specialist.md (UI Architecture)
│   - Design LiveView 1.1+ architecture
│   - Output: UI architecture
│
├─> elixir-hooks-specialist.md (JS Architecture)
│   - Design colocated hooks
│   - Output: Hooks architecture
│
├─> elixir-devops.md (Infrastructure)
│   - Design deployment infrastructure
│   - Output: Infrastructure design
│
└─> elixir-observability.md (Monitoring)
    - Design monitoring architecture
    - Output: Monitoring design

# Step 2: Synthesis
- elixir-broadway-workflows-specialist.md synthesizes all architectures
- Output: Full-stack architecture document
```

**Handoff to Next Phase**:
- **Implementation**: elixir-liveview-1_1-specialist.md, elixir-hooks-specialist.md receive implementation guidance
- **Testing**: elixir-tester.md receives testing requirements
- **Operations**: elixir-devops.md, elixir-observability.md receive operational requirements

---

## Phase 3: Implementation Workflows

### Workflow 3.1: LiveView 1.1+ Implementation

**Agents**: elixir-liveview-1_1-specialist.md, elixir-hooks-specialist.md, elixir-tester.md, elixir-observability.md

**Sequential Workflow**:
```elixir
# Step 1: LiveView Setup (elixir-liveview-1_1-specialist.md)
- Implement LiveView 1.1+ streaming with `stream/3`
- Configure `temporary_assigns` for performance
- Implement streaming for large collections
- Output: LiveView base implementation

# Step 2: JavaScript Integration (elixir-hooks-specialist.md)
- Implement colocated hooks in HEEx components
- Implement custom lifecycle hooks
- Implement state management across JS/Elixir boundary
- Output: Hooks implementation

# Step 3: Testing (elixir-tester.md)
- Test LiveView 1.1+ streaming features
- Test colocated hooks with PhoenixPlayground
- Implement property-based tests with ExUnitProperties
- Output: Comprehensive test suite

# Step 4: Monitoring (elixir-observability.md)
- Implement LiveDashboard integration
- Add custom telemetry events for LiveView performance
- Configure performance metrics
- Output: Monitoring implementation
```

**Handoff to Next Phase**:
- **Testing**: elixir-property-testing-specialist.md receives LiveView testing requirements
- **Code Review**: elixir-reviewer.md receives LiveView code for review
- **Operations**: elixir-observability.md receives production monitoring requirements

---

### Workflow 3.2: Data Pipeline Implementation

**Agents**: elixir-broadway.md, elixir-tester.md, elixir-observability.md

**Sequential Workflow**:
```elixir
# Step 1: Broadway Implementation (elixir-broadway.md)
- Implement producer-processor-batcher pipeline
- Configure message queue integration
- Implement backpressure and flow control
- Output: Broadway pipeline implementation

# Step 2: Testing (elixir-tester.md)
- Test Broadway pipeline with property-based methods
- Test error handling and retries
- Test dead letter queue patterns
- Output: Comprehensive test suite

# Step 3: Monitoring (elixir-observability.md)
- Implement Telemetry events for pipeline performance
- Configure LiveDashboard for pipeline monitoring
- Implement health checks
- Output: Monitoring implementation
```

**Handoff to Next Phase**:
- **Testing**: elixir-property-testing-specialist.md receives pipeline testing requirements
- **Code Review**: elixir-reviewer.md receives pipeline code for review
- **Operations**: elixir-devops.md receives deployment requirements

---

## Phase 4: Testing Workflows

### Workflow 4.1: Comprehensive Testing Strategy

**Agents**: elixir-tester.md, elixir-property-testing-specialist.md, elixir-exmachina-specialist.md, elixir-faker-specialist.md, elixir-benchmarking-specialist.md

**Sequential Workflow**:
```elixir
# Step 1: Test Architecture (elixir-tester.md)
- Design testing pyramid (70% unit, 20% integration, 10% E2E)
- Define test coverage targets (90%+ overall)
- Plan test organization (core/, boundaries/, workers/, integration/)
- Output: Testing architecture document

# Step 2: Test Data (elixir-exmachina-specialist.md, elixir-faker-specialist.md)
- Implement ExMachina factories for Ash resources
- Implement Faker generators for diverse test data
- Implement multi-tenant generation strategies
- Output: Complete test data factory suite

# Step 3: Property Testing (elixir-property-testing-specialist.md)
- Implement advanced ExUnitProperties tests
- Implement custom generators for complex domain types
- Implement stateful and FSM property testing
- Output: Property test suite

# Step 4: Performance Testing (elixir-benchmarking-specialist.md)
- Implement Benchee benchmarks for critical paths
- Configure regression testing
- Implement visualization and reporting
- Output: Benchmark suite and reports
```

**Handoff to Next Phase**:
- **Code Review**: elixir-reviewer.md receives test code for review
- **Coverage**: elixir-coverage-specialist.md receives coverage requirements
- **Operations**: elixir-observability.md receives test monitoring requirements

---

### Workflow 4.2: E2E and Coverage Testing

**Agents**: elixir-wallaby-specialist.md, elixir-hound-specialist.md, elixir-coverage-specialist.md

**Parallel Workflow**:
```elixir
# Step 1: Parallel Testing Setup
┌─> elixir-wallaby-specialist.md (E2E Testing)
│   - Configure Wallaby and SQL Sandbox
│   - Implement E2E test patterns
│   - Output: E2E test suite
│
├─> elixir-hound-specialist.md (Coverage)
│   - Configure Hound and coverage thresholds
│   - Set up CI/CD quality gates
│   - Output: Coverage configuration
│
└─> elixir-coverage-specialist.md (Coverage Strategy)
    - Design comprehensive coverage strategy
    - Configure coverage trends and regression detection
    - Output: Coverage strategy document

# Step 2: CI/CD Integration
- elixir-wallaby-specialist.md, elixir-hound-specialist.md, elixir-coverage-specialist.md collaborate
- Output: Integrated CI/CD pipeline with E2E and coverage
```

**Handoff to Next Phase**:
- **Code Review**: elixir-reviewer.md receives test code for review
- **Security**: elixir-security.md receives security requirements
- **Operations**: elixir-devops.md receives CI/CD deployment requirements

---

## Phase 5: Code Review Workflows

### Workflow 5.1: Comprehensive Code Review

**Agents**: elixir-reviewer.md, elixir-security.md, elixir-dialyzer-specialist.md, elixir-mixaudit-specialist.md, elixir-proper-specialist.md

**Sequential Workflow**:
```elixir
# Step 1: OTP & Architecture Review (elixir-reviewer.md)
- Review OTP patterns and supervision tree design
- Review Ash Framework best practices
- Review functional core, imperative shell principles
- Use :sys debugging commands for GenServer analysis
- Output: Architecture review report

# Step 2: Security Review (elixirir-security.md, elixir-mixaudit-specialist.md)
- Run Sobelow security scan
- Review dependency vulnerabilities with MixAudit
- Review Ash authorization policies
- Review Phoenix/Phoenix Framework security
- Output: Security review report

# Step 3: Type Safety Review (elixir-dialyzer-specialist.md, elixir-proper-specialist.md)
- Run Dialyzer static type analysis
- Review typespec patterns (@spec, @type, @opaque)
- Review behavior definitions (@behaviour, @callback)
- Review contract validation and enforcement
- Output: Type safety review report

# Step 4: Code Quality Review (elixir-reviewer.md)
- Run Credo code quality checks
- Review naming conventions and documentation
- Review anti-patterns and code smells
- Output: Code quality review report

# Step 5: Synthesis
- Combine all review reports
- Prioritize issues by severity
- Provide concrete fixes with code examples
- Output: Comprehensive code review report
```

**Handoff to Next Phase**:
- **Operations**: elixir-devops.md receives remediation requirements
- **Testing**: elixir-tester.md receives re-testing requirements
- **Observability**: elixir-observability.md receives monitoring for fixed issues

---

## Phase 6: Operations & Monitoring Workflows

### Workflow 6.1: Deployment Strategy

**Agents**: elixir-devops.md, elixir-observability.md, elixir-cachex-specialist.md

**Sequential Workflow**:
```elixir
# Step 1: Release Build (elixir-devops.md)
- Build Mix releases with proper configuration
- Configure environment variables and secrets
- Build Docker images for containerization
- Output: Release artifacts and configuration

# Step 2: Cache Optimization (elixir-cachex-specialist.md)
- Configure ETS table types and optimization
- Implement cache hit/miss ratio monitoring
- Configure cache invalidation strategies
- Output: Optimized cache configuration

# Step 3: Monitoring Setup (elixir-observability.md)
- Configure LiveDashboard for real-time monitoring
- Implement custom telemetry events
- Configure APM integration (PromEx, AppSignal)
- Output: Monitoring implementation

# Step 4: Deployment Execution (elixir-devops.md)
- Execute Mix releases deployment
- Configure distributed Erlang clustering
- Execute hot upgrade for zero-downtime
- Output: Deployment execution report
```

**Handoff to Next Phase**:
- **Testing**: elixir-wallaby-specialist.md receives post-deployment E2E testing requirements
- **Code Review**: elixir-reviewer.md receives production code review requirements
- **Observability**: elixir-observability.md receives ongoing monitoring requirements

---

### Workflow 6.2: Production Monitoring

**Agents**: elixir-observability.md, elixir-devops.md, elixir-reviewer.md

**Continuous Workflow**:
```elixir
# Step 1: Real-Time Monitoring (elixir-observability.md)
- Monitor LiveDashboard dashboards
- Track custom telemetry events
- Monitor BEAM VM metrics (memory, process count, message queues)
- Output: Real-time monitoring alerts

# Step 2: Performance Analysis (elixir-observability.md, elixir-benchmarking-specialist.md)
- Analyze performance metrics from telemetry
- Run Benchee benchmarks on production-like data
- Identify performance bottlenecks
- Output: Performance analysis report

# Step 3: Issue Investigation (elixir-reviewer.md)
- Investigate production issues with :sys debugging
- Review logs and traces
- Analyze error patterns and root causes
- Output: Issue investigation report

# Step 4: Continuous Improvement (elixir-devops.md)
- Update CI/CD pipelines based on lessons learned
- Optimize deployment strategies
- Update clustering configurations
- Output: Continuous improvement plan
```

---

## Multi-Agent Coordination Patterns

### Pattern 1: Feature Development Workflow

**Agents**: elixir-broadway.md, elixir-liveview-1_1-specialist.md, elixir-tester.md, elixir-reviewer.md, elixir-devops.md

**Workflow**:
```
1. Requirements (elixir-broadway.md)
   ↓
2. Architecture (elixir-broadway-workflows-specialist.md)
   ↓
3. Implementation (elixir-liveview-1_1-specialist.md, elixir-hooks-specialist.md)
   ↓
4. Testing (elixir-tester.md, elixir-exmachina-specialist.md)
   ↓
5. Code Review (elixir-reviewer.md, elixir-security.md)
   ↓
6. Deployment (elixir-devops.md)
   ↓
7. Monitoring (elixir-observability.md)
```

**Agent Handoffs**:
- Each agent provides clear output for next agent
- Neo4j stores patterns and decisions for reference
- Context7 citations ensure library version consistency

---

### Pattern 2: Code Quality Workflow

**Agents**: elixir-reviewer.md, elixir-security.md, elixir-dialyzer-specialist.md, elixir-mixaudit-specialist.md, elixir-proper-specialist.md, elixir-coverage-specialist.md

**Parallel Workflow**:
```elixir
# Step 1: Parallel Reviews
┌─> elixir-reviewer.md (Architecture & Code Quality)
│   - Review OTP patterns, Ash Framework, code quality
│   - Output: Architecture & code quality report
│
├─> elixir-security.md (Security)
│   - Run Sobelow, MixAudit, review vulnerabilities
│   - Output: Security review report
│
├─> elixir-dialyzer-specialist.md (Type Safety)
│   - Run Dialyzer, review typespecs
│   - Output: Type safety review report
│
├─> elixir-mixaudit-specialist.md (Dependency Security)
│   - Scan dependencies for CVEs
│   - Output: Dependency security report
│
├─> elixir-proper-specialist.md (Contracts)
│   - Review Proper specs, behaviors, contracts
│   - Output: Contract review report
│
└─> elixir-coverage-specialist.md (Coverage)
    - Analyze coverage trends, identify gaps
    - Output: Coverage report

# Step 2: Synthesis
- All agents collaborate to prioritize issues
- Create unified action plan
- Output: Comprehensive quality report
```

---

### Pattern 3: Performance Optimization Workflow

**Agents**: elixir-benchmarking-specialist.md, elixir-cachex-specialist.md, elixir-observability.md, elixir-reviewer.md

**Sequential Workflow**:
```elixir
# Step 1: Performance Baseline (elixir-benchmarking-specialist.md)
- Run Benchee benchmarks on current code
- Establish performance baselines
- Output: Performance baseline report

# Step 2: Analysis (elixir-observability.md, elixir-reviewer.md)
- Analyze production metrics from telemetry
- Review code for performance anti-patterns
- Identify bottlenecks (N+1 queries, memory leaks, etc.)
- Output: Performance analysis report

# Step 3: Optimization (elixir-cachex-specialist.md)
- Implement ETS cache optimization
- Configure cache hit/miss monitoring
- Implement cache invalidation strategies
- Output: Optimized cache configuration

# Step 4: Validation (elixir-benchmarking-specialist.md)
- Run Benchee benchmarks on optimized code
- Compare with baseline
- Output: Performance validation report
```

---

## Knowledge Graph Integration

### Neo4j Pattern Storage

**Entity Types**:
- `ElixirPattern` - Reusable Elixir patterns
- `AgentCapability` - Capabilities provided by each agent
- `LibraryReference` - Context7 library citations
- `CodeExample` - Production-ready code examples
- `BestPractice` - Consolidated best practices
- `AntiPattern` - Common pitfalls and solutions

**Relationship Types**:
- `PROVIDES_CAPABILITY` - Agent provides capability
- `USE_LIBRARY` - Agent uses Context7 library
- `INCLUDES_EXAMPLE` - Pattern includes code example
- `FOLLOWS_BEST_PRACTICE` - Pattern follows best practice
- `AVOIDS_ANTI_PATTERN` - Pattern avoids anti-pattern

**Query Examples**:
```cypher
// Find all agents that provide Broadway capabilities
MATCH (agent:AgentCapability {name: 'Broadway'})<-[:PROVIDES_CAPABILITY]-(a:Agent)
RETURN a.name, agent.name, agent.capabilities

// Find all patterns using Ash Framework
MATCH (pattern:ElixirPattern)-[:USE_LIBRARY]-(lib:LibraryReference {name: '/websites/hexdocs_pm_ash'})
RETURN pattern.name, pattern.description

// Find all anti-patterns with solutions
MATCH (anti:AntiPattern)-[:HAS_SOLUTION]-(sol:CodeExample)
RETURN anti.name, anti.description, sol.description
```

---

## Best Practices for Agent Coordination

### 1. Clear Communication

**Document Outputs**:
- Each agent should produce structured output (markdown, JSON, or code)
- Include Context7 citations with library versions
- Provide code examples with explanations
- List dependencies and prerequisites

**Input Requirements**:
- Specify required inputs for each agent
- Document data formats and schemas
- Include integration points and APIs
- Provide examples of expected inputs

### 2. Consistent Format

**Agent Output Template**:
```markdown
## Summary
[High-level summary of agent work]

## Outputs
[List of deliverables and artifacts]

## Context7 Research
[Context7 libraries consulted with versions]

## Code Examples
[Production-ready code examples]

## Next Steps
[Recommendations for next agent or phase]

## Neo4j Storage
[Entities and relationships created]
```

### 3. Knowledge Reuse

**Pattern Catalog**:
- Store reusable patterns in Neo4j
- Tag patterns by SDLC phase, complexity, library
- Enable easy lookup and reference
- Maintain version history for pattern evolution

**Code Example Library**:
- Store production-ready code examples
- Tag by use case, complexity, library version
- Enable copy-paste ready usage
- Maintain examples updated with latest patterns

### 4. Continuous Improvement

**Feedback Loops**:
- Collect feedback from each agent execution
- Update Neo4j patterns based on learnings
- Refine agent workflows based on experience
- Share learnings across all agents

**Pattern Evolution**:
- Monitor emerging Elixir patterns (LiveView 1.2+, Ash 4.0+, Oban 3.0+)
- Update Context7 research with latest documentation
- Enhance agents with new capabilities
- Retire deprecated patterns and agents

---

## Troubleshooting Agent Coordination

### Common Issues

1. **Agent Handoff Failures**
   - **Cause**: Unclear output/input requirements
   - **Solution**: Use agent output template, document all dependencies

2. **Context Inconsistency**
   - **Cause**: Different agents use different library versions
   - **Solution**: Specify exact library versions in Context7 citations

3. **Pattern Conflicts**
   - **Cause**: Multiple agents recommend conflicting patterns
   - **Solution**: Use Neo4j to track pattern decisions, resolve conflicts

4. **Knowledge Gaps**
   - **Cause**: Missing patterns or best practices
   - **Solution**: Use Context7 research to fill gaps, document learnings

### Recovery Procedures

1. **Agent Coordination Recovery**
   - Review Neo4j for previous decisions
   - Re-establish communication with failed agent
   - Document recovery procedures

2. **Pattern Consistency Recovery**
   - Review Context7 sources for latest patterns
   - Update all agents with consistent patterns
   - Document pattern evolution

3. **Knowledge Recovery**
   - Query Neo4j for related patterns
   - Use similar patterns as reference
   - Document recovered knowledge

---

## References

- **Agent Guide**: See `Elixir_Agents_Guide.md` for agent capabilities
- **SDLC Patterns**: See `Elixir_SDLC_Patterns.md` for phase-by-phase workflows
- **Context7 Sources**: See `Context7_Research_Sources.md` for library documentation
- **Best Practices**: See `Best_Practices_2025.md` for consolidated patterns

---

**Total Coordination Workflows**: 10 multi-agent workflows across 6 SDLC phases with comprehensive Neo4j integration and knowledge graph patterns
