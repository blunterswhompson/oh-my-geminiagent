import { test, expect, mock, spyOn, beforeEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as hooksModule from "../../create-hooks";

beforeEach(() => {
  resetPluginInstance();
});

test("rulesInjector adds context to tool output in AfterTool", async () => {
  const mockAfter = mock(async (input: any, output: any) => {
    if (input.tool === "read") {
      output.output += "\n\n<RULE_INJECTION>\nInjected from GEMINI.md\n</RULE_INJECTION>";
    }
  });
  
  const mockHooks = {
    rulesInjector: {
      "tool.execute.after": mockAfter
    }
  };
  
  const spy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const input = {
    event: "AfterTool" as const,
    data: {
      sessionID: "test-session",
      tool: "read",
      result: "File content here",
      callID: "test-call-id"
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("deny");
  expect(result.message).toContain("Injected from GEMINI.md");
  expect(mockAfter).toHaveBeenCalled();

  spy.mockRestore();
});

test("multiple guards are executed in sequence", async () => {
  const mockAfter1 = mock(async (input: any, output: any) => {
    output.output += " [Guard1]";
  });
  const mockAfter2 = mock(async (input: any, output: any) => {
    output.output += " [Guard2]";
  });
  
  const mockHooks = {
    guard1: {
      "tool.execute.after": mockAfter1
    },
    guard2: {
      "tool.execute.after": mockAfter2
    }
  };
  
  const spy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const input = {
    event: "AfterTool" as const,
    data: {
      sessionID: "test-session",
      tool: "read",
      result: "Original",
      callID: "test-call-id"
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("deny");
  expect(result.message).toBe("Original [Guard1] [Guard2]");
  expect(mockAfter1).toHaveBeenCalled();
  expect(mockAfter2).toHaveBeenCalled();

  spy.mockRestore();
});

test("BeforeTool iterates all guards", async () => {
  const mockBefore1 = mock(async () => {});
  const mockBefore2 = mock(async () => {});
  
  const mockHooks = {
    guard1: {
      "tool.execute.before": mockBefore1
    },
    guard2: {
      "tool.execute.before": mockBefore2
    }
  };
  
  const spy = spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

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
  
  expect(mockBefore1).toHaveBeenCalled();
  expect(mockBefore2).toHaveBeenCalled();

  spy.mockRestore();
});
