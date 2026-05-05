import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { globSync } from "glob";

export const task_rnd_command_definition = {
  name: "task_rnd_command",
  description: "Discover and execute specialized R&D slash commands (geminirnd/commands/).",
  inputSchema: {
    type: "object",
    properties: {
      command_name: { type: "string", description: "Name of the R&D command (e.g., 'accessibility-audit')" },
      prompt: { type: "string", description: "Additional context or arguments for the command" }
    },
    required: ["command_name"]
  }
};

export async function execute_task_rnd_command(args: any) {
  const { command_name, prompt } = args;
  const rndDir = join(process.cwd(), "geminirnd", "commands");
  
  // Search for the command markdown file
  const pattern = join(rndDir, "**", `${command_name}.md`);
  const files = globSync(pattern.replace(/\\/g, "/"));

  if (files.length === 0) {
    // Try fuzzy match
    const fuzzyPattern = join(rndDir, "**", `*${command_name}*.md`);
    const fuzzyFiles = globSync(fuzzyPattern.replace(/\\/g, "/"));
    
    if (fuzzyFiles.length === 0) {
      return {
        content: [{ type: "text", text: `Error: R&D command '${command_name}' not found in ${rndDir}` }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: `Error: R&D command '${command_name}' not found. Did you mean one of these?\n${fuzzyFiles.map((f: string) => `- ${basename(f, ".md")}`).join("\n")}` 
      }],
      isError: true
    };
  }

  const filePath = files[0];
  const content = readFileSync(filePath, "utf-8");
  
  // Strip frontmatter
  const parts = content.split("---");
  const instructions = parts.length >= 3 ? parts.slice(2).join("---").trim() : content.trim();

  const response = [
    `I have retrieved the workflow for the R&D command **/${command_name}**.`,
    ``,
    `**WORKFLOW INSTRUCTIONS**:`,
    `---`,
    instructions,
    `---`,
    ``,
    prompt ? `**ADDITIONAL CONTEXT**: ${prompt}` : "",
    ``,
    `Please follow this workflow to complete the task.`,
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
