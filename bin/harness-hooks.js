#!/usr/bin/env bun
/**
 * Gemini CLI Hook Wrapper
 * 
 * This script bridges Gemini CLI lifecycle events to the oh-my-geminiagent harness.
 * Supported events include: SessionStart, BeforeTool, AfterTool, AfterAgent, AfterModel, BeforeModel, PreCompress, SessionEnd.
 */
import { handleGeminiHook } from '../src/harness/hooks';

async function main() {
  const event = process.argv[2];
  // Gemini CLI passes hook data as a JSON string in the last argument
  const dataString = process.argv[process.argv.length - 1];
  
  let data = {};
  if (dataString && dataString.startsWith('{')) {
    try {
      data = JSON.parse(dataString);
    } catch (e) {
      data = { raw: dataString };
    }
  }

  try {
    const result = await handleGeminiHook({
      event: event,
      data: {
        ...data,
        directory: process.cwd()
      }
    });
    
    // Map internal result structure to Gemini CLI expected structure
    const output = {
      decision: result.status,
      reason: result.message,
      data: result.data
    };

    // Output the result as JSON for Gemini CLI to consume
    process.stdout.write(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    console.error(`Error in ${event} hook:`, error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error in hook wrapper:', err);
  process.exit(1);
});
