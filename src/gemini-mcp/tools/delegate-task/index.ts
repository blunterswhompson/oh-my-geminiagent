/**
 * delegate_task bridge tool for Gemini CLI.
 * 
 * In OpenCode, this spawned a sub-session with a specialized prompt and model.
 * In Gemini CLI, this instructs the orchestrator to use the native sub-agent mechanism.
 */

export const delegate_task_definition = {
  name: "delegate_task",
  description: "Spawn a specialized sub-agent (oracle, librarian, prometheus, etc.) to handle a specific task. Bridges to native Gemini CLI sub-agents.",
  inputSchema: {
    type: "object",
    properties: {
      subagent_type: { 
        type: "string", 
        enum: ["oracle", "librarian", "metis", "prometheus", "hephaestus", "atlas", "momus", "explore"],
        description: "The type of specialized agent to spawn"
      },
      prompt: { type: "string", description: "Full detailed instructions for the agent" },
      task_id: { type: "string", description: "Optional: task ID to resume or reference" },
    },
    required: ["subagent_type", "prompt"],
  },
};

export async function execute_delegate_task(args: any) {
  const { subagent_type, prompt, task_id } = args;

  const instruction = [
    `I have prepared the delegation for the ${subagent_type} agent.`,
    ``,
    `**MANDATORY NEXT STEP**: You must now call the native sub-agent tool '${subagent_type}' with a 'prompt' argument containing the instructions below.`,
    `DO NOT output the instructions as text (e.g. '@${subagent_type} ...'). You MUST use the JSON tool call schema for '${subagent_type}'.`,
    ``,
    `**DELEGATION DETAILS**:`,
    `Agent: ${subagent_type}`,
    `Task ID: ${task_id || "new"}`,
    `Instructions for 'prompt' argument:`,
    `---`,
    prompt,
    `---`,
    ``,
    `Wait for the sub-agent's response before continuing your orchestration.`,
  ].join("\n");

  return {
    content: [{ type: "text", text: instruction }],
  };
}
