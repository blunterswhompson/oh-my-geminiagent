import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { randomUUID } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { PluginInput } from "@opencode-ai/plugin";
import { clearInjectedState } from "./storage";

function createPluginContext(directory: string): PluginInput {
  return { directory } as PluginInput;
}

function createTruncator(input?: { truncated?: boolean; result?: string }) {
  return {
    truncate: async (_sessionID: string, content: string) => ({
      result: input?.result ?? content,
      truncated: input?.truncated ?? false,
    }),
  };
}

describe("processFilePathForDesignInjection", () => {
  let testRoot = "";

  beforeEach(() => {
    testRoot = join(tmpdir(), `design-system-injector-${randomUUID()}`);
    mkdirSync(testRoot, { recursive: true });
    // clearInjectedState is called by the hook on session deletion, but for tests we clear manually
  });

  afterEach(() => {
    rmSync(testRoot, { recursive: true, force: true });
  });

  it("injects DESIGN.md content when a frontend file is accessed", async () => {
    // given
    writeFileSync(join(testRoot, "DESIGN.md"), "# Design System\ncolors: #fff");
    const { processFilePathForDesignInjection } = await import("./injector");
    const output = { output: "base" };
    const sessionID = "session-1";
    const truncator = createTruncator();
    clearInjectedState(sessionID);

    // when
    await processFilePathForDesignInjection({
      ctx: createPluginContext(testRoot),
      sessionID,
      filePath: "src/components/Button.tsx",
      output,
      truncator,
    });

    // then
    expect(output.output).toContain("[Design System Context: DESIGN.md]");
    expect(output.output).toContain("# Design System");
    expect(output.output).toContain("colors: #fff");
  });

  it("does not inject for non-frontend files", async () => {
    // given
    writeFileSync(join(testRoot, "DESIGN.md"), "# Design System");
    const { processFilePathForDesignInjection } = await import("./injector");
    const output = { output: "base" };
    const sessionID = "session-2";
    const truncator = createTruncator();
    clearInjectedState(sessionID);

    // when
    await processFilePathForDesignInjection({
      ctx: createPluginContext(testRoot),
      sessionID,
      filePath: "src/server/config.json",
      output,
      truncator,
    });

    // then
    expect(output.output).toBe("base");
  });

  it("does not re-inject in the same session", async () => {
    // given
    writeFileSync(join(testRoot, "DESIGN.md"), "# Design System");
    const { processFilePathForDesignInjection } = await import("./injector");
    const sessionID = "session-3";
    const truncator = createTruncator();
    clearInjectedState(sessionID);
    
    const firstOutput = { output: "base" };
    const secondOutput = { output: "base" };

    // when
    await processFilePathForDesignInjection({
      ctx: createPluginContext(testRoot),
      sessionID,
      filePath: "src/App.tsx",
      output: firstOutput,
      truncator,
    });
    
    await processFilePathForDesignInjection({
      ctx: createPluginContext(testRoot),
      sessionID,
      filePath: "src/styles.css",
      output: secondOutput,
      truncator,
    });

    // then
    expect(firstOutput.output).toContain("[Design System Context: DESIGN.md]");
    expect(secondOutput.output).toBe("base");
  });

  it("invalidates cache when clearInjectedState is called", async () => {
    // given
    writeFileSync(join(testRoot, "DESIGN.md"), "# Design System V1");
    const { processFilePathForDesignInjection } = await import("./injector");
    const sessionID = "session-cache-invalidation";
    const truncator = createTruncator();
    clearInjectedState(sessionID);
    
    const firstOutput = { output: "" };
    const secondOutput = { output: "" };

    // when
    await processFilePathForDesignInjection({
      ctx: createPluginContext(testRoot),
      sessionID,
      filePath: "src/App.tsx",
      output: firstOutput,
      truncator,
    });
    
    // Invalidate
    clearInjectedState(sessionID);
    writeFileSync(join(testRoot, "DESIGN.md"), "# Design System V2");

    await processFilePathForDesignInjection({
      ctx: createPluginContext(testRoot),
      sessionID,
      filePath: "src/Button.tsx",
      output: secondOutput,
      truncator,
    });

    // then
    expect(firstOutput.output).toContain("# Design System V1");
    expect(secondOutput.output).toContain("# Design System V2");
  });

  it("does nothing if DESIGN.md is missing", async () => {
    // given
    const { processFilePathForDesignInjection } = await import("./injector");
    const output = { output: "base" };
    const sessionID = "session-4";
    const truncator = createTruncator();
    clearInjectedState(sessionID);

    // when
    await processFilePathForDesignInjection({
      ctx: createPluginContext(testRoot),
      sessionID,
      filePath: "src/App.tsx",
      output,
      truncator,
    });

    // then
    expect(output.output).toBe("base");
  });

  it("shows truncation notice when content is truncated", async () => {
    // given
    writeFileSync(join(testRoot, "DESIGN.md"), "# Large Design System");
    const { processFilePathForDesignInjection } = await import("./injector");
    const output = { output: "base" };
    const sessionID = "session-5";
    const truncator = createTruncator({ result: "trimmed content", truncated: true });
    clearInjectedState(sessionID);

    // when
    await processFilePathForDesignInjection({
      ctx: createPluginContext(testRoot),
      sessionID,
      filePath: "src/App.tsx",
      output,
      truncator,
    });

    // then
    expect(output.output).toContain("trimmed content");
    expect(output.output).toContain("[Note: Content was truncated");
  });
});
