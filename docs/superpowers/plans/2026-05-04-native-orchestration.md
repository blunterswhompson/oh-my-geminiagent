# Native Orchestration & R&D Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the extension into a high-level orchestration layer that leverages native CLI primitives for multi-agent workflows and specialized R&D tasks.

**Architecture:** A "Native Orchestration Guide" injected into Sisyphus, a `task_rnd` tool for R&D library access, and automated tool metadata synchronization.

**Tech Stack:** TypeScript, Bun, Gemini CLI MCP API.

---

### Task 1: R&D Routing Tool (`task_rnd`)

**Files:**
- Create: `src/gemini-mcp/tools/task-rnd.ts`
- Modify: `src/gemini-mcp/server.ts`

- [ ] **Step 1: Create the task_rnd tool implementation**
```typescript
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { globSync } from "glob";

export const task_rnd_definition = {
  name: "task_rnd",
  description: "Access specialized agents from the R&D library (geminirnd/). Returns instructions for a native sub-agent call.",
  inputSchema: {
    type: "object",
    properties: {
      agent_name: { type: "string", description: "Name of the specialized R&D agent" },
      prompt: { type: "string", description: "The specific task prompt" }
    },
    required: ["agent_name", "prompt"]
  }
};

export async function execute_task_rnd(args: any) {
  const { agent_name, prompt } = args;
  // Search logic for geminirnd/agent/**/*.md
  // ...
  return { content: [{ type: "text", text: "..." }] };
}
```

- [ ] **Step 2: Register task_rnd in server.ts**
Import and add to the `tools` array and the `CallToolRequestSchema` handler.

- [ ] **Step 3: Verify tool with direct MCP call**
Run: `bun run src/gemini-mcp/server.ts` (manually simulate a call or use a test script).

- [ ] **Step 4: Commit**
```bash
git add src/gemini-mcp/tools/task-rnd.ts src/gemini-mcp/server.ts
git commit -m "feat: implement task_rnd tool for R&D routing"
```

### Task 2: Automated Tool Metadata Sync

**Files:**
- Modify: `script/sync-extension.ts`

- [ ] **Step 1: Implement tool metadata extractor**
Add logic to `sync-extension.ts` to crawl `src/gemini-mcp/tools/` and extract `_definition` objects.

- [ ] **Step 2: Update manifest tools**
Update the script to automatically overwrite the `mcpServers.main-server.tools` section in `gemini-extension.json`.

- [ ] **Step 3: Run sync and verify manifest**
Run: `npm run extension:sync`
Check: `gemini-extension.json` now contains full descriptions and schemas for all tools.

- [ ] **Step 4: Commit**
```bash
git add script/sync-extension.ts gemini-extension.json
git commit -m "feat: implement automated tool metadata synchronization"
```

### Task 3: Native Orchestration Guide Injection

**Files:**
- Modify: `script/sync-extension.ts`

- [ ] **Step 1: Define the Orchestration Guide**
Create a specialized instruction block for Sisyphus.

- [ ] **Step 2: Update agent rendering loop**
Update `sync-extension.ts` to append the guide to `agents/sisyphus.md`.

- [ ] **Step 3: Final Verification**
Run: `npm run extension:sync`
Check: `agents/sisyphus.md` contains the new "Native Orchestration" mandates.

- [ ] **Step 4: Commit**
```bash
git add script/sync-extension.ts agents/sisyphus.md
git commit -m "feat: inject native orchestration mandates into @sisyphus"
```
