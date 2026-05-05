# Architectural Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Native Gemini Extension into a perfectly synchronized, highly resilient mirroring of the expert OpenCode plugin logic.

**Architecture:** A build-time "Prompt Synchronization Engine" renders TypeScript prompt builders into static Markdown/TOML, while a "Model Resilience Hook" handles dynamic provider availability at runtime.

**Tech Stack:** TypeScript, Bun, Gemini CLI Hook API.

---

### Task 1: Prompt Synchronization Engine

**Files:**
- Create: `script/sync-extension.ts`
- Modify: `package.json`

- [ ] **Step 1: Create the sync script skeleton**
```typescript
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
// Import prompt builders (using relative paths)
// ...

async function sync() {
  console.log("Synchronizing extension components...");
  // 1. Render Agents
  // 2. Render Commands
  // 3. Render RESEARCH.md
}

sync();
```

- [ ] **Step 2: Implement Agent Rendering**
Render `src/agents/*.ts` into `agents/*.md` with YAML frontmatter.
**Sanitization**: `prompt.replace(/@/g, "\\@")`.

- [ ] **Step 3: Implement Command Rendering**
Render `src/features/builtin-commands/*.ts` into `commands/*.toml`.

- [ ] **Step 4: Update package.json scripts**
Add `"extension:sync": "bun run script/sync-extension.ts"`.

- [ ] **Step 5: Run sync and verify files**
Run: `npm run extension:sync`
Check: `agents/sisyphus.md` contains "Disciplined Agent" mandates.

- [ ] **Step 6: Commit**
```bash
git add script/sync-extension.ts package.json agents/ commands/
git commit -m "feat: implement prompt synchronization engine"
```

### Task 2: R&D Library Activation

**Files:**
- Create: `script/generate-rd-index.ts`
- Modify: `script/sync-extension.ts`

- [ ] **Step 1: Create R&D crawler**
Crawl `geminirnd/` for `.md` agent files and `.toml` command files.

- [ ] **Step 2: Generate RESEARCH.md**
Write a hierarchical index to `RESEARCH.md`.

- [ ] **Step 3: Inject into Librarian**
Update `sync-extension.ts` to append `RESEARCH.md` summary to the `@librarian` prompt.

- [ ] **Step 4: Run and verify**
Run: `npm run extension:sync`
Check: `@librarian` now "knows" about the R&D library.

- [ ] **Step 5: Commit**
```bash
git add RESEARCH.md script/
git commit -m "feat: activate R&D library for @librarian"
```

### Task 3: Dynamic Model Resilience Hook

**Files:**
- Create: `src/gemini-hooks/model-resilience.ts`
- Modify: `gemini-extension.json` (indirectly via sync)

- [ ] **Step 1: Implement resilience logic**
Check for API keys in `process.env`. If missing, return a `system_directive` block for affected agents.

- [ ] **Step 2: Register hook in manifest**
Add `SessionStart` event to `gemini-extension.json`.

- [ ] **Step 3: Verify with non-interactive test**
Run: `gemini -p "omomomo"`
Expect: Toast notification about model fallbacks if keys are missing.

- [ ] **Step 4: Commit**
```bash
git add src/gemini-hooks/model-resilience.ts gemini-extension.json
git commit -m "feat: implement dynamic model resilience hook"
```
