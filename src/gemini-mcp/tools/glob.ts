import { spawn } from "bun";
import { resolve } from "node:path";

const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_LIMIT = 100;

export const glob_definition = {
  name: "glob",
  description: "Fast file pattern matching tool. Supports glob patterns like \"**/*.js\" or \"src/**/*.ts\". Returns matching file paths.",
  inputSchema: {
    type: "object",
    properties: {
      pattern: { type: "string", description: "The glob pattern to match files against" },
      path: { type: "string", description: "The directory to search in" },
    },
    required: ["pattern"],
  },
};

async function getRgPath(): Promise<string> {
  const isWindows = process.platform === "win32";
  const cmd = isWindows ? "where" : "which";
  try {
    const proc = spawn([cmd, "rg"], { stdout: "pipe" });
    const stdout = await new Response(proc.stdout).text();
    return stdout.trim().split("\n")[0] || "rg";
  } catch {
    return "rg";
  }
}

export async function execute_glob(args: any) {
  const { pattern, path } = args;
  try {
    const rgPath = await getRgPath();
    const searchPath = path || ".";
    
    // Using rg --files --glob pattern to implement glob
    const rgArgs = ["--files", "--hidden", "--glob", pattern, searchPath];

    const proc = spawn([rgPath, ...rgArgs], { stdout: "pipe", stderr: "pipe" });
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        proc.kill();
        reject(new Error(`Glob timeout after ${DEFAULT_TIMEOUT_MS}ms`));
      }, DEFAULT_TIMEOUT_MS);
    });

    const [stdout, stderr, exitCode] = await Promise.race([
      Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
        proc.exited,
      ]),
      timeoutPromise,
    ]);

    if (exitCode > 1 && stderr.trim()) {
      return { content: [{ type: "text", text: `Error: ${stderr.trim()}` }], isError: true };
    }

    const lines = stdout.trim().split("\n").filter(Boolean);
    if (lines.length === 0) {
      return { content: [{ type: "text", text: "No files matched the pattern" }] };
    }

    const limitedLines = lines.slice(0, DEFAULT_LIMIT);
    let resultText = limitedLines.join("\n");
    if (lines.length > DEFAULT_LIMIT) {
      resultText += `\n\n[Showing first ${DEFAULT_LIMIT} of ${lines.length} matches]`;
    }

    return { content: [{ type: "text", text: resultText }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}
