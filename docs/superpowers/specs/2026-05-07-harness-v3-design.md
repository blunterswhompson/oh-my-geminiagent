# Spec: Gemini CLI Harness v3.0 (The Pulse & Prune Phase)

**Date**: 2026-05-07
**Status**: DRAFT
**Topic**: Completing 100% parity by bridging Advanced Lifecycle, Proactive Context, and Teardown.

## 1. Overview
Harness v3.0 focuses on the "unseen" parts of the plugin lifecycle: proactive memory management, resource cleanup, and internal status synchronization. It bridges the remaining Gemini CLI hook points (`SessionEnd`, `PreCompress`) to our internal tiers to ensure the harness is as stable and efficient as the original plugin.

## 2. Bridge Architectures

### 2.1 Teardown Bridge (`SessionEnd`)
Ensures that all background resources are cleaned up when the CLI session terminates.
- **Mapping**: `SessionEnd` → `disposeHooks()` & `managers.backgroundManager.dispose()`.
- **Implementation**: The hook wrapper calls the internal disposal sequence, which sends SIGTERM to background subagents and closes tmux panes.

### 2.2 Proactive Context Bridge (`PreCompress`)
Enables the harness to manage memory before the LLM hits a hard context limit.
- **Mapping**: `PreCompress` → `contextWindowMonitor` & `preemptiveCompaction`.
- **Trigger**: Fired by Gemini CLI when context is getting full.
- **Logic**: The bridge reads the `.transcript.json`, calculates total tokens, and if above 80%, triggers the internal compaction logic (summarizing history and pruning tool outputs).

### 2.3 Internal Status Bridge (`AfterTool` / `AfterAgent`)
Synchronizes internal project state without requiring external notifications (OpenClaw).
- **Mapping**:
    - `AfterTool` → `message.updated` (internal status sync).
    - `AfterAgent` → `session.status` (internal retry tracking).
- **Logic**: Updates the internal `SessionStatusRegistry` to ensure reactive fallback chains (`runtimeFallback`) have accurate telemetry on tool successes/failures.

## 3. Data Flow
1. **Teardown**: User exits CLI → `SessionEnd` fires → Bridge disposes all 52 hooks and kills async background tasks.
2. **Pruning**: CLI detects large transcript → `PreCompress` fires → Bridge reads transcript → Internal hooks prune old data → Resulting state is leaner for the next turn.
3. **Pulse**: Tool executes → `AfterTool` fires → Bridge updates internal state → Internal hooks detect if a provider-side retry is needed.

## 4. Verification Strategy
- **Resource Leak Test**: Verify no `bun` or `tmux` processes remain after `SessionEnd`.
- **Memory Pressure Test**: Mock a large transcript and verify that `PreCompress` triggers internal pruning.
- **Status Consistency**: Verify that `runtimeFallback` can see progress data from the bridge.

## 5. Success Criteria
- [ ] Zero resource leaks on session termination.
- [ ] Functional proactive context pruning (no more reactive-only healing).
- [ ] 100% internal status synchronization between the CLI and the plugin core.
