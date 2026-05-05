import { formatLocation } from "./lsp-formatters"
import { withLspClient } from "./lsp-client-wrapper"
import type { Location, LocationLink } from "./types"

export async function execute_lsp_goto_definition(args: { filePath: string; line: number; character: number }) {
  try {
    const result = await withLspClient(args.filePath, async (client) => {
      return (await client.definition(args.filePath, args.line, args.character)) as
        | Location
        | Location[]
        | LocationLink[]
        | null
    })

    if (!result) {
      return "No definition found"
    }

    const locations = Array.isArray(result) ? result : [result]
    if (locations.length === 0) {
      return "No definition found"
    }

    return locations.map(formatLocation).join("\n")
  } catch (e) {
    return `Error: ${e instanceof Error ? e.message : String(e)}`
  }
}
