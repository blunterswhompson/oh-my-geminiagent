import { resolveGrepCliWithAutoInstall } from "../../shared/ripgrep-cli"
import { runRg } from "./cli"
import type { GrepOptions } from "./types"

export const grep_definition = {
  name: "grep",
  description: "Search for a pattern in the codebase using ripgrep. Use for text search when semantic search is not needed.",
  inputSchema: {
    type: "object",
    properties: {
      pattern: { type: "string", description: "The regex pattern to search for" },
      include: { type: "string", description: "Glob pattern for files to include" },
      exclude: { type: "string", description: "Glob pattern for files to exclude" },
      context: { type: "number", description: "Number of context lines to show" },
    },
    required: ["pattern"],
  },
};

export async function execute_grep(args: any) {
  try {
    const cli = await resolveGrepCliWithAutoInstall()
    const options: GrepOptions = {
      pattern: args.pattern,
      globs: args.include ? [args.include] : undefined,
      excludeGlobs: args.exclude ? [args.exclude] : undefined,
      context: args.context,
    }
    
    const result = await runRg(options, cli)
    
    if (result.error) {
      return {
        content: [{ type: "text", text: `Error: ${result.error}` }],
        isError: true,
      }
    }

    if (result.matches.length === 0) {
      return {
        content: [{ type: "text", text: "No matches found" }],
      }
    }

    const output = result.matches.map(m => `${m.file}:${m.line}:${m.text}`).join("\n")
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
