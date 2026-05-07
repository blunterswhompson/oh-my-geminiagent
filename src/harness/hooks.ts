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
        pendingPrompts: [],
        session: {
          abort: async () => ({}),
          prompt: async (options: any) => {
            const text = options?.body?.parts?.[0]?.text;
            if (text) (client as any).pendingPrompts.push(text);
            return {};
          },
          promptAsync: async (options: any) => {
            const text = options?.body?.parts?.[0]?.text;
            if (text) (client as any).pendingPrompts.push(text);
            return {};
          },
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
      shouldOverride: () => (client as any).getTurnCount?.() === 1,
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
  const { pluginInterface, pluginContext } = await getPluginInstance(directory, transcriptPath);
  const client = pluginContext.client as any;

  const flushToasts = (result: GeminiHookResult): GeminiHookResult => {
    if (client.toastBuffer && client.toastBuffer.length > 0) {
      const toasts = client.toastBuffer.join('\n');
      result.message = result.message ? `${result.message}\n\n${toasts}` : toasts;
      client.toastBuffer = [];
    }
    return result;
  };

  let result: GeminiHookResult = { status: 'allow' };

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
      result = { status: 'allow' };
      break;

    case 'BeforeTool': {
      await pluginInterface["tool.execute.before"](
        {
          tool: input.data.tool,
          sessionID: input.data.sessionID,
          callID: input.data.callID || "harness-call-id",
        },
        { args: input.data.arguments || {} },
      );
      result = { status: 'allow' };
      break;
    }

    case 'AfterTool': {
      const outputObj = {
        title: input.data.tool,
        output: input.data.result || "",
        metadata: input.data.metadata || {},
      };

      await pluginInterface["tool.execute.after"](
        {
          tool: input.data.tool,
          sessionID: input.data.sessionID,
          callID: input.data.callID || "harness-call-id",
        },
        outputObj,
      );

      if (outputObj.output !== (input.data.result || "")) {
        result = {
          status: "deny",
          message: outputObj.output,
        };
      } else {
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
        result = { status: 'allow' };
      }
      break;
    }

    case 'BeforeAgent': {
      const chatInput = {
        sessionID: input.data.sessionID,
        agent: input.data.agent || 'sisyphus',
        model: { providerID: 'gemini', modelID: 'gemini-exp-1206' }
      };

      const prompt = input.data.prompt || '';
      const chatOutput = {
        message: { role: 'user', content: prompt },
        parts: [{ type: 'text', text: prompt }]
      };

      if (pluginInterface['chat.message']) {
        await pluginInterface['chat.message'](chatInput, chatOutput);
      }

      // Handle command.execute.before if it's a slash command
      if (prompt.startsWith('/') && pluginInterface['command.execute.before']) {
        const parts = prompt.split(' ');
        const command = parts[0].slice(1);
        const args = parts.slice(1).join(' ');
        
        const commandOutput = { parts: chatOutput.parts, message: chatOutput.message };
        await pluginInterface['command.execute.before'](
          { command, sessionID: input.data.sessionID, arguments: args },
          commandOutput
        );
        chatOutput.parts = commandOutput.parts;
        chatOutput.message = commandOutput.message;
      }

      const transformOutput = {
        messages: [{
          info: { role: 'user' },
          parts: chatOutput.parts
        }]
      };

      if (pluginInterface['experimental.chat.messages.transform']) {
        await pluginInterface['experimental.chat.messages.transform']({}, transformOutput as any);
      }

      const finalContent = transformOutput.messages[0].parts.map((p: any) => p.text).join('\n');

      if (finalContent !== prompt) {
        result = {
          status: 'deny',
          message: finalContent
        };
      } else {
        result = { status: 'allow' };
      }
      break;
    }

    case 'AfterAgent': {
      // Trigger session.idle for internal turn tracking and fallback awareness
      await pluginInterface.event({
        event: {
          type: 'session.idle',
          properties: {
            sessionID: input.data.sessionID,
          }
        }
      });

      // Check for pending prompts (e.g. injected by Atlas/Boulder)
      if (client.pendingPrompts && client.pendingPrompts.length > 0) {
        const prompt = client.pendingPrompts.pop();
        result = {
          status: 'deny',
          message: prompt
        };
      } else {
        result = { status: 'allow' };
      }
      break;
    }

    case 'AfterModel': {
      const finishReason = input.data.llm_response?.finishReason;
      
      if (finishReason && finishReason !== 'stop' && finishReason !== 'end_turn') {
        await pluginInterface.event({
          event: {
            type: 'session.error',
            properties: {
              sessionID: input.data.sessionID,
              error: new Error(finishReason === 'length' ? "Token limit reached" : `LLM finish reason: ${finishReason}`)
            }
          }
        });
      }
      result = { status: 'allow' };
      break;
    }

    case 'BeforeModel': {
      const llm_request = input.data.llm_request;
      if (!llm_request || !llm_request.messages) {
        result = { status: 'allow' };
        break;
      }

      // Map experimental.chat.system.transform
      if (pluginInterface['experimental.chat.system.transform']) {
        const systemMessage = llm_request.messages.find((m: any) => m.role === 'system');
        if (systemMessage) {
          const systemOutput = { system: [systemMessage.content] };
          await pluginInterface['experimental.chat.system.transform'](
            {
              sessionID: input.data.sessionID,
              model: { id: llm_request.model, providerID: 'gemini' }
            },
            systemOutput
          );
          if (systemOutput.system[0] !== systemMessage.content) {
            systemMessage.content = systemOutput.system[0];
          }
        }
      }

      // Map chat.params for reasoning effort support
      if (pluginInterface['chat.params']) {
        const paramsInput = {
          sessionID: input.data.sessionID,
          agent: { name: input.data.agent },
          model: { providerID: 'gemini', modelID: llm_request.model },
          provider: { id: 'gemini' },
          message: { variant: input.data.variant }
        };
        const paramsOutput = {
          temperature: llm_request.temperature,
          topP: llm_request.topP,
          topK: llm_request.topK,
          maxOutputTokens: llm_request.maxOutputTokens,
          options: llm_request.options || {}
        };
        
        await pluginInterface['chat.params'](paramsInput, paramsOutput);
        
        // Map back modified params
        llm_request.temperature = paramsOutput.temperature;
        llm_request.topP = paramsOutput.topP;
        llm_request.topK = paramsOutput.topK;
        llm_request.maxOutputTokens = paramsOutput.maxOutputTokens;
        llm_request.options = paramsOutput.options;
      }

      // Map chat.headers for telemetry
      if (pluginInterface['chat.headers']) {
        const lastMessage = llm_request.messages[llm_request.messages.length - 1];
        const headersInput = {
          sessionID: input.data.sessionID,
          provider: { id: 'gemini' },
          message: {
            id: input.data.callID || "harness-call-id",
            role: lastMessage?.role
          }
        };
        const headersOutput = { headers: {} };
        await pluginInterface['chat.headers'](headersInput, headersOutput);
        
        // Gemini CLI doesn't support custom headers, but we record them in metadata if possible
        if (Object.keys(headersOutput.headers).length > 0) {
          llm_request.metadata = { ...llm_request.metadata, ...headersOutput.headers };
        }
      }
      
      result = { status: 'allow', data: { llm_request } };
      break;
    }

    case 'PreCompress': {
      const { hooks } = await getPluginInstance(directory, transcriptPath);
      
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
      result = { status: 'allow' };
      break;
    }

    case 'SessionEnd': {
      const { hooks, managers } = await getPluginInstance(directory, transcriptPath);
      hooks.disposeHooks();
      await managers.skillMcpManager.disconnectSession(input.data.sessionID);
      await managers.backgroundManager.shutdown();
      result = { status: 'allow' };
      break;
    }

    case 'Notification': {
      const msg = input.data.message || input.data.title || input.data.description || '';
      const isRetry = msg.toLowerCase().includes('retry') || msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('quota');
      
      await pluginInterface.event({
        event: {
          type: 'session.status',
          properties: {
            sessionID: input.data.sessionID,
            status: {
              type: isRetry ? 'retry' : 'idle',
              message: msg,
            }
          }
        }
      });
      result = { status: 'allow' };
      break;
    }

    default:
      result = { status: 'allow' };
      break;
  }

  return flushToasts(result);
}
