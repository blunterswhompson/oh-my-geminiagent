import { test, expect, mock, spyOn, beforeEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as pluginInterfaceModule from "../../plugin-interface";

beforeEach(() => {
  resetPluginInstance();
});

test("BeforeTool triggers pluginInterface.tool.execute.before", async () => {
  const mockBefore = mock(async () => {});
  const mockPluginInterface = {
    "tool.execute.before": mockBefore,
    event: mock(async () => {}),
  };

  const spy = spyOn(pluginInterfaceModule, "createPluginInterface").mockReturnValue(mockPluginInterface as any);

  const input = {
    event: "BeforeTool" as const,
    data: {
      sessionID: "test-session",
      tool: "write",
      arguments: { filePath: "test.ts" },
      callID: "test-call-id"
    }
  };

  await handleGeminiHook(input);
  
  expect(mockBefore).toHaveBeenCalled();
  spy.mockRestore();
});

test("AfterTool triggers pluginInterface.tool.execute.after and handles output modification", async () => {
  const mockAfter = mock(async (input: any, output: any) => {
    output.output = "Modified Output";
  });
  const mockPluginInterface = {
    "tool.execute.after": mockAfter,
    event: mock(async () => {}),
  };

  const spy = spyOn(pluginInterfaceModule, "createPluginInterface").mockReturnValue(mockPluginInterface as any);

  const input = {
    event: "AfterTool" as const,
    data: {
      sessionID: "test-session",
      tool: "read",
      result: "Original Output",
      callID: "test-call-id"
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("deny");
  expect(result.message).toBe("Modified Output");
  expect(mockAfter).toHaveBeenCalled();
  
  spy.mockRestore();
});

