---
description: Expert ExMachina test data factories for Elixir with Ecto, Ash Framework, and Phoenix LiveView
agent: elixir-exmachina-specialist
subtask: true
---

# ExMachina Test Data Factory Command

Comprehensive expertise in ExMachina test data factories for Elixir applications with deep knowledge of factory patterns, complex associations, Ash Framework integration, Phoenix LiveView testing, and realistic test data generation strategies.

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
!`find test/support -name 'factory.ex' -o -name '*_factory.ex'`
!`cat test/support/factory.ex 2>/dev/null | head -50`
```

**Schema Definitions:**
```bash
!`find lib -name '*schema.ex' -o -name '*resource.ex' | head -10`
!`grep -r "use Ecto.Schema\|use Ash.Resource" lib/ | head -10`
```

**Test Configuration:**
```bash
!`cat test/test_helper.exs`
!`cat test/support/data_case.ex 2>/dev/null`
```

## Usage Examples

### 1. Set Up ExMachina Infrastructure

**When to use:**
- Starting new Elixir project
- No factory system in place
- Migrating from hardcoded test data

**Example:**
```bash
/elixir-exmachina Set up ExMachina infrastructure for our Phoenix app with:
- Ecto schemas: User, Post, Comment, Product, Order
- Faker integration for realistic data
- DataCase and ConnCase integration
- Basic factory patterns

Framework: Phoenix 1.7 + Ecto 3.11
```

**What you'll get:**
- ExMachina dependency added to mix.exs
- test/support/factory.ex with base setup
- Factory imported in DataCase and ConnCase
- Faker initialization in test_helper.exs
- Example factories for core schemas
- Usage documentation

### 2. Create Basic Factories with Associations

**When to use:**
- Need factories for new domain models
- Building out test coverage
- Setting up factory patterns

**Example:**
```bash
/elixir-exmachina Create factories for our blog domain:

Schemas:
- User (has_many :posts, has_many :comments)
- Post (belongs_to :author (User), has_many :comments)
- Comment (belongs_to :post, belongs_to :author (User))
- Tag (many_to_many :posts)

Requirements:
- Unique emails and usernames
- Realistic content (Faker)
- Proper association handling
```

**What you'll get:**
- Complete factory definitions
- Sequence usage for unique values
- Association handling (build vs insert)
- Factory traits (admin, moderator)
- Usage examples in tests
- params_for helpers

### 3. Implement Factory Traits and Variants

**When to use:**
- Need different states (draft, published, archived)
- Multiple user roles (admin, moderator, user)
- Test scenarios require specific data patterns

**Example:**
```bash
/elixir-exmachina Create factory traits for:

User variants:
- :admin (role: :admin)
- :moderator (role: :moderator)
- :inactive (status: :inactive)
- :with_profile (includes profile)

Post variants:
- :published (status: :published, published_at set)
- :scheduled (status: :scheduled, future publish date)
- :popular (many comments, high views)
- :with_comments (includes 5 comments)

Order variants:
- :pending, :processing, :shipped, :delivered
- :large_order (20+ items)
```

**What you'll get:**
- Trait definitions for each variant
- Composite traits (e.g., :popular includes :published + comments)
- State-based traits for workflows
- Usage examples combining traits
- Performance-optimized data-heavy traits

### 4. Handle Complex Associations

**When to use:**
- Self-referencing associations (comment replies, categories)
- Many-to-many relationships (posts ↔ tags)
- Polymorphic associations
- Circular dependencies (user follows)

**Example:**
```bash
/elixir-exmachina Create factories for complex associations:

1. Comment threads (self-referencing):
   - Top-level comments
   - Nested replies (parent_id)
   - Multi-level threads

2. Product categories (tree structure):
   - Root categories
   - Nested subcategories
   - Category hierarchy

3. User social network:
   - User follows users (many-to-many self-join)
   - Bidirectional relationships
```

**What you'll get:**
- Self-referencing factory patterns
- Tree structure factories
- Many-to-many join table handling
- Circular dependency solutions
- Helper functions for complex setups
- Test examples

### 5. Integrate with Ash Framework

**When to use:**
- Using Ash Framework resources
- Need to test Ash actions and policies
- Multitenancy with Ash

**Example:**
```bash
/elixir-exmachina Create Ash-compatible factories for:

Resources:
- User (with :create and :create_admin actions)
- Post (with policies: author can update, admin can delete)
- Comment (multitenancy via organization_id)

Requirements:
- Use Ash actions in factories
- Test authorization policies
- Handle multitenancy context
- Validate against Ash changesets
```

**What you'll get:**
- Ash resource factory patterns
- Action-aware factories (using Ash.Changeset.for_create)
- Policy testing helpers (as_actor, assert_authorized)
- Multitenancy helpers (in_tenant)
- Custom insert override for Ash
- Test examples with policies

### 6. Phoenix LiveView Testing Factories

**When to use:**
- Testing LiveView components
- Form submissions in LiveView
- Real-time features with streams
- File uploads

**Example:**
```bash
/elixir-exmachina Create LiveView test helpers and factories:

Needs:
- Form params factories (string keys for LiveView forms)
- LiveView assigns fixtures
- Event payload factories (search, pagination, filters)
- Stream item factories for LiveView streams
- File upload metadata

Components:
- UserLive (create/edit forms)
- PostLive (with real-time comments)
- NotificationsLive (stream updates)
```

**What you'll get:**
- LiveView test helper module
- Form params factories (string-keyed maps)
- Event payload generators
- Stream item factories
- File upload fixtures
- Authentication helpers (login_user, live_authenticated)
- Complete LiveView test examples

### 7. Optimize Factory Performance

**When to use:**
- Test suite running slowly (>5 minutes)
- Creating large datasets for performance tests
- Many tests creating same data

**Example:**
```bash
/elixir-exmachina Optimize factory performance:

Current issues:
- 500 tests take 8 minutes
- Many tests use insert when build would work
- No batch insert helpers
- Creating unnecessary associations

Goals:
- Reduce to <3 minutes
- Implement bulk insert strategies
- Use build strategically
- Cache expensive factories
```

**What you'll get:**
- build vs insert strategy guide
- Batch insert helpers (insert_users_batch)
- Ecto.Multi patterns for related records
- Lazy evaluation with streams
- Factory caching implementation
- Association preloading optimization
- Performance benchmarks

### 8. Troubleshoot Common Factory Issues

**When to use:**
- Unique constraint violations
- Association not loaded errors
- Slow test suite
- Factory creating wrong data

**Example:**
```bash
/elixir-exmachina Debug factory issues:

Problems:
1. Tests fail with "email has already been taken"
2. post.author returns %Ecto.Association.NotLoaded{}
3. Test suite takes 15 minutes
4. Ash resource factory fails with authorization error

Context:
- 300+ tests, mix test --trace shows slow inserts
- async: true on most tests
- Using Ash Framework with policies
```

**What you'll get:**
- Root cause analysis for each issue
- Solutions with code examples
- Sequence configuration fixes
- Association preloading strategies
- Performance optimization recommendations
- Ash authorization helpers
- Prevention strategies

## What You'll Get

Every response includes:

### 1. **Complete Factory Implementations**
   - Factory definitions matching your schemas
   - Proper use of sequences for unique values
   - Association handling (build vs insert strategies)
   - Realistic data using Faker integration

### 2. **Factory Traits and Variants**
   - State-based traits (draft, published, archived)
   - Role-based traits (admin, moderator, user)
   - Composite traits for complex scenarios
   - Performance-optimized data-heavy traits

### 3. **Testing Patterns**
   - Setup callbacks with factories
   - Test fixtures for common scenarios
   - State transition testing
   - Association testing patterns
   - Validation testing with factories

### 4. **Framework Integration**
   - **Ecto**: Schema factories with proper changesets
   - **Ash Framework**: Action-aware factories, policy testing
   - **Phoenix LiveView**: Form params, event payloads, streams
   - **ExUnit**: Setup callbacks, async testing

### 5. **Performance Optimization**
   - build vs insert guidelines
   - Batch insert helpers
   - Ecto.Multi patterns
   - Lazy evaluation strategies
   - Association preloading

### 6. **Best Practices**
   - Anti-pattern identification
   - Code organization
   - Test isolation with Sandbox
   - Factory naming conventions
   - Documentation examples

### 7. **Troubleshooting Support**
   - Common issue diagnosis
   - Root cause analysis
   - Solution implementations
   - Prevention strategies

## Related Commands

- `/elixir-tester` - Comprehensive Elixir testing strategies
- `/elixir-faker` - Faker library for realistic test data
- `/elixir-propcheck` - Property-based testing with factories
- `/senior-engineer` - Production-ready feature development
- `/code-refactor` - Refactoring code to be more testable

## Key Capabilities

This command leverages the elixir-exmachina-specialist agent, which provides:

- **Factory Patterns**: Basic factories, traits, variants, associations
- **Ecto Integration**: Schema-aware factories with proper changesets
- **Ash Framework**: Resource factories, action usage, policy testing, multitenancy
- **Phoenix LiveView**: Form params, event payloads, streams, file uploads
- **Complex Associations**: Self-referencing, many-to-many, polymorphic, circular
- **Performance**: Batch inserts, build strategies, lazy evaluation, caching
- **Testing Patterns**: Setup callbacks, fixtures, state transitions, validations
- **Troubleshooting**: Unique constraints, association loading, performance, authorization
- **Best Practices**: Anti-patterns, code organization, naming conventions

## Tips for Best Results

1. **Share Schema Definitions**: Include Ecto schemas or Ash resources
2. **Describe Associations**: Specify relationships (belongs_to, has_many, many_to_many)
3. **Mention Framework**: Specify if using Ash Framework, plain Ecto, or both
4. **Include Constraints**: Unique fields, validations, required associations
5. **Describe Use Cases**: What you're testing (validations, state transitions, authorization)
6. **Share Existing Factories**: Include current factory.ex if migrating/improving
7. **Specify Performance Needs**: If dealing with large datasets or slow tests

## Technical Details

**Powered by:** `.opencode/agent/elixir-specific/elixir-exmachina-specialist.md`  
**MCP Servers:** context7 (ExMachina docs), neo4j (factory patterns), sequential-thinking (complex scenarios)  
**Knowledge Graph:** Stores factory patterns, association strategies, performance optimizations

---

**Note:** This command specializes in ExMachina test data factories. For property-based testing use `/elixir-propcheck`, for general testing strategies use `/elixir-tester`, and for realistic data generation patterns use `/elixir-faker`.

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
