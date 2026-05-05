# Design Doc: Architectural Consistency Audit & Sync System

**Goal**: Transform the Native Gemini Extension into a perfectly synchronized, highly resilient mirroring of the expert OpenCode plugin logic.

## 1. Prompt Synchronization Engine
- **Mechanism**: A TypeScript script (`script/sync-extension.ts`) that executes the programmatic prompt builders from `src/agents/` and `src/features/builtin-commands/` and renders them into static `.md` and `.toml` files.
- **Agent Generation**:
  - `agents/*.md`: YAML frontmatter with preferred model + rendered instruction body.
  - **Sanitization**: Escape `@` symbols (e.g., `\@mention`, `\@playwright/mcp`) during render to prevent Gemini CLI `ImportProcessor` errors.
- **Command Generation**:
  - `commands/*.toml`: Rendered `prompt` strings from TypeScript templates.

## 2. Dynamic Model Resilience Hook
- **Hook Type**: `SessionStart`
- **Logic**: 
  1. Enumerate configured providers via the Gemini CLI environment.
  2. Map preferred agent models (e.g., `openai/gpt-5.4`) against available providers.
  3. If a preferred model is unavailable, inject a **Session-Level Directive** to that agent to use `model: inherit`.
  4. Show a non-blocking toast notification in the CLI: `⚠ [Agent Name] falling back to primary model`.

## 3. Tool Registry Synchronization
- **Logic**: Audit `gemini-extension.json` against `src/tools/` discovery.
- **Verification**: Ensure all 26 specialized tools (including `lsp_*` and `hashline_edit`) are correctly exposed and named in the manifest.

## 4. R&D Library Activation (The "Brains" Upgrade)
- **Index Generation**: Crawl `geminirnd/` (100+ specialized agents and commands).
- **RESEARCH.md**: Generate a searchable Markdown index of every R&D capability.
- **Librarian Integration**: Inject the `RESEARCH.md` summary into the `@librarian` agent's core instructions, allowing it to act as a router for the entire R&D library.

## 5. Success Criteria
- **Zero Import Errors**: No `ImportProcessor` errors on CLI startup.
- **Logic Parity**: `agents/sisyphus.md` contains the same "Disciplined Agent" mandates as `src/agents/sisyphus.ts`.
- **Seamless Resilience**: Extension remains fully functional even if only one provider (e.g., Gemini only) is configured.

## 6. Testing Strategy
1. **Validation**: Run `gemini extensions validate .` after sync.
2. **Interactive Test**: Trigger `omomomo` and `@sisyphus` to confirm instruction rendering.
3. **Resilience Test**: Simulate missing API keys and verify the Resilience Hook triggers.
