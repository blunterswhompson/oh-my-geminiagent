import { grep_app_definition, execute_grep_app } from "./grep-app";
import { context7_definition, execute_context7 } from "./context7";
import { websearch_definition, execute_websearch } from "./websearch";

export const research_tool_definitions = [
  grep_app_definition,
  context7_definition,
  websearch_definition
];

export async function execute_research_tool(name: string, args: any) {
  switch (name) {
    case "grep_app":
      return await execute_grep_app(args);
    case "context7":
      return await execute_context7(args);
    case "websearch":
      return await execute_websearch(args);
    default:
      throw new Error(`Unknown research tool: ${name}`);
  }
}
