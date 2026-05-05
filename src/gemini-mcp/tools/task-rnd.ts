import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { globSync } from "glob";

export const task_rnd_definition = {
  name: "task_rnd",
  description: "Access specialized agents from the R&D library (geminirnd/). Returns instructions for a native sub-agent call.",
  inputSchema: {
    type: "object",
    properties: {
      agent_name: { type: "string", description: "Name of the specialized R&D agent (e.g., 'backend-reliability-engineer')" },
      prompt: { type: "string", description: "The specific task prompt" }
    },
    required: ["agent_name", "prompt"]
  }
};

export async function execute_task_rnd(args: any) {
  const { agent_name, prompt } = args;
  const rndDir = join(process.cwd(), "geminirnd", "agent");
  
  // Search for the agent markdown file recursively
  const pattern = join(rndDir, "**", `${agent_name}.md`);
  const files = globSync(pattern.replace(/\\/g, "/")); // glob expects forward slashes

  if (files.length === 0) {
    // Try fuzzy match if exact match fails
    const fuzzyPattern = join(rndDir, "**", `*${agent_name}*.md`);
    const fuzzyFiles = globSync(fuzzyPattern.replace(/\\/g, "/"));
    
    if (fuzzyFiles.length === 0) {
      return {
        content: [{ 
          type: "text", 
          text: `Error: R&D agent '${agent_name}' not found. Searched in: ${rndDir}` 
        }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: `Error: R&D agent '${agent_name}' not found. Did you mean one of these?\n${fuzzyFiles.map(f => `- ${basename(f, ".md")}`).join("\n")}` 
      }],
      isError: true
    };
  }

  const filePath = files[0];
  const content = readFileSync(filePath, "utf-8");
  
  // Strip YAML frontmatter
  const parts = content.split("---");
  const instructions = parts.length >= 3 ? parts.slice(2).join("---").trim() : content.trim();

  const response = [
    `I have retrieved the expert profile for **${agent_name}** from the R&D library.`,
    ``,
    `**MANDATORY NEXT STEP**: You must now delegate the task to the native Gemini CLI agent \`@generalist\` using the instructions below.`,
    ``,
    `**DELEGATION DETAILS**:`,
    `Agent Profile: ${agent_name}`,
    `Source: ${filePath.replace(process.cwd(), ".")}`,
    ``,
    `**EXPERT INSTRUCTIONS**:`,
    `---`,
    instructions,
    `---`,
    ``,
    `**GOAL**:`,
    prompt,
    ``,
    `Invoke \`@generalist\` with this context now.`,
  ].join("\n");

  return {
    content: [{ type: "text", text: response }],
  };
}

function basename(path: string, ext?: string): string {
  const base = path.split(/[\\/]/).pop() || "";
  if (ext && base.endsWith(ext)) {
    return base.slice(0, -ext.length);
  }
  return base;
}
