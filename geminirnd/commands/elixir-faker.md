---
description: Expert guidance on Faker library for flexible test data generation in Elixir
agent: elixir-faker-specialist
subtask: true
---

# Faker Test Data Generation Command

Expert assistance for generating realistic, flexible test data using the Faker library in Elixir applications. Get comprehensive guidance on custom generators, Phoenix LiveView test data, Ash resource factories, locale-specific data, and performance optimization.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather relevant context about your test data needs:

**Project Testing Setup:**
```bash
!`find test/support -name 'factory.ex' -o -name '*faker*'`
!`grep -r 'Faker\\.' test/ | head -20`
!`grep 'faker\|ex_machina\|smokestack' mix.exs`
```

**Domain Models:**
```bash
!`find lib -name '*schema.ex' -o -name '*resource.ex'`
!`grep -r 'defmodule.*Schema\|defmodule.*Resource' lib/`
```

**Existing Test Data Patterns:**
```bash
!`grep -r 'insert\|build\|params_for' test/ | head -20`
!`find test -name '*_test.exs' | head -10`
```

## Usage Examples

### 1. Setting Up Faker with ExMachina Factories

**When to use:**
- Starting new project with test data needs
- Want factory-based test data generation
- Need relationship handling (has_many, belongs_to)

**Example:**
```bash
/elixir-faker set up Faker with ExMachina for our blog application. We have:
- User schema (name, email, bio, avatar_url, role)
- Post schema (title, body, author_id, published_at, status)
- Comment schema (body, user_id, post_id)

Need factories for all models with realistic data.
```

**What you'll get:**
- Complete mix.exs dependency setup
- test/support/factory.ex with all factories
- Faker.start() configuration in test_helper.exs
- Factory variants (admin, published_post, draft_post)
- Relationship handling patterns (build vs insert)
- Usage examples in tests

### 2. Creating Custom Domain-Specific Generators

**When to use:**
- Need industry-specific data (e-commerce, healthcare, education)
- Standard Faker generators too generic
- Have specific data format requirements

**Example:**
```bash
/elixir-faker create custom generators for our e-commerce platform:
- Product SKUs (format: CATEGORY-12345)
- Order numbers (format: ORD-timestamp-random)
- Tracking numbers (carrier + 12 digits)
- Payment tokens (Stripe-style tok_xxxx)
- Invoice numbers (format: INV-YYYY-sequence)

Need realistic price distribution: 80% between $10-$100, 20% premium $100-$1000
```

**What you'll get:**
- test/support/faker/ecommerce.ex module
- Custom generators matching your formats
- Realistic data distribution patterns
- Validation-compliant data generation
- Usage examples and documentation
- Neo4j knowledge base entries

### 3. Locale-Specific Data Generation

**When to use:**
- Testing international features
- Need region-specific formats (postcodes, phones, SSN)
- Multi-locale application testing

**Example:**
```bash
/elixir-faker create locale-specific generators for:
- UK: Postcodes (AA9A 9AA), phone (+44), NI numbers, sort codes
- US: ZIP codes, SSN (123-45-6789), phone numbers, EIN
- Canada: Postal codes (A1A 1A1), SIN, provinces

Need to test address validation for all three countries.
```

**What you'll get:**
- test/support/faker/locales/ directory structure
- UK, US, Canada-specific generators
- Format-compliant data (postcodes, SSN, etc.)
- Locale switching examples
- Multi-region test patterns
- Documentation for each locale

### 4. Phoenix LiveView Test Data Patterns

**When to use:**
- Testing LiveView forms and interactions
- Need realistic user input simulation
- Testing LiveView assigns and state changes

**Example:**
```bash
/elixir-faker create LiveView test data helpers for:
- User registration form (name, email, password, avatar upload)
- Post creation form (title, body, tags, status)
- Search functionality (query params)
- Pagination (page, per_page, sort_by)
- File upload metadata

Need to test both valid and invalid form submissions.
```

**What you'll get:**
- test/support/live_view_test_helper.ex
- Form param generators (build_user_form_params, etc.)
- Event payload generators (search, pagination, filters)
- File upload metadata generators
- LiveView stream data helpers
- Complete LiveView test examples

### 5. Ash Resource Factory Setup with Smokestack

**When to use:**
- Using Ash Framework for resources
- Need Ash-compatible factory setup
- Want declarative factory patterns

**Example:**
```bash
/elixir-faker set up Smokestack factories for our Ash resources:
- MyApp.Accounts.User (name, email, role, status)
- MyApp.Blog.Post (title, body, author_id, published_at)
- MyApp.Shop.Product (name, sku, price, category)

Need variants: :admin user, :published post, :featured product
```

**What you'll get:**
- Smokestack dependency setup
- test/support/factory.ex with Ash patterns
- Faker integration with Smokestack attributes
- Factory variants using constant/choose
- insert!/2 usage examples
- Complete test integration

### 6. Bulk Data Generation Performance Optimization

**When to use:**
- Need to generate thousands of test records
- Test suite running slowly
- Database seeding for manual testing

**Example:**
```bash
/elixir-faker optimize bulk data generation. We need:
- 10,000 users for load testing
- Each user has 5 posts on average
- Each post has 3 comments
- Current approach using insert/1 takes 5+ minutes

Need efficient batch insertion strategy.
```

**What you'll get:**
- Repo.insert_all/2 batch insert patterns
- Ecto.Multi for related records
- Streaming generators for memory efficiency
- Database seeding helpers
- Performance benchmarks
- Transaction wrapping for cleanup
- Optimization recommendations

### 7. Custom Generator Creation Guide

**When to use:**
- Need generators for unique domain types
- Want to extend Faker for your industry
- Building reusable generator library

**Example:**
```bash
/elixir-faker create custom generator module for our healthcare app:
- Medical record numbers (MRN-123456)
- Insurance providers (from common list)
- Prescription codes (RX-1234)
- ICD-10 diagnosis codes (A12.34 format)
- Blood types (A+, B-, O+, etc.)

Need realistic distribution matching actual patient demographics.
```

**What you'll get:**
- test/support/faker/healthcare.ex module
- All requested custom generators
- Realistic data distribution patterns
- Format validation examples
- Integration with existing factories
- Documentation and usage guide

### 8. Debugging Factory and Generator Issues

**When to use:**
- Factories generating invalid data
- Database constraint violations
- Relationship loading issues
- Locale generators not working

**Example:**
```bash
/elixir-faker help debug factory issues:
1. User factory email sometimes generates duplicates (unique constraint violation)
2. Post factory published_at occasionally in future (validation fails)
3. Relationship not loading (user.posts is nil)
4. UK postcode generator creating invalid formats

[Paste factory code]
```

**What you'll get:**
- Root cause analysis for each issue
- Fixed factory implementations
- Unique data generation strategies
- Relationship preloading patterns
- Locale generator corrections
- Best practices to avoid future issues

## What You'll Get

Every response includes:

### 1. **Complete Working Implementations**
   - Factory modules with all requested models
   - Custom generator modules for domain-specific data
   - Locale-specific generators matching regional formats
   - Test helper modules for LiveView/Phoenix

### 2. **Faker Integration Patterns**
   - ExMachina + Faker setup (for Ecto schemas)
   - Smokestack + Faker setup (for Ash resources)
   - Standalone Faker usage patterns
   - Best practices for each approach

### 3. **Realistic Data Generation**
   - Appropriate Faker generators for each field type
   - Custom generators for domain-specific formats
   - Frequency-based realistic distributions
   - Validation-compliant data patterns

### 4. **Performance Optimization**
   - Batch insert strategies (Repo.insert_all)
   - Ecto.Multi for related records
   - Streaming generators for large datasets
   - Memory-efficient lazy evaluation
   - Database seeding utilities

### 5. **Documentation and Examples**
   - Usage examples for all generators
   - Test integration patterns
   - Troubleshooting common issues
   - Neo4j knowledge base entries
   - Team onboarding guide

### 6. **Production-Ready Code**
   - No database constraint violations
   - Proper relationship handling
   - Locale-aware data generation
   - Test isolation with transactions
   - Comprehensive error handling

## Related Commands

- `/elixir-test` - General Elixir testing strategies
- `/elixir-exmachina` - ExMachina-specific patterns and best practices
- `/elixir-propcheck` - Property-based testing with generated data
- `/elixir-coverage` - Test coverage analysis
- `/elixir-e2e` - End-to-end testing with realistic data

## Key Capabilities

This command leverages the elixir-faker-specialist agent, which provides:

- **Faker Expertise**: Deep knowledge of all Faker modules and generators
- **Custom Generator Design**: Create domain-specific generators for any industry
- **Locale Support**: Generate region-specific data (UK, US, Canada, etc.)
- **Factory Patterns**: ExMachina and Smokestack integration expertise
- **LiveView Testing**: Realistic form data, event payloads, stream data
- **Performance Optimization**: Bulk data generation, batch inserts, streaming
- **Relationship Handling**: Proper build vs insert strategies
- **Neo4j Integration**: Store patterns and examples in knowledge graph

## Tips for Best Results

1. **Provide Domain Context**: Explain your industry and data requirements
2. **Share Schema Details**: Include field types, constraints, validations
3. **Specify Formats**: Describe exact format requirements (SKU-12345, etc.)
4. **Mention Relationships**: Explain has_many, belongs_to associations
5. **Include Constraints**: Share unique indexes, validations, business rules
6. **Clarify Volume**: Specify if generating hundreds or thousands of records
7. **Share Locale Needs**: Mention regional data format requirements

## Technical Details

**Powered by:** `.opencode/agent/elixir-specific/elixir-faker-specialist.md`  
**MCP Servers:** context7 (Faker docs), neo4j (pattern storage), sequential-thinking (analysis)  
**Knowledge Graph:** Stores custom generators, factory patterns, locale formats, performance strategies

---

**Note:** This command specializes in Faker for test data generation. For factory-specific patterns use `/elixir-exmachina`, for property-based testing use `/elixir-propcheck`, and for general testing use `/elixir-test`.

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
