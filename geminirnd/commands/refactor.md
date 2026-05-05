---
description: Improve code quality and reduce technical debt through systematic refactoring
agent: core/code-refactoring-expert
subtask: true
---

Systematic code refactoring to improve quality, reduce technical debt, and apply SOLID principles while preserving behavior through comprehensive testing.

!cat package.json 2>/dev/null | grep -E "(eslint|prettier|typescript|zod)" || echo "No JS/TS quality tools found"
!find . -name "*.tsx" -o -name "*.ts" -o -name "*.js" 2>/dev/null | head -20

1. **Code Smell Detection**:
   - Identify method-level smells: long methods, complex conditionals, duplicates, magic values
   - Detect class-level issues: god classes, feature envy, primitive obsession
   - Find architectural problems: circular dependencies, tight coupling
   - Prioritize by impact and risk matrix

2. **Test Coverage Verification**:
   - Verify minimum 80% coverage for refactoring target
   - Write missing tests before refactoring begins
   - NEVER proceed without adequate test coverage
   - Ensure tests pass consistently

3. **Incremental Refactoring**:
   - Extract Method/Function for complex logic
   - Introduce Parameter Objects for grouped parameters
   - Replace Conditional with Polymorphism
   - Run tests after EACH transformation
   - Commit each successful step independently

4. **TypeScript & Next.js Patterns**:
   - Convert prop drilling to React Context or URL state
   - Refactor Client Components to Server Components where possible
   - Implement Zod schemas for loose API responses
   - Extract logic from components into custom hooks or utility functions
   - Optimize heavy client-side computations with `useMemo` or move to Server Components

5. **SOLID Principles**:
   - Single Responsibility: One reason to change per module
   - Open/Closed: Use interfaces/types for extension
   - Liskov Substitution: Honor subtype contracts
   - Interface Segregation: Split large interfaces
   - Dependency Inversion: Inject dependencies for testability

6. **Technical Debt Tracking**:
   - Capture before/after metrics (complexity, LOC, coverage, duplication)
   - Document refactoring outcomes with evidence
   - Update technical debt register

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
