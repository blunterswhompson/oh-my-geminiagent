# Elixir SDLC Patterns - Phase-by-Phase Agent Mapping

**Version**: 1.0  
**Date**: 2025-01-16

---

## Overview

This document maps Elixir Software Development Lifecycle (SDLC) phases to the 21 specialized Elixir agents in `agent/elixir-specific/`. Each phase includes recommended agents, workflows, and Context7 research sources.

---

## SDLC Phases Overview

| Phase | Purpose | Primary Agents | Secondary Agents | Context7 Sources |
|-------|---------|----------------|------------------|-------------------|
| **Requirements & Planning** | Feature specification, architecture decisions | elixir-broadway.md, elixir-genstage-specialist.md | elixir-devops.md, elixir-observability.md | `/websites/hexdocs_pm_broadway`, `/websites/hexdocs_pm_gen_stage` |
| **Architecture & Design** | System design, data modeling, service boundaries | elixir-broadway-workflows-specialist.md, elixir-devops.md | elixir-liveview-1_1-specialist.md, elixir-hooks-specialist.md | `/websites/hexdocs_pm_broadway`, `/websites/hexdocs_pm_phoenix` |
| **Implementation** | Coding, feature development, UI implementation | elixir-liveview-1_1-specialist.md, elixir-hooks-specialist.md | elixir-devops.md, elixir-observability.md | `/websites/hexdocs_pm_phoenix`, `/websites/hexdocs_pm_elixir_1_19_3` |
| **Testing** | Unit, integration, E2E, property-based testing | elixir-tester.md, elixir-property-testing-specialist.md | elixir-exmachina-specialist.md, elixir-faker-specialist.md, elixir-benchmarking-specialist.md, elixir-wallaby-specialist.md, elixir-hound-specialist.md, elixir-coverage-specialist.md | `/websites/hexdocs_pm_ash`, `/websites/hexdocs_pm_phoenix`, StreamData, ExUnitProperties |
| **Code Review** | Static analysis, security review, architectural validation | elixir-reviewer.md, elixir-security.md, elixir-dialyzer-specialist.md, elixir-mixaudit-specialist.md | Sobelow, Credo, `/jeremyjh/dialyxir` | `/websites/hexdocs_pm_elixir_1_19_3`, `/websites/hexdocs_pm_proper` |
| **Operations & Monitoring** | Deployment, monitoring, performance analysis | elixir-devops.md, elixir-observability.md | elixir-cachex-specialist.md, elixir-concache-specialist.md | Mix docs, Phoenix LiveDashboard, PromEx |

---

## Phase 1: Requirements & Planning

### Purpose
Define requirements, design architecture, and plan feature implementation with Elixir-specific patterns and best practices.

### Primary Agents

#### elixir-broadway.md
**Context**: Data processing pipelines and event-driven architectures

**Key Responsibilities**:
- Design Broadway producer-processor-batcher patterns
- Plan message queue integration (RabbitMQ, SQS, Pub/Sub)
- Define backpressure and flow control strategies
- Plan error handling, retries, and dead letter queues
- Design multi-stage pipeline workflows

**Workflows**:
```
Feature Requirements → Broadway Pipeline Design → Message Queue Integration
     ↓                                                    ↓
Data Flow Modeling → Backpressure Strategy → Performance Requirements
     ↓                                                    ↓
Error Handling Planning → Dead Letter Queue Design → Production Readiness
```

**Context7 Research**:
- `/websites/hexdocs_pm_broadway` (80.3 benchmark, 516 snippets)
- Broadway producer patterns
- Message queue integration (RabbitMQ, SQS, Pub/Sub)
- Backpressure management

---

#### elixir-genstage-specialist.md
**Context**: Legacy GenStage systems and migration planning

**Key Responsibilities**:
- Design GenStage producer, processor, and consumer patterns
- Plan GenStage to Broadway migration strategies
- Define flow control and backpressure for legacy systems
- Design event streaming architectures
- Plan modernization strategies

**Workflows**:
```
Legacy System Analysis → GenStage Pattern Design → Broadway Migration Planning
     ↓                                                    ↓
Flow Control Strategy → Event Streaming Design → Migration Roadmap
```

**Context7 Research**:
- `/websites/hexdocs_pm_gen_stage`
- GenStage to Broadway comparison
- Migration patterns and guides

---

### Secondary Agents

#### elixir-devops.md
**Context**: Deployment and infrastructure planning

**Key Responsibilities**:
- Plan Mix releases and deployment strategy
- Design distributed Erlang clustering
- Plan hot upgrades for zero-downtime
- Design CI/CD pipelines for Elixir projects
- Plan database migrations with Ash

**Workflows**:
```
Feature Requirements → Deployment Architecture → CI/CD Pipeline Design
     ↓                                                    ↓
Clustering Strategy → Hot Upgrade Planning → Production Readiness
```

---

#### elixir-observability.md
**Context**: Monitoring and observability planning

**Key Responsibilities**:
- Design telemetry and metrics strategy
- Plan LiveDashboard integration
- Design APM integration for production monitoring
- Plan error tracking and alerting
- Design distributed tracing with OpenTelemetry

**Workflows**:
```
Requirements → Telemetry Strategy → Monitoring Architecture
     ↓                                                    ↓
Alert Design → Tracing Strategy → Production Readiness
```

---

## Phase 2: Architecture & Design

### Purpose
Design Elixir system architecture, data models, service boundaries, and implementation strategies with modern Elixir patterns.

### Primary Agents

#### elixir-broadway-workflows-specialist.md
**Context**: Complex Broadway pipelines and multi-stage workflows

**Key Responsibilities**:
- Design fan-out/fan-in patterns for parallel processing
- Design multi-stage pipeline transformations
- Design dynamic pipeline configuration
- Design complex aggregation workflows
- Plan pipeline performance optimization

**Workflows**:
```
Architecture Design → Multi-Stage Pipeline → Fan-Out/Fan-In Patterns
     ↓                                                    ↓
Dynamic Configuration → Aggregation Workflows → Performance Optimization
```

**Context7 Research**:
- `/websites/hexdocs_pm_broadway`
- Advanced Broadway patterns
- Complex workflow design

---

#### elixir-devops.md (Architecture Focus)
**Context**: Deployment and infrastructure architecture

**Key Responsibilities**:
- Design Mix release architecture
- Design distributed Erlang clustering with libcluster
- Design hot upgrade strategies for zero-downtime
- Design CI/CD pipeline architecture
- Design database migration strategies with Ash

**Workflows**:
```
System Architecture → Release Design → Clustering Architecture
     ↓                                                    ↓
Hot Upgrade Design → CI/CD Architecture → Migration Strategy
```

---

### Secondary Agents

#### elixir-liveview-1_1-specialist.md
**Context**: Phoenix LiveView 1.1+ architecture and streaming patterns

**Key Responsibilities**:
- Design LiveView 1.1+ streaming architecture
- Design colocated hooks for JavaScript integration
- Design HEEx function component architecture
- Design LiveView 1.1+ slots and composition
- Plan LiveView performance optimization

**Workflows**:
```
UI Architecture → Streaming Design → Hook Architecture
     ↓                                                    ↓
Component Design → Performance Planning → Implementation Ready
```

**Context7 Research**:
- `/websites/hexdocs_pm_phoenix`
- LiveView 1.1+ streaming features
- Colocated hooks patterns
- HEEx component design

---

#### elixir-hooks-specialist.md
**Context**: JavaScript integration and custom lifecycle management

**Key Responsibilities**:
- Design hook registration and initialization
- Design JavaScript interop with HEEx components
- Design custom lifecycle hooks (onMount, onUpdate, onUnmount)
- Design state management across JS/Elixir boundary
- Design event handling and communication patterns

**Workflows**:
```
Component Design → Hook Architecture → JavaScript Interop
     ↓                                                    ↓
State Management → Event Handling → Implementation Ready
```

---

## Phase 3: Implementation

### Purpose
Implement Elixir features with modern patterns including LiveView 1.1+ streaming, colocated hooks, and performance optimizations.

### Primary Agents

#### elixir-liveview-1_1-specialist.md
**Context**: Phoenix LiveView 1.1+ implementation

**Key Responsibilities**:
- Implement LiveView 1.1+ streaming with `stream/3`, `stream_insert/4`, `stream_delete/3`
- Implement colocated hooks for JavaScript integration
- Implement HEEx function components
- Implement LiveView 1.1+ slots and slots composition
- Optimize LiveView performance with streaming

**Workflows**:
```
LiveView Setup → Streaming Implementation → Hook Integration
     ↓                                                    ↓
Component Implementation → Slot Composition → Performance Optimization
```

**Context7 Research**:
- `/websites/hexdocs_pm_phoenix`
- LiveView 1.1+ API documentation
- Streaming patterns and best practices

---

#### elixir-hooks-specialist.md
**Context**: JavaScript integration implementation

**Key Responsibilities**:
- Implement colocated hooks in HEEx components
- Implement JavaScript interop with custom hooks
- Implement lifecycle hooks (onMount, onUpdate, onUnmount, etc.)
- Implement state management across JS/Elixir boundary
- Implement event handling with push_event/handleEvent

**Workflows**:
```
Hook Setup → JavaScript Integration → Lifecycle Implementation
     ↓                                                    ↓
State Management → Event Handling → Testing Ready
```

---

### Secondary Agents

#### elixir-devops.md (Implementation Focus)
**Context**: Development environment and deployment automation

**Key Responsibilities**:
- Implement Mix releases configuration
- Implement CI/CD pipelines for automated testing and deployment
- Implement database migrations with Ash
- Configure local development environment
- Set up hot reload and compilation strategies

**Workflows**:
```
Environment Setup → Release Configuration → CI/CD Implementation
     ↓                                                    ↓
Migration Setup → Hot Reload → Development Ready
```

---

#### elixir-observability.md (Implementation Focus)
**Context**: Monitoring and telemetry implementation

**Key Responsibilities**:
- Implement Telemetry configuration and metrics
- Implement Phoenix LiveDashboard integration
- Implement custom telemetry events and metrics
- Configure error tracking with Sentry or Honeybadger
- Implement distributed tracing with OpenTelemetry

**Workflows**:
```
Telemetry Setup → Dashboard Integration → Metrics Implementation
     ↓                                                    ↓
Error Tracking → Distributed Tracing → Production Ready
```

---

## Phase 4: Testing

### Purpose
Comprehensive testing strategy including unit, integration, E2E, property-based testing, and quality assurance for Elixir applications.

### Primary Agents

#### elixir-tester.md
**Context**: Comprehensive testing strategy enhanced with Ash.Generator, Oban.Testing, PhoenixPlayground

**Key Responsibilities**:
- Design testing architecture following testing pyramid
- Test Ash actions with property-based methods
- Test Oban workers in inline and manual modes
- Test Phoenix LiveView components with PhoenixPlayground
- Implement ExUnitProperties with StreamData integration

**Workflows**:
```
Test Architecture → Ash Testing → Oban Testing
     ↓                                                    ↓
LiveView Testing → Property Testing → Quality Gates
```

**Context7 Research**:
- `/websites/hexdocs_pm_ash`
- `/websites/hexdocs_pm_oban`
- PhoenixPlayground documentation
- StreamData patterns
- ExUnitProperties advanced features

---

#### elixir-property-testing-specialist.md
**Context**: Advanced ExUnitProperties patterns for complex property-based testing

**Key Responsibilities**:
- Implement advanced ExUnitProperties macros and patterns
- Implement custom generators for complex domain types
- Implement stateful and FSM property testing
- Implement shrinking strategies for failing tests
- Implement performance optimization for property tests

**Workflows**:
```
Property Architecture → Custom Generators → Stateful Testing
     ↓                                                    ↓
Shrinking Strategies → Performance Optimization → Test Ready
```

**Context7 Research**:
- StreamData documentation
- ExUnitProperties advanced patterns
- Stateful testing patterns (StreamState)
- Generator composition strategies

---

### Secondary Agents

#### elixir-exmachina-specialist.md
**Context**: ExMachina test data factories for Ash resources

**Key Responsibilities**:
- Implement factory patterns for Ash resources
- Implement relationship handling (belongs to, has many, many-to-many)
- Implement multi-tenant generation strategies
- Implement Ash actions & policies testing helpers
- Implement recursive strategies for trees and graphs

**Workflows**:
```
Factory Design → Relationship Handling → Multi-Tenant Strategies
     ↓                                                    ↓
Policy Testing → Recursive Strategies → Test Data Ready
```

**Context7 Research**:
- ExMachina documentation
- Ash Framework resource patterns
- Factory patterns and best practices

---

#### elixir-faker-specialist.md
**Context**: Faker test data generation for flexible testing

**Key Responsibilities**:
- Implement 50+ Faker generators for common Elixir types
- Implement Phoenix LiveView testing strategies
- Implement Ash resource integration patterns
- Implement custom domain-specific generator creation
- Implement localization and custom data patterns

**Workflows**:
```
Generator Setup → Domain Patterns → LiveView Integration
     ↓                                                    ↓
Custom Generators → Localization → Test Data Ready
```

---

#### elixir-benchmarking-specialist.md
**Context**: Benchee performance benchmarking and regression testing

**Key Responsibilities**:
- Implement Benchee configuration and setup
- Implement performance strategies with before/after hooks
- Implement memory/GC analysis with memory_time and reduction_time
- Implement regression testing with save/load functionality
- Implement visualization with HTML and Console formatters

**Workflows**:
```
Benchmark Setup → Performance Strategies → Memory Analysis
     ↓                                                    ↓
Regression Testing → Visualization → Performance Ready
```

---

#### elixir-wallaby-specialist.md
**Context**: Wallaby + Playwright E2E testing

**Key Responsibilities**:
- Implement Wallaby configuration and SQL Sandbox setup
- Implement Phoenix LiveView testing patterns
- Implement JavaScript interaction and assertion patterns
- Implement form submission, validation, and workflow testing
- Implement page navigation, session management, and concurrent testing

**Workflows**:
```
E2E Setup → LiveView Testing → JavaScript Testing
     ↓                                                    ↓
Form Testing → Workflow Testing → Browser Automation Ready
```

---

#### elixir-hound-specialist.md
**Context**: Hound code coverage and quality enforcement

**Key Responsibilities**:
- Implement Hound configuration and setup
- Implement coverage thresholds and quality gates
- Implement CI/CD integration for coverage enforcement
- Implement multi-module and umbrella project support
- Implement ExCoveralls and Coveralls integration

**Workflows**:
```
Coverage Setup → Thresholds → CI/CD Integration
     ↓                                                    ↓
Multi-Module Support → Visualization → Quality Gates Ready
```

---

#### elixir-coverage-specialist.md
**Context**: Comprehensive code coverage strategy and CI/CD integration

**Key Responsibilities**:
- Implement coverage tool comparison (ExCoveralls, Coveralls, ExCover)
- Implement coverage thresholds and quality metrics
- Implement line, branch, and function coverage strategies
- Implement module coverage patterns
- Implement coverage trends and regression detection

**Workflows**:
```
Coverage Strategy → Tool Configuration → Thresholds
     ↓                                                    ↓
Module Patterns → Trends & Regression → CI/CD Ready
```

---

#### elixir-concache-specialist.md
**Context**: ConCache for concurrent testing and cache coordination

**Key Responsibilities**:
- Implement ConCache configuration and setup
- Implement multi-process cache testing patterns
- Implement cache coordination and synchronization
- Implement concurrent test execution with cache isolation
- Implement cache invalidation and consistency testing

**Workflows**:
```
Cache Setup → Multi-Process Testing → Coordination
     ↓                                                    ↓
Isolation → Invalidation → Consistency Ready
```

---

## Phase 5: Code Review

### Purpose
Comprehensive code review including static analysis, security review, architectural validation, and quality assurance for Elixir applications.

### Primary Agents

#### elixir-reviewer.md
**Context**: Elixir code reviewer enhanced with :sys debugging, Credo, Sobelow, LiveView 1.1+ features

**Key Responsibilities**:
- Review OTP patterns and supervision tree design
- Review Ash Framework best practices and architectural alignment
- Review Sobelow security scanning patterns
- Review Credo code quality checks
- Review :sys module debugging commands for GenServer analysis
- Review LiveView 1.1+ streaming patterns

**Workflows**:
```
Code Analysis → OTP Review → Ash Framework Review
     ↓                                                    ↓
Security Review → Quality Review → :sys Debugging → LiveView Review
```

**Context7 Research**:
- `/websites/hexdocs_pm_elixir_1_19_3`
- `/websites/hexdocs_pm_phoenix` (LiveView 1.1+)
- Sobelow documentation
- Credo documentation
- Ash Framework best practices

---

#### elixir-security.md
**Context**: Elixir application security analysis

**Key Responsibilities**:
- Implement Sobelow static analysis and configuration
- Review Phoenix/Phoenix Framework security best practices
- Review Ash Framework authorization and policies
- Review dependency scanning and CVE analysis
- Review penetration testing for Elixir apps
- Review security-focused code

**Workflows**:
```
Security Scan → Sobelow Review → Ash Authorization Review
     ↓                                                    ↓
Dependency Analysis → Penetration Testing → Security Report
```

---

#### elixir-dialyzer-specialist.md
**Context**: Dialyzer static type analysis and Dialyxir configuration

**Key Responsibilities**:
- Review Dialyzer configuration and PLT management
- Review Dialyxir Mix tasks for automated analysis
- Review Typespec patterns with @spec, @type, @opaque
- Review success typing integration for dynamic Elixir code
- Review CI/CD workflows for type safety
- Review common type errors and anti-patterns

**Workflows**:
```
Type Analysis → Dialyzer Review → Typespec Review
     ↓                                                    ↓
Success Typing → CI/CD Integration → Type Safety Report
```

**Context7 Research**:
- `/jeremyjh/dialyxir`
- Dialyzer documentation
- Typespec patterns
- Gradual typing strategies

---

#### elixir-mixaudit-specialist.md
**Context**: Mix dependency vulnerability scanning and security auditing

**Key Responsibilities**:
- Review MixAudit configuration and execution
- Review Hex package security advisory analysis
- Review dependency vulnerability scanning and CVE tracking
- Review supply chain security assessment
- Review SBOM generation for compliance
- Review CI/CD integration for automated security checks

**Workflows**:
```
Dependency Scan → MixAudit Review → CVE Analysis
     ↓                                                    ↓
Supply Chain → SBOM Generation → Security Report
```

---

### Secondary Agents

#### elixir-proper-specialist.md
**Context**: Proper 1.5.0 specs, behavior contracts, and contract validation

**Key Responsibilities**:
- Review Proper specification patterns (@spec, @type, @opaque)
- Review behavior definitions (@behaviour, @callback)
- Review contract validation and enforcement
- Review gradual typing adoption strategies
- Review integration with Dialyzer

**Workflows**:
```
Spec Review → Behavior Review → Contract Validation
     ↓                                                    ↓
Gradual Typing → Dialyzer Integration → Type Safety Report
```

**Context7 Research**:
- `/websites/hexdocs_pm_proper` (Proper 1.5.0)
- OTP behavior patterns
- Contract testing strategies

---

## Phase 6: Operations & Monitoring

### Purpose
Deployment, monitoring, performance analysis, cache optimization, and production operations for Elixir applications.

### Primary Agents

#### elixir-devops.md (Operations Focus)
**Context**: Deployment and production operations

**Key Responsibilities**:
- Configure Mix releases for production
- Configure distributed Erlang setup with libcluster
- Configure database migrations and versioning with Ash
- Configure monitoring and health checks
- Configure hot upgrade planning for zero-downtime deployment

**Workflows**:
```
Release Building → Distributed Setup → Migration Planning
     ↓                                                    ↓
Monitoring Setup → Hot Upgrade Planning → Deployment Ready
```

---

#### elixir-observability.md
**Context**: Monitoring and observability implementation

**Key Responsibilities**:
- Configure Phoenix LiveDashboard for real-time monitoring
- Configure custom telemetry events and metrics
- Configure OpenTelemetry for distributed tracing
- Configure APM integration (PromEx, AppSignal, Sentry)
- Configure error tracking and alerting systems

**Workflows**:
```
Dashboard Setup → Telemetry Configuration → Tracing Setup
     ↓                                                    ↓
APM Integration → Error Tracking → Monitoring Ready
```

---

### Secondary Agents

#### elixir-cachex-specialist.md
**Context**: Cachex ETS cache analysis and performance optimization

**Key Responsibilities**:
- Configure ETS table type selection and optimization
- Configure cache hit/miss ratio analysis with Cachex.Stats
- Configure memory usage and garbage collection optimization
- Configure time-based and size-based cache invalidation patterns
- Configure multi-process coordination with transactions and concurrency flags

**Workflows**:
```
Cache Setup → Hit/Miss Analysis → Memory Optimization
     ↓                                                    ↓
Invalidation Strategy → Coordination → Performance Ready
```

---

#### elixir-concache-specialist.md
**Context**: ConCache for concurrent testing and cache coordination

**Key Responsibilities**:
- Configure ConCache and supervision tree integration
- Configure multi-process cache testing patterns
- Configure cache synchronization and coordination
- Configure test isolation with cache factories
- Configure cache invalidation and consistency validation

**Workflows**:
```
Cache Configuration → Multi-Process Testing → Coordination
     ↓                                                    ↓
Test Isolation → Invalidation → Consistency Ready
```

---

## Cross-Phase Workflows

### End-to-End Feature Development Workflow

```
Requirements (Phase 1)
    ↓
Architecture (Phase 2)
    ↓
Implementation (Phase 3)
    ↓
Testing (Phase 4)
    ↓
Code Review (Phase 5)
    ↓
Operations (Phase 6)
```

**Agent Coordination**:
1. **Requirements**: elixir-broadway.md, elixir-devops.md, elixir-observability.md
2. **Architecture**: elixir-broadway-workflows-specialist.md, elixir-liveview-1_1-specialist.md, elixir-hooks-specialist.md
3. **Implementation**: elixir-liveview-1_1-specialist.md, elixir-hooks-specialist.md
4. **Testing**: elixir-tester.md, elixir-property-testing-specialist.md, elixir-exmachina-specialist.md
5. **Code Review**: elixir-reviewer.md, elixir-security.md, elixir-dialyzer-specialist.md, elixir-mixaudit-specialist.md, elixir-proper-specialist.md
6. **Operations**: elixir-devops.md, elixir-observability.md, elixir-cachex-specialist.md, elixir-concache-specialist.md

---

## Key Ecosystem Libraries

### Context7 Libraries
- `/websites/hexdocs_pm_broadway` - Broadway docs (516 examples, 80.3 benchmark)
- `/websites/hexdocs_pm_gen_stage` - GenStage patterns
- `/websites/hexdocs_pm_phoenix` - Phoenix LiveView 1.1+ streaming
- `/websites/hexdocs_pm_ash` - Ash Framework v3.0+ patterns
- `/websites/hexdocs_pm_oban` - Oban testing and workers
- `/websites/hexdocs_pm_elixir_1_19_3` - Elixir 1.19.3 OTP patterns
- `/jeremyjh/dialyxir` - Dialyzer integration
- `/websites/hexdocs_pm_proper` - Proper 1.5.0 specs

### Web Research Sources
- Broadway/GenStage comparison articles
- LiveView 1.1+ feature announcements
- Elixir security best practices
- Property-based testing patterns
- Performance optimization articles
- Mix releases and hot upgrade strategies

---

## Next Steps

1. **Phase Execution**: Follow agent coordination for each SDLC phase
2. **Documentation Updates**: Update SDLC patterns as Elixir ecosystem evolves
3. **Agent Enhancement**: Enhance agents based on emerging patterns
4. **Best Practices Consolidation**: See `Best_Practices_2025.md` for consolidated patterns
5. **Integration**: See `Integration_Guide.md` for multi-agent workflows

---

**Total Coverage**: 21 Elixir agents across 6 SDLC phases with comprehensive Context7 research and modern Elixir patterns
