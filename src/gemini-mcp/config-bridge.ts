import { loadPluginConfig } from "../plugin-config";
import { createManagers } from "../create-managers";
import { createTools } from "../create-tools";
import { createRuntimeTmuxConfig } from "../create-runtime-tmux-config";
import { createModelCacheState } from "../plugin-state";

/**
 * Bridges the Gemini CLI MCP server to the plugin's dynamic tool discovery system.
 * Reuses the same logic as oh-my-opencode to find and register tools from skills, 
 * commands, and external MCPs.
 */
export async function resolveDynamicTools() {
  const directory = process.cwd();

  // 1. Load dynamic configuration
  const pluginConfig = loadPluginConfig(directory, {});

  // 2. Prepare state and config for managers
  const tmuxConfig = createRuntimeTmuxConfig(pluginConfig);
  const modelCacheState = createModelCacheState();

  // 3. Create managers (for stateful tools)
  const managers = createManagers({
    ctx: { directory, client: null },
    pluginConfig,
    tmuxConfig,
    modelCacheState,
    backgroundNotificationHookEnabled: true,
  });

  // 4. Assemble tools
  const { filteredTools } = await createTools({
    ctx: { directory, client: null },
    pluginConfig,
    managers,
  });

  // 5. Map internal tools to MCP Tool definitions
  return Object.entries(filteredTools).map(([name, tool]) => ({
    name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));
}
