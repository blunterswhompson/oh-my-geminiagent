# Elixir Agents Guide - Complete Reference

**Version**: 1.0  
**Date**: 2025-01-16  
**Total Agents**: 21 specialized Elixir agents

---

## Overview

This guide provides a comprehensive overview of all 21 Elixir-specialized agents available in the `agent/elixir-specific/` directory. Each agent is production-ready with Context7-researched documentation, MCP server integration specifications, and modern Elixir patterns for 2025.

---

## Quick Reference

| Agent Name | SDLC Phase | Key Capabilities | Context7 Source | Lines |
|-------------|--------------|-------------------|------------------|--------|
| `elixir-broadway.md` | Architecture | Data processing pipelines, backpressure, RabbitMQ/Kafka | `/websites/hexdocs_pm_broadway` | ~900 |
| `elixir-liveview-1_1-specialist.md` | Development | LiveView 1.1+ streaming, colocated hooks, HEEx slots | `/websites/hexdocs_pm_phoenix` | ~800 |
| `elixir-dialyzer-specialist.md` | Testing | Static type analysis, Dialyxir, gradual typing | `/jeremyjh/dialyxir` | ~750 |
| `elixir-mixaudit-specialist.md` | Security | Dependency vulnerability scanning, CVE analysis | MixAudit GitHub | ~500 |
| `elixir-genstage-specialist.md` | Architecture | Stream processing, GenStage to Broadway migration | `/websites/hexdocs_pm_gen_stage` | ~900 |
| `elixir-propcheck-specialist.md` | Testing | PropCheck property-based testing, PropEr patterns | `/websites/hexdocs_pm_proper` | ~750 |
| `elixir-proper-specialist.md` | Testing | Proper 1.5.0 specs, behavior contracts, @spec | `/websites/hexdocs_pm_proper` | ~700 |
| `elixir-exmachina-specialist.md` | Testing | ExMachina factories, Ash resource factories, multi-tenant data | ExMachina docs | ~1,500 |
| `elixir-faker-specialist.md` | Testing | Faker test data generation, domain-specific generators | Faker library docs | ~1,100 |
| `elixir-benchmarking-specialist.md` | Operations | Benchee benchmarking, performance profiling, regression testing | Benchee docs | ~850 |
| `elixir-wallaby-specialist.md` | Testing | Wallaby + Playwright E2E testing, browser automation | Wallaby, Playwright | ~700 |
| `elixir-hound-specialist.md` | Testing | Hound code coverage, ExCoveralls, quality gates | Hound, ExCoveralls | ~600 |
| `elixir-coverage-specialist.md` | Testing | Coverage strategy, thresholds, CI/CD integration | ExCoveralls, Coveralls | ~750 |
| `elixir-cachex-specialist.md` | Operations | Cachex ETS analysis, cache hit/miss ratios, memory optimization | Cachex docs | ~600 |
| `elixir-concache-specialist.md` | Testing | ConCache concurrent testing, cache coordination, isolation | ConCache docs | ~600 |
| `elixir-broadway-workflows-specialist.md` | Architecture | Multi-stage pipelines, fan-out/fan-in, dynamic configuration | `/websites/hexdocs_pm_broadway` | ~900 |
| `elixir-hooks-specialist.md` | Development | LiveView colocated hooks, JavaScript interop, TypeScript | `/websites/hexdocs_pm_phoenix` | ~750 |
| `elixir-property-testing-specialist.md` | Testing | ExUnitProperties advanced PBT, stateful testing, generators | StreamData docs | ~850 |
| `elixir-devops.md` | Deployment | Mix releases, hot upgrades, clustering, CI/CD | Mix docs, libcluster | ~900 |
| `elixir-security.md` | Security | Sobelow, Credo, dependency security, penetration testing | Sobelow, Credo | ~900 |
| `elixir-observability.md` | Operations | Telemetry, LiveDashboard, :observer, APM integration | Phoenix LiveDashboard, PromEx | ~850 |
| `elixir-tester.md` | Testing | Enhanced with Ash.Generator, Oban.Testing, PhoenixPlayground | Ash, Oban, PhoenixPlayground | ~893 |
| `elixir-reviewer.md` | Code Review | Enhanced with :sys debugging, LiveView 1.1+, Credo | `/websites/hexdocs_pm_elixir_1_19_3` | ~989 |

---

## Agent Categories

### 1. Architecture & Data Processing (4 agents)

#### elixir-broadway.md
**Purpose**: Specialized agent for designing and implementing high-throughput concurrent data processing pipelines using Broadway.

**Key Features**:
- Producer-processor-batcher design patterns
- Backpressure management and flow control
- Integration with message queues (RabbitMQ, SQS, Pub/Sub, Kafka)
- Error handling, retries, and dead letter queues
- Performance tuning for high-throughput processing

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Building event-driven architectures
- ETL (Extract, Transform, Load) pipelines
- Processing streaming data from multiple sources
- Implementing workflow orchestration

**Code Examples**:
```elixir
defmodule MyBroadway do
  use Broadway
  
  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: MyBroadway,
      producer: [
        module: {BroadwayRabbitMQ.Producer,
          queue: "my_queue",
          qos: [prefetch_count: 50]
        },
        concurrency: 1
      ],
      processors: [
        default: [concurrency: 50]
      ],
      batchers: [
        default: [
          batch_size: 10,
          batch_timeout: 1500,
          concurrency: 5
        ]
      ]
    )
  end
end
```

#### elixir-genstage-specialist.md
**Purpose**: Expert in GenStage streaming patterns and GenStage to Broadway migration strategies.

**Key Features**:
- GenStage producer, processor, and consumer patterns
- Flow control and backpressure management
- GenStage to Broadway migration strategies
- Legacy system integration

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Stream processing with GenStage
- Migrating legacy GenStage systems to Broadway
- Understanding modern streaming patterns

---

#### elixir-broadway-workflows-specialist.md
**Purpose**: Expert in advanced Broadway patterns including fan-out/fan-in topologies, multi-stage pipelines, and complex data transformation workflows.

**Key Features**:
- Fan-out/fan-in patterns for parallel processing
- Multi-stage pipeline design
- Dynamic pipeline configuration
- Complex transformation and aggregation workflows

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Complex data processing
- ETL workflows with multiple stages
- Real-time analytics and aggregation

---

#### elixir-devops.md
**Purpose**: Specialized agent for Elixir deployment and DevOps operations including Mix releases, hot upgrades, and clustering.

**Key Features**:
- Mix releases configuration and building
- Hot upgrades and distributed deployments
- OTP application clustering with libcluster
- CI/CD pipeline design for Elixir projects
- Database migration management with Ash
- Monitoring and telemetry setup

**MCP Servers**: context7, neo4j, sequential-thinking, supabase

**When to Use**:
- Deployment automation
- Release management
- Clustering setup and configuration

---

### 2. Development & UI (2 agents)

#### elixir-liveview-1_1-specialist.md
**Purpose**: Expert in Phoenix LiveView 1.1+ features including streaming, colocated hooks, function components, and slots.

**Key Features**:
- LiveView 1.1+ streaming with `stream/3`, `stream_insert/4`, `stream_delete/3`
- Colocated hooks for JavaScript integration
- HEEx function component patterns
- LiveView 1.1+ slots and slots composition
- Performance optimizations and streaming best practices
- Testing patterns for LiveView 1.1+ applications

**MCP Servers**: context7, neo4j, sequential-thinking, playwright

**When to Use**:
- Modern LiveView applications
- Streaming features and infinite scroll
- Performance optimization for LiveView
- JavaScript integration with HEEx components

**Code Examples**:
```elixir
def mount(_params, _session, socket) do
  {:ok,
    socket
    |> assign(page: 1, per_page: 20, end_of_timeline?: false)
    |> stream(:posts, Blog.list_posts(limit: 20))}
end

def handle_info({:post_created, post}, socket) do
  {:noreply, stream_insert(socket, :posts, post, at: 0)}
end
```

#### elixir-hooks-specialist.md
**Purpose**: Expert in Phoenix LiveView collocated hooks for JavaScript integration and custom lifecycle management.

**Key Features**:
- Hook registration and initialization
- JavaScript interop with HEEx components
- Custom lifecycle hooks (onMount, onUpdate, onUnmount)
- State management across JS/Elixir boundary
- Event handling and communication patterns
- TypeScript integration for type-safe hooks

**MCP Servers**: context7, neo4j, sequential-thinking, playwright

**When to Use**:
- LiveView extensions requiring JS functionality
- Custom hooks for JavaScript libraries
- Complex component interactions

---

### 3. Code Quality & Security (3 agents)

#### elixir-dialyzer-specialist.md
**Purpose**: Expert in Dialyzer static type analysis and Dialyxir configuration for Elixir applications.

**Key Features**:
- Dialyzer configuration and PLT management
- Dialyxir Mix tasks for automated analysis
- Typespec patterns with @spec, @type, @opaque
- Success typing integration for dynamic Elixir code
- CI/CD workflows for type safety
- Common type errors and anti-patterns

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Type safety enforcement
- CI/CD type checking
- Code quality through gradual typing

**Code Examples**:
```elixir
# mix.exs
defp deps do
  [
    {:dialyxir, "~> 1.4", only: [:dev, :test], runtime: false}
  ]
end

# Typespec example
@spec add(integer(), integer()) :: integer()
def add(x, y), do: x + y
```

#### elixir-mixaudit-specialist.md
**Purpose**: Specialized agent for Mix dependency vulnerability scanning and security auditing for Elixir projects.

**Key Features**:
- MixAudit configuration and execution
- Hex package security advisory analysis
- Dependency vulnerability scanning and CVE tracking
- Supply chain security assessment
- SBOM generation for compliance
- CI/CD integration for automated security checks
- Integration with Sobelow for code analysis

**MCP Servers**: context7, neo4j, sequential-thinking, sobelow

**When to Use**:
- Pre-deployment security scans
- Dependency vulnerability management
- Compliance reporting

---

#### elixir-security.md
**Purpose**: Specialized agent for Elixir application security analysis including Sobelow, Credo, dependency scanning, and penetration testing.

**Key Features**:
- Sobelow static analysis and configuration
- Phoenix security best practices (CSRF, authentication)
- Ash Framework authorization and policies
- Dependency scanning and CVE analysis
- Penetration testing for Elixir apps
- Security-focused code review

**MCP Servers**: context7, neo4j, sequential-thinking, sobelow

**When to Use**:
- Security audits
- Vulnerability scanning
- Security testing and penetration testing

---

### 4. Testing & Quality Assurance (8 agents)

#### elixir-tester.md (Enhanced)
**Purpose**: Specialized testing expert for Elixir applications, enhanced with Ash.Generator, Oban.Testing, PhoenixPlayground, and ExUnitProperties.

**Key Features**:
- Testing philosophy: TDD, testing pyramid, property-based testing
- Ash.Generator.action_input patterns for resource testing
- Oban.Testing inline vs manual modes
- PhoenixPlayground.Test for LiveView component testing
- ExUnitProperties with StreamData integration
- Factory patterns with ExMachina for Ash resources

**MCP Servers**: context7, neo4j, sequential-thinking, playwright, supabase

**When to Use**:
- Comprehensive testing strategies
- Test architecture design
- Quality gate enforcement

**Code Examples**:
```elixir
# Ash.Generator pattern
use Ash.Generator

def user(opts \\ []) do
  changeset_generator(
    User,
    :create,
    defaults: [
      email: "user-#{System.unique_integer([:positive])}@example.com",
      username: "user_#{System.unique_integer([:positive])}"
    ],
    overrides: opts
  )
end

# In tests
check all(
  user <- MyApp.TestGenerators.user(),
  _ <- MyApp.TestGenerators.generate_many(user_generator, 10)
) do
  assert user.email =~ "@example.com"
  assert user.username =~ "user_"
end
```

#### elixir-propcheck-specialist.md
**Purpose**: Expert in Elixir PropCheck (PropEr-based) property testing as alternative to StreamData.

**Key Features**:
- PropCheck patterns and test generation
- Comparison with StreamData testing
- When to use PropCheck vs StreamData
- Migration strategies from PropCheck to StreamData
- Team adoption and training

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Alternative PBT framework
- Teams preferring PropEr API style
- Migration between frameworks

---

#### elixir-proper-specialist.md
**Purpose**: Expert in Elixir Proper (1.5.0) library for behavior specification, @spec types, @behaviour definitions, and contract validation.

**Key Features**:
- Proper specification patterns (@spec, @type, @opaque)
- Behavior definitions (@behaviour, @callback)
- Contract validation and enforcement
- Gradual typing adoption strategies
- Integration with Dialyzer

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- OTP patterns and behavior contracts
- Type safety with contracts
- Behavior-driven development

**Code Examples**:
```elixir
@spec calculate(integer(), integer()) :: integer()
def calculate(x, y), do: x + y

@callback init(any()) :: {:ok, any()} | {:error, any()}
@callback handle_cast(any(), any()) :: {:noreply, any()}

defmodule MyServer do
  @behaviour MyBehaviour
  @impl true
  def init(args), do: {:ok, args}
end
```

---

#### elixir-exmachina-specialist.md
**Purpose**: Expert in ExMachina test data factories and complex Ash resource test scenarios.

**Key Features**:
- Factory patterns for Ash resources
- Relationship handling (belongs to, has many, many-to-many)
- Multi-tenant generation strategies
- Ash actions & policies testing helpers
- Phoenix LiveView helpers for factories
- Recursive strategies for trees and graphs

**MCP Servers**: context7, neo4j, sequential-thinking, supabase

**When to Use**:
- Complex Ash resource testing
- Multi-tenant data generation
- Factory patterns for complex relationships

**Code Examples**:
```elixir
defmodule MyApp.Factory do
  use ExMachina.Ecto, repo: MyApp.Repo

  def user_factory do
    %MyApp.Accounts.User{
      email: sequence(:email, &"user-#{&1}@example.com"),
      username: sequence(:username, &"user_#{&1}"),
      role: :user,
      status: :active
    }
  end

  def task_factory do
    %MyApp.Tasks.Task{
      title: sequence(:title, &"Task #{&1}"),
      status: :todo,
      priority: :medium,
      user: build(:user),
      project: build(:project)
    }
  end

  def urgent_task_factory do
    struct!(
      task_factory(),
      %{
        title: "URGENT: " <> sequence(:title, &"Task #{&1}"),
        priority: :urgent,
        status: :in_progress
      }
    )
  end
end
```

---

#### elixir-faker-specialist.md
**Purpose**: Expert in Faker library for flexible test data generation as alternative to ExMachina.

**Key Features**:
- 50+ Faker generators for common Elixir types
- Phoenix LiveView testing strategies
- Ash resource integration patterns using Smokestack
- Custom domain-specific generator creation
- Localization and custom data patterns
- ExMachina integration with advanced patterns

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Diverse test data generation
- Custom domain patterns
- Flexible testing strategies

---

#### elixir-benchmarking-specialist.md
**Purpose**: Expert in Benchee performance benchmarking and regression testing for Elixir applications.

**Key Features**:
- Benchee configuration with all options
- Performance strategies with before/after hooks
- Memory/GC analysis with memory_time and reduction_time
- Regression testing with save/load functionality
- Visualization with HTML and Console formatters
- Mix integration with custom tasks

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Performance optimization
- Regression detection
- Benchmarking workflows

**Code Examples**:
```elixir
Benchee.run(%{
  "fast implementation" => fn -> FastImplementation.process(data) end,
  "slow implementation" => fn -> SlowImplementation.process(data) end
},
  time: 10,
  warmup: 2,
  formatters: [
    Benchee.Formatters.Console,
    {Benchee.Formatters.HTML, file: "bench/output.html"}
  ]
)
```

---

#### elixir-wallaby-specialist.md
**Purpose**: Expert in end-to-end E2E testing using Wallaby and Playwright for Elixir/Phoenix applications.

**Key Features**:
- Wallaby configuration and SQL Sandbox setup
- Phoenix LiveView testing patterns with authentication
- JavaScript interaction and assertion patterns
- Form submission, validation, and multi-step workflow testing
- Page navigation, session management, and concurrent testing
- Advanced patterns: page objects, custom assertions, fixtures

**MCP Servers**: context7, neo4j, sequential-thinking, playwright

**When to Use**:
- E2E testing
- Acceptance testing
- End-to-end validation

---

#### elixir-hound-specialist.md
**Purpose**: Expert in Hound code coverage reporting and quality enforcement for Elixir projects.

**Key Features**:
- Hound configuration and setup
- Coverage thresholds and quality gates
- CI/CD integration for coverage enforcement
- Multi-module and umbrella project support
- ExCoveralls and Coveralls integration
- Coverage visualization and reporting

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Code quality enforcement
- CI/CD coverage gates
- Reporting dashboards

---

#### elixir-coverage-specialist.md
**Purpose**: Expert in comprehensive code coverage strategy, tools, and CI/CD integration for Elixir projects.

**Key Features**:
- Coverage tool comparison (ExCoveralls, Coveralls, ExCover)
- Coverage thresholds and quality metrics
- Line, branch, and function coverage strategies
- Module coverage patterns
- Coverage trends and regression detection
- CI/CD integration for coverage reporting

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Coverage strategy design
- Quality gate enforcement
- Coverage reporting automation

---

### 5. Operations & Observability (3 agents)

#### elixir-observability.md
**Purpose**: Specialized in Elixir application monitoring, telemetry, and observability with focus on real-time performance analysis.

**Key Features**:
- Phoenix LiveDashboard integration and customization
- Telemetry configuration and metrics
- BEAM VM monitoring with :observer tools
- Application Performance Monitoring (APM) integration
- OpenTelemetry for distributed tracing
- Error tracking and alerting systems

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Performance analysis
- Monitoring architecture design
- Production operations

---

#### elixir-cachex-specialist.md
**Purpose**: Expert in Cachex ETS cache usage analysis and performance optimization for Elixir applications.

**Key Features**:
- ETS table design and optimization patterns
- Cache hit/miss ratio analysis
- Memory usage and garbage collection optimization
- Cache invalidation strategies
- Multi-process cache coordination
- Distributed cache synchronization

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Cache performance optimization
- Memory analysis
- Distributed caching strategies

---

#### elixir-concache-specialist.md
**Purpose**: Expert in ConCache for concurrent testing and cache coordination in Elixir applications.

**Key Features**:
- ConCache configuration and setup
- Multi-process cache testing patterns
- Cache coordination and synchronization
- Concurrent test execution with cache isolation
- Cache invalidation and consistency testing
- Performance testing under concurrent load

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Concurrent testing
- Cache coordination
- Performance optimization

---

### 6. Code Review (1 agent)

#### elixir-reviewer.md (Enhanced)
**Purpose**: Specialized Elixir code reviewer, enhanced with :sys debugging, Credo, Sobelow security patterns, and LiveView 1.1+ features.

**Key Features**:
- OTP patterns and supervision tree validation
- Ash Framework best practices and architectural alignment
- Sobelow security scanning patterns
- Credo code quality checks
- :sys module debugging commands for GenServer analysis
- Performance optimization patterns
- Common anti-patterns and fixes

**MCP Servers**: context7, neo4j, sequential-thinking

**When to Use**:
- Code reviews for Elixir projects
- OTP pattern validation
- Security and quality audits

**Code Examples**:
```elixir
# :sys debugging commands
:sys.statistics(pid, true)
:sys.trace(pid, true)
:sys.get_state(pid)
:sys.get_status(pid)

# Enable debugger and observer
:debugger.start()
:observer.start()

# Trace function calls
:dbg.tracer()
:dbg.p(:all, :c)
:dbg.tp(MyApp.Worker, :process, 2)
:dbg.stop()
```

---

## Agent Coordination Patterns

### Multi-Agent Workflows

1. **Architecture → Development → Testing**
   - elixir-broadway.md → elixir-liveview-1_1-specialist.md → elixir-tester.md
   - Design pipelines with Broadway
   - Build LiveView UI with streaming
   - Test with Ash.Generator and PhoenixPlayground

2. **Code Review → Security → Deployment**
   - elixir-reviewer.md → elixir-security.md → elixir-devops.md
   - Review code with :sys debugging
   - Security scan with Sobelow and MixAudit
   - Deploy with Mix releases

3. **Testing → Quality Assurance**
   - elixir-tester.md + elixir-coverage-specialist.md
   - Test with comprehensive strategies
   - Enforce quality gates

---

## Next Steps

1. **Explore**: Read individual agent files for detailed patterns
2. **Test**: Create sample Elixir projects to validate agents
3. **Integrate**: Use agents together for complete SDLC coverage
4. **Evolve**: Monitor emerging Elixir patterns and update agents

---

## References

- **Context7 Libraries**: See `Context7_Research_Sources.md` for detailed library information
- **SDLC Patterns**: See `Elixir_SDLC_Patterns.md` for phase-by-phase agent usage
- **Integration Guide**: See `Integration_Guide.md` for multi-agent workflows
- **Best Practices**: See `Best_Practices_2025.md` for consolidated patterns

---

**Total Documentation**: ~15,000 lines of Elixir-specific guidance across 21 specialized agents
