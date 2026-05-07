import { test, expect, mock, spyOn } from "bun:test";
import { handleGeminiHook } from "../hooks";
import * as eventModule from "../../plugin/event";

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
