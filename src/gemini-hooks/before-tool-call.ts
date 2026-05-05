import { existsSync } from "fs";

/**
 * before-tool-call hook for Gemini CLI extension.
 * Ensures safety and architectural mandates are followed.
 */

async function main() {
  let inputJson = "";
  try {
    inputJson = await new Response(process.stdin).text();
    if (!inputJson) {
      process.stdout.write(JSON.stringify({}));
      process.exit(0);
    }

    const input = JSON.parse(inputJson);
    const { toolName, args, sessionHistory } = input;

    // 1. Mandatory Read-before-Edit/Write Guard
    if (toolName === "Edit" || toolName === "Write" || toolName === "replace") {
      const filePath = args.file_path || args.filePath || args.path || args.file;
      if (filePath && existsSync(filePath)) {
        const hasRead = sessionHistory.some((msg: any) => 
          msg.role === "assistant" && 
          (msg.tool_use?.name === "Read" || msg.tool_use?.name === "read_file") && 
          (msg.tool_use?.args?.file_path === filePath || msg.tool_use?.args?.filePath === filePath || msg.tool_use?.args?.path === filePath)
        );

        if (!hasRead) {
          // Exit code 2 triggers a system block in Gemini CLI
          process.stderr.write(`Error: You are attempting to modify '${filePath}' without reading it first. You MUST read a file before modifying it to ensure correct context and anchors.`);
          process.exit(2);
        }
      }
    }

    // Return an empty object to proceed without changes
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  } catch (error) {
    // Fail safe: proceed if we can't parse input
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  }
}

main().catch(() => process.exit(0));
