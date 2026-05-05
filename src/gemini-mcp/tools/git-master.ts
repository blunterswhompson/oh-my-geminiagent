import { execSync } from "node:child_process";

export const git_master_definition = {
  name: "git_master",
  description: "Advanced Git operations (atomic commits, rebase orchestration, history search).",
  inputSchema: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        enum: ["status", "commit", "rebase", "log"],
        description: "The git operation to perform"
      },
      args: {
        type: "object",
        properties: {
          message: { type: "string", description: "Commit message" },
          files: { type: "array", items: { type: "string" }, description: "Files to stage" },
          query: { type: "string", description: "Search query for history" },
          target: { type: "string", description: "Target branch for rebase" }
        }
      }
    },
    required: ["operation"]
  }
};

export async function execute_git_master(args: any) {
  const { operation, args: opArgs } = args;

  try {
    switch (operation) {
      case "status": {
        const status = execSync("git status --short", { encoding: "utf-8" });
        const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
        return {
          content: [{ 
            type: "text", 
            text: `On branch: ${branch}\n\n${status || "Nothing to commit, working tree clean"}` 
          }]
        };
      }

      case "commit": {
        if (!opArgs?.message) throw new Error("Commit message is required");
        if (opArgs.files && opArgs.files.length > 0) {
          execSync(`git add ${opArgs.files.join(" ")}`);
        }
        const result = execSync(`git commit -m "${opArgs.message.replace(/"/g, '\\"')}"`, { encoding: "utf-8" });
        return {
          content: [{ type: "text", text: result }]
        };
      }

      case "rebase": {
        if (!opArgs?.target) throw new Error("Rebase target is required");
        const result = execSync(`git rebase ${opArgs.target}`, { encoding: "utf-8" });
        return {
          content: [{ type: "text", text: result }]
        };
      }

      case "log": {
        const logArgs = opArgs?.query ? `--grep="${opArgs.query.replace(/"/g, '\\"')}"` : "-n 10";
        const result = execSync(`git log --oneline ${logArgs}`, { encoding: "utf-8" });
        return {
          content: [{ type: "text", text: result }]
        };
      }

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error: ${error instanceof Error ? error.message : String(error)}` 
      }],
      isError: true
    };
  }
}
