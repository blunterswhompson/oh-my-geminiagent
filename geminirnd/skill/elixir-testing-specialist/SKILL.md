# Elixir Testing Specialist

## Skill Purpose

Expert-level Elixir testing strategies and implementation specialist providing comprehensive guidance on modern Elixir application testing, from advanced ExUnit patterns to cutting-edge property-based testing approaches.

## Core Capabilities

### Advanced ExUnit Patterns and Macros
- **Custom Test Macros**: Develop sophisticated test macros for complex scenario testing
- **Advanced Setup/Teardown**: Multi-level context management with nested describe blocks
- **Async Testing Patterns**: Optimize test parallelism with proper isolation strategies
- **Test Factories**: Declarative test data generation and management
- **Mocking and Stubbing**: Advanced mocking strategies with proper boundaries

### Ash Framework Testing Specialists
- **Resource Testing**: Comprehensive Ash resource action testing patterns
- **Policy Testing**: Authorization and policy validation in isolation
- **Domain Testing**: Multi-resource interaction and workflow testing
- **Data Layer Testing**: ETS, Mnesia, and PostgreSQL-specific testing patterns
- **Ash Generator Integration**: Leverage Ash.Generator for property-based resource testing
- **Smokestack Factories**: Declarative test factories for Ash resources

### Oban Worker Testing (Including Pro Features)
- **Worker Unit Testing**: Isolated worker behavior validation
- **Integration Testing**: End-to-end job processing workflows
- **Oban Pro Features**: Testing advanced plugins, cron jobs, and workflows
- **Job Scheduling**: Time-based job testing strategies
- **Queue Management**: Priority, retry, and failure scenario testing
- **Performance Testing**: Worker throughput and concurrency testing

### Phoenix LiveView Testing with PhoenixPlayground
- **Component Testing**: Isolated LiveComponent testing strategies
- **Integration Testing**: Full LiveView lifecycle testing
- **Event Simulation**: Complex user interaction patterns
- **State Management**: Testing LiveView state transitions
- **PhoenixPlayground**: Rapid prototyping and testing playground setup
- **Accessibility Testing**: ARIA compliance and screen reader testing

### Property-Based Testing with StreamData
- **Generator Design**: Custom data generators for complex domains
- **Property Definition**: Identifying and testing invariants
- **Shrinking Strategies**: Efficient failure case minimization
- **State Machine Testing**: Complex stateful system validation
- **Performance Properties**: Testing performance characteristics
- **Edge Case Discovery**: Finding unexpected behavior patterns

### Test-Driven Development (TDD) Methodology
- **Red-Green-Refactor**: Master the TDD cycle in Elixir
- **Test-First Design**: Writing tests before implementation
- **Incremental Development**: Building functionality test by test
- **Refactoring Safety**: Using tests to enable safe refactoring
- **Specification by Example**: Using tests as living documentation

### CI/CD Integration for Automated Testing
- **Pipeline Design**: Optimizing test execution in CI/CD
- **Test Parallelization**: Maximizing resource utilization
- **Coverage Analysis**: Meaningful code coverage strategies
- **Test Filtering**: Running targeted test suites efficiently
- **Performance Testing Integration**: Automated performance regression detection
- **Environment Management**: Testing across multiple environments

## MCP Server Requirements

### context7
- **Purpose**: Access latest Elixir testing documentation and patterns
- **Usage**: Research current best practices and emerging testing methodologies
- **Integration**: Stay updated with the latest Elixir ecosystem testing tools

### neo4j
- **Purpose**: Store and analyze testing relationships and patterns
- **Usage**: Track test coverage relationships, dependency graphs, and test architecture
- **Integration**: Maintain knowledge base of testing strategies and their relationships

### sequential-thinking
- **Purpose**: Analyze complex testing scenarios and design comprehensive strategies
- **Usage**: Break down complex testing requirements into actionable steps
- **Integration**: Design testing architectures for complex Elixir applications

### playwright
- **Purpose**: End-to-end testing of Phoenix applications
- **Usage**: Browser automation for full-stack Elixir application testing
- **Integration**: Complement unit and integration tests with real browser scenarios

### supabase
- **Purpose**: Testing applications with external database dependencies
- **Usage**: Integration testing with realistic database scenarios
- **Integration**: Test data persistence and real-world usage patterns

## When to Use

### Comprehensive Testing Strategy Design
- **New Projects**: Design complete testing architecture from scratch
- **Legacy Applications**: Modernize existing test suites with current best practices
- **Complex Domains**: Design testing strategies for sophisticated business logic

### Test Architecture Reviews
- **Test Suite Audits**: Evaluate existing test coverage and quality
- **Performance Optimization**: Improve test execution speed and efficiency
- **Maintainability**: Enhance test organization and readability

### Advanced Testing Scenarios
- **Property-Based Testing**: Implement sophisticated property-based test suites
- **Integration Testing**: Design comprehensive integration test strategies
- **Performance Testing**: Establish automated performance regression testing

## Testing Patterns and Best Practices

### ExUnit Advanced Patterns

#### Custom Test Macros
```elixir
defmodule MyApp.TestMacros do
  defmacro assert_http_error(conn, status, message \\ nil) do
    quote do
      assert html_response(unquote(conn), unquote(status))
      if unquote(message) do
        assert html_response(unquote(conn), unquote(status)) =~ unquote(message)
      end
    end
  end

  defmacro with_authenticated_user(user, do: block) do
    quote do
      conn = Plug.Test.init_test_session(build_conn(), %{user_id: unquote(user).id})
      unquote(block)
    end
  end
end
```

#### Advanced Context Management
```elixir
defmodule MyApp.DataCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      alias MyApp.Repo
      
      import Ecto.Query
      import MyApp.DataCase
      import MyApp.TestMacros
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(MyApp.Repo)
    
    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(MyApp.Repo, {:shared, self()})
    end

    setup_shared_context(tags)
  end

  defp setup_shared_context(%{async: true}), do: %{}
  
  defp setup_shared_context(_tags) do
    {:ok, user: insert(:user)}
  end
end
```

### Ash Framework Testing

#### Resource Testing with Generators
```elixir
defmodule MyApp.ResourceTest do
  use ExUnit.Case, async: true
  use ExUnitProperties
  
  alias MyApp.Accounts.User
  alias MyApp.Accounts.Domain
  
  describe "User resource" do
    property "validates email format" do
      check all email <- StreamData.string(:ascii) do
        changeset = Domain.create_user_changeset(%{email: email})
        
        if String.contains?(email, "@") do
          assert changeset.valid?
        else
          refute changeset.valid?
          assert {:email, {"invalid email", _}} in changeset.errors
        end
      end
    end

    property "can create users with valid data" do
      user_generator = Ash.Generator.changeset_generator(User, :create)
      
      check all changeset <- user_generator do
        assert {:ok, user} = Ash.create(changeset, authorize?: false)
        assert user.__metadata__.loaded?
      end
    end
  end
end
```

#### Policy Testing
```elixir
defmodule MyApp.UserPolicyTest do
  use ExUnit.Case, async: true
  
  alias MyApp.Accounts.{User, Tweet}
  alias MyApp.Accounts.Domain

  describe "tweet policies" do
    test "users can read their own tweets" do
      user = insert(:user)
      tweet = insert(:tweet, user: user)
      
      assert Domain.can_read_tweet?(user, tweet)
    end

    test "users cannot read hidden tweets from others" do
      user1 = insert(:user)
      user2 = insert(:user)
      tweet = insert(:tweet, user: user1, hidden?: true)
      
      refute Domain.can_read_tweet?(user2, tweet)
    end

    test "admins can read any tweet" do
      admin = insert(:user, admin: true)
      user = insert(:user)
      tweet = insert(:tweet, user: user, hidden?: true)
      
      assert Domain.can_read_tweet?(admin, tweet)
    end
  end
end
```

### Oban Worker Testing

#### Worker Unit Testing
```elixir
defmodule MyApp.Workers.EmailWorkerTest do
  use ExUnit.Case, async: true
  
  alias MyApp.Workers.EmailWorker
  alias MyApp.Mailer

  import Oban.Testing

  describe "perform/1" do
    test "sends welcome email" do
      user = insert(:user)
      
      job = EmailWorker.new(%{
        "user_id" => user.id,
        "type" => "welcome"
      })

      assert {:ok, %Oban.Job{}} = perform_job(EmailWorker, job)
      
      assert_email_sent(Mailer.WelcomeEmail, to: user.email)
    end

    test "handles missing user gracefully" do
      job = EmailWorker.new(%{
        "user_id" => 999_999,
        "type" => "welcome"
      })

      assert {:cancel, :user_not_found} = perform_job(EmailWorker, job)
    end
  end
end
```

#### Integration Testing with Oban.Pro
```elixir
defmodule MyApp.WorkflowTest do
  use ExUnit.Case
  
  alias MyApp.Workflows
  alias Oban.Pro

  setup do
    Oban.Pro.Testing.setup_oban_test(repo: MyApp.Repo)
  end

  test "user onboarding workflow" do
    user = insert(:user, email_verified?: false)
    
    {:ok, workflow} = Workflows.start_user_onboarding(user)
    
    # Verify initial jobs were created
    assert_enqueued(worker: MyApp.Workers.WelcomeEmail, args: %{"user_id" => user.id})
    assert_enqueued(worker: MyApp.Workers.ProfileSetup, args: %{"user_id" => user.id})
    
    # Complete workflow steps
    perform_job_with_asserter(MyApp.Workers.WelcomeEmail)
    perform_job_with_asserter(MyApp.Workers.ProfileSetup)
    
    # Verify workflow completion
    assert workflow.state == :completed
    assert reload(user).email_verified?
  end
end
```

### Phoenix LiveView Testing

#### Component Testing
```elixir
defmodule MyAppWeb.Live.Components.UserProfileTest do
  use MyAppWeb.ConnCase, async: true
  
  import Phoenix.LiveViewTest
  
  describe "UserProfile component" do
    test "displays user information", %{conn: conn} do
      user = insert(:user, name: "John Doe")
      
      {:ok, view, _html} = 
        live_isolated(conn, MyAppWeb.UserLive.Profile, session: %{"user_id" => user.id})
      
      assert render(view) =~ "John Doe"
      assert has_element?(view, "[data-role=user-avatar]")
      assert has_element?(view, "[data-role=edit-profile]")
    end

    test "handles profile updates", %{conn: conn} do
      user = insert(:user)
      
      {:ok, view, _html} = 
        live_isolated(conn, MyAppWeb.UserLive.Profile, session: %{"user_id" => user.id})
      
      view
      |> form("#profile-form", user: %{name: "Jane Doe"})
      |> render_submit()
      
      assert render(view) =~ "Profile updated successfully"
      assert render(view) =~ "Jane Doe"
    end
  end
end
```

#### Stateful Component Testing
```elixir
defmodule MyAppWeb.Live.Components.CounterTest do
  use MyAppWeb.ConnCase, async: true
  
  import Phoenix.LiveViewTest
  
  test "counter increments and decrements", %{conn: conn} do
    {:ok, view, _html} = live_isolated(conn, MyAppWeb.CounterLive)
    
    # Initial state
    assert render(view) =~ "Count: 0"
    
    # Increment
    view |> element("button", "Increment") |> render_click()
    assert render(view) =~ "Count: 1"
    
    # Multiple increments
    for _ <- 1..5 do
      view |> element("button", "Increment") |> render_click()
    end
    assert render(view) =~ "Count: 6"
    
    # Decrement
    view |> element("button", "Decrement") |> render_click()
    assert render(view) =~ "Count: 5"
    
    # Boundary conditions
    for _ <- 1..10 do
      view |> element("button", "Decrement") |> render_click()
    end
    assert render(view) =~ "Count: 0"  # Should not go below 0
  end
end
```

### Property-Based Testing

#### Custom Generators
```elixir
defmodule MyApp.Generators do
  use StreamData
  
  def user_generator do
    gen all name <- string(:alphanumeric),
            email <- email_generator(),
            age <- integer(0..120) do
      %{
        name: name,
        email: email,
        age: age
      }
    end
  end
  
  def email_generator do
    gen all local_part <- string(:alphanumeric, min_length: 1),
            domain <- string(:alphanumeric, min_length: 1),
            tld <- member_of(["com", "org", "net", "io", "dev"]) do
      "#{local_part}@#{domain}.#{tld}"
    end
  end
  
  def tweet_generator do
    gen all text <- string(:alphanumeric, min_length: 1, max_length: 280),
            likes_count <- integer(0..1_000_000),
            retweets_count <- integer(0..1_000_000) do
      %{
        text: text,
        likes_count: likes_count,
        retweets_count: retweets_count
      }
    end
  end
end
```

#### Property Testing Business Logic
```elixir
defmodule MyApp.TwitterLogicTest do
  use ExUnit.Case
  use ExUnitProperties
  
  alias MyApp.Generators
  
  describe "tweet metrics" do
    property "engagement rate is always between 0 and 100" do
      check all tweet <- Generators.tweet_generator() do
        engagement_rate = calculate_engagement_rate(tweet)
        assert engagement_rate >= 0
        assert engagement_rate <= 100
      end
    end
    
    property "viral threshold is consistent" do
      check all tweet <- Generators.tweet_generator() do
        engagement_rate = calculate_engagement_rate(tweet)
        is_viral = engagement_rate > 5.0
        
        # If it's viral, it should have high engagement
        if is_viral do
          assert tweet.likes_count + tweet.retweets_count > 100
        end
      end
    end
  end
  
  describe "user timelines" do
    property "timeline is chronologically ordered" do
      check all users <- list_of(Generators.user_generator(), min_length: 1),
                  tweets_per_user <- integer(1..5) do
        timeline = build_timeline(users, tweets_per_user)
        
        # Verify chronological order
        sorted_timeline = 
          timeline
          |> Enum.sort_by(& &1.inserted_at, DateTime)
          |> Enum.reverse()
        
        assert timeline == sorted_timeline
      end
    end
  end
end
```

### State Machine Testing
```elixir
defmodule MyApp.OrderStateMachineTest do
  use ExUnit.Case
  use ExUnitProperties
  
  describe "order state machine" do
    property "valid state transitions" do
      check all commands <- commands_generator() do
        {:ok, order} = create_order()
        state = %{order: order, history: []}
        
        {final_state, result} = run_commands(state, commands)
        
        # Verify final state is valid
        assert final_state.order.status in [:pending, :processing, :shipped, :delivered, :cancelled]
        
        # Verify state transition rules
        verify_state_transition_validity(final_state.history)
      end
    end
  end
  
  defp commands_generator do
    frequency([
      {3, constant({:process, []})},
      {3, constant({:ship, []})},
      {3, constant({:deliver, []})},
      {1, constant({:cancel, []})},
      {2, constant({:refund, []})}
    ])
  end
  
  defp run_commands(state, commands) do
    Enum.reduce(commands, {state, :ok}, fn {command, args}, {current_state, _result} ->
      case execute_command(current_state, command, args) do
        {:ok, new_state} -> 
          history = [{command, current_state.order.status, new_state.order.status} | current_state.history]
          {%{new_state | history: history}, :ok}
        {:error, _reason} = error -> 
          {current_state, error}
      end
    end)
  end
  
  defp execute_command(%{order: order}, :process, []), do: transition_order(order, :pending, :processing)
  defp execute_command(%{order: order}, :ship, []), do: transition_order(order, :processing, :shipped)
  defp execute_command(%{order: order}, :deliver, []), do: transition_order(order, :shipped, :delivered)
  defp execute_command(%{order: order}, :cancel, []), do: transition_order(order, :pending, :cancelled)
  defp execute_command(%{order: order}, :refund, []), do: transition_order(order, :delivered, :refunded)
  defp execute_command(_state, _command, _args), do: {:error, :invalid_command}
  
  defp transition_order(order, from_status, to_status) do
    if order.status == from_status do
      {:ok, %{order: %{order | status: to_status}}}
    else
      {:error, :invalid_transition}
    end
  end
  
  defp verify_state_transition_validity(history) do
    valid_transitions = [
      {:pending, :processing},
      {:processing, :shipped},
      {:shipped, :delivered},
      {:pending, :cancelled},
      {:delivered, :refunded}
    ]
    
    Enum.each(history, fn {command, from, to} ->
      if command != :refund do
        assert {from, to} in valid_transitions, 
          "Invalid transition: #{from} -> #{to} via #{command}"
      end
    end)
  end
end
```

## Performance Testing Integration

### Load Testing Patterns
```elixir
defmodule MyApp.Performance.UserRegistrationTest do
  use ExUnit.Case
  
  @moduletag :performance
  
  describe "user registration performance" do
    test "handles concurrent registrations" do
      start_time = System.monotonic_time(:millisecond)
      user_count = 1000
      
      tasks = 
        for i <- 1..user_count do
          Task.async(fn ->
            registration_data = %{
              email: "user#{i}@example.com",
              name: "User #{i}",
              password: "password123"
            }
            
            MyApp.Accounts.register_user(registration_data)
          end)
        end
      
      results = Task.await_many(tasks, 30_000)
      
      end_time = System.monotonic_time(:millisecond)
      duration = end_time - start_time
      
      successful_registrations = Enum.count(results, fn
        {:ok, _user} -> true
        _ -> false
      end)
      
      # Performance assertions
      assert successful_registrations == user_count
      assert duration < 10_000  # Should complete within 10 seconds
      assert duration / user_count < 50  # Average < 50ms per registration
      
      # Throughput calculation
      throughput = user_count / (duration / 1000)
      IO.puts("Registration throughput: #{Float.round(throughput, 2)} registrations/second")
    end
  end
end
```

## CI/CD Integration

### GitHub Actions Configuration
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Elixir
      uses: erlef/setup-beam@v1
      with:
        elixir-version: '1.15'
        otp-version: '26.0'
        
    - name: Cache dependencies
      uses: actions/cache@v3
      with:
        path: deps
        key: ${{ runner.os }}-mix-${{ hashFiles('**/mix.lock') }}
        restore-keys: ${{ runner.os }}-mix-
        
    - name: Install dependencies
      run: mix deps.get
      
    - name: Compile
      run: mix compile --warnings-as-errors
      
    - name: Setup database
      run: |
        mix ecto.create
        mix ecto.migrate
        
    - name: Run tests
      env:
        POSTGRES_HOST: localhost
        POSTGRES_PORT: 5432
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: postgres
        POSTGRES_DB: myapp_test
      run: |
        mix test --trace --cover --max-failures=5
        mix coveralls.json
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: coveralls.json
        
    - name: Performance tests
      if: github.ref == 'refs/heads/main'
      run: |
        mix test --only performance
        
    - name: Property-based tests
      run: |
        mix test --only property
```

## Testing Architecture Patterns

### Test Organization Structure
```
test/
├── support/
│   ├── channel_case.ex          # Phoenix channel testing
│   ├── conn_case.ex            # Connection testing helpers
│   ├── data_case.ex            # Database testing setup
│   └── feature_case.ex         # Feature testing helpers
├── unit/                       # Unit tests
│   ├── my_app/
│   │   ├── accounts/
│   │   ├── billing/
│   │   └── notifications/
├── integration/                 # Integration tests
│   ├── api/
│   ├── web/
│   └── workers/
├── feature/                    # Feature/acceptance tests
│   ├── user_registration.feature
│   ├── order_processing.feature
│   └── social_interactions.feature
├── property/                   # Property-based tests
│   ├── string_utils_test.exs
│   ├── financial_calculations_test.exs
│   └── state_machine_test.exs
├── performance/                # Performance tests
│   ├── load_tests/
│   └── benchmarks/
└── factories/                  # Test factories
    ├── accounts_factory.ex
    ├── billing_factory.ex
    └── notifications_factory.ex
```

This comprehensive Elixir testing specialist skill provides expert-level guidance for designing, implementing, and maintaining robust testing strategies across the entire Elixir ecosystem, from unit tests to complex integration scenarios and advanced property-based testing approaches.