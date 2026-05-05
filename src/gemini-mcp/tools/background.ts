import { execute_session_manager_tool } from "./session-manager";

export const background_output_definition = {
  name: "background_output",
  description: "Retrieve the output and transcript of a background sub-agent session.",
  inputSchema: {
    type: "object",
    properties: {
      task_id: { type: "string", description: "The session ID or task ID of the background agent" },
      limit: { type: "number", description: "Maximum number of messages to return" },
      include_thinking: { type: "boolean", description: "Whether to include thinking blocks" }
    },
    required: ["task_id"]
  }
};

export const background_cancel_definition = {
  name: "background_cancel",
  description: "Cancel a running background sub-agent session.",
  inputSchema: {
    type: "object",
    properties: {
      task_id: { type: "string", description: "The session ID or task ID to cancel" }
    },
    required: ["task_id"]
  }
};

export async function execute_background_tool(name: string, args: any) {
  switch (name) {
    case "background_output": {
      // Proxy to session_read
      const result = await execute_session_manager_tool("session_read", {
        session_id: args.task_id,
        limit: args.limit || 50
      });
      return result;
    }

    case "background_cancel": {
      // In the native CLI, we don't have a direct cancel API via MCP yet.
      // We'll return an instruction for the user/orchestrator.
      return {
        content: [{ 
          type: "text", 
          text: `Cancellation requested for session ${args.task_id}. Please use the CLI interface to stop the session if it's still running.` 
        }]
      };
    }

    default:
      throw new Error(`Unknown background tool: ${name}`);
  }
}
