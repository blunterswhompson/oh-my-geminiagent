# Audit and Update for Modern TypeScript & Next.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the entire agent and command ecosystem to support Next.js 15+ (App Router), TypeScript, and Vitest, while removing legacy Elixir/Rust references and fixing broken JSON prompt links.

**Architecture:** A hybrid "Gemini CLI Native" approach that embeds expert instructions directly into markdown files, creating new specialized TypeScript/Next.js agents and cleaning up core agents.

**Tech Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Initialize New TypeScript & Next.js Agent Directory

**Files:**
- Create: `agent/typescript-nextjs/app-router-expert.md`
- Create: `agent/typescript-nextjs/typescript-architect.md`
- Create: `agent/typescript-nextjs/vitest-specialist.md`

- [ ] **Step 1: Create `app-router-expert.md`**
Create the new specialist agent with App Router guidance.
```markdown
---
description: Expert in Next.js 15+ App Router, Server Components, and Server Actions
mode: all
mcp_servers:
  context7: true
  playwright: true
tools:
  read: true
  grep: true
  glob: true
  write: true
  edit: true
  bash: true
---
# Next.js App Router Expert
## Capabilities
- **React Server Components (RSC)**: Guidance on Server vs Client boundaries.
- **Server Actions**: Secure implementation of data mutations.
- **Data Fetching**: Proper use of `fetch`, caching, and revalidation.
- **Streaming & Suspense**: Implementing loading states and Partial Prerendering (PPR).
```

- [ ] **Step 2: Create `typescript-architect.md`**
Create the TypeScript architect agent.
```markdown
---
description: Expert in TypeScript architecture, strict type safety, and Zod validation
mode: all
mcp_servers:
  context7: true
tools:
  read: true
  grep: true
  glob: true
  write: true
  edit: true
---
# TypeScript Architect
## Capabilities
- **Strict Typing**: Designing robust interfaces and types.
- **Zod Validation**: Implementing runtime schema validation.
- **Design Patterns**: Applying GoF and SOLID patterns in TypeScript.
```

- [ ] **Step 3: Create `vitest-specialist.md`**
Create the Vitest specialist agent.
```markdown
---
description: Expert in Vitest, React Testing Library, and TDD
mode: all
mcp_servers:
  context7: true
tools:
  read: true
  grep: true
  glob: true
  write: true
  edit: true
  bash: true
---
# Vitest Specialist
## Capabilities
- **Unit Testing**: Writing fast, isolated tests for logic.
- **Component Testing**: Testing UI with React Testing Library.
- **Mocking**: Using `vi.mock` and MSW for API mocking.
```

- [ ] **Step 4: Commit new agents**
```bash
git add agent/typescript-nextjs/*.md
git commit -m "feat: add specialized typescript and nextjs agents"
```

---

### Task 2: Refurbish Core Agents (Remove Legacy)

**Files:**
- Modify: `agent/core/senior-software-engineer.md`
- Modify: `agent/core/frontend-ux-specialist.md`

- [ ] **Step 1: Clean `senior-software-engineer.md`**
Remove Elixir/Rust specific sections and replace with general/TS guidance.
```markdown
# Replace lines ~70-130 (Elixir sections) with:
### Modern Web (Next.js & TypeScript)
- **App Router Mastery**: Leverage Server Components for data fetching and Client Components for interactivity.
- **Type Safety**: Ensure 100% type coverage for public APIs and data structures.
- **Performance**: Optimize LCP and CLS using Next.js Image component and font optimization.
```

- [ ] **Step 2: Update `frontend-ux-specialist.md`**
Align with Tailwind and modern design patterns.
```markdown
# Replace Framework-Specific Guidance (Vue/Angular) with:
### Next.js & Tailwind
- **Utility-First**: Use Tailwind CSS for rapid, consistent styling.
- **Component Primitives**: Leverage Radix UI or Shadcn UI for accessible UI patterns.
- **Animations**: Use Framer Motion for smooth, declarative transitions.
```

- [ ] **Step 3: Run diagnostics and commit**
```bash
git add agent/core/*.md
git commit -m "refactor: remove legacy elixir/rust references from core agents"
```

---

### Task 3: Batch Update Commands (Remove JSON References)

**Files:**
- Modify: `commands/*.md` (All files containing `./prompts/*.json`)

- [ ] **Step 1: Identify all files with JSON references**
Run: `grep -l "\.json" commands/*.md`

- [ ] **Step 2: Replace JSON references with inline instructions**
For each identified file, remove the `Reference ./prompts/xyz.json` line and add a brief "Modern Standards" section.
Example for `commands/senior-engineer.md`:
```markdown
# Remove line 335
# Add:
## Modern Standards (Next.js 15+)
- Use React Server Components for data fetching.
- Implement Server Actions for mutations.
- Ensure all components are accessible (ARIA, keyboard).
```

- [ ] **Step 3: Update Context Gathering in commands**
Ensure `package.json` is prioritized.
```markdown
# Change shell injections like:
!`cat mix.exs 2>/dev/null | head -50 || cat package.json 2>/dev/null | head -50`
# to:
!`cat package.json 2>/dev/null | head -50`
```

- [ ] **Step 4: Commit command updates**
```bash
git add commands/*.md
git commit -m "refactor: inline command instructions and prioritize package.json"
```

---

### Task 6: Audit & Correct Elixir Agents/Commands

**Files:**
- Modify: `agent/elixir-specific/*.md`
- Modify: `commands/elixir-*.md`
- Modify: `commands/accessibility-audit.md`, `commands/api-test.md`, etc.

- [ ] **Step 1: Clean Elixir Command Standards**
Replace the hallucinated "Modern Standards (Next.js 15+)" blocks in Elixir commands with correct 2025 Elixir standards.
```markdown
## Modern Standards (Elixir 2025)
- **Framework**: Phoenix 1.7+, LiveView 1.1+ (Streaming).
- **Domain**: Ash Framework 3.0+ for declarative resources.
- **Async**: Oban for background jobs, Broadway for data pipelines.
- **Type Safety**: Dialyzer with comprehensive typespecs.
- **Testing**: ExUnit with StreamData for property-based testing.
```

- [ ] **Step 2: Inline Elixir Agent Instructions**
Audit `agent/elixir-specific/` files. Ensure they have the 5-section structure and high-signal inlined instructions.

- [ ] **Step 3: Restore Elixir Context Gathering**
Ensure commands correctly target `mix.exs` and `lib/`.

---

### Task 7: Audit & Correct Rust Agents/Commands

**Files:**
- Modify: `agent/rust-specific/*.md`
- Modify: `commands/rust-*.md`

- [ ] **Step 1: Clean Rust Command Standards**
Replace hallucinated Next.js blocks with correct 2024 Edition Rust standards.
```markdown
## Modern Standards (Rust 2024 Edition)
- **Stack**: Axum (Web), Tokio (Runtime), SQLx (Database).
- **Concurrency**: Actors via channels, `JoinSet` for task management.
- **Error Handling**: `thiserror` for libraries, `anyhow` for applications.
- **Observability**: `tracing` with OpenTelemetry integration.
- **Testing**: `cargo-nextest` and `proptest`.
```

- [ ] **Step 2: Inline Rust Agent Instructions**
Audit `agent/rust-specific/` files for structural completeness and 2024 Edition patterns.


---

### Task 4: Modernize Frontend Design Skill

**Files:**
- Modify: `skill/frontend-design/SKILL.md`

- [ ] **Step 1: Update framework preference**
```markdown
# Replace Elixir/Phoenix references with:
- **Primary Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Components**: Radix UI, Shadcn UI
```

- [ ] **Step 2: Update testing guidance**
Change Playwright/Phoenix testing references to **Vitest** and **React Testing Library**.

- [ ] **Step 3: Commit skill update**
```bash
git add skill/frontend-design/SKILL.md
git commit -m "refactor: update frontend-design skill for Next.js and Tailwind"
```

---

### Task 5: Final Validation

- [ ] **Step 1: Search for any remaining legacy references**
Run: `grep -rE "Elixir|Rust|Ash Framework|OTP" agent/core/ commands/`
Run: `grep -r "\.json" commands/` (excluding package.json)

- [ ] **Step 2: Fix any survivors**
Manually address any remaining legacy terms or JSON references.

- [ ] **Step 3: Final commit**
```bash
git commit -m "chore: final cleanup of legacy references"
```
