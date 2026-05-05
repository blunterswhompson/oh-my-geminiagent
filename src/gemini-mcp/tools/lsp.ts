import { resolve } from "node:path";
import { execute_lsp_goto_definition } from "../lsp/goto-definition-tool";
import { execute_lsp_find_references } from "../lsp/find-references-tool";
import { execute_lsp_symbols } from "../lsp/symbols-tool";
import { execute_lsp_diagnostics } from "../lsp/diagnostics-tool";
import { execute_lsp_prepare_rename, execute_lsp_rename } from "../lsp/rename-tools";

// Helper to wrap the refactored standalone functions for MCP
async function wrapLspResult(executionPromise: Promise<string>) {
  try {
    const result = await executionPromise;
    return {
      content: [{ type: "text", text: String(result) }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}

export const lsp_goto_definition_definition = {
  name: "lsp_goto_definition",
  description: "Jump to symbol definition. Find WHERE something is defined.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: { type: "string" },
      line: { type: "number", description: "1-based line number" },
      character: { type: "number", description: "0-based character offset" },
    },
    required: ["filePath", "line", "character"],
  },
};

export const lsp_find_references_definition = {
  name: "lsp_find_references",
  description: "Find all references to a symbol at a specific location.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: { type: "string" },
      line: { type: "number", description: "1-based line number" },
      character: { type: "number", description: "0-based character offset" },
    },
    required: ["filePath", "line", "character"],
  },
};

export const lsp_symbols_definition = {
  name: "lsp_symbols",
  description: "List symbols in a file or search workspace-wide.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: { type: "string", description: "File path to get symbols for" },
      query: { type: "string", description: "Optional search query for workspace symbols" },
    },
    required: ["filePath"],
  },
};

export const lsp_diagnostics_definition = {
  name: "lsp_diagnostics",
  description: "Get errors, warnings, and hints from the language server for a file or directory.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: { type: "string", description: "File or directory path to check" },
      severity: { 
        type: "string", 
        enum: ["error", "warning", "information", "hint", "all"],
        description: "Filter by severity level" 
      },
    },
    required: ["filePath"],
  },
};

export const lsp_prepare_rename_definition = {
  name: "lsp_prepare_rename",
  description: "Check if a symbol can be renamed and get its current range.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: { type: "string" },
      line: { type: "number" },
      character: { type: "number" },
    },
    required: ["filePath", "line", "character"],
  },
};

export const lsp_rename_definition = {
  name: "lsp_rename",
  description: "Rename a symbol across the workspace.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: { type: "string" },
      line: { type: "number" },
      character: { type: "number" },
      newName: { type: "string", description: "The new name for the symbol" },
    },
    required: ["filePath", "line", "character", "newName"],
  },
};

export async function execute_lsp_tool(name: string, args: any) {
  switch (name) {
    case "lsp_goto_definition":
      return await wrapLspResult(execute_lsp_goto_definition(args));
    case "lsp_find_references":
      return await wrapLspResult(execute_lsp_find_references(args));
    case "lsp_symbols":
      return await wrapLspResult(execute_lsp_symbols(args));
    case "lsp_diagnostics":
      return await wrapLspResult(execute_lsp_diagnostics(args));
    case "lsp_prepare_rename":
      return await wrapLspResult(execute_lsp_prepare_rename(args));
    case "lsp_rename":
      return await wrapLspResult(execute_lsp_rename(args));
    default:
      throw new Error(`Unknown LSP tool: ${name}`);
  }
}
