import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, sep } from "node:path";
import { homedir } from "node:os";

/**
 * load_rules tool for Gemini CLI.
 * 
 * Replaces the 'rules-injector' hook by allowing agents to explicitly 
 * load project-specific and directory-specific rules.
 */

export const load_rules_definition = {
  name: "load_rules",
  description: "Load project-specific and directory-specific rules from .sisyphus/rules/ and other standard locations.",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "The directory to load rules for (default: current directory)" },
    },
  },
};

function findRuleFilesRecursive(dir: string, results: string[]) {
  if (!existsSync(dir)) return;
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findRuleFilesRecursive(fullPath, results);
    } else if (file.endsWith(".md")) {
      results.push(fullPath);
    }
  }
}

export async function execute_load_rules(args: any) {
  const startDir = args.path || process.cwd();
  const rules: string[] = [];
  const ruleContents: string[] = [];

  // 1. Search up the tree for .sisyphus/rules/
  let currentDir = startDir;
  while (true) {
    const sisyphusRulesDir = join(currentDir, ".sisyphus", "rules");
    if (existsSync(sisyphusRulesDir)) {
      const files: string[] = [];
      findRuleFilesRecursive(sisyphusRulesDir, files);
      rules.push(...files);
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }

  // 2. Global rules (example location)
  const globalRulesDir = join(homedir(), ".oh-my-geminiagent", "rules");
  if (existsSync(globalRulesDir)) {
    const files: string[] = [];
    findRuleFilesRecursive(globalRulesDir, files);
    rules.push(...files);
  }

  // Deduplicate and read
  const uniqueRules = [...new Set(rules)];
  for (const rulePath of uniqueRules) {
    try {
      const content = readFileSync(rulePath, "utf-8");
      ruleContents.push(`### Rule: ${rulePath}\n\n${content}`);
    } catch {}
  }

  if (ruleContents.length === 0) {
    return { content: [{ type: "text", text: "No specific rules found for this directory." }] };
  }

  return {
    content: [{ type: "text", text: `Found ${ruleContents.length} rule(s):\n\n${ruleContents.join("\n\n---\n\n")}` }],
  };
}
