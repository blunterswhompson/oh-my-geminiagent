import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { runCommentChecker, type HookInput } from "../../hooks/comment-checker/cli";
import { findRuleFiles, findProjectRoot } from "../../hooks/rules-injector/finder";
import { resolve, relative } from "node:path";
import { homedir } from "node:os";

/**
 * Enhanced write tool for Gemini CLI.
 * 
 * Replaces the native write_file with a harnessed version that:
 * 1. Blocks or warns about AI-generated comment slop using comment-checker.
 * 2. Automatically injects relevant GEMINI.md rules.
 */

export const omo_write_definition = {
  name: "omo_write",
  description: "Write content to a file with comment slop detection and rule injection. Preferred over native write_file.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: { type: "string", description: "Path to the file to write" },
      content: { type: "string", description: "Full content to write to the file" },
      overwrite: { type: "boolean", description: "Whether to overwrite the file if it exists" },
    },
    required: ["filePath", "content"],
  },
};

export async function execute_omo_write(args: any) {
  try {
    const { filePath, content, overwrite } = args;
    const absolutePath = resolve(process.cwd(), filePath);

    if (existsSync(absolutePath) && !overwrite) {
      return {
        content: [{ type: "text", text: `Error: File already exists: ${filePath}. Set overwrite: true if you really want to replace it, or use hashline_edit.` }],
        isError: true,
      };
    }

    // --- HARNESS GUARD: Comment Checker (Pre-write) ---
    const hookInput: HookInput = {
      session_id: "main",
      tool_name: "Write",
      transcript_path: "",
      cwd: process.cwd(),
      hook_event_name: "PostToolUse",
      tool_input: {
        file_path: absolutePath,
        content: content,
      },
    };

    const checkResult = await runCommentChecker(hookInput);
    if (checkResult.hasComments && checkResult.message) {
      return {
        content: [{ type: "text", text: `Error: AI-generated comment slop detected!\n${checkResult.message}\n\nPlease remove the unnecessary comments and try again.` }],
        isError: true,
      };
    }

    writeFileSync(absolutePath, content, "utf-8");

    let finalOutput = `Successfully written to ${filePath}`;

    // --- HARNESS GUARD: Automatic Rule Injection ---
    try {
      const projectRoot = findProjectRoot(absolutePath);
      const home = homedir();
      const rules = findRuleFiles(projectRoot, home, absolutePath);

      if (rules.length > 0) {
        finalOutput += "\n\n### Relevant Rules Injected:";
        for (const rule of rules) {
          const ruleContent = readFileSync(rule.path, "utf-8");
          const relPath = projectRoot ? relative(projectRoot, rule.path) : rule.path;
          finalOutput += `\n\n[Rule: ${relPath}]\n${ruleContent}`;
        }
      }
    } catch (ruleError) {
      console.error("[harness:write] Rule injection failed:", ruleError);
    }

    return {
      content: [{ type: "text", text: finalOutput }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}
