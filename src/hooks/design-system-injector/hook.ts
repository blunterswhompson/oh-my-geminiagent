import type { PluginInput } from "@opencode-ai/plugin";
import { createDynamicTruncator } from "../../shared/dynamic-truncator";
import { processFilePathForDesignInjection } from "./injector";
import { clearInjectedState } from "./storage";

interface ToolExecuteInput {
  tool: string;
  sessionID: string;
}

interface ToolExecuteOutput {
  title: string;
  output: string;
}

interface EventInput {
  event: {
    type: string;
    properties?: unknown;
  };
}

const TRACKED_TOOLS = ["read", "write", "edit", "hashline_edit", "multiedit"];
const DESIGN_MD_FILENAME = "DESIGN.md";

/**
 * Creates the DesignSystemInjector hook.
 */
export function createDesignSystemInjectorHook(
  ctx: PluginInput,
  modelCacheState?: { anthropicContext1MEnabled: boolean },
) {
  const truncator = createDynamicTruncator(ctx, modelCacheState);

  const toolExecuteAfter = async (input: ToolExecuteInput, output: ToolExecuteOutput) => {
    const toolName = input.tool.toLowerCase();

    if (TRACKED_TOOLS.includes(toolName)) {
      const filePath = output.title;
      if (!filePath) return;

      // Invalidate cache if DESIGN.md is modified
      if ((toolName === "write" || toolName === "edit" || toolName === "hashline_edit") && filePath.endsWith(DESIGN_MD_FILENAME)) {
        clearInjectedState(input.sessionID);
      }

      await processFilePathForDesignInjection({
        ctx,
        sessionID: input.sessionID,
        filePath,
        output,
        truncator,
      });
    }
  };

  const eventHandler = async ({ event }: EventInput) => {
    if (event.type === "session.deleted" || event.type === "session.compacted") {
      const props = event.properties as Record<string, unknown> | undefined;
      const sessionID = (props?.sessionID ??
        (props?.info as { id?: string } | undefined)?.id) as string | undefined;
      
      if (sessionID) {
        clearInjectedState(sessionID);
      }
    }
  };

  return {
    "tool.execute.after": toolExecuteAfter,
    event: eventHandler,
  };
}
