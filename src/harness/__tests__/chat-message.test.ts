import { test, expect, mock, spyOn, beforeEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as pluginInterfaceModule from "../../plugin-interface";

beforeEach(() => {
  resetPluginInstance();
});

test("BeforeAgent triggers chat.message and transform parity", async () => {
  const mockChatMessage = mock(async (input: any, output: any) => {
    output.parts[0].text = "chat: " + output.parts[0].text;
  });
  const mockMessagesTransform = mock(async (input: any, output: any) => {
    output.messages[0].parts[0].text = "transform: " + output.messages[0].parts[0].text;
  });

  const mockPluginInterface = {
    "chat.message": mockChatMessage,
    "experimental.chat.messages.transform": mockMessagesTransform,
    event: mock(async () => {}),
  };

  const spy = spyOn(pluginInterfaceModule, "createPluginInterface").mockReturnValue(mockPluginInterface as any);

  const input = {
    event: "BeforeAgent" as const,
    data: {
      sessionID: "test-session",
      agent: "sisyphus",
      prompt: "hello"
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("deny");
  expect(mockChatMessage).toHaveBeenCalled();
  expect(mockMessagesTransform).toHaveBeenCalled();
  
  expect(result.message).toBe("transform: chat: hello");

  spy.mockRestore();
});

test("BeforeAgent works when optional handlers are missing", async () => {
  const mockPluginInterface = {
    event: mock(async () => {}),
    // Missing chat.message and experimental.chat.messages.transform
  };

  const spy = spyOn(pluginInterfaceModule, "createPluginInterface").mockReturnValue(mockPluginInterface as any);

  const input = {
    event: "BeforeAgent" as const,
    data: {
      sessionID: "test-session",
      agent: "sisyphus",
      prompt: "hello"
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");

  spy.mockRestore();
});
