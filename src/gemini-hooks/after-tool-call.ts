/**
 * after-tool-call hook for Gemini CLI extension.
 * Enhances tool results and enforces post-execution mandates.
 */

async function main() {
  let inputJson = "";
  try {
    inputJson = await new Response(process.stdin).text();
    if (!inputJson) {
      process.exit(0);
    }

    const input = JSON.parse(inputJson);
    const { toolName, result } = input;

    let enhancedResult = typeof result === 'string' ? result : JSON.stringify(result);

    // 1. Mandatory Post-Edit Diagnostics Prompting
    if ((toolName === "Edit" || toolName === "Write" || toolName === "replace") && !input.isError) {
      enhancedResult += "\n\n**VERIFICATION MANDATE**: An edit was successful. You MUST now run \`lsp_diagnostics\` on the modified file to ensure no new errors were introduced.";
    }

    // 2. Output Truncation
    if (enhancedResult.length > 50000) {
       enhancedResult = enhancedResult.slice(0, 50000) + "\n\n[Output truncated due to size. Use start_line/end_line to read specific sections.]";
    }

    process.stdout.write(JSON.stringify({ result: enhancedResult }));
    process.exit(0);
  } catch (error) {
    // Fail safe
    process.exit(0);
  }
}

main().catch(() => process.exit(0));
