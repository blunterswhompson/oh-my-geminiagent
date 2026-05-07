# Gemini CLI Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a native Gemini CLI extension that mirrors the full functionality of the `oh-my-opencode` plugin, including dynamic tool discovery and the 52-hook lifecycle.

**Architecture:** A Dynamic MCP Orchestrator bridge that reuses the plugin's `ConfigHandler` and a Hook Translation Layer that maps Gemini CLI events to our internal hook tiers.

**Tech Stack:** Bun, TypeScript, MCP SDK, Gemini CLI Extension API.

---

### Task 1: Dynamic Orchestrator Refactor

**Files:**
- Modify: `src/gemini-mcp/server.ts`
- Create: `src/gemini-mcp/config-bridge.ts`
- Test: `src/gemini-mcp/__tests__/config-bridge.test.ts`

- [ ] **Step 1: Write the failing test for dynamic discovery**
```typescript
import { test, expect } from "bun:test";
import { resolveDynamicTools } from "../config-bridge";

test("should discover tools from multiple tiers", async () => {
  const tools = await resolveDynamicTools();
  expect(tools.length).toBeGreaterThan(26); // core + dynamic
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `bun test src/gemini-mcp/__tests__/config-bridge.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `resolveDynamicTools` using `ConfigHandler`**
```typescript
import { ConfigHandler } from "../plugin-handlers/config-handler";
export async function resolveDynamicTools() {
  const handler = new ConfigHandler();
  const config = await handler.load();
  return config.tools;
}
```

- [ ] **Step 4: Update `server.ts` to use dynamic tools**
```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = await resolveDynamicTools();
  return { tools };
});
```

- [ ] **Step 5: Run test to verify it passes**
Run: `bun test src/gemini-mcp/__tests__/config-bridge.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**
```bash
git add src/gemini-mcp/
git commit -m "feat: implement dynamic tool discovery in harness server"
```

### Task 2: Hook Bridge Foundation

**Files:**
- Create: `src/harness/hooks.ts`
- Create: `src/harness/types.ts`
- Test: `src/harness/__tests__/hooks.test.ts`

- [ ] **Step 1: Define Gemini Hook types and the bridge entry point**
```typescript
export interface GeminiHookInput {
  event: string;
  data: any;
}

export async function handleGeminiHook(input: GeminiHookInput) {
  // Map Gemini event -> Internal Tier -> Internal Hook
}
```

- [ ] **Step 2: Write tests for event mapping**
```typescript
test("SessionStart maps to session.created", async () => {
  const result = await handleGeminiHook({ event: "SessionStart", data: {} });
  // verify internal hook was called
});
```

- [ ] **Step 3: Implement minimal mapping for SessionStart**
- [ ] **Step 4: Commit**
```bash
git add src/harness/
git commit -m "feat: add hook bridge foundation"
```

### Task 3: Translate Critical Hooks (Slop & Boulder)

**Files:**
- Modify: `src/harness/hooks.ts`
- Test: `src/harness/__tests__/hooks.test.ts`

- [ ] **Step 1: Map `AfterTool` to `commentChecker`**
- [ ] **Step 2: Map `AfterAgent` to `todoContinuationEnforcer` (The Boulder)**
- [ ] **Step 3: Implement decision logic (deny/continue)**
- [ ] **Step 4: Write tests for blocking AI slop**
- [ ] **Step 5: Commit**
```bash
git add src/harness/hooks.ts
git commit -m "feat: translate critical tool guard and continuation hooks"
```

### Task 4: Native Delegation Bridge

**Files:**
- Modify: `src/tools/delegate-task/tools.ts`
- Modify: `src/tools/delegate-task/sync-session-creator.ts`

- [ ] **Step 1: Update `delegate_task` to detect harness environment**
- [ ] **Step 2: Implement native `@agent` output formatting**
- [ ] **Step 3: Update subagent registration in `gemini-extension.json`**
- [ ] **Step 4: Commit**
```bash
git add src/tools/delegate-task/
git commit -m "feat: implement native subagent delegation bridge"
```

### Task 5: Finalization & manifest

**Files:**
- Modify: `gemini-extension.json`
- Create: `bin/harness-hooks.js`

- [ ] **Step 1: Register hooks in `gemini-extension.json`**
- [ ] **Step 2: Link all commands from `commands/`**
- [ ] **Step 3: Create executable wrapper for hooks**
- [ ] **Step 4: Final verification in linked CLI**
- [ ] **Step 5: Commit**
```bash
git add gemini-extension.json bin/
git commit -m "feat: finalize gemini-extension.json and hook wrappers"
```
