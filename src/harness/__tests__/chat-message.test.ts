import { test, expect, mock, spyOn, beforeEach } from "bun:test";
import { handleGeminiHook, resetPluginInstance } from "../hooks";
import * as pluginInterfaceModule from "../../plugin-interface";

beforeEach(() => {
  resetPluginInstance();
});

test("BeforeModel triggers chat.message and transform parity", async () => {
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
    event: "BeforeModel" as const,
    data: {
      sessionID: "test-session",
      agent: "sisyphus",
      llm_request: {
        model: "gemini-1.5-pro",
        messages: [
          { role: "user", content: "hello" }
        ]
      }
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(mockChatMessage).toHaveBeenCalled();
  expect(mockMessagesTransform).toHaveBeenCalled();
  
  const updatedRequest = result.data.llm_request;
  // chat.message prepends "chat: ", experimental.chat.messages.transform prepends "transform: "
  expect(updatedRequest.messages[0].content).toBe("transform: chat: hello");

  spy.mockRestore();
});

test("BeforeModel works when optional handlers are missing", async () => {
  const mockPluginInterface = {
    event: mock(async () => {}),
    // Missing chat.message and experimental.chat.messages.transform
  };

  const spy = spyOn(pluginInterfaceModule, "createPluginInterface").mockReturnValue(mockPluginInterface as any);

  const input = {
    event: "BeforeModel" as const,
    data: {
      sessionID: "test-session",
      agent: "sisyphus",
      llm_request: {
        model: "gemini-1.5-pro",
        messages: [
          { role: "user", content: "hello" }
        ]
      }
    }
  };

  const result = await handleGeminiHook(input);
  
  expect(result.status).toBe("allow");
  expect(result.data.llm_request.messages[0].content).toBe("hello");

  spy.mockRestore();
});
