import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import yaml from "js-yaml";

function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n?---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  if (!match) return { data: {} as any, body: content };
  try {
    return { data: yaml.load(match[1]) as any, body: match[2] };
  } catch {
    return { data: {} as any, body: match[2] };
  }
}

function getFiles(dir: string): string[] {
  const results: string[] = [];
  if (!statSync(dir).isDirectory()) return results;
  const list = readdirSync(dir);
  for (const file of list) {
    const path = join(dir, file);
    const stat = statSync(path);
    if (stat && stat.isDirectory()) {
      results.push(...getFiles(path));
    } else {
      results.push(path);
    }
  }
  return results;
}

function generateIndex() {
  const agentDir = join(process.cwd(), "geminirnd/agent");
  const commandDir = join(process.cwd(), "geminirnd/commands");

  let markdown = "# R&D Library Index\n\n";
  markdown += "This index contains specialized agents and commands available in the `geminirnd/` directory for advanced research and implementation tasks.\n\n";

  // 1. Agents
  markdown += "## Agents\n\n";
  const agentFiles = getFiles(agentDir).filter(f => f.endsWith(".md") && !f.endsWith("README.md") && !f.includes(".backup"));
  
  const agentsByCategory: Record<string, any[]> = {};
  for (const file of agentFiles) {
    const relativePath = relative(agentDir, file);
    const category = relativePath.includes("/") ? relativePath.split("/")[0] : "General";
    const content = readFileSync(file, "utf8");
    const { data } = parseFrontmatter(content);
    const name = relativePath.split("/").pop()?.replace(".md", "") || "Unknown";
    const description = data.description || content.split("\n").find(l => l.trim() && !l.startsWith("#") && !l.startsWith("---"))?.trim() || "No description";
    
    if (!agentsByCategory[category]) agentsByCategory[category] = [];
    agentsByCategory[category].push({ name, description });
  }

  // Sort categories
  const sortedCategories = Object.keys(agentsByCategory).sort();

  for (const category of sortedCategories) {
    const agents = agentsByCategory[category];
    markdown += `### ${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")}\n`;
    for (const agent of agents) {
      markdown += `- **${agent.name}**: ${agent.description}\n`;
    }
    markdown += "\n";
  }

  // 2. Commands
  markdown += "## Commands\n\n";
  const commandFiles = getFiles(commandDir).filter(f => f.endsWith(".md") || f.endsWith(".toml")).sort();
  for (const file of commandFiles) {
    const content = readFileSync(file, "utf8");
    let name = relative(commandDir, file).replace(/\.(md|toml)$/, "");
    let description = "No description";

    if (file.endsWith(".md")) {
      const { data } = parseFrontmatter(content);
      description = data.description || content.split("\n").find(l => l.trim() && !l.startsWith("#") && !l.startsWith("---"))?.trim() || "No description";
    } else {
      // toml
      const descMatch = content.match(/description\s*=\s*"([^"]+)"/);
      if (descMatch) description = descMatch[1];
    }
    markdown += `- **${name}**: ${description}\n`;
  }

  writeFileSync(join(process.cwd(), "RESEARCH.md"), markdown);
  console.log("✅ Generated RESEARCH.md");
}

generateIndex();
