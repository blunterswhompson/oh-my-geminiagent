import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  interactive_bash_definition,
  execute_interactive_bash,
} from "./tools/interactive-bash";
import { grep_definition, execute_grep } from "./tools/grep/index";
import { glob_definition, execute_glob } from "./tools/glob";
import {
  execute_ast_grep,
} from "./tools/ast-grep";
import {
  execute_lsp_tool,
} from "./tools/lsp";
import {
  execute_hashline_edit,
} from "./tools/hashline-edit";
import {
  execute_session_manager_tool,
} from "./tools/session-manager";
import {
  execute_task_tool,
} from "./tools/task";
import {
  execute_look_at,
} from "./tools/look-at";
import {
  execute_delegate_task,
} from "./tools/delegate-task/index";
import {
  execute_load_rules,
} from "./tools/load-rules";
import {
  execute_task_rnd,
} from "./tools/task-rnd";
import {
  execute_task_rnd_command,
} from "./tools/task-rnd-command";
import {
  execute_git_master,
} from "./tools/git-master";
import {
  execute_research_tool,
} from "./tools/research/index";
import {
  execute_background_tool,
} from "./tools/background";
import {
  execute_skill,
} from "./tools/skill";

import { loadPluginConfig } from "../plugin-config";
import { createManagers } from "../create-managers";
import { createTools } from "../create-tools";
import { createRuntimeTmuxConfig } from "../create-runtime-tmux-config";
import { createModelCacheState } from "../plugin-state";
import { ALL_TOOL_DEFINITIONS } from "./tool-definitions";
import { resolveDynamicTools } from "./config-bridge";

const server = new Server(
  {
    name: "oh-my-geminiagent-tools",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool handlers will be registered here in Phase 2.
 */

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const dynamicTools = await resolveDynamicTools();
  return {
    tools: dynamicTools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "interactive_bash":
        return await execute_interactive_bash(args);
      case "grep":
        return await execute_grep(args);
      case "glob":
        return await execute_glob(args);
      case "ast_grep_search":
        return await execute_ast_grep(args, false);
      case "ast_grep_replace":
        return await execute_ast_grep(args, true);
      case "lsp_goto_definition":
      case "lsp_find_references":
      case "lsp_symbols":
      case "lsp_diagnostics":
      case "lsp_prepare_rename":
      case "lsp_rename":
        return await execute_lsp_tool(name, args);
      case "hashline_edit":
        return await execute_hashline_edit(args);
      case "session_list":
      case "session_read":
      case "session_search":
      case "session_info":
        return await execute_session_manager_tool(name, args);
      case "task_create":
      case "task_get":
      case "task_list":
      case "task_update":
        return await execute_task_tool(name, args);
      case "look_at":
        return await execute_look_at(args);
      case "delegate_task":
        return await execute_delegate_task(args);
      case "load_rules":
        return await execute_load_rules(args);
      case "task_rnd":
        return await execute_task_rnd(args);
      case "task_rnd_command":
        return await execute_task_rnd_command(args);
      case "git_master":
        return await execute_git_master(args);
      case "grep_app":
      case "context7":
      case "websearch":
        return await execute_research_tool(name, args);
      case "background_output":
      case "background_cancel":
        return await execute_background_tool(name, args);
      case "skill":
        return await execute_skill(args);
      default: {
        // Dynamic tool routing fallback
        const directory = process.cwd();
        const pluginConfig = loadPluginConfig(directory, {});
        const tmuxConfig = createRuntimeTmuxConfig(pluginConfig);
        const modelCacheState = createModelCacheState();

        const managers = createManagers({
          ctx: { directory, client: null },
          pluginConfig,
          tmuxConfig,
          modelCacheState,
          backgroundNotificationHookEnabled: true,
        });

        const { filteredTools } = await createTools({
          ctx: { directory, client: null },
          pluginConfig,
          managers,
        });

        const tool = filteredTools[name];
        if (tool) {
          return await tool.execute(args, {
            sessionId: "harness-session", // Placeholder for CLI
          });
        }
        throw new Error(`Tool not found: ${name}`);
      }
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Gemini MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
