---
description: Design and implement reliable backend systems with security, scalability, and data integrity
agent: core/backend-reliability-engineer
subtask: true
---

Evidence-based backend engineering for APIs, databases, distributed systems, security, and performance with Elixir/OTP patterns.

!`find lib -type f \( -name "*.ex" -o -name "*.exs" \) 2>/dev/null | head -20`
!`cat mix.exs 2>/dev/null | grep -E "(phoenix|ecto|oban|ash)" | head -10`
!`ls -la priv/repo/migrations/ 2>/dev/null | tail -10 || echo "No migrations found"`
!`cat config/config.exs 2>/dev/null | grep -E "(pool_size|timeout|queue)" | head -10`

## Overview

Systematic approach to building reliable backend systems prioritizing data integrity, security, and scalability. Operates with evidence-based methodology: research patterns, benchmark performance, validate security, and test failure scenarios.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

The commands above provide:
- Application structure and existing modules
- Dependencies (Phoenix, Ecto, Oban, Ash Framework)
- Database migrations and schema changes
- Configuration for connection pools and queues

## Usage Examples

### 1. API Design with Pagination and Filtering

Design RESTful API endpoints with proper pagination, filtering, rate limiting, and documentation:

```bash
# Ask the agent to design an API
@backend-reliability "Design a RESTful API for products with pagination, filtering by category, and sorting"
```

**What you'll get:**
- Phoenix controller with proper pagination (page, page_size)
- Query filtering and sorting implementation
- Rate limiting configuration
- OpenAPI documentation schema
- Proper HTTP status codes and error handling

### 2. Database Schema Optimization

Create optimized database schemas with proper indexes, relationships, and constraints:

```bash
@backend-reliability "Design a database schema for an e-commerce order system with proper indexes"
```

**What you'll get:**
- Normalized schema design with proper relationships
- Strategic indexes on foreign keys and filtered columns
- Composite indexes for common query patterns
- Unique constraints and check constraints
- Migration files with indexes

### 3. Implement Authentication and Authorization

Add JWT authentication and role-based access control:

```bash
@backend-reliability "Implement JWT authentication with refresh tokens and RBAC for admin/user roles"
```

**What you'll get:**
- Guardian setup for JWT tokens
- Authentication plug for protected routes
- Ash policies for role-based access control
- Token refresh mechanism
- Security headers configuration

### 4. Performance Optimization

Optimize database queries, eliminate N+1 queries, and implement caching:

```bash
@backend-reliability "Optimize the order listing endpoint - it's doing N+1 queries"
```

**What you'll get:**
- Analysis of current query patterns (EXPLAIN ANALYZE)
- Preloading strategy for associations
- Strategic caching with Cachex
- Connection pool tuning
- Performance metrics and benchmarks

### 5. Distributed System Design

Design for horizontal scaling with message queues and failure resilience:

```bash
@backend-reliability "Design async payment processing with Oban that handles retries and failures"
```

**What you'll get:**
- Oban worker with exponential backoff
- Circuit breaker for external API calls
- Idempotency key implementation
- Error handling and retry strategies
- Queue configuration tuning

### 6. Security Implementation

Add input validation, SQL injection prevention, and encryption:

```bash
@backend-reliability "Review security of user registration endpoint - add validation and encryption"
```

**What you'll get:**
- Input validation with Ash actions
- Parameterized queries (no SQL injection)
- Password hashing with Bcrypt
- Sensitive data encryption with Cloak
- Security headers configuration

### 7. Monitoring and Observability

Set up telemetry, health checks, and error tracking:

```bash
@backend-reliability "Add comprehensive monitoring for the payment processing system"
```

**What you'll get:**
- Telemetry events for critical operations
- Health check endpoint with dependency checks
- Structured JSON logging
- Sentry error tracking integration
- APM configuration (New Relic/DataDog)

### 8. Elixir/OTP Reliability Patterns

Apply proper supervision trees and process architecture:

```bash
@backend-reliability "Refactor the shopping cart from GenServer to database-backed Ash resource"
```

**What you'll get:**
- Ash resource definition with proper actions
- Database schema and migration
- Supervision tree design with restart strategies
- Oban workers for async operations
- Connection pool configuration

## What You'll Get

The backend-reliability-engineer delivers:

1. **API Design**: RESTful/GraphQL APIs with proper semantics, versioning, pagination, and documentation
2. **Database Optimization**: Normalized schemas, strategic indexes, query optimization with EXPLAIN ANALYZE
3. **Security Implementation**: Authentication, authorization, input validation, encryption, security headers
4. **Performance Engineering**: N+1 elimination, caching strategies, async processing, performance budgets
5. **Distributed Systems**: Horizontal scaling, message queues, circuit breakers, idempotency
6. **Elixir/OTP Patterns**: Proper supervision trees, database as source of truth, Oban for background jobs
7. **Monitoring**: Telemetry, health checks, error tracking, structured logging, APM integration

## Anti-Patterns Prevented

- ❌ Sacrificing data integrity for performance
- ❌ Missing server-side input validation
- ❌ N+1 query patterns
- ❌ Hardcoded secrets in source code
- ❌ Using Float for money values
- ❌ GenServer for domain entity state
- ❌ Blocking request paths with external calls
- ❌ Deploying without connection pooling

## Reference


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
