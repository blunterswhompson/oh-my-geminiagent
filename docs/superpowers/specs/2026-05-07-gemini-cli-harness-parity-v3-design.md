# Spec: Gemini CLI Harness Parity V3 - Unified Orchestration & UI

**Date:** 2026-05-07
**Status:** Draft
**Ethos:** Relentless Execution (omomomo)

## 1. Goal
Achieve 100% architectural and functional parity between the Gemini CLI harness and the `oh-my-opencode` reference implementation. This version focuses on "Pre-planning" interception, visible UI feedback (Toasts), and stateful turn tracking.

## 2. Architecture

The harness acts as a high-fidelity bridge between Gemini CLI's hook system and the internal `pluginInterface` handlers.

### 2.1 BeforeAgent Interception (Pre-planning)
The `BeforeAgent` hook is the primary entry point for user prompt transformation.

- **Mechanism**: "Intercept & Re-prompt".
- **Handlers**: Bridges `chat.message` and `autoSlashCommand`.
- **Logic**: 
  - If a command/keyword is detected: Return `decision: "deny"` with the expanded template in the `reason` field. This triggers a native turn restart.
  - If no command: Return `decision: "allow"` and proceed to planning.

### 2.2 UI Bridge (Toast Flush)
Bridges `client.tui.showToast` to the terminal-native `systemMessage`.

- **Component**: `ToastBuffer` inside `TranscriptClient`.
- **Implementation**: 
  - `showToast` pushes messages (with `[OMO]` prefix) to a session-specific buffer.
  - Every harness hook (especially `AfterTool` and `AfterAgent`) flushes this buffer into the Gemini CLI `systemMessage` field.
- **Visuals**: Ensures Boulder loop countdowns (`Continuing task... (2s)`) and Slop detection warnings are visible to the user.

### 2.3 Stateful Turn Tracking
Enables turn-aware logic (First Turn vs. Subsequent).

- **Mechanism**: `TranscriptClient.getTurnCount(sessionID)`.
- **Implementation**: Reads the transcript file and counts unique user messages.
- **Bridge**: Un-mocks `firstMessageVariantGate.shouldOverride(sessionID)` to return `true` only if turn count is 1.
- **Impact**: Restores automatic context injection and greetings for new sessions.

## 3. Implementation Details

### 3.1 src/harness/hooks.ts
- Add `BeforeAgent` case.
- Update `handleGeminiHook` to check and flush the `ToastBuffer` into `systemMessage` for all returned results.
- Instantiate `firstMessageVariantGate` with logic that calls `client.getTurnCount()`.

### 3.2 src/harness/transcript-client.ts
- Add `toastBuffer: string[]`.
- Implement `tui.showToast` to push to `toastBuffer`.
- Implement `getTurnCount()` by parsing `transcriptPath`.

## 4. Error Handling
- **Transcript Failures**: If the transcript cannot be read for turn counting, default to `turnCount = 1` to ensure rules are injected.
- **Buffer Overflow**: Clear `ToastBuffer` after each flush to prevent message duplication.

## 5. Verification Plan
- **Test 1**: Verify `/omomomo` in `BeforeAgent` triggers a `deny` with the correct template.
- **Test 2**: Verify `AfterTool` output includes `systemMessage` when a toast is triggered (e.g., by Slop detection).
- **Test 3**: Verify `turnCount` logic correctly identifies the first turn and triggers `GEMINI.md` injection.
