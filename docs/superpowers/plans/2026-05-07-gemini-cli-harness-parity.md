# Gemini CLI Harness: Parity Phase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the "Healing" and "Knowledge" gaps by implementing a real session client bridge (via transcript parsing) and mapping recovery logic to the internal `session.error` lifecycle.

**Architecture:** A robust `TranscriptClient` that implements the plugin's `client` interface by reading and writing to the Gemini CLI's JSON transcript file. A new `AfterModel` hook mapping that detects finish reasons (e.g., `length`) and dispatches to our internal recovery tier.

**Tech Stack:** Bun, TypeScript, Node.js FS, oh-my-geminiagent internal hooks.

---

### Task 1: The Transcript Client Bridge

**Files:**
- Create: `src/harness/transcript-client.ts`
- Modify: `src/harness/hooks.ts`
- Test: `src/harness/__tests__/transcript-client.test.ts`

- [ ] **Step 1: Implement the `TranscriptClient` class**
Implement a class that reads the `transcript_path` and provides a subset of the OpenCode SDK client methods:
- `session.todo()`: Extracts the latest `write_todos` args from the messages array.
- `session.messages()`: Returns the messages array from the transcript.
- `session.abort()`: A no-op for now (CLI control is limited).

- [ ] **Step 2: Write tests for `TranscriptClient`**
```typescript
test("extracts todos from transcript", async () => {
  const client = new TranscriptClient("/mock/path.json");
  // mock fs read with write_todos call
  const todos = await client.session.todo();
  expect(todos.data.length).toBeGreaterThan(0);
});
```

- [ ] **Step 3: Update `getPluginInstance` in `src/harness/hooks.ts`**
Replace the `mockClient` with a real `TranscriptClient` instance initialized with the `transcript_path` passed from the hook wrapper.

- [ ] **Step 4: Commit**
```bash
git add src/harness/
git commit -m "feat: implement functional session bridge via transcript parsing"
```

### Task 2: Healing Bridge (Recovery Logic)

**Files:**
- Modify: `bin/harness-hooks.js`
- Modify: `src/harness/hooks.ts`
- Modify: `gemini-extension.json`
- Test: `src/harness/__tests__/recovery-mapping.test.ts`

- [ ] **Step 1: Map `AfterModel` event in `harness-hooks.js`**
Update the wrapper to handle the `AfterModel` hook point.

- [ ] **Step 2: Implement recovery mapping in `handleGeminiHook`**
In `src/harness/hooks.ts`, map `AfterModel` to the internal `session.error` event IF the `finishReason` is `length` (token limit) or if an error is present.
```typescript
case 'AfterModel':
  if (input.data.llm_response.finishReason === 'length') {
    await eventHandler({
      event: {
        type: 'session.error',
        properties: {
          sessionID: input.data.sessionID,
          error: new Error("Token limit reached")
        }
      }
    });
  }
```

- [ ] **Step 3: Register `AfterModel` in `gemini-extension.json`**
Add the hook registration so the CLI actually calls our wrapper.

- [ ] **Step 4: Verify recovery triggers**
Write a test to ensure the `anthropicContextWindowLimitRecovery` (internal) is called when the hook receives a `length` finish reason.

- [ ] **Step 5: Commit**
```bash
git add bin/ harness-hooks.js src/ gemini-extension.json
git commit -m "feat: map AfterModel to internal session.error for self-healing"
```

### Task 3: Final Verification & Audit Closure

- [ ] **Step 1: Run full parity test suite**
- [ ] **Step 2: Update audit report status to "COMPLETE"**
- [ ] **Step 3: Final Commit**
```bash
git add docs/superpowers/specs/2026-05-07-harness-audit-report.md
git commit -m "docs: finalize harness audit and parity status"
```
