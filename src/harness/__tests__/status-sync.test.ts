import { test, expect, mock, spyOn, beforeEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as eventModule from "../../plugin/event";
import * as hooksModule from "../../create-hooks";

beforeEach(() => {
  resetPluginInstance();
});

test("AfterTool triggers message.updated event", async () => {
  const mockEventHandler = mock(async () => {});
  const eventSpy = spyOn(eventModule, "createEventHandler").mockReturnValue(mockEventHandler);
  const mockHooks = {
    commentChecker: {
      "tool.execute.after": mock(async () => {})
    }
  };
  const hooksSpy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const input = {
    event: "AfterTool" as const,
    data: {
      sessionID: "test-session",
      tool: "read_file",
      result: "file content",
      directory: process.cwd()
    }
  };

  await handleGeminiHook(input);
  
  // Verify message.updated was called
  const messageUpdatedCall = mockEventHandler.mock.calls.find(call => call[0].event.type === "message.updated");
  expect(messageUpdatedCall).toBeDefined();
  expect(messageUpdatedCall![0].event.properties.sessionID).toBe("test-session");
  // It should also have info property as expected by internal event handler
  expect(messageUpdatedCall![0].event.properties.info).toBeDefined();
  expect(messageUpdatedCall![0].event.properties.info.sessionID).toBe("test-session");
  expect(messageUpdatedCall![0].event.properties.info.role).toBe("tool");
  expect(messageUpdatedCall![0].event.properties.info.type).toBe("tool");

  eventSpy.mockRestore();
  hooksSpy.mockRestore();
});

test("AfterAgent triggers session.idle event", async () => {
  const mockEventHandler = mock(async () => {});
  const eventSpy = spyOn(eventModule, "createEventHandler").mockReturnValue(mockEventHandler);
  const mockHooks = {
    disposeHooks: mock(() => {})
  };
  const hooksSpy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const input = {
    event: "AfterAgent" as const,
    data: {
      sessionID: "test-session",
      directory: process.cwd()
    }
  };

  await handleGeminiHook(input);
  // Verify session.idle was called
  const sessionIdleCall = mockEventHandler.mock.calls.find(call => call[0].event.type === "session.idle");
  expect(sessionIdleCall).toBeDefined();
  expect(sessionIdleCall![0].event.properties.sessionID).toBe("test-session");

  eventSpy.mockRestore();
  hooksSpy.mockRestore();
});
