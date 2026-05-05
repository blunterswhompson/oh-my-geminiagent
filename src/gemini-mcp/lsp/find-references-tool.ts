import { formatLocation } from "./lsp-formatters"
import { withLspClient } from "./lsp-client-wrapper"
import type { Location } from "./types"

export async function execute_lsp_find_references(args: { filePath: string; line: number; character: number; includeDeclaration?: boolean }) {
  try {
    const result = await withLspClient(args.filePath, async (client) => {
      return (await client.references(args.filePath, args.line, args.character, {
        includeDeclaration: args.includeDeclaration ?? true,
      })) as Location[] | null
    })

    if (!result || result.length === 0) {
      return "No references found"
    }

    return result.map(formatLocation).join("\n")
  } catch (e) {
    return `Error: ${e instanceof Error ? e.message : String(e)}`
  }
}
