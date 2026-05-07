import { GeminiHookInput, GeminiHookResult } from './types';
import { loadPluginConfig } from '../plugin-config';
import { createManagers } from '../create-managers';
import { createTools } from '../create-tools';
import { createHooks } from '../create-hooks';
import { createEventHandler } from '../plugin/event';
import { createModelCacheState } from '../plugin-state';
import { createRuntimeTmuxConfig } from '../create-runtime-tmux-config';
import { PluginContext } from '../plugin/types';
import { TranscriptClient } from './transcript-client';

let cachedPluginInstance: any = null;

export function resetPluginInstance() {
  cachedPluginInstance = null;
}

async function getPluginInstance(directory: string, transcriptPath?: string) {
  if (
    cachedPluginInstance &&
    cachedPluginInstance.directory === directory &&
    cachedPluginInstance.transcriptPath === transcriptPath
  ) {
    return cachedPluginInstance;
  }

  // Use TranscriptClient if transcriptPath is provided, otherwise fallback to mock
  const client = transcriptPath
    ? new TranscriptClient(transcriptPath)
    : ({
        session: {
          abort: async () => ({}),
          prompt: async () => ({}),
          summarize: async () => ({}),
          todo: async () => ({ data: [] }),
          messages: async () => ({ data: [] }),
        },
      } as any);

  const pluginContext: PluginContext = {
    directory,
    client,
  };

  const pluginConfig = loadPluginConfig(directory, pluginContext);
  const tmuxConfig = createRuntimeTmuxConfig(pluginConfig);
  const modelCacheState = createModelCacheState();
  const disabledHooks = new Set(pluginConfig.disabled_hooks ?? []);
  const isHookEnabled = (hookName: any) => !disabledHooks.has(hookName);

  const managers = createManagers({
    ctx: pluginContext,
    pluginConfig,
    tmuxConfig,
    modelCacheState,
    backgroundNotificationHookEnabled: isHookEnabled('background-notification'),
  });

  const toolsResult = await createTools({
    ctx: pluginContext,
    pluginConfig,
    managers,
  });

  const hooks = createHooks({
    ctx: pluginContext,
    pluginConfig,
    modelCacheState,
    backgroundManager: managers.backgroundManager,
    modelFallbackControllerAccessor: managers.modelFallbackControllerAccessor,
    isHookEnabled,
    safeHookEnabled: true,
    mergedSkills: toolsResult.mergedSkills,
    availableSkills: toolsResult.availableSkills,
  });

  const eventHandler = createEventHandler({
    ctx: pluginContext,
    pluginConfig,
    firstMessageVariantGate: {
      markSessionCreated: () => {},
      clear: () => {},
    },
    managers,
    hooks,
  });

  cachedPluginInstance = {
    directory,
    transcriptPath,
    eventHandler,
    hooks,
    managers,
    pluginConfig,
    pluginContext,
  };

  return cachedPluginInstance;
}

/**
 * Bridge between Gemini CLI hooks and internal plugin hooks.
 */
export async function handleGeminiHook(input: GeminiHookInput): Promise<GeminiHookResult> {
  const directory = input.data.directory || process.cwd();
  const transcriptPath = input.data.transcript_path;
  const { eventHandler } = await getPluginInstance(directory, transcriptPath);

  // Dispatch based on Gemini event type
  switch (input.event) {
    case 'SessionStart':
      await eventHandler({
        event: {
          type: 'session.created',
          properties: {
            sessionID: input.data.sessionID,
            info: {
              id: input.data.sessionID,
            }
          }
        }
      });
      return { status: 'allow' };

    case 'BeforeTool': {
      const { hooks } = await getPluginInstance(directory, transcriptPath);
      if (hooks.commentChecker?.["tool.execute.before"]) {
        await hooks.commentChecker["tool.execute.before"](
          {
            tool: input.data.tool,
            sessionID: input.data.sessionID,
            callID: input.data.callID || "harness-call-id",
          },
          { args: input.data.arguments || {} },
        );
      }
      return { status: 'allow' };
    }

    case 'AfterTool': {
      const { hooks, eventHandler } = await getPluginInstance(directory, transcriptPath);
      if (hooks.commentChecker?.["tool.execute.after"]) {
        const outputObj = {
          title: input.data.tool,
          output: input.data.result || "",
          metadata: input.data.metadata || {},
        };
        await hooks.commentChecker["tool.execute.after"](
          {
            tool: input.data.tool,
            sessionID: input.data.sessionID,
            callID: input.data.callID || "harness-call-id",
          },
          outputObj,
        );
        if (outputObj.output !== (input.data.result || "")) {
          return {
            status: "deny",
            message: outputObj.output,
          };
        }
      }

      // Trigger message.updated for internal telemetry
      await eventHandler({
        event: {
          type: 'message.updated',
          properties: {
            sessionID: input.data.sessionID,
            info: {
              sessionID: input.data.sessionID,
              tool: input.data.tool,
              id: input.data.callID || "harness-call-id",
              role: "tool",
              type: "tool",
            }
          }
        }
      });

      return { status: 'allow' };
    }

    case 'AfterAgent': {
      const { eventHandler } = await getPluginInstance(directory, transcriptPath);
      
      // Trigger session.status for internal turn tracking and fallback awareness
      await eventHandler({
        event: {
          type: 'session.status',
          properties: {
            sessionID: input.data.sessionID,
            status: {
              type: 'idle'
            }
          }
        }
      });
      return { status: 'allow' };
    }

    case 'AfterModel':
      if (input.data.llm_response?.finishReason === 'length') {
        await eventHandler({
          event: {
            type: 'session.error',
            properties: {
              sessionID: input.data.sessionID,
              error: new Error("Token limit reached")
            }
          }
        });
      }
      return { status: 'allow' };

    case 'PreCompress': {
      const { hooks, eventHandler } = await getPluginInstance(directory, transcriptPath);
      
      // Capture state before compaction
      await hooks.compactionContextInjector?.capture(input.data.sessionID);
      await hooks.compactionTodoPreserver?.capture(input.data.sessionID);

      // Trigger internal compaction event to notify other hooks (e.g. contextWindowMonitor)
      await eventHandler({
        event: {
          type: 'experimental.session.compacting',
          properties: {
            sessionID: input.data.sessionID,
          }
        }
      });
      return { status: 'allow' };
    }

    case 'SessionEnd': {
      const { hooks, managers } = await getPluginInstance(directory, transcriptPath);
      hooks.disposeHooks();
      await managers.skillMcpManager.disconnectSession(input.data.sessionID);
      await managers.backgroundManager.shutdown();
      return { status: 'allow' };
    }

    default:
      return { status: 'allow' };
  }
}
