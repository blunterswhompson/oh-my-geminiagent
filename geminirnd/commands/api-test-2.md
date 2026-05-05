---
description: Playwright API mocking, HAR replay, MSW integration, and network interception for isolated testing
agent: testing/api-tester-2
subtask: true
---

# API Testing - Mocking & Network Interception

Specialized API testing with Playwright Route API for request interception, HAR file recording and replay, Mock Service Worker (MSW) integration, GraphQL mocking, and network performance measurement for isolated, reliable tests.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather relevant context:

**Current Testing Setup:**
```bash
!`find test -name '*mock*' -o -name '*msw*' -o -name '*.har' 2>/dev/null | head -10`
!`grep -r 'playwright\|msw\|graphql' package.json test/ 2>/dev/null | head -10`
!`cat playwright.config.ts 2>/dev/null | head -20`
```

**API Structure:**
```bash
!`find . -name 'openapi.yml' -o -name 'swagger.json' -o -name 'schema.graphql' 2>/dev/null`
!`grep -r 'fetch\|axios\|Req' assets/js lib/*_web 2>/dev/null | head -20`
```

**Localhost Status:**
```bash
!`curl -s http://localhost:4000/api/health || echo "Server not running"`
!`curl -s http://localhost:4000/graphql -H "Content-Type: application/json" --data '{"query":"{__schema{types{name}}}"}' 2>/dev/null | head -5`
```

## Usage Examples

### 1. Playwright Route API - Request Interception

**When to use:**
- Mocking external API dependencies
- Testing different response scenarios
- Simulating network errors
- Isolating frontend from backend

**Example:**
```bash
/api-test-2 Set up Playwright route mocking for product API:
- Mock GET /api/products (return 3 test products)
- Mock GET /api/products/:id (return specific product or 404)
- Mock POST /api/orders (return success or validation error)
- Test frontend handles success, loading, and error states
- Verify correct headers sent (Authorization, Content-Type)
```

**What you'll get:**
- **Playwright Route Mock Test** (`test/mocks/product_api.spec.js`):
  ```javascript
  import { test, expect } from '@playwright/test'
  
  test.describe('Product API Mocking', () => {
    test('mocks product listing endpoint', async ({ page }) => {
      // Intercept and mock API response
      await page.route('**/api/products', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              { id: 1, name: 'Widget A', price_cents: 1999 },
              { id: 2, name: 'Widget B', price_cents: 2999 },
              { id: 3, name: 'Widget C', price_cents: 3999 },
            ],
            meta: { total: 3, page: 1 }
          })
        })
      })
      
      await page.goto('http://localhost:4000/products')
      
      // Verify UI renders mocked data
      await expect(page.getByText('Widget A')).toBeVisible()
      await expect(page.getByText('$19.99')).toBeVisible()
    })
    
    test('mocks 404 for non-existent product', async ({ page }) => {
      await page.route('**/api/products/999', async (route) => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            error: { message: 'Product not found', code: 'not_found' }
          })
        })
      })
      
      await page.goto('http://localhost:4000/products/999')
      
      // Verify error state displayed
      await expect(page.getByText('Product not found')).toBeVisible()
    })
    
    test('verifies request headers', async ({ page }) => {
      await page.route('**/api/orders', async (route) => {
        const request = route.request()
        
        // Verify headers
        expect(request.headers()['content-type']).toBe('application/json')
        expect(request.headers()['authorization']).toContain('Bearer')
        
        // Verify request body
        const body = JSON.parse(request.postData())
        expect(body.product_id).toBeDefined()
        
        await route.fulfill({
          status: 201,
          body: JSON.stringify({ data: { id: 123, status: 'pending' } })
        })
      })
      
      await page.goto('http://localhost:4000/products/1')
      await page.getByRole('button', { name: 'Order Now' }).click()
      
      await expect(page.getByText('Order #123 confirmed')).toBeVisible()
    })
  })
  ```

- **Network Error Simulation**:
  ```javascript
  test('handles network timeout gracefully', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      // Simulate network error
      await route.abort('timedout')
    })
    
    await page.goto('http://localhost:4000/products')
    
    // Verify error UI displayed
    await expect(page.getByText('Connection timeout')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible()
  })
  
  test('simulates 500 server error', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      })
    })
    
    await page.goto('http://localhost:4000/products')
    await expect(page.getByText('Something went wrong')).toBeVisible()
  })
  ```

- **Request Modification**:
  ```javascript
  test('modifies outgoing request headers', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      // Add custom header to all API requests
      const headers = {
        ...route.request().headers(),
        'X-Client-Version': '2.1.0',
        'X-Request-Id': crypto.randomUUID()
      }
      
      await route.continue({ headers })
    })
    
    await page.goto('http://localhost:4000/products')
    // Request now includes custom headers
  })
  ```

**Timeline**: 3-4 hours

### 2. HAR File Recording and Replay

**When to use:**
- Recording real API responses for offline testing
- Capturing production-like traffic patterns
- Creating regression test fixtures
- Testing without hitting live APIs

**Example:**
```bash
/api-test-2 Record HAR file for product checkout workflow:
- Start on product listing page
- Browse to product detail
- Add to cart
- Complete checkout
- Save all API requests/responses as checkout.har
- Create test that replays HAR file for fast, offline testing
```

**What you'll get:**
- **HAR Recording Script** (`scripts/record_har.js`):
  ```javascript
  import { chromium } from 'playwright'
  
  async function recordHAR() {
    const browser = await chromium.launch()
    const context = await browser.newContext({
      recordHar: { path: 'test/fixtures/checkout.har' }
    })
    
    const page = await context.newPage()
    
    // Perform user flow
    await page.goto('http://localhost:4000/products')
    await page.getByText('Widget A').click()
    await page.getByRole('button', { name: 'Add to Cart' }).click()
    await page.goto('http://localhost:4000/checkout')
    await page.fill('#email', 'test@example.com')
    await page.getByRole('button', { name: 'Complete Order' }).click()
    
    // Wait for order confirmation
    await page.waitForURL('**/orders/*')
    
    // Close to save HAR
    await context.close()
    await browser.close()
    
    console.log('HAR file saved to test/fixtures/checkout.har')
  }
  
  recordHAR()
  ```

- **HAR Replay Test** (`test/har/checkout_replay.spec.js`):
  ```javascript
  import { test, expect } from '@playwright/test'
  
  test('replays checkout flow from HAR file', async ({ browser }) => {
    // Create context with HAR replay
    const context = await browser.newContext({
      recordHar: {
        path: 'test/fixtures/checkout.har',
        mode: 'minimal' // Only replay recorded requests
      }
    })
    
    const page = await context.newPage()
    
    // Replay entire flow without hitting real API
    await page.goto('http://localhost:4000/products')
    
    // All API requests served from HAR file
    await expect(page.getByText('Widget A')).toBeVisible()
    
    await page.getByText('Widget A').click()
    await expect(page.getByText('$19.99')).toBeVisible()
    
    await page.getByRole('button', { name: 'Add to Cart' }).click()
    await expect(page.getByText('Added to cart')).toBeVisible()
    
    await context.close()
  })
  ```

- **HAR File Editing** (for custom scenarios):
  ```javascript
  import fs from 'fs'
  
  // Load and modify HAR file
  const har = JSON.parse(fs.readFileSync('test/fixtures/checkout.har'))
  
  // Find specific entry and modify response
  const productEntry = har.log.entries.find(e => 
    e.request.url.includes('/api/products/1')
  )
  
  if (productEntry) {
    const response = JSON.parse(productEntry.response.content.text)
    response.data.price_cents = 999 // Change price
    productEntry.response.content.text = JSON.stringify(response)
  }
  
  // Save modified HAR
  fs.writeFileSync('test/fixtures/checkout_sale.har', JSON.stringify(har))
  ```

- **npm Scripts**:
  ```json
  {
    "scripts": {
      "record:har": "node scripts/record_har.js",
      "test:har": "playwright test test/har"
    }
  }
  ```

**Timeline**: 2-3 hours

### 3. Mock Service Worker (MSW) Integration

**When to use:**
- Consistent mocking across Playwright and unit tests
- Sharing mocks between browser and Node.js tests
- Complex API mocking with request handlers
- Simulating realistic API behavior

**Example:**
```bash
/api-test-2 Set up MSW for product and order APIs:
- Install and configure MSW for browser and Node.js
- Create handlers for /api/products, /api/orders, /api/cart
- Support success, error, and loading states
- Integrate with Playwright and Jest tests
- Document mock data factory patterns
```

**What you'll get:**
- **MSW Setup** (`test/mocks/handlers.js`):
  ```javascript
  import { http, HttpResponse } from 'msw'
  
  export const handlers = [
    // GET /api/products
    http.get('/api/products', ({ request }) => {
      const url = new URL(request.url)
      const page = url.searchParams.get('page') || 1
      
      return HttpResponse.json({
        data: [
          { id: 1, name: 'Widget A', price_cents: 1999, stock: 10 },
          { id: 2, name: 'Widget B', price_cents: 2999, stock: 5 },
          { id: 3, name: 'Widget C', price_cents: 3999, stock: 0 },
        ],
        meta: { total: 3, page: parseInt(page), per_page: 10 }
      })
    }),
    
    // GET /api/products/:id
    http.get('/api/products/:id', ({ params }) => {
      const { id } = params
      const products = {
        '1': { id: 1, name: 'Widget A', price_cents: 1999, stock: 10 },
        '2': { id: 2, name: 'Widget B', price_cents: 2999, stock: 5 },
      }
      
      const product = products[id]
      
      if (!product) {
        return new HttpResponse(null, {
          status: 404,
          statusText: 'Not Found'
        })
      }
      
      return HttpResponse.json({ data: product })
    }),
    
    // POST /api/orders
    http.post('/api/orders', async ({ request }) => {
      const body = await request.json()
      
      // Validate request
      if (!body.product_id || !body.quantity) {
        return HttpResponse.json(
          { error: { message: 'Missing required fields' } },
          { status: 422 }
        )
      }
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return HttpResponse.json({
        data: {
          id: Math.floor(Math.random() * 10000),
          product_id: body.product_id,
          quantity: body.quantity,
          status: 'pending',
          total_cents: 1999 * body.quantity
        }
      }, { status: 201 })
    }),
    
    // Simulated network error
    http.get('/api/unstable', () => {
      return HttpResponse.error()
    })
  ]
  ```

- **MSW Server Setup** (`test/mocks/server.js`):
  ```javascript
  import { setupServer } from 'msw/node'
  import { handlers } from './handlers'
  
  export const server = setupServer(...handlers)
  
  // Jest/Vitest integration
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
  ```

- **Playwright Integration** (`test/msw/products.spec.js`):
  ```javascript
  import { test, expect } from '@playwright/test'
  import { setupWorker } from 'msw/browser'
  import { handlers } from '../mocks/handlers'
  
  test.beforeEach(async ({ context }) => {
    // Inject MSW worker into browser context
    await context.addInitScript(() => {
      window.msw = {
        worker: setupWorker(...handlers),
        start: () => window.msw.worker.start()
      }
    })
  })
  
  test('uses MSW to mock product API', async ({ page }) => {
    // Start MSW worker
    await page.evaluate(() => window.msw.start())
    
    await page.goto('http://localhost:4000/products')
    
    // MSW intercepts and mocks the API call
    await expect(page.getByText('Widget A')).toBeVisible()
    await expect(page.getByText('$19.99')).toBeVisible()
  })
  
  test('overrides handler for specific test', async ({ page }) => {
    await page.evaluate(() => {
      // Override specific handler
      window.msw.worker.use(
        http.get('/api/products', () => {
          return HttpResponse.json({ data: [] }) // Empty state
        })
      )
      window.msw.start()
    })
    
    await page.goto('http://localhost:4000/products')
    await expect(page.getByText('No products available')).toBeVisible()
  })
  ```

- **Mock Data Factories** (`test/mocks/factories.js`):
  ```javascript
  import { faker } from '@faker-js/faker'
  
  export const createProduct = (overrides = {}) => ({
    id: faker.number.int({ min: 1, max: 10000 }),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price_cents: faker.number.int({ min: 999, max: 99999 }),
    stock: faker.number.int({ min: 0, max: 100 }),
    created_at: faker.date.past().toISOString(),
    ...overrides
  })
  
  export const createOrder = (overrides = {}) => ({
    id: faker.number.int({ min: 1000, max: 99999 }),
    user_id: faker.number.int({ min: 1, max: 1000 }),
    total_cents: faker.number.int({ min: 1000, max: 100000 }),
    status: faker.helpers.arrayElement(['pending', 'confirmed', 'shipped']),
    created_at: faker.date.recent().toISOString(),
    ...overrides
  })
  ```

**Timeline**: 4-5 hours

### 4. GraphQL Query and Mutation Mocking

**When to use:**
- Testing GraphQL API integration
- Mocking GraphQL mutations and queries
- Validating type-safe GraphQL responses
- Testing error handling and edge cases

**Example:**
```bash
/api-test-2 Mock GraphQL API for product catalog:
- Mock query getProducts (with pagination)
- Mock query getProduct (by ID)
- Mock mutation createOrder (success and validation errors)
- Validate type-safe responses match schema
- Test GraphQL error states (network, validation, not found)
```

**What you'll get:**
- **GraphQL MSW Handlers** (`test/mocks/graphql_handlers.js`):
  ```javascript
  import { graphql, HttpResponse } from 'msw'
  
  export const graphqlHandlers = [
    // Query: getProducts
    graphql.query('GetProducts', ({ query, variables }) => {
      const { limit = 10, offset = 0 } = variables
      
      return HttpResponse.json({
        data: {
          products: [
            {
              id: '1',
              name: 'Widget A',
              price: 1999,
              __typename: 'Product'
            },
            {
              id: '2',
              name: 'Widget B',
              price: 2999,
              __typename: 'Product'
            }
          ],
          productsConnection: {
            totalCount: 2,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false
            }
          }
        }
      })
    }),
    
    // Query: getProduct
    graphql.query('GetProduct', ({ variables }) => {
      const { id } = variables
      
      if (id === '999') {
        // Not found scenario
        return HttpResponse.json({
          errors: [
            {
              message: 'Product not found',
              extensions: { code: 'NOT_FOUND' }
            }
          ]
        })
      }
      
      return HttpResponse.json({
        data: {
          product: {
            id,
            name: 'Widget A',
            description: 'A high-quality widget',
            price: 1999,
            stock: 10,
            __typename: 'Product'
          }
        }
      })
    }),
    
    // Mutation: createOrder
    graphql.mutation('CreateOrder', async ({ variables }) => {
      const { input } = variables
      
      // Validation error
      if (!input.productId || !input.quantity) {
        return HttpResponse.json({
          errors: [
            {
              message: 'Validation failed',
              extensions: {
                code: 'BAD_USER_INPUT',
                validationErrors: {
                  productId: input.productId ? null : 'Product ID required',
                  quantity: input.quantity ? null : 'Quantity required'
                }
              }
            }
          ]
        })
      }
      
      // Success
      return HttpResponse.json({
        data: {
          createOrder: {
            id: '12345',
            productId: input.productId,
            quantity: input.quantity,
            status: 'PENDING',
            totalCents: 1999 * input.quantity,
            __typename: 'Order'
          }
        }
      })
    })
  ]
  ```

- **Playwright GraphQL Test** (`test/graphql/product_queries.spec.js`):
  ```javascript
  import { test, expect } from '@playwright/test'
  import { graphql } from 'msw'
  
  test.describe('GraphQL Product Queries', () => {
    test('queries product list successfully', async ({ page }) => {
      await page.route('**/graphql', async (route) => {
        const request = route.request()
        const body = JSON.parse(request.postData())
        
        if (body.query.includes('GetProducts')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                products: [
                  { id: '1', name: 'Widget A', price: 1999 }
                ]
              }
            })
          })
        }
      })
      
      await page.goto('http://localhost:4000/products')
      await expect(page.getByText('Widget A')).toBeVisible()
    })
    
    test('handles GraphQL errors gracefully', async ({ page }) => {
      await page.route('**/graphql', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            errors: [
              {
                message: 'Product not found',
                extensions: { code: 'NOT_FOUND' }
              }
            ]
          })
        })
      })
      
      await page.goto('http://localhost:4000/products/999')
      await expect(page.getByText('Product not found')).toBeVisible()
    })
    
    test('validates mutation input', async ({ page }) => {
      await page.route('**/graphql', async (route) => {
        const body = JSON.parse(route.request().postData())
        
        if (body.query.includes('createOrder')) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              errors: [
                {
                  message: 'Validation failed',
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    validationErrors: {
                      quantity: 'Quantity must be greater than 0'
                    }
                  }
                }
              ]
            })
          })
        }
      })
      
      await page.goto('http://localhost:4000/products/1')
      await page.fill('#quantity', '0')
      await page.getByRole('button', { name: 'Order' }).click()
      
      await expect(page.getByText('Quantity must be greater than 0')).toBeVisible()
    })
  })
  ```

- **Type-Safe GraphQL Client** (generated types):
  ```typescript
  // generated/graphql.ts (from codegen)
  export type GetProductsQuery = {
    products: Array<{
      id: string
      name: string
      price: number
      __typename: 'Product'
    }>
  }
  
  export type CreateOrderMutation = {
    createOrder: {
      id: string
      status: OrderStatus
      totalCents: number
    }
  }
  ```

**Timeline**: 3-4 hours

### 5. API Response Schema Validation

**When to use:**
- Validating API contracts
- Ensuring type safety
- Preventing schema drift
- Testing API versioning

**Example:**
```bash
/api-test-2 Validate API responses against JSON schemas:
- Load OpenAPI spec from priv/static/openapi.yml
- Generate JSON schemas for all endpoints
- Test that actual responses match schemas
- Fail tests on schema violations
- Generate schema validation report
```

**What you'll get:**
- **Schema Validation Test** (`test/schema/api_contracts.spec.js`):
  ```javascript
  import { test, expect } from '@playwright/test'
  import Ajv from 'ajv'
  import addFormats from 'ajv-formats'
  import fs from 'fs'
  import yaml from 'js-yaml'
  
  const ajv = new Ajv({ allErrors: true })
  addFormats(ajv)
  
  // Load OpenAPI spec
  const openapi = yaml.load(
    fs.readFileSync('priv/static/openapi.yml', 'utf8')
  )
  
  test.describe('API Schema Validation', () => {
    test('GET /api/products matches schema', async ({ request }) => {
      const response = await request.get('http://localhost:4000/api/products')
      const data = await response.json()
      
      // Extract schema from OpenAPI spec
      const schema = openapi.paths['/api/products'].get.responses['200']
        .content['application/json'].schema
      
      // Validate response
      const validate = ajv.compile(schema)
      const valid = validate(data)
      
      if (!valid) {
        console.log('Validation errors:', validate.errors)
      }
      
      expect(valid).toBe(true)
    })
    
    test('POST /api/orders validates input and output', async ({ request }) => {
      const orderData = {
        product_id: 1,
        quantity: 2,
        shipping_address: {
          street: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip: '97201'
        }
      }
      
      const response = await request.post('http://localhost:4000/api/orders', {
        data: orderData
      })
      
      const data = await response.json()
      
      // Validate response schema
      const schema = openapi.paths['/api/orders'].post.responses['201']
        .content['application/json'].schema
      
      const validate = ajv.compile(schema)
      expect(validate(data)).toBe(true)
    })
    
    test('error responses match error schema', async ({ request }) => {
      const response = await request.get('http://localhost:4000/api/products/999')
      const data = await response.json()
      
      // All errors should follow consistent schema
      const errorSchema = {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['message', 'code'],
            properties: {
              message: { type: 'string' },
              code: { type: 'string' },
              details: { type: 'object' }
            }
          }
        }
      }
      
      const validate = ajv.compile(errorSchema)
      expect(validate(data)).toBe(true)
    })
  })
  ```

- **Schema Validation Report Generator**:
  ```javascript
  import { chromium } from 'playwright'
  import Ajv from 'ajv'
  
  async function validateAllEndpoints() {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    
    const results = []
    const ajv = new Ajv()
    
    const endpoints = [
      { method: 'GET', path: '/api/products' },
      { method: 'GET', path: '/api/products/1' },
      { method: 'POST', path: '/api/orders' },
      { method: 'GET', path: '/api/cart' }
    ]
    
    for (const endpoint of endpoints) {
      const response = await page.request[endpoint.method.toLowerCase()](
        `http://localhost:4000${endpoint.path}`
      )
      
      const data = await response.json()
      const schema = getSchemaForEndpoint(endpoint)
      const validate = ajv.compile(schema)
      const valid = validate(data)
      
      results.push({
        endpoint: `${endpoint.method} ${endpoint.path}`,
        status: response.status(),
        valid,
        errors: validate.errors
      })
    }
    
    await browser.close()
    
    // Generate report
    console.log('API Schema Validation Report')
    console.log('============================')
    results.forEach(r => {
      const status = r.valid ? '✅' : '❌'
      console.log(`${status} ${r.endpoint} (${r.status})`)
      if (!r.valid) {
        console.log('  Errors:', r.errors)
      }
    })
  }
  ```

**Timeline**: 3-4 hours

### 6. Network Performance Measurement

**When to use:**
- Tracking API response times
- Identifying slow endpoints
- Performance regression testing
- SLO compliance monitoring

**Example:**
```bash
/api-test-2 Measure and track API performance metrics:
- Capture timing for all API requests
- Measure DNS lookup, connection, TLS handshake, response times
- Identify requests exceeding 200ms budget
- Generate performance report with p50, p95, p99
- Fail tests if p95 > 500ms
```

**What you'll get:**
- **Performance Measurement Test** (`test/performance/api_timing.spec.js`):
  ```javascript
  import { test, expect } from '@playwright/test'
  
  test.describe('API Performance Metrics', () => {
    const timings = []
    
    test.beforeEach(async ({ page }) => {
      // Capture all API request timings
      page.on('response', async (response) => {
        if (response.url().includes('/api/')) {
          const timing = response.timing()
          timings.push({
            url: response.url(),
            status: response.status(),
            responseTime: timing.responseEnd - timing.requestStart,
            dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
            connectTime: timing.connectEnd - timing.connectStart,
            tlsTime: timing.secureConnectionStart 
              ? timing.connectEnd - timing.secureConnectionStart 
              : 0,
            ttfb: timing.responseStart - timing.requestStart, // Time to first byte
          })
        }
      })
    })
    
    test('measures product listing performance', async ({ page }) => {
      await page.goto('http://localhost:4000/products')
      
      // Find timing for products API
      const productTiming = timings.find(t => t.url.includes('/api/products'))
      
      expect(productTiming).toBeDefined()
      expect(productTiming.responseTime).toBeLessThan(500) // 500ms budget
      
      console.log('Performance metrics:', {
        responseTime: `${productTiming.responseTime}ms`,
        ttfb: `${productTiming.ttfb}ms`,
        dnsTime: `${productTiming.dnsTime}ms`,
        connectTime: `${productTiming.connectTime}ms`
      })
    })
    
    test.afterAll(() => {
      // Calculate percentiles
      const responseTimes = timings.map(t => t.responseTime).sort((a, b) => a - b)
      
      const percentile = (p) => {
        const index = Math.ceil((p / 100) * responseTimes.length) - 1
        return responseTimes[index]
      }
      
      const report = {
        totalRequests: timings.length,
        p50: percentile(50),
        p95: percentile(95),
        p99: percentile(99),
        slowest: responseTimes[responseTimes.length - 1],
        fastest: responseTimes[0]
      }
      
      console.log('API Performance Summary:')
      console.log(`  Total requests: ${report.totalRequests}`)
      console.log(`  p50: ${report.p50}ms`)
      console.log(`  p95: ${report.p95}ms`)
      console.log(`  p99: ${report.p99}ms`)
      
      // Fail if p95 exceeds budget
      expect(report.p95).toBeLessThan(500)
    })
  })
  ```

- **Performance Budget Configuration** (`playwright.config.ts`):
  ```typescript
  export default defineConfig({
    use: {
      trace: 'on-first-retry',
      
      // Network throttling for realistic testing
      launchOptions: {
        slowMo: 0, // No artificial delay
      },
    },
    
    // Custom reporter for performance metrics
    reporter: [
      ['html'],
      ['./test/reporters/performance-reporter.js']
    ]
  })
  ```

- **Custom Performance Reporter** (`test/reporters/performance-reporter.js`):
  ```javascript
  class PerformanceReporter {
    constructor(options) {
      this.timings = []
    }
    
    onTestEnd(test, result) {
      // Extract performance data from test
      const perfData = result.attachments
        .filter(a => a.name === 'performance')
        .map(a => JSON.parse(a.body.toString()))
      
      this.timings.push(...perfData)
    }
    
    onEnd() {
      // Generate performance report
      const slowEndpoints = this.timings
        .filter(t => t.responseTime > 200)
        .sort((a, b) => b.responseTime - a.responseTime)
      
      if (slowEndpoints.length > 0) {
        console.log('\n⚠️  Slow API Endpoints (>200ms):')
        slowEndpoints.forEach(e => {
          console.log(`  ${e.url}: ${e.responseTime}ms`)
        })
      }
    }
  }
  
  module.exports = PerformanceReporter
  ```

**Timeline**: 2-3 hours

### 7. Dynamic Mock Data Generation

**When to use:**
- Generating realistic test data
- Testing with varying data sets
- Avoiding hardcoded fixtures
- Simulating production-like scenarios

**Example:**
```bash
/api-test-2 Set up dynamic mock data generation:
- Use Faker.js to generate realistic product data
- Create factory functions for products, orders, users
- Generate random but valid data for each test run
- Support seeded data for reproducible tests
- Document factory patterns
```

**What you'll get:**
- **Mock Data Factories** (`test/factories/index.js`):
  ```javascript
  import { faker } from '@faker-js/faker'
  
  // Seed for reproducible tests
  faker.seed(12345)
  
  export const createProduct = (overrides = {}) => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price_cents: faker.number.int({ min: 999, max: 99999 }),
    stock: faker.number.int({ min: 0, max: 100 }),
    category: faker.commerce.department(),
    image_url: faker.image.url(),
    created_at: faker.date.past().toISOString(),
    ...overrides
  })
  
  export const createOrder = (overrides = {}) => ({
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    product_ids: [faker.string.uuid(), faker.string.uuid()],
    total_cents: faker.number.int({ min: 1000, max: 100000 }),
    status: faker.helpers.arrayElement(['pending', 'confirmed', 'shipped', 'delivered']),
    shipping_address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zip: faker.location.zipCode()
    },
    created_at: faker.date.recent().toISOString(),
    ...overrides
  })
  
  export const createUser = (overrides = {}) => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    avatar_url: faker.image.avatar(),
    created_at: faker.date.past({ years: 2 }).toISOString(),
    ...overrides
  })
  
  // Generate batch data
  export const createProducts = (count = 10, overrides = {}) => {
    return Array.from({ length: count }, () => createProduct(overrides))
  }
  ```

- **Using Factories in Tests**:
  ```javascript
  import { test, expect } from '@playwright/test'
  import { createProducts, createOrder } from '../factories'
  
  test('displays dynamic product list', async ({ page }) => {
    const products = createProducts(5)
    
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: products })
      })
    })
    
    await page.goto('http://localhost:4000/products')
    
    // Verify first product rendered
    await expect(page.getByText(products[0].name)).toBeVisible()
  })
  
  test('handles order with specific characteristics', async ({ page }) => {
    // Create order with specific overrides
    const pendingOrder = createOrder({
      status: 'pending',
      total_cents: 5000
    })
    
    await page.route('**/api/orders/*', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: pendingOrder })
      })
    })
    
    await page.goto(`http://localhost:4000/orders/${pendingOrder.id}`)
    
    await expect(page.getByText('Status: Pending')).toBeVisible()
    await expect(page.getByText('$50.00')).toBeVisible()
  })
  ```

**Timeline**: 2 hours

### 8. Testing Error Scenarios

**When to use:**
- Validating error handling
- Testing edge cases
- Ensuring graceful degradation
- Verifying user-facing error messages

**Example:**
```bash
/api-test-2 Test comprehensive error scenarios:
- 400 Bad Request (invalid input)
- 401 Unauthorized (missing/invalid token)
- 403 Forbidden (insufficient permissions)
- 404 Not Found (resource doesn't exist)
- 422 Validation Error (invalid data)
- 500 Internal Server Error
- Network timeout and connection errors
- Verify user sees helpful error messages
```

**What you'll get:**
- **Error Scenario Tests** (`test/errors/api_errors.spec.js`):
  ```javascript
  import { test, expect } from '@playwright/test'
  
  test.describe('API Error Handling', () => {
    test('handles 400 Bad Request', async ({ page }) => {
      await page.route('**/api/orders', async (route) => {
        await route.fulfill({
          status: 400,
          body: JSON.stringify({
            error: {
              message: 'Invalid request format',
              code: 'bad_request'
            }
          })
        })
      })
      
      await page.goto('http://localhost:4000/products/1')
      await page.getByRole('button', { name: 'Order' }).click()
      
      await expect(page.getByText('Invalid request format')).toBeVisible()
    })
    
    test('handles 401 Unauthorized', async ({ page }) => {
      await page.route('**/api/cart', async (route) => {
        await route.fulfill({
          status: 401,
          body: JSON.stringify({
            error: {
              message: 'Authentication required',
              code: 'unauthorized'
            }
          })
        })
      })
      
      await page.goto('http://localhost:4000/cart')
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/)
      await expect(page.getByText('Please sign in to continue')).toBeVisible()
    })
    
    test('handles 422 Validation Error', async ({ page }) => {
      await page.route('**/api/orders', async (route) => {
        await route.fulfill({
          status: 422,
          body: JSON.stringify({
            error: {
              message: 'Validation failed',
              code: 'validation_error',
              details: {
                quantity: 'Must be greater than 0',
                shipping_address: 'Required field'
              }
            }
          })
        })
      })
      
      await page.goto('http://localhost:4000/checkout')
      await page.getByRole('button', { name: 'Place Order' }).click()
      
      // Verify field-specific errors displayed
      await expect(page.getByText('Must be greater than 0')).toBeVisible()
      await expect(page.getByText('Required field')).toBeVisible()
    })
    
    test('handles 500 Internal Server Error', async ({ page }) => {
      await page.route('**/api/products', async (route) => {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({
            error: {
              message: 'Internal server error',
              code: 'internal_error'
            }
          })
        })
      })
      
      await page.goto('http://localhost:4000/products')
      
      await expect(page.getByText('Something went wrong')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible()
    })
    
    test('handles network timeout', async ({ page }) => {
      await page.route('**/api/products', async (route) => {
        await route.abort('timedout')
      })
      
      await page.goto('http://localhost:4000/products')
      
      await expect(page.getByText('Connection timeout')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible()
    })
    
    test('retries failed requests', async ({ page }) => {
      let attempts = 0
      
      await page.route('**/api/products', async (route) => {
        attempts++
        
        if (attempts < 3) {
          // First 2 attempts fail
          await route.abort('failed')
        } else {
          // 3rd attempt succeeds
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [{ id: 1, name: 'Widget A', price_cents: 1999 }]
            })
          })
        }
      })
      
      await page.goto('http://localhost:4000/products')
      
      // After retries, should display data
      await expect(page.getByText('Widget A')).toBeVisible()
      expect(attempts).toBe(3) // Verify 3 attempts made
    })
  })
  ```

**Timeline**: 3 hours

## What You'll Get

Every API testing engagement includes:

### 1. **Request Interception Suite**
   - Playwright route() mocks for all API endpoints
   - Custom response scenarios (success, error, timeout)
   - Request header verification
   - Request body validation
   - Network error simulation

### 2. **HAR Recording & Replay**
   - Scripts to record real API traffic
   - HAR files for offline testing
   - HAR editing tools for custom scenarios
   - Fast, deterministic tests without live APIs

### 3. **MSW Integration**
   - Consistent mocks across browser and Node.js
   - Request handlers for all endpoints
   - Mock data factories with Faker.js
   - Playwright and Jest integration

### 4. **GraphQL Mocking**
   - Type-safe query and mutation mocks
   - Error scenario handling
   - Validation error testing
   - Response schema validation

### 5. **Schema Validation**
   - JSON Schema validation against OpenAPI spec
   - Contract testing for all endpoints
   - Schema drift detection
   - Validation error reports

### 6. **Performance Metrics**
   - Response time measurement (p50, p95, p99)
   - DNS, connection, TLS timing breakdown
   - Time to first byte (TTFB) tracking
   - Performance budget enforcement

### 7. **Error Testing Suite**
   - All HTTP error codes (400, 401, 403, 404, 422, 500)
   - Network errors (timeout, connection failure)
   - Retry logic validation
   - User-facing error message verification

### 8. **Neo4j Knowledge Graph**
   - API mock patterns stored for reuse
   - Performance metrics tracked over time
   - Error scenarios cataloged
   - Testing best practices documented

## Related Commands

- `/api-test` - Performance, load, and contract testing with k6/Pact
- `/qa-engineer` - Comprehensive test strategy
- `/elixir-wallaby` - E2E testing with Wallaby
- `/accessibility-audit` - WCAG compliance testing

## Key Capabilities

This command leverages the api-tester-2 agent, which provides:

- **Playwright Route API**: Request interception, response mocking, header modification
- **HAR Files**: Recording and replay for offline testing
- **MSW Integration**: Browser and Node.js mocking with shared handlers
- **GraphQL**: Type-safe mocking for queries and mutations
- **Schema Validation**: JSON Schema validation against OpenAPI specs
- **Performance**: Response time tracking and performance budgets
- **Error Testing**: Comprehensive error scenario coverage
- **Mock Factories**: Dynamic data generation with Faker.js

## Tips for Best Results

1. **Specify Endpoints**: List specific API endpoints or reference OpenAPI spec
2. **Share Examples**: Provide sample request/response payloads
3. **Define Scenarios**: Describe success, error, and edge case scenarios to test
4. **Mention Tech**: GraphQL vs REST, authentication type, framework used
5. **Performance Goals**: Response time budgets, SLO targets
6. **Error Cases**: Known error scenarios or edge cases to validate

## Technical Details

**Powered by:** `.opencode/agent/testing/api-tester-2.md`  
**MCP Servers:** context7 (Playwright/MSW docs), neo4j (pattern storage), sequential-thinking (analysis), playwright (browser automation), supabase (false)  
**Knowledge Graph:** Stores API mock patterns, performance metrics, error scenarios, and testing strategies

---

**Note:** This command specializes in API mocking and network interception with Playwright. For performance/load testing use `/api-test`, for E2E testing use `/elixir-wallaby`, and for comprehensive test strategy use `/qa-engineer`.

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
