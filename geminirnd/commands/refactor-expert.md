---
description: Expert code refactoring to improve quality and reduce technical debt
agent: core/code-refactoring-expert
subtask: true
---

Systematic refactoring to improve code quality, apply SOLID principles, and implement framework-specific patterns with test-driven incremental transformations.

!`find lib test -type f \( -name "*.ex" -o -name "*.exs" \) 2>/dev/null | head -20`
!`mix test --cover 2>/dev/null | tail -20 || echo "No test coverage available"`
!`mix credo --strict 2>/dev/null | head -30 || echo "Credo not installed"`
!`find lib -type f -name "*.ex" -exec wc -l {} + | sort -rn | head -10 | awk '{print $2, $1 " lines"}' || echo "No large files found"`

## Overview

Dedicated to improving code quality, reducing technical debt, and applying proven refactoring patterns while preserving behavior through comprehensive testing and incremental transformations.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

The commands above provide:
- Application structure and modules
- Current test coverage percentage
- Code quality issues from Credo
- Largest files (potential god modules)

## Usage Examples

### 1. Extract Method/Function

Break down long methods into focused functions:

```bash
@refactor-expert "Refactor the process_order function - it's 80 lines and does too much"
```

**What you'll get:**
- Analysis of function responsibilities
- Extracted helper functions with descriptive names
- Pipeline-based composition with Elixir's `|>` operator
- Tests pass after refactoring
- Reduced cyclomatic complexity

### 2. Convert GenServer to Database-Backed Resource

Move entity state from GenServer to database with Ash Framework:

```bash
@refactor-expert "Convert the ShoppingCart GenServer to a database-backed Ash resource"
```

**What you'll get:**
- Ash resource definition with actions
- Database migration for cart and cart_items tables
- Proper relationships and validations
- Tests migrated from GenServer to database tests
- GenServer removed, state in database

### 3. Extract Pure Functions to impl/ Layer

Separate business logic from data access:

```bash
@refactor-expert "Extract business logic from Orders context to pure functions in impl/ layer"
```

**What you'll get:**
- Pure calculation functions in `lib/my_app/orders/impl/`
- Boundary module for data access
- Testable business logic without database
- Clear separation of concerns
- Improved test coverage

### 4. Replace Conditional with Polymorphism

Eliminate complex conditionals using protocols:

```bash
@refactor-expert "Replace the payment_method type checking with polymorphic protocols"
```

**What you'll get:**
- Protocol definition for payment processing
- Protocol implementations for each payment type
- Elimination of if/else or case conditionals
- Open/Closed principle applied
- Easy to add new payment methods

### 5. Introduce Parameter Object

Group related parameters into domain objects:

```bash
@refactor-expert "Function has 8 parameters - introduce parameter object"
```

**What you'll get:**
- Domain struct encapsulating related parameters
- Simplified function signature
- Better encapsulation and maintainability
- Type specs for parameter object
- Updated callers

### 6. Break Down God Module

Split large module into focused contexts:

```bash
@refactor-expert "UserManager module is 600 lines - split into focused modules"
```

**What you'll get:**
- Analysis of responsibilities
- Multiple focused modules (Authentication, Profile, PasswordReset)
- Single Responsibility Principle applied
- Tests reorganized to match new structure
- Updated dependencies

### 7. Refactor Ecto to Ash Framework

Migrate manual Ecto to declarative Ash patterns:

```bash
@refactor-expert "Convert Product Ecto schema to Ash resource with actions"
```

**What you'll get:**
- Ash resource definition with attributes
- Declarative actions replacing manual changesets
- Built-in validations and policies
- Simplified CRUD operations
- Tests updated for Ash API

### 8. Move External Calls to Oban Workers

Extract blocking operations to background jobs:

```bash
@refactor-expert "Move email sending and API calls to Oban background workers"
```

**What you'll get:**
- Oban worker definitions
- Job enqueueing in controllers
- Non-blocking request paths
- Retry strategies with exponential backoff
- Queue configuration

### 9. Technical Debt Assessment

Evaluate and prioritize technical debt:

```bash
@refactor-expert "Assess technical debt in the billing module and create action plan"
```

**What you'll get:**
- Code smell analysis (long methods, god classes, duplication)
- Cyclomatic complexity metrics
- Test coverage gaps
- Prioritized refactoring backlog
- Impact and effort estimates

### 10. Apply SOLID Principles

Review and refactor for SOLID compliance:

```bash
@refactor-expert "Review the payment processing module for SOLID principles violations"
```

**What you'll get:**
- Single Responsibility analysis
- Open/Closed principle application with protocols
- Dependency injection recommendations
- Interface segregation improvements
- Before/after comparison

## What You'll Get

The code-refactoring-expert delivers:

1. **Code Smell Detection**: Long methods, god classes, duplicate code, magic numbers, deep nesting
2. **Test Coverage**: Verification of adequate tests before refactoring, gaps filled
3. **Incremental Refactoring**: Small, safe transformations with tests passing after each step
4. **Elixir Patterns**: GenServer to database, pure functions to impl/, Ecto to Ash, Oban workers
5. **SOLID Principles**: Single responsibility, open/closed, dependency inversion
6. **Technical Debt**: Metrics, documentation, prioritized action plans
7. **Pattern Application**: Extract method, parameter object, replace conditional with polymorphism

## Refactoring Patterns

### Structural Patterns
- Extract Method/Function
- Extract Module/Class
- Move Method/Field
- Inline Function
- Replace Magic Numbers with Constants

### Behavioral Patterns
- Replace Conditional with Polymorphism (Protocols)
- Introduce Parameter Object
- Replace Nested Conditionals with Guards
- Extract Strategy Pattern

### Elixir-Specific
- GenServer State → Database-Backed Resources
- Extract Pure Functions → impl/ Layer
- Ecto Changesets → Ash Actions
- Synchronous Calls → Oban Workers
- Manual ETS → Cachex with TTL

## Refactoring Process

1. **Detect** - Identify code smells and prioritize by impact/risk
2. **Cover** - Ensure 80%+ test coverage exists, write missing tests
3. **Transform** - Apply refactoring pattern, one small step at a time
4. **Verify** - Run tests after EACH transformation
5. **Commit** - Commit each successful step independently
6. **Measure** - Capture before/after metrics

## Anti-Patterns Prevented

- ❌ Refactoring without test coverage
- ❌ Changing functionality during refactoring
- ❌ Large, risky rewrites
- ❌ Ignoring test failures
- ❌ Introducing GenServer entity state
- ❌ Missing type specs after refactoring
- ❌ Over-engineering with speculative features

## Safety Checklist

Before every refactoring:
- [ ] Test coverage ≥80% for target code
- [ ] All tests pass consistently
- [ ] Understand the code's purpose and behavior
- [ ] Have a rollback plan (Git commit)
- [ ] One transformation at a time

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
