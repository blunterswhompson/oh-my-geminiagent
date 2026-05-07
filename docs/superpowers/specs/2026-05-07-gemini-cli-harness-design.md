# Spec: oh-my-geminiagent Gemini CLI Harness

**Date**: 2026-05-07
**Status**: DRAFT
**Topic**: Building a fully functional Gemini CLI harness to achieve parity with the OpenCode plugin.

## 1. Overview
The Gemini CLI Harness serves as the architectural bridge between the highly sophisticated `oh-my-opencode` plugin logic and the Gemini CLI's extension system. It enables "Relentless Execution," multi-agent orchestration, and a 3-tier MCP system within the native Gemini environment.

## 2. Architecture

### 2.1 Dynamic MCP Orchestrator (`src/harness/server.ts`)
The `main-server` is refactored from a static MCP server to a dynamic orchestrator.
- **Initialization**: On startup, it executes the `ConfigHandler` 6-phase pipeline.
- **Tool Merging**: It dynamically merges:
    - **Tier 1**: Built-in remote MCPs (Exa, Context7, Grep.app).
    - **Tier 2**: Workspace `.mcp.json` files with environment variable expansion.
    - **Tier 3**: Skill-embedded MCPs defined in `SKILL.md` YAML frontmatter.
- **Session Management**: Uses the existing `BackgroundManager` to handle asynchronous tasks, maintaining state in `.sisyphus/`.

### 2.2 Hook Bridge (`src/harness/hooks.ts`)
A unified hook entry point translates Gemini CLI lifecycle events into the plugin's internal hook tiers.

| Gemini CLI Hook | Internal Tier | Target Hooks |
|-----------------|---------------|--------------|
| `SessionStart`  | Session       | `session.created`, `autoUpdateChecker` |
| `BeforeTool`    | Tool Guard    | `writeExistingFileGuard`, `bashFileReadGuard` |
| `AfterTool`     | Tool Guard    | `commentChecker`, `hashlineReadEnhancer`, `jsonErrorRecovery` |
| `AfterAgent`    | Continuation  | `todoContinuationEnforcer`, `atlasHook` (The "Boulder") |
| `Notification`  | Continuation  | `backgroundNotificationHook` |
| `PreCompress`   | Transform     | `contextWindowMonitor`, `preemptiveCompaction` |

### 2.3 Agent & Command Mapping
- **Subagents**: Standard `agents/*.md` files are registered with the CLI. The `delegate_task` tool is updated to prefer native `@` syntax when running in the harness.
- **Commands**: Existing `.toml` commands in `commands/` are linked directly to the extension manifest.

## 3. Data Flow
1. **User Action**: User runs `gemini` or a custom command like `/refactor`.
2. **CLI Initialization**: Gemini CLI loads the `oh-my-geminiagent` extension.
3. **Dynamic Discovery**: The `main-server` scans for skills and MCPs, presenting a unified toolset.
4. **Hook Execution**: During the agent loop, the CLI invokes our hook bridge. The bridge reads the shared session state from `.sisyphus/tasks/`, runs our logic, and returns JSON decisions (e.g., "deny" or "continue").

## 4. Error Handling & Logging
- **Logging**: All internal logs continue to flow to `/tmp/oh-my-opencode.log`.
- **Fail-Safe**: Hook failures are caught by a `safeCreateHook` wrapper, ensuring the CLI doesn't crash on plugin errors.

## 5. Testing Strategy
- **Parity Tests**: A new test suite will verify that tool outputs and hook decisions are identical between the OpenCode and Gemini CLI harnesses.
- **Mock CLI**: Use a simulated CLI environment to test hook JSON outputs.

## 6. Success Criteria
- [ ] 100% parity of the 26 core tools.
- [ ] Working "Boulder" continuation logic in the Gemini CLI.
- [ ] Successful dynamic loading of Tier-2 and Tier-3 MCPs.
- [ ] Native `@agent` delegation working with specialized personas.
