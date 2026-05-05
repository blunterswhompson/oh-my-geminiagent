import {
  executeHashlineEditTool,
} from "../hashline-edit/hashline-edit-executor";
import { HASHLINE_EDIT_DESCRIPTION } from "../hashline-edit/tool-description";

export const hashline_edit_definition = {
  name: "hashline_edit",
  description: HASHLINE_EDIT_DESCRIPTION,
  inputSchema: {
    type: "object",
    properties: {
      filePath: { type: "string", description: "Absolute path to the file to edit" },
      delete: { type: "boolean", description: "Delete file instead of editing" },
      rename: { type: "string", description: "Rename output file path after edits" },
      edits: {
        type: "array",
        items: {
          type: "object",
          properties: {
            op: { type: "string", enum: ["replace", "append", "prepend"] },
            pos: { type: "string", description: "Primary anchor in LINE#ID format" },
            end: { type: "string", description: "Range end anchor in LINE#ID format" },
            lines: {
              oneOf: [
                { type: "array", items: { type: "string" } },
                { type: "string" },
                { type: "null" }
              ]
            },
          },
          required: ["op"]
        },
        description: "Array of edit operations to apply"
      },
    },
    required: ["filePath", "edits"],
  },
};

export async function execute_hashline_edit(args: any) {
  try {
    // Mock context for hashline-edit-executor
    const context: any = {
      directory: process.cwd(),
      metadata: (val: any) => {
        // Log metadata to stderr or handle as needed
        // console.error("Edit metadata:", JSON.stringify(val, null, 2));
      }
    };

    const result = await executeHashlineEditTool(args, context);
    
    if (result.startsWith("Error:")) {
      return {
        content: [{ type: "text", text: result }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: result }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}
