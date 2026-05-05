# Spec: Audit and Update of Agents for Modern TypeScript & Next.js

**Date**: 2026-05-03
**Status**: Draft
**Target Stack**: Next.js 15+ (App Router), TypeScript (Strict), Tailwind CSS, Vitest.

## 1. Problem Statement
The current agent and command infrastructure is heavily optimized for Elixir and Rust workloads. Many core agents contain legacy guidance that contradicts modern TypeScript/Next.js best practices (e.g., Ash Framework patterns in a React context). Furthermore, the "Triad System" (Agent-Prompt-Command) is broken due to missing JSON prompt files, leading to reference errors during task execution.

## 2. Goals
- **Modernization**: Align all agents and commands with Next.js 15+ (App Router) and TypeScript standards.
- **Simplification**: Eliminate the dependency on external JSON prompt files by moving expert instructions directly into Agent and Command markdown files.
- **Refinement**: Clean legacy Elixir/Rust references from generic core agents to prevent cross-language hallucinations.
- **Expertise**: Establish a new suite of specialized agents for the TypeScript/Next.js ecosystem.

## 3. Proposed Architecture

### 3.1 New Specialized Agents
Create a new directory `agent/typescript-nextjs/` containing:
- **`app-router-expert.md`**: Specialist in React Server Components (RSC), Server Actions, Streaming, and PPR.
- **`typescript-architect.md`**: Specialist in strict type safety, Zod validation, and architectural patterns for TS.
- **`vitest-specialist.md`**: Specialist in TDD with Vitest, React Testing Library, and mocking strategies.

### 3.2 Command Audit and Refactoring
Update all files in `commands/` to:
- **Auto-Detect Stack**: Update shell injections (e.g., `!cat package.json`) to prioritize JavaScript/TypeScript environments.
- **Inline Instructions**: Remove references to `./prompts/*.json` and replace them with high-signal instruction blocks within the markdown.
- **Tool Alignment**: Ensure commands like `/test` or `/refactor` use `npm/pnpm/yarn` and JS-native linters (ESLint/Prettier).

### 3.3 Core Agent Cleanup
Audit `agent/core/` and `agent/specialized-agents/`:
- Remove Elixir/Rust specific capabilities from generic roles (e.g., `senior-software-engineer`, `qa-test-engineer`).
- Standardize YAML frontmatter for tool permissions (`edit: allow` for implementation roles).

### 3.4 Skill Modernization
Update `skill/frontend-design/SKILL.md`:
- Prioritize **Tailwind CSS** and **Vanilla CSS** (per user preference).
- Focus on **Radix UI** and **Shadcn UI** patterns.
- Align animation guidance with **Framer Motion** for React.

## 4. Implementation Strategy

### Phase 1: Foundation (Cleanup & Setup)
- Delete legacy JSON references in all commands.
- Clean `agent/core/senior-software-engineer.md`.
- Create `agent/typescript-nextjs/` directory.

### Phase 2: Expertise (New Agents)
- Implement `app-router-expert.md`.
- Implement `typescript-architect.md`.
- Implement `vitest-specialist.md`.

### Phase 3: Integration (Commands & Skills)
- Batch update `commands/*.md` with new shell injections and inline instructions.
- Update `skill/frontend-design/SKILL.md`.

## 5. Success Criteria
- [ ] No "file not found" errors for JSON prompts.
- [ ] `senior-software-engineer` provides TS/Next.js guidance without Elixir hallucinations.
- [ ] Specialized Next.js agents provide correct App Router patterns (Server vs Client components).
- [ ] All updated commands successfully gather context from a standard `package.json` setup.
