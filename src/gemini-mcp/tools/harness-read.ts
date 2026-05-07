import { readFileSync, existsSync, statSync } from "node:fs";
import { formatHashLines } from "../hashline-edit/hash-computation";
import { findRuleFiles, findProjectRoot } from "../../hooks/rules-injector/finder";
import { homedir } from "node:os";
import { resolve, relative } from "node:path";

/**
 * Enhanced read tool for Gemini CLI.
 * 
 * Replaces the native read_file with a harnessed version that:
 * 1. Automatically adds LINE#ID hashes (for hashline_edit).
 * 2. Automatically injects relevant GEMINI.md rules.
 */

export const omo_read_definition = {
  name: "omo_read",
  description: "Read a file with LINE#ID hashing and automatic rule injection. Preferred over native read_file for editing workflows.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: { type: "string", description: "Path to the file to read" },
      start_line: { type: "number", description: "Optional: 1-based line number to start reading from" },
      end_line: { type: "number", description: "Optional: 1-based line number to end reading at (inclusive)" },
    },
    required: ["filePath"],
  },
};

export async function execute_omo_read(args: any) {
  try {
    const { filePath, start_line, end_line } = args;
    const absolutePath = resolve(process.cwd(), filePath);

    if (!existsSync(absolutePath)) {
      return {
        content: [{ type: "text", text: `Error: File not found: ${filePath}` }],
        isError: true,
      };
    }

    const content = readFileSync(absolutePath, "utf-8");
    let lines = content.split("\n");

    // Handle line ranges
    const start = start_line ? Math.max(0, start_line - 1) : 0;
    const end = end_line ? Math.min(lines.length, end_line) : lines.length;
    
    // Apply hashing
    const formattedContent = lines
      .slice(start, end)
      .map((line, idx) => {
        const lineNum = start + idx + 1;
        // Reusing formatHashLine logic locally to avoid complex stream handling for simple read
        const { formatHashLine } = require("../hashline-edit/hash-computation");
        return formatHashLine(lineNum, line);
      })
      .join("\n");

    let output = `<file>\n${formattedContent}\n</file>`;

    // --- HARNESS GUARD: Automatic Rule Injection ---
    try {
      const projectRoot = findProjectRoot(absolutePath);
      const home = homedir();
      const rules = findRuleFiles(projectRoot, home, absolutePath);

      if (rules.length > 0) {
        output += "\n\n### Relevant Rules Injected:";
        for (const rule of rules) {
          const ruleContent = readFileSync(rule.path, "utf-8");
          const relPath = projectRoot ? relative(projectRoot, rule.path) : rule.path;
          output += `\n\n[Rule: ${relPath}]\n${ruleContent}`;
        }
      }
    } catch (ruleError) {
      console.error("[harness:read] Rule injection failed:", ruleError);
    }

    return {
      content: [{ type: "text", text: output }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}
