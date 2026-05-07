import { test, expect, mock, spyOn, beforeEach, afterEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as eventModule from "../../plugin/event";
import * as hooksModule from "../../create-hooks";
import fs from "node:fs";
import path from "node:path";

const TRANSCRIPT_PATH = path.resolve(process.cwd(), "test-compaction-transcript.json");

beforeEach(() => {
  resetPluginInstance();
  if (fs.existsSync(TRANSCRIPT_PATH)) {
    fs.unlinkSync(TRANSCRIPT_PATH);
  }
});

afterEach(() => {
  if (fs.existsSync(TRANSCRIPT_PATH)) {
    fs.unlinkSync(TRANSCRIPT_PATH);
  }
});

test("PreCompress triggers internal compaction hooks and event", async () => {
  const mockCapture = mock(async () => {});
  const mockTodoCapture = mock(async () => {});
  const mockHooks = {
    compactionContextInjector: {
      capture: mockCapture,
      inject: () => "mock-context"
    },
    compactionTodoPreserver: {
      capture: mockTodoCapture
    },
    commentChecker: {},
    disposeHooks: () => {}
  };
  
  const hooksSpy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);
  const mockEventHandler = mock(async () => {});
  const eventSpy = spyOn(eventModule, "createEventHandler").mockReturnValue(mockEventHandler);

  // Create a large transcript
  const transcript = {
    messages: Array.from({ length: 50 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message ${i} with some content to make it large...`.repeat(5)
    }))
  };
  fs.writeFileSync(TRANSCRIPT_PATH, JSON.stringify(transcript));

  const input = {
    event: "PreCompress" as const,
    data: {
      sessionID: "test-session",
      directory: process.cwd(),
      transcript_path: TRANSCRIPT_PATH
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(mockCapture).toHaveBeenCalledWith("test-session");
  expect(mockTodoCapture).toHaveBeenCalledWith("test-session");
  
  // Verify eventHandler was called with experimental.session.compacting
  expect(mockEventHandler).toHaveBeenCalled();
  const eventCall = mockEventHandler.mock.calls.find(call => call[0].event.type === "experimental.session.compacting");
  expect(eventCall).toBeDefined();
  expect(eventCall![0].event.properties.sessionID).toBe("test-session");

  hooksSpy.mockRestore();
  eventSpy.mockRestore();
});
