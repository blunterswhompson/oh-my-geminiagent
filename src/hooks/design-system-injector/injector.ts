import type { PluginInput } from "@opencode-ai/plugin";
import { findDesignMd } from "./finder";
import { isFrontendFile } from "./matcher";
import { isInjected, markAsInjected } from "./storage";
import { log } from "../../shared";
import { HOOK_NAME, DESIGN_MD_FILENAME } from "./constants";

interface DynamicTruncator {
  truncate: (
    sessionID: string,
    content: string
  ) => Promise<{ result: string; truncated: boolean }>;
}

interface InjectionParams {
  ctx: PluginInput;
  sessionID: string;
  filePath: string;
  output: { output: string };
  truncator: DynamicTruncator;
}

/**
 * Processes a file path for potential DESIGN.md injection.
 */
export async function processFilePathForDesignInjection(params: InjectionParams): Promise<void> {
  const { ctx, sessionID, filePath, output, truncator } = params;

  // 1. Check if it's a frontend file
  if (!isFrontendFile(filePath, ctx.directory)) {
    return;
  }

  // 2. Check if already injected in this session
  if (isInjected(sessionID)) {
    return;
  }

  // 3. Find DESIGN.md
  const designMdContent = findDesignMd(filePath, ctx.directory);
  if (!designMdContent) {
    return;
  }

  // 4. Inject content
  log(`[${HOOK_NAME}] Injecting DESIGN.md context for ${filePath}`, {
    sessionID,
  });

  const { result, truncated } = await truncator.truncate(
    sessionID,
    designMdContent
  );

  const truncationNotice = truncated
    ? `\n\n[Note: Content was truncated to save context window space. For full context, please read the file directly: ${DESIGN_MD_FILENAME}]`
    : "";

  const injection = `\n\n[Design System Context: ${DESIGN_MD_FILENAME}]\n${result}${truncationNotice}`;
  output.output += injection;

  // 5. Mark as injected
  markAsInjected(sessionID);
}
