import { test, expect, mock, spyOn, beforeEach, afterEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as eventModule from "../../plugin/event";
import * as hooksModule from "../../create-hooks";

beforeEach(() => {
  resetPluginInstance();
});

test("SessionStart maps to session.created", async () => {
  const mockEventHandler = mock(async () => {});
  const spy = spyOn(eventModule, "createEventHandler").mockReturnValue(mockEventHandler);

  const input = {
    event: "SessionStart" as const,
    data: {
      sessionID: "test-session",
      directory: process.cwd()
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(mockEventHandler).toHaveBeenCalled();
  
  const call = mockEventHandler.mock.calls[0];
  expect(call[0].event.type).toBe("session.created");
  expect(call[0].event.properties.sessionID).toBe("test-session");

  spy.mockRestore();
});

test("BeforeTool triggers commentChecker tool.execute.before", async () => {
  const mockBefore = mock(async () => {});
  const mockHooks = {
    commentChecker: {
      "tool.execute.before": mockBefore,
      "tool.execute.after": mock(async () => {})
    }
  };
  
  const spy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const input = {
    event: "BeforeTool" as const,
    data: {
      sessionID: "test-session",
      tool: "write",
      arguments: { filePath: "test.ts", content: "console.log('hi')" },
      callID: "test-call-id"
    }
  };

  await handleGeminiHook(input);
  
  expect(mockBefore).toHaveBeenCalled();
  const call = mockBefore.mock.calls[0];
  expect(call[0].tool).toBe("write");
  expect(call[0].callID).toBe("test-call-id");
  expect(call[1].args.filePath).toBe("test.ts");

  spy.mockRestore();
});

test("AfterTool blocks if commentChecker detects slop", async () => {
  const mockAfter = mock(async (input: any, output: any) => {
    output.output += "\n\nAI slop detected!";
  });
  const mockHooks = {
    commentChecker: {
      "tool.execute.before": mock(async () => {}),
      "tool.execute.after": mockAfter
    }
  };
  
  const spy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const input = {
    event: "AfterTool" as const,
    data: {
      sessionID: "test-session",
      tool: "write",
      result: "Written successfully",
      callID: "test-call-id"
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("deny");
  expect(result.message).toContain("AI slop detected!");
  expect(mockAfter).toHaveBeenCalled();

  spy.mockRestore();
});

test("AfterAgent triggers todoContinuationEnforcer via session.status", async () => {
  const mockEventHandler = mock(async () => {});
  const spy = spyOn(eventModule, "createEventHandler").mockReturnValue(mockEventHandler);

  const input = {
    event: "AfterAgent" as const,
    data: {
      sessionID: "test-session",
      directory: process.cwd()
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(mockEventHandler).toHaveBeenCalled();
  
  const call = mockEventHandler.mock.calls[0];
  expect(call[0].event.type).toBe("session.idle");
  expect(call[0].event.properties.sessionID).toBe("test-session");

  spy.mockRestore();
});

test("BeforeAgent triggers chat.message and messages.transform", async () => {
  const mockChatMsg = mock(async () => {});
  const mockHooks = {
    keywordDetector: { "chat.message": mockChatMsg },
    autoSlashCommand: { "chat.message": mock(async () => {}) },
    claudeCodeHooks: { "messages.transform": mock(async () => {}) },
    thinkingBlockValidator: { "messages.transform": mock(async () => {}) },
    toolPairValidator: { "messages.transform": mock(async () => {}) },
    contextInjectorMessagesTransform: { "messages.transform": mock(async () => {}) }
  };
  
  const spy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const input = {
    event: "BeforeAgent" as const,
    data: {
      sessionID: "test-session",
      agent: "sisyphus",
      prompt: "test prompt",
      directory: process.cwd()
    }
  };

  const result = await handleGeminiHook(input);
  expect(mockChatMsg).toHaveBeenCalled();
  expect(result.status).toBe("allow");

  spy.mockRestore();
});

test("BeforeAgent intercepts and re-prompts if content changed", async () => {
  const mockChatMsg = mock(async (input: any, output: any) => {
    output.parts = [{ type: 'text', text: 'TRANSFORMED PROMPT' }];
  });
  const mockHooks = {
    keywordDetector: { "chat.message": mockChatMsg },
    autoSlashCommand: { "chat.message": mock(async () => {}) },
    claudeCodeHooks: { "messages.transform": mock(async () => {}) },
    thinkingBlockValidator: { "messages.transform": mock(async () => {}) },
    toolPairValidator: { "messages.transform": mock(async () => {}) },
    contextInjectorMessagesTransform: { "messages.transform": mock(async () => {}) }
  };
  
  const spy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const input = {
    event: "BeforeAgent" as const,
    data: {
      sessionID: "test-session",
      agent: "sisyphus",
      prompt: "original prompt",
      directory: process.cwd()
    }
  };

  const result = await handleGeminiHook(input);
  expect(result.status).toBe("deny");
  expect(result.message).toBe("TRANSFORMED PROMPT");

  spy.mockRestore();
});

test("Notification maps to session.status with retry type if message contains retry", async () => {
  const mockEventHandler = mock(async () => {});
  const spy = spyOn(eventModule, "createEventHandler").mockReturnValue(mockEventHandler);

  const input = {
    event: "Notification" as const,
    data: {
      sessionID: "test-session",
      message: "Retrying in 5 seconds due to rate limit",
      directory: process.cwd()
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(mockEventHandler).toHaveBeenCalled();
  
  const call = mockEventHandler.mock.calls[0];
  expect(call[0].event.type).toBe("session.status");
  expect(call[0].event.properties.sessionID).toBe("test-session");
  expect(call[0].event.properties.status.type).toBe("retry");
  expect(call[0].event.properties.status.message).toBe("Retrying in 5 seconds due to rate limit");

  spy.mockRestore();
});

test("Notification maps to session.status with idle type if message does not contain retry", async () => {
  const mockEventHandler = mock(async () => {});
  const spy = spyOn(eventModule, "createEventHandler").mockReturnValue(mockEventHandler);

  const input = {
    event: "Notification" as const,
    data: {
      sessionID: "test-session",
      message: "Processing data...",
      directory: process.cwd()
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(mockEventHandler).toHaveBeenCalled();
  
  const call = mockEventHandler.mock.calls[0];
  expect(call[0].event.type).toBe("session.status");
  expect(call[0].event.properties.sessionID).toBe("test-session");
  expect(call[0].event.properties.status.type).toBe("idle");
  expect(call[0].event.properties.status.message).toBe("Processing data...");

  spy.mockRestore();
});
