import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const skill_definition = {
  name: "skill",
  description: "Load an expert skill/workflow from the library and inject it into your context.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Name of the skill to activate (e.g., 'github-triage')" },
      user_message: { type: "string", description: "Your goal for using this skill" }
    },
    required: ["name"]
  }
};

export async function execute_skill(args: any) {
  const { name, user_message } = args;
  const skillsDir = join(process.cwd(), ".opencode", "skills");
  
  const skillPath = join(skillsDir, name, "SKILL.md");

  if (!existsSync(skillPath)) {
    const availableSkills = readdirSync(skillsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return {
      content: [{ 
        type: "text", 
        text: `Error: Skill '${name}' not found. Available skills:\n${availableSkills.map(s => `- ${s}`).join("\n")}` 
      }],
      isError: true
    };
  }

  const content = readFileSync(skillPath, "utf-8");
  
  // Strip frontmatter if present
  const parts = content.split("---");
  const instructions = parts.length >= 3 ? parts.slice(2).join("---").trim() : content.trim();

  const response = [
    `I have activated the **${name}** skill.`,
    ``,
    `**SKILL INSTRUCTIONS**:`,
    `---`,
    instructions,
    `---`,
    ``,
    user_message ? `**GOAL**: ${user_message}` : "",
    ``,
    `Please follow these expert instructions for all subsequent actions in this workflow.`,
  ].join("\n");

  return {
    content: [{ type: "text", text: response }],
  };
}
