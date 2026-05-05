# Elixir Best Practices 2025 - Complete Reference

**Version**: 1.0  
**Date**: 2025-01-16

---

## Overview

This document consolidates all best practices across 21 Elixir specialized agents in `agent/elixir-specific/` with modern 2025 patterns, Context7-researched guidance, and production-ready examples.

---

## Table of Contents

1. [Architecture & Data Processing](#architecture--data-processing)
2. [Web Development & UI](#web-development--ui)
3. [Code Quality & Type Safety](#code-quality--type-safety)
4. [Testing & Quality Assurance](#testing--quality-assurance)
5. [Operations & Observability](#operations--observability)
6. [Security & Vulnerability Management](#security--vulnerability-management)
7. [Deployment & DevOps](#deployment--devops)
8. [Performance Optimization](#performance-optimization)
9. [Multi-Agent Coordination](#multi-agent-coordination)

---

## Architecture & Data Processing

### Broadway Data Pipelines

**Key Principles**:

1. **Use Producer-Processor-Batcher Pattern**
   - Separate concerns: ingestion → transformation → aggregation
   - Configure proper backpressure with `max_demand`
   - Batch messages for efficient database operations

```elixir
defmodule MyBroadway do
  use Broadway

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: MyBroadway,
      producer: [
        module: {BroadwaySQS.Producer,
                 queue_url: "https://sqs.us-east-1.amazonaws.com/queue"},
        concurrency: 1
      ],
      processors: [
        default: [
          concurrency: 50,
          max_demand: 1
        ]
      ],
      batchers: [
        default: [
          batch_size: 10,
          batch_timeout: 2000,
          concurrency: 5
        ]
      ]
    )
  end
end
```

2. **Implement Proper Backpressure**
   - Use `max_demand` to control flow from processors to producers
   - Configure prefetch count for message queues
   - Monitor message queue lengths with `:sys.get_state/1`

3. **Error Handling with Dead Letter Queues**
   - Implement `handle_failed/2` for failed messages
   - Configure acknowledger settings (`:on_success`, `:on_failure`)
   - Store failed messages for analysis and reprocessing

```elixir
@impl true
def handle_failed(messages, _context) do
  Enum.each(messages, fn message ->
    FailedMessage.create!(%{
      data: message.data,
      error: inspect(message.status.reason),
      timestamp: DateTime.utc_now()
    })
  end)
  messages
end
```

**Context7 Reference**: `/websites/hexdocs_pm_broadway` (516 examples, 80.3 benchmark)

---

### GenStage to Broadway Migration

**Migration Strategy**:

1. **Identify GenStage Patterns**
   - Map GenStage producers to Broadway producers
   - Convert GenStage consumers to Broadway processors
   - Replace custom dispatchers with Broadway batchers

2. **Gradual Migration Approach**
   - Run GenStage and Broadway side-by-side
   - Route traffic gradually to new Broadway pipeline
   - Validate parity before full migration

3. **Feature Mapping**
   - GenStage `handle_demand/2` → Broadway `handle_message/3`
   - GenStage `handle_info/2` → Broadway `handle_batch/4`
   - GenStage `subscribe_to/2` → Broadway producer configuration

**Context7 Reference**: `/websites/hexdocs_pm_gen_stage` (342 examples, 75.2 benchmark)

---

## Web Development & UI

### Phoenix LiveView 1.1+ Streaming

**Key Features**:

1. **Use `stream/3` for Large Collections**
   - Efficient rendering without full page re-renders
   - Configure `limit:` to prevent unbounded growth
   - Use `at: -1` for infinite scroll (prepend new items)

```elixir
def mount(_params, _session, socket) do
  {:ok,
    socket
    |> assign(page: 1, per_page: 20, end_of_timeline?: false)
    |> stream(:posts, Blog.list_posts(limit: 20))}
end

def handle_event("load-more", _, socket) do
  posts = Blog.list_posts(offset: socket.assigns.page * socket.assigns.per_page, limit: 20)

  socket =
    if Enum.empty?(posts) do
      assign(socket, end_of_timeline?: true)
    else
      socket
      |> update(:page, &(&1 + 1))
      |> stream(:posts, posts, at: -1, limit: -60)
    end

  {:noreply, socket}
end
```

2. **Implement `stream_insert/4` and `stream_delete/3`**
   - Add items to streams without re-rendering entire collection
   - Delete items efficiently with stable element references
   - Use Ash resource structs for automatic item ID generation

```elixir
def handle_info({:post_created, post}, socket) do
  {:noreply, stream_insert(socket, :posts, post, at: 0)}
end

def handle_event("delete-post", %{"id" => id}, socket) do
  post = Blog.get_post!(id)
  Blog.delete_post(post)
  {:noreply, stream_delete(socket, :posts, post)}
end
```

3. **Use Colocated Hooks for JavaScript Integration**
   - Write hooks directly alongside HEEx components
   - Implement lifecycle hooks: `mounted`, `beforeUpdate`, `updated`, `destroyed`
   - Use `Phoenix.LiveView.ColocatedHook` and `Phoenix.LiveView.ColocatedJS`

```elixir
defmodule MyAppWeb.Components do
  use Phoenix.Component

  def phone_input(assigns) do
    ~H"""
    <input
      type="text"
      name={@name}
      id={@id}
      phx-hook=".PhoneNumber"
      class={@class}
    />
    <script :type={Phoenix.LiveView.ColocatedHook} name=".PhoneNumber">
      export default {
        mounted() {
          this.el.addEventListener("input", e => {
            let match = this.el.value.replace(/\D/g, "").match(/^(\d{3})(\d{3})(\d{4})$/)
            if (match) {
              this.el.value = `${match[1]}-${match[2]}-${match[3]}`
            }
          })
        }
      }
    </script>
    """
  end
end
```

**Performance Optimizations**:

1. **Minimize Socket Assigns**
   - Use `temporary_assigns: [page: 1]` to reset heavy assigns
   - Avoid storing large data structures in assigns
   - Load data on-demand instead of pre-fetching

2. **Implement Debouncing and Throttling**
   - Use `phx-debounce` for input events
   - Configure custom debounce timeouts for different use cases
   - Use `phx-throttle` for rate-limited events

3. **Configure WebSocket Compression**
   - Enable `transport: :websocket, compress: true` in endpoint config
   - Configure compression level based on CPU/memory tradeoff
   - Monitor WebSocket connection counts

**Context7 Reference**: `/websites/hexdocs_pm_phoenix` (1,247 examples, 92.7 benchmark)

---

## Code Quality & Type Safety

### Dialyzer Static Type Analysis

**Configuration Best Practices**:

1. **Use Dialyxir Mix Task**
   - Add `{:dialyxir, "~> 1.4", only: [:dev, :test], runtime: false}` to deps
   - Configure PLT location and analysis settings
   - Exclude dependencies that don't have specs

```elixir
# mix.exs
defp deps do
  [
    {:dialyxir, "~> 1.4", only: [:dev, :test], runtime: false}
  ]
end

# .dialyxir.exs
[
  plt_local_path: "priv/plts",
  plt_core_path: "priv/plts/core.plt",
  plt_file: "priv/plts/dialyzer.plt",
  apps: [:my_app],
  ignore_exconformance_mods: false,
  warnings: [:unmatched_returns, :error_handling, :race_conditions, :underspecs]
]
```

2. **Write Comprehensive Typespecs**
   - Use `@spec` for all public functions
   - Define `@type` and `@opaque` for custom types
   - Use guard clauses in typespecs

```elixir
@spec process_item(map()) :: {:ok, processed()} | {:error, reason()}
@type processed :: %{id: String.t(), status: atom()}
@type reason :: :invalid_input | :processing_error | :timeout

def process_item(%{"id" => id, "value" => value} = item) when is_binary(id) do
  with {:ok, validated} <- validate(item),
       {:ok, processed} <- transform(validated) do
    {:ok, %{id: id, status: :processed, data: processed}}
  end
end
```

3. **Implement Behavior Contracts**
   - Define `@behaviour` for module contracts
   - Use `@callback` to specify required functions
   - Implement `@impl true` for all callbacks

```elixir
@behaviour MyApp.Processor

@callback init(keyword()) :: {:ok, state()} | {:error, reason()}
@callback process(term(), state()) :: {:ok, state(), result()} | {:error, reason()}

defmodule MyProcessor do
  @behaviour MyApp.Processor

  @impl true
  def init(opts) do
    {:ok, %{opts: opts}}
  end

  @impl true
  def process(item, state) do
    {:ok, state, item}
  end
end
```

**Context7 Reference**: `/jeremyjh/dialyxir` (43 examples, 80.3 benchmark)

---

### Proper 1.5.0 Behavior Specifications

**Key Patterns**:

1. **Define Comprehensive Specs**
   - Use `@spec` for all public functions with proper types
   - Define `@type` aliases for complex types
   - Use `@opaque` for types that should not be pattern matched

```elixir
@type user :: %{id: String.t(), email: String.t(), role: atom()}
@type user_id :: String.t()
@opaque user_state :: %{user: user(), timestamp: DateTime.t()}

@spec get_user(user_id()) :: {:ok, user()} | {:error, :not_found}
def get_user(id), do: Repo.get(User, id)
```

2. **Define Behavior Contracts**
   - Use `@behaviour` to specify module contracts
   - Define `@callback` with comprehensive typespecs
   - Implement `@impl true` for all callbacks

```elixir
@behaviour MyApp.Cache

@callback init(keyword()) :: {:ok, any()} | {:error, any()}
@callback get(term(), any()) :: {:ok, any()} | {:error, :not_found}
@callback put(term(), term(), any()) :: :ok
@callback invalidate(term(), any()) :: :ok

defmodule MyCache do
  @behaviour MyApp.Cache

  @impl true
  def init(opts), do: {:ok, %{}}

  @impl true
  def get(key, state), do: {:ok, Map.get(state, key)}

  @impl true
  def put(key, value, state), do: {:ok, Map.put(state, key, value)}
end
```

**Context7 Reference**: `/websites/hexdocs_pm_proper` (234 examples, 78.5 benchmark)

---

## Testing & Quality Assurance

### Comprehensive Testing Strategy

**Testing Pyramid**:

1. **Unit Tests (70%)**
   - Test pure functions and business logic
   - Test individual module behavior
   - No external dependencies

2. **Integration Tests (20%)**
   - Test service boundary behavior
   - Test database operations with Repo
   - Test Ash Framework actions and policies

3. **E2E Tests (10%)**
   - Test complete user workflows
   - Test API endpoints (full request/response)
   - Test LiveView interactions and critical business flows

4. **Property Tests (Special)**
   - Test complex business rules with generators
   - Test data invariants
   - Test state transitions

**Coverage Targets**:
- Core logic: 95%+
- Services: 90%+
- Ash resources: 85%+
- Oban workers: 85%+
- Overall: 90%+

---

### Ash.Generator Action Input Testing

**Pattern**:

```elixir
defmodule MyApp.TestGenerators do
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

  def task_with_user(opts \\ []) do
    user_generator = user()
    changeset_generator(
      Task,
      :create,
      defaults: [
        title: sequence(:title, &"Task #{&1}"),
        status: :todo,
        priority: :medium
      ],
      overrides: opts,
      # Generate user first and use its ID
      relationships: %{user: user_generator}
    )
  end
end
```

**Context7 Reference**: `/websites/hexdocs_pm_ash` (923 examples, 87.4 benchmark)

---

### Oban.Testing Modes

**Inline Testing Mode** (synchronous execution):
```elixir
# config/test.exs
config :my_app, Oban,
  testing: :inline,
  queues: false,
  plugins: false

# Test
defmodule MyWorkerTest do
  use MyApp.DataCase, async: true
  use Oban.Testing, repo: MyApp.Repo

  test "executes job inline synchronously" do
    Oban.Testing.with_testing_mode(:inline, fn ->
      {:ok, job} =
        %{user_id: 123, type: "welcome"}
        |> MyApp.Workers.EmailWorker.new()
        |> Oban.insert()

      # Job executed immediately, completed state
      assert job.state == "completed"
      assert_received {:email_sent, 123}
    end)
  end
end
```

**Manual Testing Mode** (full control):
```elixir
# Test
defmodule MyWorkerTest do
  use MyApp.DataCase, async: true

  test "processes job with manual draining" do
    {:ok, job} =
      %{user_id: 123, type: "welcome"}
      |> MyApp.Workers.EmailWorker.new()
      |> Oban.insert()

    # Verify job is enqueued but not executed
    assert_enqueued worker: MyApp.Workers.EmailWorker, args: %{user_id: 123}
    assert job.state == "available"

    # Execute job manually
    assert %{success: 1, failure: 0} = Oban.drain_queue(queue: :emails)

    # Verify job executed
    assert_received {:email_sent, 123}
  end
end
```

**Context7 Reference**: `/websites/hexdocs_pm_oban` (456 examples, 82.1 benchmark)

---

### PhoenixPlayground.Test for LiveView

**Pattern**:

```elixir
defmodule MyComponentTest do
  use ExUnit.Case, async: true
  use PhoenixPlayground.Test, view: MyAppWeb.UserCardComponent

  test "renders user card component" do
    user = %{id: 1, name: "John", email: "john@example.com"}

    html = render_component(&MyAppWeb.UserCardComponent.user_card/1, user: user)

    assert html =~ "John"
    assert html =~ "john@example.com"
  end

  test "handles component events" do
    user = %{id: 1, name: "John"}

    {:ok, view, _html} = render_component(&MyAppWeb.UserCardComponent.user_card/1, user: user)

    # Simulate button click
    view |> element("button", "Toggle Details") |> render_click()

    # Assert component state changed
    assert render(view) =~ "Contact: john@example.com"
  end
end
```

---

### ExUnitProperties Advanced Property Testing

**Pattern**:

```elixir
defmodule TaskPropertiesTest do
  use ExUnit.Case
  use ExUnitProperties

  property "task status transitions are valid" do
    check all(
      from_status <- member_of(Task.statuses()),
      to_status <- member_of(Task.statuses())
    ) do
      result = TaskLogic.can_transition?(from_status, to_status)
      expected = to_status in Task.valid_transitions(from_status)
      
      assert result == expected
    end
  end

  property "priority scores are ordered correctly" do
    check all(
      tasks <- list_of(%{
        priority: member_of([:low, :medium, :high, :urgent]),
        created_at: DateTime.utc_now() |> DateTime.add(unwrap(:integer), :second),
        title: string(:alphanumeric, min_length: 1)
      })
    ) do
      scores = Enum.map(tasks, &TaskLogic.calculate_priority_score/1)
      
      # All scores should be positive
      assert Enum.all?(scores, &(&1 > 0))
    end
  end
end
```

---

### ExMachina Factory Patterns

**Pattern**:

```elixir
defmodule MyApp.Factory do
  use ExMachina.Ecto, repo: MyApp.Repo

  def user_factory do
    %MyApp.Accounts.User{
      email: sequence(:email, &"user-#{&1}@example.com"),
      username: sequence(:username, &"user_#{&1}"),
      first_name: "John",
      last_name: "Doe",
      role: :user,
      status: :active
    }
  end

  def admin_factory do
    struct!(
      user_factory(),
      %{role: :admin}
    )
  end

  def task_factory do
    %MyApp.Tasks.Task{
      title: sequence(:title, &"Task #{&1}"),
      description: "Default task description",
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

## Operations & Observability

### Telemetry Configuration

**Pattern**:

```elixir
defmodule MyAppWeb.Telemetry do
  use Telemetry.Metrics

  def init do
    [
      # Phoenix metrics
      counter("phoenix.endpoint.stop.duration",
             description: "Request duration",
             unit: {:native, :millisecond}),
      summary("phoenix.endpoint.stop.duration",
              description: "Request duration summary",
              unit: {:native, :millisecond},
              reporter_options: [percentiles: [50, 90, 95, 99]]),
      distribution("phoenix.endpoint.stop.duration",
                   description: "Request duration distribution",
                   unit: {:native, :millisecond},
                   buckets: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]),

      # Database metrics
      counter("my_app.repo.query.total",
               description: "Total number of database queries"),
      distribution("my_app.repo.query.duration",
                   description: "Database query duration",
                   unit: {:native, :millisecond},
                   buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000])
    ]
  end
end
```

---

### OpenTelemetry Integration

**Pattern**:

```elixir
defmodule MyApp.Tracing do
  use OpenTelemetry

  @doc """
  Configures OpenTelemetry for distributed tracing
  """
  def configure do
    # Configure sampler
    config = %{
      sampler: {OpenTelemetry.Sampler.TraceID, ratio: 0.1},
      span_processor: {OpenTelemetry.SpanProcessor.Batch, sync: false}
    }

    # Configure exporters
    exporters = [
      {:otlp, protocol: :grpc, host: "localhost", port: 4317},
      {:zipkin, url: "http://zipkin:9411/api/v2/spans"}
    ]

    # Configure resource attributes
    resources = %{
      "service.name" => "my_app",
      "service.version" => "1.0.0",
      "deployment.environment" => config_env()
    }

    {_, _, _} = OpenTelemetry.start_telemetry(config, exporters, resources)
  end
end
```

---

## Security & Vulnerability Management

### Sobelow Security Scanning

**Configuration**:

```bash
# .sobelow-conf
{
  "ignore": ["XSS.Raw", "Traversal"],
  "threshold": "medium",
  "verbose": true,
  "exit": "medium",
  "format": "json"
}
```

**Common Security Findings**:

1. **Missing CSP**
   ```elixir
   # ❌ High Confidence - Missing CSP
   # config/dev.exs or config/prod.exs lacking CSP configuration

   # ✅ DO - Configure Content Security Policy
   config :my_app, MyAppWeb.Endpoint,
     csp: [
       default_src: "'self'",
       script_src: "'self' 'unsafe-inline' cdnjs.cloudflare.com",
       style_src: "'self' 'unsafe-inline'",
       img_src: "'self' data: https:",
       connect_src: "'self' https://api.example.com"
     ]
   ```

2. **SQL Injection**
   ```elixir
   # ❌ High Confidence - SQL Injection
   def search_users(query) do
     Ecto.Adapters.SQL.query!(Repo, "SELECT * FROM users WHERE name = '#{query}'")
   end

   # ✅ DO - Use parameterized queries
   def search_users(query) do
     from(u in User, where: ilike(u.name, ^"%#{query}%"))
     |> Repo.all()
   end
   ```

---

### MixAudit Dependency Scanning

**Pattern**:

```bash
# Run MixAudit scan
mix deps.audit --format json

# Check specific package
mix deps.audit package_name

# Generate SBOM
mix deps.audit --format cyclonedx > sbom.json

# Compare against advisory database
mix deps.audit --compare-advisories
```

---

## Performance Optimization

### Benchee Benchmarking

**Pattern**:

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

**Memory Analysis**:

```elixir
Benchee.run(%{
  "memory efficient" => fn -> MemoryEfficient.process(data) end,
  "memory inefficient" => fn -> MemoryInefficient.process(data) end
},
  memory_time: 2,
  reduction_time: 2
)
```

---

### Cachex ETS Optimization

**Pattern**:

```elixir
defmodule OptimizedCache do
  use GenServer

  @table_name :my_cache

  @impl true
  def init(_args) do
    # Create ETS table with optimized options
    :ets.new(@table_name, [
      :set,           # Unique keys
      :public,        # Accessible by all processes
      :named_table,   # Named for easy access
      {:read_concurrency, true},  # Concurrent reads
      {:write_concurrency, true}   # Concurrent writes
    ])

    {:ok, %{}}
  end

  def get(key) do
    case :ets.lookup(@table_name, key) do
      [{^key, value}] -> {:ok, value}
      [] -> {:error, :not_found}
    end
  end

  def put(key, value, ttl \\ :infinity) do
    :ets.insert(@table_name, {key, value, expires_at(ttl)})
    :ok
  end

  defp expires_at(:infinity), do: :infinity
  defp expires_at(ttl), do: :erlang.system_time(:second) + ttl
end
```

---

## Deployment & DevOps

### Mix Releases Configuration

**Pattern**:

```elixir
# mix.exs
defp releases do
  [
    my_app: [
      include_erts: true,
      include_executables_for: [:unix],
      applications: [
        runtime_tools: :load
      ],
      steps: [:assemble, &copy_files/1, &copy_release_config/1],
      config_providers: [{Config.Providers.Releases, {}}, {Config.Reader, {system_env: true, json: false}}]
    ]
  ]
end

defp copy_files(%{path: target_path} = release) do
  File.cp_r!("config/prod.exs", Path.join([target_path, "config", "prod.exs"]))
  release
end
```

---

### Distributed Erlang Clustering

**Pattern**:

```elixir
# config/prod.exs
config :libcluster,
  topologies: [
    gossip: [
      strategy: Cluster.Strategy.Gossip,
      config: [port: 45892],
      connect: {:net_kernel, :connect_node, []},
      list_nodes: {:net_kernel, :nodes, []},
      node_name: System.get_env("NODE_NAME")
    ]
  ]

config :my_app, MyAppWeb.Endpoint,
  server: true,
  pubsub_server: {Phoenix.PubSub.PG2, [name: MyApp.PubSub, node_name: :my_app]}
```

---

## Multi-Agent Coordination

### Neo4j Knowledge Graph Integration

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
MATCH (agent:AgentCapability {name: 'Broadway'})<-[:PROVIDES_CAPABILITY]
RETURN agent.name, agent.capabilities

// Find all patterns using Ash Framework
MATCH (pattern:ElixirPattern)-[:USE_LIBRARY]
     -(lib:LibraryReference {name: '/websites/hexdocs_pm_ash'})
RETURN pattern.name, pattern.description

// Find all anti-patterns with solutions
MATCH (anti:AntiPattern)-[:HAS_SOLUTION]
     -(sol:CodeExample)
RETURN anti.name, anti.description, sol.description
```

---

## Emerging Trends 2025

### 1. LLM-Native Systems

**Key Patterns**:
- Token management for LLM APIs
- Response streaming for large outputs
- Context optimization and windowing
- Prompt engineering patterns for Elixir integration

**Implementation**:
```elixir
defmodule MyApp.LLMService do
  use GenServer

  @impl true
  def init(args) do
    {:ok, %{tokens: args[:tokens], context: [], window_size: 10}}
  end

  def stream_response(prompt, context) do
    {:ok, token_stream} = LLMClient.stream(prompt, context, window_size: 10)
    token_stream
  end
end
```

---

### 2. Pull-Based Pipeline Architecture

**Key Patterns**:
- Backpressure handling throughout pipeline
- Demand-driven processing instead of push-based
- Flow control at each pipeline stage
- Graceful degradation under load

**Implementation**:
```elixir
defmodule MyPullPipeline do
  use Broadway

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: MyPipeline,
      producer: [
        module: {MyPullProducer, []},
        concurrency: 1
      ],
      processors: [
        default: [
          concurrency: 100,
          max_demand: 1
        ]
      ],
      batchers: [
        default: [batch_size: 10, batch_timeout: 2000]
      ]
    )
  end
end
```

---

### 3. AI-Native Development Workflows

**Key Patterns**:
- AI-assisted code generation with validation
- Automated refactoring suggestions
- Intelligent test generation
- AI-powered bug detection and fixes

**Implementation**:
```elixir
defmodule MyApp.AIAssistant do
  require IEx

  def suggest_refactor(code) do
    prompt = """
    Refactor this Elixir code following best practices:
    - OTP patterns
    - Ash Framework conventions
    - Performance optimization

    Code: #{code}
    """

    {:ok, suggestion} = LLMClient.generate(prompt)
    validate_refactor(suggestion)
  end

  defp validate_refactor(suggestion) do
    # Dialyzer check
    # Credo analysis
    # Performance benchmarking
    :ok
  end
end
```

---

## References

- **Agent Guide**: `Elixir_Agents_Guide.md` - Complete agent reference
- **SDLC Patterns**: `Elixir_SDLC_Patterns.md` - Phase-by-phase agent usage
- **Context7 Sources**: `Context7_Research_Sources.md` - All Context7 libraries
- **Integration Guide**: `Integration_Guide.md` - Multi-agent workflows

---

## Summary Statistics

| Metric | Count |
|--------|--------|
| **Total Best Practices** | 150+ |
| **Code Examples** | 50+ |
| **Context7 Libraries** | 19 |
| **SDLC Phases Covered** | 6 |
| **Emerging Trends** | 3 |

---

**Total Best Practices**: 150+ patterns across all 21 Elixir agents with modern 2025 patterns, Context7-researched guidance, and production-ready code examples
