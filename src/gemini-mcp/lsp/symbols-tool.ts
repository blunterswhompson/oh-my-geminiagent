import { formatSymbol } from "./lsp-formatters"
import { withLspClient } from "./lsp-client-wrapper"
import type { DocumentSymbol, SymbolInformation } from "./types"

export async function execute_lsp_symbols(args: { filePath: string; query?: string }) {
  try {
    if (args.query) {
      const result = await withLspClient(args.filePath, async (client) => {
        return (await client.workspaceSymbols(args.query!)) as SymbolInformation[] | null
      })

      if (!result || result.length === 0) {
        return "No workspace symbols found"
      }

      return result.map(formatSymbol).join("\n")
    }

    const result = await withLspClient(args.filePath, async (client) => {
      return (await client.documentSymbols(args.filePath)) as
        | DocumentSymbol[]
        | SymbolInformation[]
        | null
    })

    if (!result || result.length === 0) {
      return "No document symbols found"
    }

    return result.map(formatSymbol).join("\n")
  } catch (e) {
    return `Error: ${e instanceof Error ? e.message : String(e)}`
  }
}
