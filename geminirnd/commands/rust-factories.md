---
description: Expert factori and fake-rs test data factories for Rust with SQLx, Axum, and Tokio
agent: rust-specific/rust-test-factory-specialist
subtask: true
---

# Rust Test Data Factory Command

Comprehensive expertise in test data factories for Rust applications using `factori`, `fake-rs`, and SQLx-backed test helpers. Deep knowledge of factory patterns, complex struct relationships, builder patterns, and realistic test data generation strategies.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather test infrastructure context:

**Factory Files:**
```bash
!`find tests/ src/ -name '*factory*' -o -name '*fixture*' 2>/dev/null | head -10`
!`cat tests/common/mod.rs 2>/dev/null | head -50`
```

**Struct Definitions:**
```bash
!`find src/ -name '*.rs' | xargs grep -l "struct\|#\[derive" 2>/dev/null | head -10`
```

**Test Configuration:**
```bash
!`ls -la tests/ 2>/dev/null`
```

## Usage Examples

### 1. Set Up Factory Infrastructure

**When to use:**
- Starting a new Rust project with test data needs
- No factory system in place
- Migrating from hardcoded test structs

**Example:**
```bash
/rust-factories Set up factori infrastructure for our web service with:
- Domain structs: User, Post, Comment, Product, Order
- fake-rs integration for realistic data
- SQLx test helpers (PgPool-backed insertion)
- Common test fixtures module

Stack: Axum + SQLx + Tokio
```

**What you'll get:**
- `factori` and `fake` added to `[dev-dependencies]` in Cargo.toml
- `tests/common/factories.rs` with base factory setup
- SQLx `PgPool` test helper for database-backed tests
- `#[tokio::test]` integration patterns
- Example factories for core domain structs
- Usage documentation

### 2. Create Basic Factories with Relationships

**When to use:**
- Need factories for new domain structs
- Building out test coverage
- Setting up factory patterns with FK relationships

**Example:**
```bash
/rust-factories Create factories for our blog domain:

Structs:
- User (has many Posts, has many Comments)
- Post (belongs to User via author_id, has many Comments)
- Comment (belongs to Post via post_id, belongs to User via author_id)
- Tag (many-to-many with Posts)

Requirements:
- Unique emails and usernames
- Realistic content (fake-rs)
- Proper FK relationship handling
```

**What you'll get:**
- Complete `factori!` macro factory definitions
- Sequence-style unique value generation
- FK relationship handling (in-memory vs DB-inserted)
- Factory mixins (admin, moderator roles)
- Usage examples in `#[tokio::test]` tests
- `params_for`-style helper functions

### 3. Implement Factory Mixins and Variants

**When to use:**
- Need different states (draft, published, archived)
- Multiple user roles (admin, moderator, user)
- Test scenarios require specific data patterns

**Example:**
```bash
/rust-factories Create factory mixins for:

User variants:
- admin (role: Role::Admin)
- moderator (role: Role::Moderator)
- inactive (status: Status::Inactive)
- with_profile (includes nested Profile)

Post variants:
- published (status: Status::Published, published_at set)
- scheduled (status: Status::Scheduled, future publish date)
- popular (high view_count, many comments)
- with_comments (includes 5 comments)

Order variants:
- pending, processing, shipped, delivered
- large_order (20+ items)
```

**What you'll get:**
- `factori!` mixin definitions for each variant
- Composite mixins (e.g., popular includes published + comments)
- State-based enums used in factories
- Usage examples combining mixins
- Performance-optimized data-heavy factories

### 4. Handle Complex Struct Relationships

**When to use:**
- Self-referencing structs (comment replies, category trees)
- Many-to-many relationships (posts ↔ tags via join table)
- Optional/nullable FK fields
- Circular dependencies

**Example:**
```bash
/rust-factories Create factories for complex relationships:

1. Comment threads (self-referencing):
   - Top-level comments (parent_id: None)
   - Nested replies (parent_id: Some(id))
   - Multi-level threads

2. Category tree (recursive):
   - Root categories
   - Nested subcategories
   - Category hierarchy

3. User social graph:
   - User follows users (many-to-many self-join)
   - Bidirectional relationships
```

**What you'll get:**
- Self-referencing factory patterns with `Option<Uuid>`
- Recursive tree structure factories
- Many-to-many join table insertion helpers
- Circular dependency solutions using deferred insertion
- Helper functions for complex test setups

### 5. Integrate with fake-rs for Realistic Data

**When to use:**
- Need realistic names, emails, addresses in factories
- Domain-specific fake data (SKUs, order numbers, medical IDs)
- Locale-specific data generation

**Example:**
```bash
/rust-factories Integrate fake-rs into our User and Product factories:

User fields needing fake data:
- name: realistic full name
- email: valid format, unique
- bio: sentence or paragraph
- avatar_url: valid URL

Product fields:
- sku: format PROD-XXXXX
- name: product name
- description: paragraph
- price_cents: realistic range 100-100000
```

**What you'll get:**
- `#[derive(Dummy)]` on domain structs where applicable
- Custom `Dummy` implementations for special formats
- `Fake` trait usage patterns in `factori!` defaults
- Locale-aware generation (en_US, fr_FR, etc.)
- Unique constraint handling patterns

### 6. SQLx Database-Backed Factory Helpers

**When to use:**
- Integration tests requiring DB-inserted records
- Testing queries, constraints, and relationships in Postgres
- Need transactional test isolation

**Example:**
```bash
/rust-factories Create SQLx-backed factory helpers:

Needs:
- insert_user(&pool) -> Result<User>
- insert_post(&pool, author_id: Uuid) -> Result<Post>
- insert_user_with_posts(&pool, post_count: u32) -> Result<(User, Vec<Post>)>
- Transaction wrapping for test isolation

Tests use #[tokio::test] with PgPool fixture
```

**What you'll get:**
- `async fn insert_*` factory helpers using `sqlx::query!`
- `PgPool` test fixture setup with `sqlx::test`
- Transactional test isolation patterns
- `Ecto.Multi`-style `sqlx::Transaction` for related records
- Cleanup helpers and test teardown patterns

### 7. Optimize Factory Performance

**When to use:**
- Test suite running slowly
- Creating large datasets for load tests
- Many tests creating redundant data

**Example:**
```bash
/rust-factories Optimize factory performance:

Current issues:
- 300 integration tests take 6 minutes
- Many tests insert when in-memory structs would work
- No bulk insert helpers
- Creating unnecessary FK records

Goals:
- Reduce to <2 minutes
- Implement bulk insert strategies
- Use in-memory factories strategically
- Cache expensive setup data
```

**What you'll get:**
- In-memory vs DB factory strategy guide
- `sqlx::query!` bulk insert patterns (INSERT ... UNNEST)
- `Arc<PgPool>` sharing and connection pool tuning
- Lazy/once-style expensive fixture caching
- Benchmarks and optimization recommendations

### 8. Troubleshoot Common Factory Issues

**When to use:**
- Unique constraint violations in tests
- FK constraint errors
- Slow test suite
- Factory generating invalid data

**Example:**
```bash
/rust-factories Debug factory issues:

Problems:
1. Tests fail with "duplicate key value violates unique constraint email"
2. FK constraint error: "post author_id not found"
3. Test suite takes 10 minutes
4. Mixin overrides not applying correctly

Context:
- 200+ integration tests, #[tokio::test]
- Using factori 0.8, fake 2.9, sqlx 0.7
- PostgreSQL via Docker in CI
```

**What you'll get:**
- Root cause analysis for each issue
- Unique value generation fixes (UUIDs, sequences)
- Insertion order fixes for FK dependencies
- Connection pool and test parallelism tuning
- Mixin composition debugging
- Prevention strategies

## What You'll Get

Every response includes:

### 1. **Complete Factory Implementations**
   - `factori!` macro definitions matching your domain structs
   - Mixin definitions for state variants and roles
   - `fake-rs` integration for realistic field values
   - FK relationship handling (build vs insert strategies)

### 2. **Factory Mixins and Variants**
   - State-based mixins (draft, published, archived)
   - Role-based mixins (admin, moderator, user)
   - Composite mixins for complex scenarios
   - Performance-optimized data-heavy variants

### 3. **Testing Patterns**
   - `#[tokio::test]` setup with `sqlx::test` or `PgPool` fixtures
   - In-memory factory usage for pure unit tests
   - DB-backed factory helpers for integration tests
   - Transactional isolation with `BEGIN`/`ROLLBACK`

### 4. **Framework Integration**
   - **SQLx**: `query!` macro factories with compile-time checks
   - **Axum**: HTTP layer test helpers using `axum::test`
   - **Tokio**: Async factory helpers and test runtime setup
   - **fake-rs**: `Dummy` derive and custom `Fake` implementations

### 5. **Performance Optimization**
   - Build vs insert guidelines
   - Bulk insert helpers (INSERT ... UNNEST)
   - `Arc<PgPool>` sharing across tests
   - Lazy fixture caching
   - Connection pool tuning for parallel tests

### 6. **Best Practices**
   - Anti-pattern identification
   - Code organization in `tests/common/`
   - Test isolation with transactions
   - Factory naming conventions
   - Documentation examples

### 7. **Troubleshooting Support**
   - Unique constraint violation fixes
   - FK dependency ordering
   - Performance diagnosis
   - Mixin composition debugging
   - Prevention strategies

## Related Commands

- `/rust-test` - Comprehensive Rust testing strategies
- `/rust-faker` - fake-rs library for realistic test data
- `/rust-property-testing` - Property-based testing with proptest/quickcheck
- `/senior-engineer` - Production-ready feature development
- `/code-refactor` - Refactoring code to be more testable

## Key Capabilities

This command leverages the rust-test-factory-specialist agent, which provides:

- **Factory Patterns**: Basic factories, mixins, variants, relationships
- **factori Integration**: `factori!` macro, mixin system, builder patterns
- **SQLx Integration**: Database-backed factories with compile-time checked queries
- **fake-rs Integration**: `Dummy` derive, custom generators, locale support
- **Axum Testing**: HTTP test helpers with factory-generated request data
- **Complex Relationships**: Self-referencing, many-to-many, optional FKs
- **Performance**: Bulk inserts, in-memory strategies, pool tuning
- **Testing Patterns**: Setup helpers, fixtures, state transitions, constraints
- **Troubleshooting**: Unique constraints, FK errors, slow tests, mixin issues

## Tips for Best Results

1. **Share Struct Definitions**: Include your domain structs with field types
2. **Describe Relationships**: Specify FK fields and their targets
3. **Mention Stack**: Specify SQLx version, Axum, Tokio runtime settings
4. **Include Constraints**: Unique fields, NOT NULL, check constraints
5. **Describe Use Cases**: What you're testing (queries, handlers, state machines)
6. **Share Existing Factories**: Include current factory code if migrating/improving
7. **Specify Performance Needs**: If dealing with large datasets or slow CI

## Technical Details

**Powered by:** `.opencode/agent/rust-specific/rust-test-factory-specialist.md`
**MCP Servers:** context7 (factori/fake-rs docs), sequential-thinking (complex scenarios)
**Key Crates:** `factori`, `fake`, `sqlx`, `tokio`, `rstest`

---

**Note:** This command specializes in test data factories using `factori` and `fake-rs`. For property-based testing use `/rust-property-testing`, for general testing strategies use `/rust-test`, and for realistic data generation patterns use `/rust-faker`.

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
