import { spawn } from "bun";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Constants from src/tools/interactive-bash/constants.ts
const DEFAULT_TIMEOUT_MS = 60_000;
const BLOCKED_TMUX_SUBCOMMANDS = [
  "capture-pane", "capturep", "save-buffer", "saveb",
  "show-buffer", "showb", "pipe-pane", "pipep",
];
const INTERACTIVE_BASH_DESCRIPTION = `WARNING: This is TMUX ONLY. Pass tmux subcommands directly (without 'tmux' prefix).

Examples: new-session -d -s omo-dev, send-keys -t omo-dev "vim" Enter

For TUI apps needing ongoing interaction (vim, htop, pudb). One-shot commands → use Bash with &.`;

// From src/tools/interactive-bash/tmux-path-resolver.ts
let tmuxPath: string | null = null;
async function getTmuxPath(): Promise<string> {
  if (tmuxPath) return tmuxPath;
  const isWindows = process.platform === "win32";
  const cmd = isWindows ? "where" : "which";
  try {
    const proc = spawn([cmd, "tmux"], { stdout: "pipe" });
    const stdout = await new Response(proc.stdout).text();
    tmuxPath = stdout.trim().split("\n")[0] || "tmux";
    return tmuxPath;
  } catch {
    return "tmux";
  }
}

// From src/tools/interactive-bash/tools.ts
function tokenizeCommand(cmd: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuote = false;
  let quoteChar = "";
  let escaped = false;

  for (let i = 0; i < cmd.length; i++) {
    const char = cmd[i];
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if ((char === "'" || char === '"') && !inQuote) {
      inQuote = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuote) {
      inQuote = false;
      quoteChar = "";
    } else if (char === " " && !inQuote) {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export const interactive_bash_definition = {
  name: "interactive_bash",
  description: INTERACTIVE_BASH_DESCRIPTION,
  inputSchema: {
    type: "object",
    properties: {
      tmux_command: {
        type: "string",
        description: "The tmux command to execute (without 'tmux' prefix)",
      },
    },
    required: ["tmux_command"],
  },
};

export async function execute_interactive_bash(args: any) {
  const { tmux_command } = args;
  try {
    const path = await getTmuxPath();
    const parts = tokenizeCommand(tmux_command);

    if (parts.length === 0) {
      return { content: [{ type: "text", text: "Error: Empty tmux command" }], isError: true };
    }

    const subcommand = parts[0].toLowerCase();
    if (BLOCKED_TMUX_SUBCOMMANDS.includes(subcommand)) {
      // Re-use logic for identifying session name for the error message
      const sessionIdx = parts.findIndex(p => p === "-t" || p.startsWith("-t"));
      let sessionName = "omo-session";
      if (sessionIdx !== -1) {
        if (parts[sessionIdx] === "-t" && parts[sessionIdx + 1]) {
          sessionName = parts[sessionIdx + 1];
        } else if (parts[sessionIdx].startsWith("-t")) {
          sessionName = parts[sessionIdx].slice(2);
        }
      }
      return {
        content: [{
          type: "text",
          text: `Error: '${parts[0]}' is blocked in interactive_bash. Use capture-pane directly via standard shell if needed for ${sessionName}.`,
        }],
        isError: true,
      };
    }

    const proc = spawn([path, ...parts], { stdout: "pipe", stderr: "pipe" });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        proc.kill();
        reject(new Error(`Timeout after ${DEFAULT_TIMEOUT_MS}ms`));
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

    if (exitCode !== 0) {
      return {
        content: [{ type: "text", text: `Error: ${stderr.trim() || `Exit code ${exitCode}`}` }],
        isError: true,
      };
    }

    return { content: [{ type: "text", text: stdout || "(no output)" }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}
