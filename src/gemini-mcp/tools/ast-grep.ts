import { spawn } from "bun";
import { existsSync } from "node:fs";

// Constants from original ast-grep tools
const CLI_LANGUAGES = [
  "bash", "c", "cpp", "csharp", "css", "elixir", "go", "haskell", "html", "java",
  "javascript", "json", "kotlin", "lua", "nix", "php", "python", "ruby", "rust",
  "scala", "solidity", "swift", "typescript", "tsx", "yaml",
];
const DEFAULT_TIMEOUT_MS = 300_000;
const DEFAULT_MAX_OUTPUT_BYTES = 1 * 1024 * 1024;
const DEFAULT_MAX_MATCHES = 500;

export const ast_grep_search_definition = {
  name: "ast_grep_search",
  description: "Search code patterns across filesystem using AST-aware matching. Supports 25 languages. Use meta-variables: $VAR (single node), $$$ (multiple nodes). Patterns must be complete AST nodes (valid code).",
  inputSchema: {
    type: "object",
    properties: {
      pattern: { type: "string", description: "AST pattern with meta-variables ($VAR, $$$)" },
      lang: { type: "string", enum: CLI_LANGUAGES, description: "Target language" },
      paths: { type: "array", items: { type: "string" }, description: "Paths to search (default: ['.'])" },
      globs: { type: "array", items: { type: "string" }, description: "Include/exclude globs" },
      context: { type: "number", description: "Context lines around match" },
    },
    required: ["pattern", "lang"],
  },
};

export const ast_grep_replace_definition = {
  name: "ast_grep_replace",
  description: "Replace code patterns across filesystem with AST-aware rewriting. Dry-run by default. Use meta-variables in rewrite to preserve matched content.",
  inputSchema: {
    type: "object",
    properties: {
      pattern: { type: "string", description: "AST pattern to match" },
      rewrite: { type: "string", description: "Replacement pattern (can use $VAR from pattern)" },
      lang: { type: "string", enum: CLI_LANGUAGES, description: "Target language" },
      paths: { type: "array", items: { type: "string" }, description: "Paths to search" },
      globs: { type: "array", items: { type: "string" }, description: "Include/exclude globs" },
      dryRun: { type: "boolean", description: "Preview changes without applying (default: true)" },
    },
    required: ["pattern", "rewrite", "lang"],
  },
};

async function getSgPath(): Promise<string> {
  const isWindows = process.platform === "win32";
  const cmd = isWindows ? "where" : "which";
  try {
    const proc = spawn([cmd, "sg"], { stdout: "pipe" });
    const stdout = await new Response(proc.stdout).text();
    return stdout.trim().split("\n")[0] || "sg";
  } catch {
    return "sg";
  }
}

function parseSgOutput(stdout: string) {
  if (!stdout.trim()) return { matches: [], truncated: false };
  const truncated = stdout.length >= DEFAULT_MAX_OUTPUT_BYTES;
  const json = truncated ? stdout.substring(0, stdout.lastIndexOf("},") + 1) + "]" : stdout;
  try {
    const matches = JSON.parse(json);
    return { matches: matches.slice(0, DEFAULT_MAX_MATCHES), truncated: truncated || matches.length > DEFAULT_MAX_MATCHES };
  } catch {
    return { matches: [], error: "Failed to parse ast-grep output" };
  }
}

export async function execute_ast_grep(args: any, isReplace: boolean) {
  try {
    const sgPath = await getSgPath();
    const { pattern, lang, paths = ["."], globs, context, rewrite, dryRun = true } = args;

    const baseArgs = ["run", "-p", pattern, "--lang", lang, "--json=compact"];
    if (isReplace && rewrite) {
      baseArgs.push("-r", rewrite);
      if (!dryRun) baseArgs.push("--update-all");
    }
    if (context) baseArgs.push("-C", String(context));
    if (globs) globs.forEach((g: string) => baseArgs.push("--globs", g));
    baseArgs.push(...paths);

    const proc = spawn([sgPath, ...baseArgs], { stdout: "pipe", stderr: "pipe" });
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        proc.kill();
        reject(new Error(`ast-grep timeout after ${DEFAULT_TIMEOUT_MS}ms`));
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

    if (exitCode !== 0 && stdout.trim() === "" && stderr.trim()) {
      return { content: [{ type: "text", text: `Error: ${stderr.trim()}` }], isError: true };
    }

    const { matches, truncated, error } = parseSgOutput(stdout);
    if (error) return { content: [{ type: "text", text: error }], isError: true };

    if (matches.length === 0) {
      return { content: [{ type: "text", text: "No matches found" }] };
    }

    let resultText = isReplace ? `${matches.length} replacement(s)${dryRun ? " (dry run)" : ""}:\n\n` : `Found ${matches.length} match(es):\n\n`;
    
    matches.forEach((m: any) => {
      resultText += `${m.file}:${m.range.start.line + 1}:${m.range.start.column + 1}\n`;
      resultText += `  ${m.lines.trim()}\n\n`;
    });

    if (truncated) resultText += "[Output truncated due to size limit]\n";
    if (isReplace && dryRun) resultText += "Use dryRun=false to apply changes.\n";

    return { content: [{ type: "text", text: resultText.trim() }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}
