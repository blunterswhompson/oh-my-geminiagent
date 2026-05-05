---
description: Performance, load, contract, and integration testing for APIs with k6, Pact, and chaos engineering
agent: testing/api-tester
subtask: true
---

# API Testing Command

Comprehensive API testing including performance profiling, load testing, contract validation, integration testing, chaos engineering, and monitoring setup to ensure APIs are battle-tested before deployment.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather relevant context:

**Current Test Setup:**
```bash
!`find . -name '*k6*.js' -o -name '*jmeter*' -o -name '*pact*' 2>/dev/null | head -10`
!`grep -r 'HTTPoison\|Req\|Finch' lib/ | head -5`
!`cat config/config.exs | grep -A 5 'pool_size\|timeout'`
```

**API Endpoints:**
```bash
!`grep -r "scope" lib/*_web/router.ex 2>/dev/null | head -20`
!`find lib/*_web/controllers -name "*_controller.ex" 2>/dev/null | head -20`
!`find lib -name "*_resource.ex" 2>/dev/null | head -20`
!`find public docs -name 'openapi.yml' -o -name 'swagger.json' 2>/dev/null`
```

**Localhost Status:**
```bash
!`curl -s http://localhost:4000/api/health || echo "Server not running"`
!`psql -h localhost -U postgres -c "SELECT version();" 2>/dev/null | head -3`
```

## Usage Examples

### 1. Performance Testing with k6

**When to use:**
- Establishing performance baselines
- Validating response time budgets
- Identifying N+1 query problems
- Testing API endpoints before deployment

**Example:**
```bash
/api-test Create k6 performance test suite for product API endpoints:
- GET /api/products (list with pagination)
- GET /api/products/:id (single product detail)
- POST /api/orders (create order workflow)
- Target: p95 < 100ms, p99 < 200ms, throughput > 1000 RPS
- Run for 5 minutes with 100 concurrent users
```

**What you'll get:**
- **k6 Test Script** (`performance_tests/api_endpoints.js`):
  ```javascript
  export const options = {
    stages: [
      { duration: '30s', target: 20 },
      { duration: '1m', target: 100 },
      { duration: '30s', target: 0 },
    ],
    thresholds: {
      http_req_duration: ['p(95)<100', 'p(99)<200'],
      http_req_failed: ['rate<0.01'],
    },
  }
  
  export default function () {
    const res = http.get('http://localhost:4000/api/products')
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 100ms': (r) => r.timings.duration < 100,
    })
  }
  ```

- **Performance Report**:
  ```
  ✓ http_req_duration............: avg=42ms  p95=87ms  p99=156ms
  ✓ http_req_failed...............: 0.02% (24/120000)
  ✓ http_reqs.....................: 120000 (1234/s)
  ✓ checks........................: 99.98% pass
  
  Results: All thresholds met ✅
  ```

- **Bottleneck Analysis**:
  ```markdown
  ## Performance Analysis
  
  **N+1 Query Detected**: GET /api/orders
  - Before: 450ms (1 + N queries)
  - After preload: 42ms (2 queries)
  - Fix: `Order |> Repo.all() |> Repo.preload([:user, :items])`
  
  **Database Pool Exhaustion**: 300+ concurrent users
  - Symptom: Timeout errors, p99 spike to 5000ms
  - Fix: Increased pool_size from 10 to 20
  ```

- **Benchee Micro-benchmarks**:
  ```elixir
  Benchee.run(%{
    "without preload" => fn -> # N+1 problem
    "with preload" => fn -> # Optimized
  })
  # Result: 13.87x faster with preload
  ```

**Timeline**: 3-4 hours

### 2. Load Testing - Find Breaking Points

**When to use:**
- Capacity planning
- Finding system limits
- Testing auto-scaling triggers
- Validating graceful degradation

**Example:**
```bash
/api-test Run stress test to find breaking point:
- Start with 100 users (normal load)
- Ramp to 500 users (peak expected)
- Continue to 1000 users (stress)
- Identify at what point errors increase
- Measure recovery time after load removed
```

**What you'll get:**
- **Stress Test Script** (`load_tests/stress_test.js`):
  ```javascript
  export const options = {
    stages: [
      { duration: '2m', target: 100 },   // Normal
      { duration: '5m', target: 500 },   // Peak
      { duration: '2m', target: 1000 },  // Stress
      { duration: '10m', target: 0 },    // Recovery
    ],
  }
  ```

- **Load Test Results**:
  ```markdown
  ## Breaking Point Analysis
  
  **100 users** (Normal Load):
  - p95: 87ms ✅
  - Error rate: 0.02% ✅
  - CPU: 45%, Memory: 2.1GB
  
  **500 users** (Peak Load):
  - p95: 156ms ✅
  - Error rate: 0.3% ✅
  - CPU: 78%, Memory: 4.2GB
  
  **1000 users** (Breaking Point):
  - p95: 2340ms ❌
  - Error rate: 12% ❌
  - CPU: 95%, Memory: 7.8GB
  - Connection pool exhausted
  
  **Recommendation**: Max capacity ~500 concurrent users
  **Recovery Time**: 2m15s after load removed ✅
  ```

- **Spike Test** (viral scenario):
  ```
  100 users → 1400 users in 10s
  Result: 503 errors (graceful), no crashes ✅
  ```

**Timeline**: 2-3 hours

### 3. Contract Testing with Pact

**When to use:**
- API versioning
- Preventing breaking changes
- Consumer-driven contract testing
- CI/CD integration

**Example:**
```bash
/api-test Set up Pact contract testing between mobile app (consumer) and product API (provider):
- Define contracts for GET /api/products, POST /api/orders
- Generate pact files from consumer tests
- Verify provider implements contracts
- Integrate with CI/CD to prevent breaking changes
```

**What you'll get:**
- **Consumer Contract Test** (`test/pact/product_api_consumer_test.exs`):
  ```elixir
  test "returns list of products", %{pact: pact} do
    interaction = %{
      description: "a request for products",
      with_request: %{
        method: :get,
        path: "/api/products",
      },
      will_respond_with: %{
        status: 200,
        body: %{
          data: Pact.like([
            %{
              id: Pact.uuid(),
              name: Pact.like("Widget"),
              price_cents: Pact.like(1999),
            }
          ])
        }
      }
    }
    
    Pact.put_interaction(pact, interaction)
    # Make request and verify...
  end
  ```

- **Provider Verification Test**:
  ```elixir
  test "verify pact with mobile_app consumer" do
    opts = [
      pact_urls: ["./pacts/mobile_app-product_api.json"],
      provider_base_url: "http://localhost:4000",
    ]
    assert Pact.verify_pacts(opts) == :ok
  end
  ```

- **Generated Pact Contract** (`pacts/mobile_app-product_api.json`)
- **CI/CD Integration** (GitHub Actions workflow)
- **Backward Compatibility Tests**

**Timeline**: 4-5 hours

### 4. OpenAPI/Swagger Contract Validation with Dredd

**When to use:**
- Validating API matches spec
- Documenting API changes
- Ensuring spec accuracy
- Preventing spec drift

**Example:**
```bash
/api-test Validate API implementation against OpenAPI spec with Dredd:
- Use existing priv/static/openapi.yml
- Test all documented endpoints
- Verify request/response schemas match
- Generate validation report
```

**What you'll get:**
- **Dredd Configuration** (`dredd.yml`):
  ```yaml
  language: nodejs
  server: mix phx.server
  server-wait: 3
  blueprint: priv/static/openapi.yml
  endpoint: 'http://localhost:4000'
  ```

- **Dredd Hooks** (`dredd_hooks.js`):
  ```javascript
  hooks.beforeAll((transactions, done) => {
    db.migrate().then(() => db.seed()).then(done)
  })
  
  hooks.beforeEach((transaction, done) => {
    transaction.request.headers['Authorization'] = 'Bearer test_token'
    done()
  })
  ```

- **Contract Validation Report**:
  ```
  Dredd Contract Tests
  ✓ GET /api/products → 200 OK
  ✓ GET /api/products/:id → 200 OK
  ✓ POST /api/orders → 201 Created
  ✓ POST /api/orders → 422 Validation Error
  
  47 tests, 47 passing, 0 failures ✅
  API matches OpenAPI specification perfectly
  ```

**Timeline**: 2-3 hours

### 5. Integration Testing - Complete Workflows

**When to use:**
- Testing user journeys
- Validating business workflows
- Testing webhook delivery
- Verifying background jobs

**Example:**
```bash
/api-test Create integration test for complete order workflow:
1. User browses products (GET /api/products)
2. Adds items to cart (POST /api/cart/items)
3. Views cart (GET /api/cart)
4. Checks out (POST /api/orders)
5. Verify webhook fired, inventory updated, email queued
```

**What you'll get:**
- **Integration Test** (`test/integration/order_workflow_test.exs`):
  ```elixir
  @moduletag :integration
  
  test "user can browse, add to cart, and checkout", %{conn: conn} do
    # Setup
    user = insert(:user)
    product = insert(:product, price_cents: 1999)
    conn = authenticate(conn, user)
    
    # Step 1: Browse products
    conn = get(conn, ~p"/api/products")
    assert %{"data" => products} = json_response(conn, 200)
    
    # Step 2: Add to cart
    conn = post(conn, ~p"/api/cart/items", %{
      product_id: product.id, quantity: 2
    })
    assert json_response(conn, 201)
    
    # Step 3: Checkout
    conn = post(conn, ~p"/api/orders", %{
      payment_method_id: "pm_test"
    })
    assert %{"data" => %{"id" => order_id}} = json_response(conn, 201)
    
    # Verify background jobs enqueued
    assert_enqueued(worker: SendOrderConfirmationWorker)
    assert_enqueued(worker: UpdateInventoryWorker)
  end
  ```

- **Webhook Delivery Tests**:
  ```elixir
  test "delivers webhook on order creation" do
    HTTPClientMock
    |> expect(:post, fn url, body, headers ->
      assert url == "https://webhook.example.com/orders"
      assert Jason.decode!(body)["event"] == "order.created"
      {:ok, %{status_code: 200}}
    end)
    
    {:ok, order} = Orders.create_order(%{...})
    assert_enqueued(worker: WebhookDeliveryWorker)
  end
  ```

- **Rate Limiting Tests**:
  ```elixir
  test "enforces 100 requests per minute per user" do
    # Make 100 requests (should succeed)
    # 101st request should return 429
    assert conn.status == 429
  end
  ```

**Timeline**: 4-5 hours

### 6. Chaos Engineering - Resilience Testing

**When to use:**
- Testing failure scenarios
- Validating circuit breakers
- Testing graceful degradation
- Ensuring fault tolerance

**Example:**
```bash
/api-test Run chaos tests to validate system resilience:
- Simulate database connection failure
- Test payment API timeout and retry logic
- Validate circuit breaker opens after 5 failures
- Test cache failure graceful degradation
- Ensure proper error propagation with request IDs
```

**What you'll get:**
- **Database Failure Test**:
  ```elixir
  test "API returns 503 when database unavailable" do
    :sys.suspend(MyApp.Repo)
    
    conn = get(build_conn(), ~p"/api/products")
    assert %{"error" => %{"code" => "service_unavailable"}} = 
      json_response(conn, 503)
    
    :sys.resume(MyApp.Repo)
  end
  ```

- **Circuit Breaker Test**:
  ```elixir
  test "circuit breaker opens after threshold failures" do
    # Simulate 5 failures
    Enum.each(1..5, fn _ ->
      assert {:error, _} = ExternalAPI.call()
    end)
    
    # Circuit should be open
    assert {:error, :circuit_open} = ExternalAPI.call()
  end
  ```

- **Graceful Degradation Test**:
  ```elixir
  test "search degrades to SQL when Elasticsearch down" do
    ElasticsearchMock
    |> expect(:search, fn _ -> {:error, :unavailable} end)
    
    conn = get(build_conn(), ~p"/api/search?q=widget")
    
    # Still returns results (SQL fallback)
    assert %{"data" => results} = json_response(conn, 200)
    assert %{"meta" => %{"search_method" => "sql_fallback"}}
  end
  ```

- **Chaos Report**:
  ```markdown
  ## Resilience Test Results
  
  ✅ Database failure → 503 (not 500)
  ✅ Circuit breaker opens after 5 failures
  ✅ Recovery time: 2m15s
  ✅ Graceful degradation working
  ✅ Error propagation includes request IDs
  ```

**Timeline**: 3-4 hours

### 7. Monitoring and Observability Setup

**When to use:**
- Production deployment preparation
- Setting up performance dashboards
- Configuring alerts
- Establishing SLI/SLO targets

**Example:**
```bash
/api-test Set up comprehensive API monitoring:
- Export Prometheus metrics (RPS, latency, errors)
- Create Grafana dashboard
- Configure alerts (error rate, latency, pool exhaustion)
- Define SLI/SLO targets (99.9% uptime, p95 < 100ms)
- Set up synthetic monitoring (health checks every 60s)
```

**What you'll get:**
- **Telemetry Configuration**:
  ```elixir
  # lib/my_app_web/telemetry.ex
  def metrics do
    [
      summary("phoenix.endpoint.stop.duration",
        unit: {:native, :millisecond},
        tags: [:method, :route]
      ),
      counter("my_app.orders.created"),
      distribution("my_app.orders.value", buckets: [1000, 5000, 10000]),
    ]
  end
  ```

- **Grafana Dashboard** (JSON config):
  - Request Rate (RPS) panel
  - Response Time (p50, p95, p99) panel
  - Error Rate panel with alerts
  - Database Query Time panel
  - Oban Queue Depth panel

- **Alert Rules** (`alerts.yml`):
  ```yaml
  - alert: HighErrorRate
    expr: rate(errors[5m]) > 0.01
    for: 5m
    annotations:
      summary: "Error rate exceeded 1% threshold"
  
  - alert: HighLatency
    expr: histogram_quantile(0.95, http_duration) > 100
    for: 5m
  ```

- **SLI/SLO Definitions**:
  ```yaml
  slos:
    - name: api_availability
      target: 0.999  # 99.9%
      sli: "success_count / total_count"
    
    - name: api_latency
      target: 0.95  # 95% < 100ms
      sli: "requests_under_100ms / total_requests"
  ```

- **Synthetic Monitoring**:
  ```yaml
  monitoring:
    - name: api_health_check
      url: https://api.chronodrip.com/health
      interval: 60s
      expected_status: 200
  ```

**Timeline**: 4-5 hours

### 8. Realistic User Journey Simulation

**When to use:**
- Production load simulation
- Testing real user behavior
- Capacity planning
- Performance validation

**Example:**
```bash
/api-test Create realistic user journey k6 test:
- 70% browse → view → exit
- 20% browse → view → add to cart → exit
- 10% browse → view → add to cart → checkout
- Random think time (2-10s between actions)
- Run with 200 concurrent users for 10 minutes
```

**What you'll get:**
- **User Journey Script** (`load_tests/user_journey.js`):
  ```javascript
  export default function () {
    // Browse products
    http.get('http://localhost:4000/api/products')
    sleep(randomIntBetween(2, 5))
    
    // View product
    http.get(`http://localhost:4000/api/products/${productId}`)
    sleep(randomIntBetween(5, 10))
    
    // 70% add to cart
    if (Math.random() < 0.7) {
      http.post('http://localhost:4000/api/cart/items', ...)
      sleep(2)
      
      // 30% checkout
      if (Math.random() < 0.3) {
        http.post('http://localhost:4000/api/orders', ...)
      }
    }
  }
  ```

- **Conversion Funnel Analysis**:
  ```
  200 users → 140 add to cart → 42 checkout
  Conversion rate: 21% ✅
  ```

**Timeline**: 2-3 hours

## What You'll Get

Every API test engagement includes:

### 1. **Performance Test Suite**
   - k6/JMeter/Gatling scripts
   - Response time validation (p50, p95, p99)
   - Throughput measurement (RPS)
   - N+1 query identification and fixes
   - Benchee micro-benchmarks

### 2. **Load Test Reports**
   - Normal load validation
   - Peak load capacity
   - Breaking point analysis
   - Spike test results
   - Recovery time measurement

### 3. **Contract Tests**
   - Pact consumer/provider tests
   - Dredd OpenAPI validation
   - Backward compatibility tests
   - CI/CD integration

### 4. **Integration Tests**
   - Complete workflow validation
   - Webhook delivery tests
   - Rate limiting verification
   - Authentication flow tests
   - Background job validation

### 5. **Chaos Tests**
   - Database failure handling
   - Circuit breaker validation
   - Graceful degradation tests
   - Error propagation verification

### 6. **Monitoring Setup**
   - Prometheus metrics export
   - Grafana dashboards
   - Alert configurations
   - SLI/SLO definitions
   - Synthetic monitoring

### 7. **Neo4j Knowledge Graph**
   - Performance benchmarks stored
   - Bottleneck patterns cataloged
   - Optimization strategies documented
   - SLO compliance tracked

## Related Commands

- `/qa-engineer` - Comprehensive test strategy including API testing
- `/elixir-wallaby` - E2E testing with browser automation
- `/accessibility-audit` - Accessibility testing
- `/api-test-2` - Playwright API mocking and network interception

## Key Capabilities

This command leverages the api-tester agent, which provides:

- **Performance Testing**: k6, JMeter, Gatling for response time profiling
- **Load Testing**: Stress, spike, soak tests to find breaking points
- **Contract Testing**: Pact (consumer-driven), Dredd (OpenAPI validation)
- **Integration Testing**: Workflow validation, webhook testing, rate limiting
- **Chaos Engineering**: Failure simulation, circuit breakers, graceful degradation
- **Monitoring**: Prometheus, Grafana, alerting, SLI/SLO tracking
- **Neo4j Integration**: Performance benchmarks, bottleneck patterns, trend analysis

## Tips for Best Results

1. **Provide Endpoints**: List specific API endpoints or point to OpenAPI spec
2. **Define Budgets**: Specify performance targets (e.g., "p95 < 100ms")
3. **Mention Load**: Expected concurrent users, requests per second
4. **Include SLAs**: Uptime requirements, error rate thresholds
5. **Specify Tools**: Preference for k6 vs JMeter vs Gatling
6. **Share Context**: Current performance issues, bottlenecks, concerns

## Technical Details

**Powered by:** `.opencode/agent/testing/api-tester.md`  
**MCP Servers:** context7 (k6, Pact docs), neo4j (pattern storage), sequential-thinking (analysis), supabase (true)  
**Knowledge Graph:** Stores performance benchmarks, bottleneck patterns, load test results, SLO compliance

---

**Note:** This command specializes in API performance, load, and contract testing. For browser-based API mocking use `/api-test-2`, for E2E testing use `/elixir-wallaby`, and for comprehensive test strategy use `/qa-engineer`.

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
