import { GeminiHookInput, GeminiHookResult } from './types';
import { loadPluginConfig } from '../plugin-config';
import { createManagers } from '../create-managers';
import { createTools } from '../create-tools';
import { createHooks } from '../create-hooks';
import { createModelCacheState } from '../plugin-state';
import { createRuntimeTmuxConfig } from '../create-runtime-tmux-config';
import { PluginContext } from '../plugin/types';
import { TranscriptClient } from './transcript-client';
import { createPluginInterface } from '../plugin-interface';

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

  const pluginInterface = createPluginInterface({
    ctx: pluginContext,
    pluginConfig,
    firstMessageVariantGate: {
      shouldOverride: () => false,
      markApplied: () => {},
      markSessionCreated: () => {},
      clear: () => {},
    },
    managers,
    hooks,
    tools: toolsResult.tools,
  });

  cachedPluginInstance = {
    directory,
    transcriptPath,
    pluginInterface,
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
  const { pluginInterface } = await getPluginInstance(directory, transcriptPath);

  // Dispatch based on Gemini event type
  switch (input.event) {
    case 'SessionStart':
      await pluginInterface.event({
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
      for (const hookName in hooks) {
        const hook = hooks[hookName];
        if (hook?.["tool.execute.before"]) {
          await hook["tool.execute.before"](
            {
              tool: input.data.tool,
              sessionID: input.data.sessionID,
              callID: input.data.callID || "harness-call-id",
            },
            { args: input.data.arguments || {} },
          );
        }
      }
      return { status: 'allow' };
    }

    case 'AfterTool': {
      const { hooks, pluginInterface } = await getPluginInstance(directory, transcriptPath);
      const outputObj = {
        title: input.data.tool,
        output: input.data.result || "",
        metadata: input.data.metadata || {},
      };

      for (const hookName in hooks) {
        const hook = hooks[hookName];
        if (hook?.["tool.execute.after"]) {
          await hook["tool.execute.after"](
            {
              tool: input.data.tool,
              sessionID: input.data.sessionID,
              callID: input.data.callID || "harness-call-id",
            },
            outputObj,
          );
        }
      }

      if (outputObj.output !== (input.data.result || "")) {
        return {
          status: "deny",
          message: outputObj.output,
        };
      }

      // Trigger message.updated for internal telemetry
      await pluginInterface.event({
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
      const { pluginInterface } = await getPluginInstance(directory, transcriptPath);
      
      // Trigger session.status for internal turn tracking and fallback awareness
      await pluginInterface.event({
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

    case 'AfterModel': {
      const { pluginInterface } = await getPluginInstance(directory, transcriptPath);
      if (input.data.llm_response?.finishReason === 'length') {
        await pluginInterface.event({
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
    }

    case 'BeforeModel': {
      const { pluginInterface } = await getPluginInstance(directory, transcriptPath);
      const llm_request = input.data.llm_request;
      if (!llm_request || !llm_request.messages) {
        return { status: 'allow' };
      }

      // Convert Gemini messages to OpenCode format for transformation
      const lastMessage = llm_request.messages[llm_request.messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        const chatInput = {
          sessionID: input.data.sessionID,
          agent: input.data.agent,
          model: { providerID: 'gemini', modelID: llm_request.model }
        };
        const chatOutput = {
          message: lastMessage,
          parts: [{ type: 'text', text: lastMessage.content }]
        };

        if (pluginInterface['chat.message']) {
          await pluginInterface['chat.message'](chatInput, chatOutput);
          lastMessage.content = chatOutput.parts.map(p => p.text).join('\n');
        }
      }

      const transformOutput = {
        messages: llm_request.messages.map((m: any) => ({
          info: m,
          parts: [{ type: 'text', text: m.content }]
        }))
      };

      if (pluginInterface['experimental.chat.messages.transform']) {
        await pluginInterface['experimental.chat.messages.transform']({}, transformOutput as any);
      }

      // Update messages back
      llm_request.messages = transformOutput.messages.map((m: any) => ({
        ...m.info,
        content: m.parts.map((p: any) => p.text).join('\n')
      }));

      return {
        status: 'allow',
        data: { llm_request }
      };
    }

    case 'PreCompress': {
      const { hooks, pluginInterface } = await getPluginInstance(directory, transcriptPath);
      
      // Capture state before compaction
      await hooks.compactionContextInjector?.capture(input.data.sessionID);
      await hooks.compactionTodoPreserver?.capture(input.data.sessionID);

      // Trigger internal compaction event to notify other hooks (e.g. contextWindowMonitor)
      await pluginInterface.event({
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
