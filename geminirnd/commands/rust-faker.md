---
description: Expert guidance on fake-rs library for flexible test data generation in Rust
agent: rust-specific/rust-faker-specialist
subtask: true
---

# Rust fake-rs Test Data Generation Command

Expert assistance for generating realistic, flexible test data using the `fake` crate (fake-rs) in Rust applications. Get comprehensive guidance on `#[derive(Dummy)]`, custom `Fake` implementations, locale-specific data, domain-specific generators, and performance optimization.

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
!`find tests/ src/ -name '*factory*' -o -name '*fake*' -o -name '*fixture*' 2>/dev/null | head -10`
!`grep -r 'fake::\|Fake\|Dummy' tests/ src/ 2>/dev/null | head -20`
```

**Domain Structs:**
```bash
!`find src/ -name '*.rs' | xargs grep -l "#\[derive\|pub struct" 2>/dev/null | head -10`
!`cat src/domain/mod.rs 2>/dev/null | head -50`
```

**Existing Test Data Patterns:**
```bash
!`grep -r 'Faker\|fake!\|Dummy\|factori!' tests/ 2>/dev/null | head -20`
!`find tests/ -name '*.rs' | head -10`
```

## Usage Examples

### 1. Setting Up fake-rs with factori

**When to use:**
- Starting new project with test data needs
- Want factory-based test data generation with fake-rs
- Need relationship handling (FK fields, nested structs)

**Example:**
```bash
/rust-faker set up fake-rs with factori for our web service. We have:
- User struct (name, email, bio, avatar_url, role)
- Post struct (title, body, author_id, published_at, status)
- Comment struct (body, user_id, post_id)

Need factories for all structs with realistic data.
```

**What you'll get:**
- `fake` and `factori` added to `[dev-dependencies]` in Cargo.toml
- `#[derive(Dummy)]` on domain structs where suitable
- `factori!` macro definitions using `fake` generators
- `Faker` locale configuration for data variety
- Relationship handling patterns (build vs DB-insert)
- Usage examples in `#[tokio::test]` tests

### 2. Derive Dummy for Domain Structs

**When to use:**
- Need quick fake data for any instance of a struct
- Want `fake::Faker.fake::<MyStruct>()` to work automatically
- Structs have standard field types (String, u64, Option<T>, Vec<T>)

**Example:**
```bash
/rust-faker derive Dummy for our domain structs:

pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub bio: Option<String>,
    pub role: UserRole,
    pub created_at: DateTime<Utc>,
}

pub enum UserRole { Admin, Moderator, User }
```

**What you'll get:**
- `#[derive(Dummy)]` applied with appropriate `#[dummy(...)]` field attributes
- Custom `Dummy` impl for `UserRole` enum
- `dummy(faker = "...")` for specific generators (Name, SafeEmail, etc.)
- `dummy(default)` for fields needing special handling
- Usage examples: `let user: User = Faker.fake();`

### 3. Creating Custom Domain-Specific Generators

**When to use:**
- Need industry-specific data (e-commerce, healthcare, fintech)
- Standard fake-rs providers too generic
- Have specific data format requirements

**Example:**
```bash
/rust-faker create custom generators for our e-commerce platform:
- Product SKUs (format: CAT-12345)
- Order numbers (format: ORD-timestamp-random)
- Tracking numbers (carrier + 12 digits)
- Payment tokens (Stripe-style tok_xxxx)
- Invoice numbers (format: INV-YYYY-sequence)

Need realistic price distribution: 80% between $1.00–$100.00, 20% premium $100–$1000
```

**What you'll get:**
- `tests/common/fakers/ecommerce.rs` module
- Structs implementing `fake::Fake` trait for each generator
- Realistic data distribution patterns using `rand` distributions
- Validation-compliant data generation
- Usage examples and documentation
- Integration with `factori!` defaults

### 4. Locale-Specific Data Generation

**When to use:**
- Testing internationalization features
- Need region-specific formats (postcodes, phone numbers, addresses)
- Multi-locale application testing

**Example:**
```bash
/rust-faker create locale-specific generators for:
- UK: Postcodes (AA9A 9AA format), phone (+44), NI numbers
- US: ZIP codes, SSN (123-45-6789), phone numbers
- Canada: Postal codes (A1A 1A1), provinces, SIN

Need to test address validation for all three regions.
```

**What you'll get:**
- `tests/common/fakers/locales/` directory structure
- UK, US, Canada-specific generators implementing `Fake`
- Format-compliant data matching real-world patterns
- `fake::locales::EN` / custom locale usage
- Multi-region test patterns and examples
- Documentation for each locale generator

### 5. Axum HTTP Handler Test Data

**When to use:**
- Testing Axum request handlers with realistic payloads
- Need JSON body structs for `axum::test` helpers
- Testing form submissions and query params

**Example:**
```bash
/rust-faker create Axum test data helpers for:
- User registration payload (name, email, password, avatar_url)
- Post creation payload (title, body, tags, status)
- Search query params (q, page, per_page, sort_by)
- Pagination params
- File upload metadata

Need to test both valid and invalid request payloads.
```

**What you'll get:**
- `tests/common/payloads.rs` with request payload generators
- `serde_json::Value` factories for JSON bodies
- `axum::test` integration helpers
- Valid and invalid payload variants
- Query string parameter generators
- Complete Axum handler test examples

### 6. Bulk Data Generation for Load Tests

**When to use:**
- Need to generate thousands of test records
- Load testing with realistic data volumes
- Database seeding for manual/staging testing

**Example:**
```bash
/rust-faker optimize bulk data generation. We need:
- 10,000 users for load testing
- Each user has an average of 5 posts
- Each post has 3 comments
- Current row-by-row INSERT takes 8+ minutes

Need efficient batch insertion strategy.
```

**What you'll get:**
- `sqlx::query!` bulk insert patterns (INSERT ... UNNEST / copy)
- Parallel generation with `rayon` iterators
- `Vec` pre-allocation and batch sizing strategies
- Streaming generators for memory efficiency
- Database seeding binary/script helpers
- Performance benchmarks and optimization recommendations

### 7. Custom Generator Creation Guide

**When to use:**
- Need generators for unique domain types
- Want to extend fake-rs for your industry
- Building reusable generator library for the team

**Example:**
```bash
/rust-faker create custom generator module for our healthcare app:
- Medical record numbers (MRN-123456)
- Insurance provider names (from realistic list)
- Prescription codes (RX-1234)
- ICD-10 diagnosis codes (A12.34 format)
- Blood types (A+, B-, O+, etc.)

Need realistic distribution matching patient demographics.
```

**What you'll get:**
- `tests/common/fakers/healthcare.rs` module
- Structs implementing `fake::Fake` for each generator
- Realistic frequency distributions using `rand::distributions::WeightedIndex`
- Format validation examples
- Integration with existing `factori!` factories
- Documentation and usage guide

### 8. Debugging Generator and Factory Issues

**When to use:**
- Factories generating invalid data (constraint violations)
- `#[derive(Dummy)]` producing unexpected values
- Locale generators not matching expected format
- Test flakiness from non-deterministic data

**Example:**
```bash
/rust-faker help debug fake-rs issues:
1. User factory email sometimes not unique (DB unique constraint fails)
2. Dummy-derived DateTime<Utc> produces out-of-range values
3. Custom postcode generator creates invalid UK formats
4. Tests are flaky due to random data hitting edge cases

[Paste relevant struct/factory code]
```

**What you'll get:**
- Root cause analysis for each issue
- Fixed generator implementations
- Seeded RNG patterns for deterministic tests (`StdRng::seed_from_u64`)
- Unique value generation strategies (UUID-based, counter-based)
- Format correction for locale generators
- Best practices to avoid future flakiness

## What You'll Get

Every response includes:

### 1. **Complete Working Implementations**
   - `#[derive(Dummy)]` annotated structs with correct field attributes
   - Custom `Fake` implementations for domain-specific generators
   - Locale-specific generators for regional data formats
   - Test helper modules for Axum/HTTP testing

### 2. **fake-rs Integration Patterns**
   - `factori!` + `fake` integration (for SQLx-backed tests)
   - Standalone `Faker.fake::<T>()` usage patterns
   - `#[dummy(faker = "...")]` field-level control
   - Best practices for each approach

### 3. **Realistic Data Generation**
   - Appropriate fake-rs providers for each field type
   - Custom generators for domain-specific formats
   - Weighted distributions for realistic data spread
   - Validation-compliant data patterns

### 4. **Performance Optimization**
   - Bulk generation with `rayon` parallel iterators
   - Batch INSERT strategies (INSERT ... UNNEST)
   - `Vec` pre-allocation and memory efficiency
   - Streaming generators for large datasets
   - Database seeding utilities

### 5. **Documentation and Examples**
   - Usage examples for all generators
   - Test integration patterns
   - Troubleshooting common issues
   - Team onboarding guide

### 6. **Production-Ready Code**
   - No DB constraint violations from test data
   - Proper relationship handling
   - Locale-aware data generation
   - Test isolation with `sqlx::test` transactions
   - Deterministic seeding options for reproducibility

## Related Commands

- `/rust-test` - General Rust testing strategies
- `/rust-factories` - factori-specific patterns and best practices
- `/rust-property-testing` - Property-based testing with proptest
- `/rust-security` - Security-focused testing and fuzzing

## Key Capabilities

This command leverages the rust-faker-specialist agent, which provides:

- **fake-rs Expertise**: Deep knowledge of all fake-rs providers and generators
- **Custom Generator Design**: Implement `Fake` trait for domain-specific types
- **Locale Support**: Generate region-specific data (UK, US, Canada, etc.)
- **Factory Patterns**: `factori!` and `Dummy` derive integration
- **Axum Testing**: Realistic request payload, JSON body, and query param factories
- **Performance Optimization**: Bulk data generation, parallel generation, batch inserts
- **Relationship Handling**: FK-aware factory composition strategies
- **Determinism**: Seeded RNG patterns for reproducible test data

## Tips for Best Results

1. **Provide Domain Context**: Explain your industry and data requirements
2. **Share Struct Definitions**: Include field types, derives, and constraints
3. **Specify Formats**: Describe exact format requirements (SKU-12345, etc.)
4. **Mention Relationships**: Explain FK fields and how structs relate
5. **Include Constraints**: Unique indexes, NOT NULL fields, check constraints
6. **Clarify Volume**: Specify if generating hundreds or thousands of records
7. **Share Locale Needs**: Mention regional data format requirements

## Technical Details

**Powered by:** `.opencode/agent/rust-specific/rust-faker-specialist.md`
**MCP Servers:** context7 (fake-rs docs), sequential-thinking (analysis)
**Key Crates:** `fake`, `factori`, `rand`, `sqlx`, `serde_json`

---

**Note:** This command specializes in `fake-rs` for test data generation. For factory-specific patterns use `/rust-factories`, for property-based testing use `/rust-property-testing`, and for general testing use `/rust-test`.

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
