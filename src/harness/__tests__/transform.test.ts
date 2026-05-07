import { test, expect, mock, spyOn, beforeEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as hooksModule from "../../create-hooks";

beforeEach(() => {
  resetPluginInstance();
});

test("BeforeAgent triggers keyword detector and modifies prompt", async () => {
  const mockKeywordDetector = mock(async (input: any, output: any) => {
    // Simulate keyword detector adding mode instructions
    const textPart = output.parts.find((p: any) => p.type === "text");
    if (textPart && textPart.text.includes("ultrawork")) {
      textPart.text = "MODE: ULTRAWORK\n\n" + textPart.text;
    }
  });

  const mockHooks = {
    keywordDetector: {
      "chat.message": mockKeywordDetector
    },
    contextInjectorMessagesTransform: {},
    thinkingBlockValidator: {},
    toolPairValidator: {}
  };
  
  spyOn(hooksModule, "createHooks").mockReturnValue(mockHooks as any);

  const input = {
    event: "BeforeAgent" as const,
    data: {
      sessionID: "test-session",
      prompt: "I want to do some ultrawork"
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("deny");
  expect(result.message).toContain("MODE: ULTRAWORK");
  expect(mockKeywordDetector).toHaveBeenCalled();
});
