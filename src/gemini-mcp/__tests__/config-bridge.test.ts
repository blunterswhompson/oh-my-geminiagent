import { describe, it, expect, mock, beforeEach } from "bun:test";
import { resolveDynamicTools } from "../config-bridge";

describe("resolveDynamicTools", () => {
  it("should discover dynamic tools from configuration", async () => {
    // This test will fail because resolveDynamicTools is not yet implemented
    const tools = await resolveDynamicTools();
    
    // We expect it to at least return the built-in tools
    expect(tools.length).toBeGreaterThan(0);
    
    // And potentially some dynamic tools if we mock them
    // For now, let's just assert that it's an array
    expect(Array.isArray(tools)).toBe(true);
  });

  it("should include tools from skills", async () => {
    // Mocking the skill loader or filesystem might be needed for a more robust test
    // But for a first failing test, just calling it and expecting it to exist is enough
    const tools = await resolveDynamicTools();
    const toolNames = tools.map(t => t.name);
    
    // We expect some core tools to be there
    expect(toolNames).toContain("grep");
    expect(toolNames).toContain("glob");
  });
});
