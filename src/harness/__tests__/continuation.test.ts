import { test, expect, mock, spyOn, beforeEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as eventModule from "../../plugin/event";
import * as hooksModule from "../../create-hooks";

beforeEach(() => {
  resetPluginInstance();
});

test("AfterAgent triggers session.idle and returns deny if a prompt is injected", async () => {
  // Mock hooks to provide necessary fields for createChatMessageHandler
  const mockHooks = {
    runtimeFallback: null,
    stopContinuationGuard: null,
    backgroundNotificationHook: null,
    keywordDetector: null,
    thinkMode: null,
    claudeCodeHooks: null,
    autoSlashCommand: null,
    noSisyphusGpt: null,
    noHephaestusNonGpt: null,
    startWork: null,
    ralphLoop: null,
    disposeHooks: mock(() => {})
  };
  spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  // Mock createEventHandler factory to simulate a hook injecting a prompt
  const eventSpy = spyOn(eventModule, "createEventHandler").mockImplementation((args: any) => {
    return async (input: any) => {
      if (input.event.type === 'session.idle') {
        // Simulate Atlas or Boulder injecting a prompt via promptAsync
        await args.ctx.client.session.promptAsync({ body: { parts: [{ type: 'text', text: "Continue with Task X" }] } });
      }
    };
  });

  const input = {
    event: "AfterAgent" as const,
    data: {
      sessionID: "test-session",
      directory: process.cwd()
    }
  };

  const result = await handleGeminiHook(input);
  
  // Verify that AfterAgent returned a deny with the injected prompt
  expect(result.status).toBe("deny");
  expect(result.message).toBe("Continue with Task X");
  
  eventSpy.mockRestore();
});

test("AfterAgent returns allow if no prompt is injected", async () => {
  const mockHooks = {
    runtimeFallback: null,
    stopContinuationGuard: null,
    backgroundNotificationHook: null,
    keywordDetector: null,
    thinkMode: null,
    claudeCodeHooks: null,
    autoSlashCommand: null,
    noSisyphusGpt: null,
    noHephaestusNonGpt: null,
    startWork: null,
    ralphLoop: null,
    disposeHooks: mock(() => {})
  };
  spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const eventSpy = spyOn(eventModule, "createEventHandler").mockImplementation(() => {
    return async () => {};
  });

  const input = {
    event: "AfterAgent" as const,
    data: {
      sessionID: "test-session",
      directory: process.cwd()
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(result.message).toBeUndefined();

  eventSpy.mockRestore();
});
