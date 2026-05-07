import { test, expect, mock, spyOn, beforeEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as toolBeforeModule from "../../plugin/tool-execute-before";
import * as toolAfterModule from "../../plugin/tool-execute-after";

beforeEach(() => {
  resetPluginInstance();
});

test("BeforeTool calls the shared pluginInterface handler", async () => {
  const mockBefore = mock(async () => {});
  const spy = spyOn(toolBeforeModule, "createToolExecuteBeforeHandler").mockReturnValue(mockBefore);

  const input = {
    event: "BeforeTool" as const,
    data: {
      sessionID: "test-session",
      tool: "bash",
      arguments: { command: "ls" },
      callID: "test-call-id"
    }
  };

  await handleGeminiHook(input);
  
  expect(mockBefore).toHaveBeenCalled();
  const call = mockBefore.mock.calls[0];
  expect(call[0].tool).toBe("bash");
  expect(call[0].sessionID).toBe("test-session");
  expect(call[0].callID).toBe("test-call-id");
  expect(call[1].args.command).toBe("ls");

  spy.mockRestore();
});

test("AfterTool calls the shared pluginInterface handler and returns 'deny' if output is changed", async () => {
  const mockAfter = mock(async (input: any, output: any) => {
    output.output = "Modified output";
  });
  const spy = spyOn(toolAfterModule, "createToolExecuteAfterHandler").mockReturnValue(mockAfter);

  const input = {
    event: "AfterTool" as const,
    data: {
      sessionID: "test-session",
      tool: "read",
      result: "Original result",
      callID: "test-call-id"
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(mockAfter).toHaveBeenCalled();
  expect(result.status).toBe("deny");
  expect(result.message).toBe("Modified output");

  spy.mockRestore();
});

test("AfterTool returns 'allow' if output is not changed", async () => {
  const mockAfter = mock(async () => {});
  const spy = spyOn(toolAfterModule, "createToolExecuteAfterHandler").mockReturnValue(mockAfter);

  const input = {
    event: "AfterTool" as const,
    data: {
      sessionID: "test-session",
      tool: "read",
      result: "Same result",
      callID: "test-call-id"
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(mockAfter).toHaveBeenCalled();
  expect(result.status).toBe("allow");

  spy.mockRestore();
});
