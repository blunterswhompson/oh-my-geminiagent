import { test, expect, mock, spyOn, beforeEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as eventModule from "../../plugin/event";

beforeEach(() => {
  resetPluginInstance();
});

test("AfterModel with finishReason 'length' triggers session.error", async () => {
  const mockEventHandler = mock(async () => {});
  const spy = spyOn(eventModule, "createEventHandler").mockReturnValue(mockEventHandler);

  const input = {
    event: "AfterModel" as const,
    data: {
      sessionID: "test-session",
      directory: process.cwd(),
      llm_response: {
        finishReason: "length"
      }
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(mockEventHandler).toHaveBeenCalled();
  
  const call = mockEventHandler.mock.calls[0];
  expect(call[0].event.type).toBe("session.error");
  expect(call[0].event.properties.sessionID).toBe("test-session");
  expect(call[0].event.properties.error.message).toBe("Token limit reached");

  spy.mockRestore();
});

test("AfterModel with finishReason 'stop' does not trigger session.error", async () => {
  const mockEventHandler = mock(async () => {});
  const spy = spyOn(eventModule, "createEventHandler").mockReturnValue(mockEventHandler);

  const input = {
    event: "AfterModel" as const,
    data: {
      sessionID: "test-session",
      directory: process.cwd(),
      llm_response: {
        finishReason: "stop"
      }
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(mockEventHandler).not.toHaveBeenCalled();

  spy.mockRestore();
});
