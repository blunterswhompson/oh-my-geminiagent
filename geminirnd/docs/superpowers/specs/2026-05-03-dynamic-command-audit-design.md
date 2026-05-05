# Spec: Dynamic Stack-Aware Command & Agent Audit

**Date**: 2026-05-03
**Status**: Draft
**Target Environments**: Next.js 15+ (App Router), Elixir 2025 (Phoenix/Ash), Rust 2024 (Tokio/Axum).

## 1. Problem Statement
The previous modernization successfully created specialized Next.js agents but left the "Generic" commands and core agents in a state of language-imbalance. Over 60 commands (e.g., `/refactor`, `/senior-engineer`) still feature Elixir-first examples and "Modern Standards (Elixir 2025)" footers, even when used in a TypeScript context. This creates a significant risk of "cross-language hallucination" where the agent proposes Elixir patterns for a JavaScript codebase.

## 2. Goals
- **Stack Awareness**: Ensure all generic commands (65+ files) dynamically detect and prioritize the active tech stack.
- **Polyglot Clarity**: Restructure commands to provide distinct, prefixed guidance for Next.js, Elixir, and Rust within the same file.
- **Agent Alignment**: Update core agents (Systems Architect, QA, Performance) to include high-signal Next.js 15+ patterns.
- **Documentation Parity**: Update the `agent/README.md` to reflect the 2026 modernization and the new specialized directory structure.

## 3. Proposed Architecture

### 3.1 The "Context-First" Command Pattern
All generic commands in `commands/*.md` will be refactored to follow this structure:

#### A. Enhanced Context Gathering
Replace single-stack detections with a multi-stack detection block:
```bash
# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`
```

#### B. Prefixed Usage Examples
Group examples by environment to prevent confusion:
- **`### [Next.js 15+] ...`**: Primary modern web examples.
- **`### [Elixir 2025] ...`**: High-performance functional examples.
- **`### [Rust 2024] ...`**: Systems and concurrency examples.

#### C. Unified "Modern System Standards" Footer
Replace static single-language footers with a grouped section covering all three primary stacks.

### 3.2 Core Agent Refurbishment
- **`agent/core/systems-architect.md`**: Add guidance for App Router boundaries, RSC vs Client splitting, and Vercel Edge Runtime.
- **`agent/core/performance-optimizer.md`**: Align with Next.js 15 caching (Data Cache, Full Route Cache) and INP metrics.
- **`agent/core/qa-test-engineer.md`**: (COMPLETED) Already has Next.js 15+ sections.

### 3.3 README Update
- **`agent/README.md`**: Complete rewrite to document the new `typescript-nextjs/` directory, the removal of legacy JSON prompts, and the 2026 "Context-First" triad system.

## 4. Implementation Strategy

### Phase 1: Batch Command Refactor
- Target the ~65 "generic" files in `commands/`.
- Apply the `sed` and `replace` operations to update `Context Gathering` and `Modern Standards`.
- Verify no remaining static "Elixir 2025" footers exist in generic commands.

### Phase 2: Core Agent Update
- Manually review and update `systems-architect.md` and `performance-optimizer.md`.
- Ensure YAML frontmatter is consistent across all core agents.

### Phase 3: Documentation
- Update `agent/README.md`.
- Audit `agent/README.md.bak` and cleanup if redundant.

## 5. Success Criteria
- [ ] 100% of generic commands use the multi-stack detection block.
- [ ] No generic command has a footer that exclusively mentions Elixir.
- [ ] `agent/README.md` accurately describes the current file structure and specialized agents.
- [ ] All "high signal" Next.js 15+ patterns are present in the Systems Architect and Senior Engineer agents.
