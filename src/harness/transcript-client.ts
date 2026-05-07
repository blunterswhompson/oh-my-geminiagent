import fs from 'node:fs';

/**
 * Client that reads Gemini CLI session transcripts to provide state to internal hooks.
 */
export class TranscriptClient {
  public pendingPrompts: string[] = [];
  public toastBuffer: string[] = [];

  public tui = {
    showToast: (options: { message?: string; body?: string }) => {
      const msg = options.message || options.body;
      if (msg) this.toastBuffer.push(`[OMO] ${msg}`);
    }
  };

  constructor(private transcriptPath: string) {}

  public getTurnCount(): number {
    try {
      if (!fs.existsSync(this.transcriptPath)) {
        return 1;
      }
      const content = fs.readFileSync(this.transcriptPath, 'utf-8');
      const transcript = JSON.parse(content);
      const messages = transcript.messages || [];
      return messages.filter((m: any) => m.role === 'user').length + 1;
    } catch (e) {
      console.error('[TranscriptClient] Error calculating turn count:', e);
      return 1;
    }
  }

  public session = {
    /**
     * No-op abort implementation.
     */
    abort: async () => {
      return {};
    },

    /**
     * Stores the prompt text in pendingPrompts.
     */
    prompt: async (options: { message: string }) => {
      if (options?.message) {
        this.pendingPrompts.push(options.message);
      }
      return {};
    },

    /**
     * Stores the prompt text in pendingPrompts.
     */
    promptAsync: async (options: { message: string }) => {
      if (options?.message) {
        this.pendingPrompts.push(options.message);
      }
      return {};
    },

    /**
     * No-op summarize implementation.
     */
    summarize: async () => {
      return {};
    },

    /**
     * Reads the transcript and returns the most recent todos.
     */
    todo: async () => {
      try {
        if (!fs.existsSync(this.transcriptPath)) {
          return { data: [] };
        }

        const content = fs.readFileSync(this.transcriptPath, 'utf-8');
        const transcript = JSON.parse(content);
        const messages = transcript.messages || [];

        // Find the most recent assistant message with a write_todos tool call
        for (let i = messages.length - 1; i >= 0; i--) {
          const message = messages[i];
          if (message.role === 'assistant' && Array.isArray(message.content)) {
            const toolCall = message.content.find(
              (part: any) =>
                part.type === 'tool_use' && part.name === 'write_todos'
            );
            if (toolCall && toolCall.input && Array.isArray(toolCall.input.todos)) {
              return { data: toolCall.input.todos };
            }
          }
        }
      } catch (error) {
        console.error('[TranscriptClient] Error reading todos:', error);
      }
      return { data: [] };
    },

    /**
     * Returns the full history of messages from the transcript.
     */
    messages: async () => {
      try {
        if (!fs.existsSync(this.transcriptPath)) {
          return { data: [] };
        }

        const content = fs.readFileSync(this.transcriptPath, 'utf-8');
        const transcript = JSON.parse(content);
        return { data: transcript.messages || [] };
      } catch (error) {
        console.error('[TranscriptClient] Error reading messages:', error);
      }
      return { data: [] };
    },
  };
}
