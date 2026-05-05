# Design Doc: Native Orchestration & R&D Routing

**Goal**: Elevate the Native Gemini Extension into a high-level orchestration layer that leverages native CLI primitives for multi-agent workflows and specialized R&D tasks.

## 1. Native Orchestrator Mandates
- **Mechanism**: The `sync-extension.ts` script will inject a "Native Orchestration Guide" into `agents/sisyphus.md`.
- **Logic**: This guide teaches Sisyphus how to identify when a task requires a specialist and precisely how to invoke native sub-agents (e.g., `@oracle`, `@librarian`) instead of trying to handle everything itself.
- **Workflow**: 
  1. Detect complex sub-task.
  2. Formulate expert prompt.
  3. Invoke `@specialist [prompt]`.
  4. Integrate the result back into the main thread.

## 2. R&D Routing Tool (`task_rnd`)
- **Location**: `src/gemini-mcp/tools/task-rnd.ts`
- **Function**: A new tool that acts as a bridge to the `geminirnd/` library.
- **Parameters**: `agent_name` (string), `prompt` (string).
- **Behavior**:
  1. Crawl `geminirnd/agent/` for the requested agent file.
  2. Read the instructions.
  3. Return a "Preparation Block" to the main agent:
     > "Expert instructions found for [Agent]. To proceed, you MUST invoke a sub-agent with the following instructions: [Rendered Prompt]."

## 3. Automated Tool Metadata Sync
- **Mechanism**: Update `script/sync-extension.ts` to crawl `src/gemini-mcp/tools/`.
- **Logic**: Use `ts-morph` or regex to extract `_definition` objects (description, inputSchema) from the TypeScript tool files.
- **Action**: Automatically overwrite the `mcpServers.main-server.tools` section in `gemini-extension.json`.
- **Benefit**: Ensures the manifest is always up-to-date with the actual capabilities of the MCP server.

## 4. Success Criteria
- **Zero Config Drift**: Tool definitions in the manifest perfectly match the code.
- **R&D Accessibility**: User can ask "Use the Elixir Security Specialist to audit this file," and Sisyphus successfully retrieves the instructions and delegates the task.
- **Native Alignment**: No external bridges or background managers; orchestration happens via standard CLI turns.

## 5. Testing Strategy
1. **Sync Test**: Run `bun run extension:sync` and verify `gemini-extension.json` contains updated tool schemas.
2. **R&D Test**: Trigger `@librarian` to find a specific R&D agent, then use `task_rnd` to fetch its instructions.
3. **Orchestration Test**: Verify Sisyphus uses the native `@` command correctly in a multi-step workflow.
