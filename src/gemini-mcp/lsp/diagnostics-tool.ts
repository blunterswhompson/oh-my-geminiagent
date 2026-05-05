import { resolve } from "path"
import { DEFAULT_MAX_DIAGNOSTICS } from "./constants"
import { aggregateDiagnosticsForDirectory } from "./directory-diagnostics"
import { formatDiagnostic } from "./lsp-formatters"
import { withLspClient } from "./lsp-client-wrapper"
import type { Diagnostic, DiagnosticSeverity } from "./types"

export async function execute_lsp_diagnostics(args: { filePath: string; severity?: string }) {
  try {
    const fullPath = resolve(process.cwd(), args.filePath)
    
    // Check if it's a directory
    const isDir = await import("fs").then(fs => fs.promises.stat(fullPath).then(s => s.isDirectory()).catch(() => false))

    if (isDir) {
      return await aggregateDiagnosticsForDirectory(fullPath, args.severity)
    }

    const result = await withLspClient(args.filePath, async (client) => {
      return (await client.diagnostics(args.filePath)) as Diagnostic[] | null
    })

    if (!result || result.length === 0) {
      return "No diagnostics found"
    }

    let diagnostics = result
    if (args.severity && args.severity !== "all") {
      const severityMap: Record<string, DiagnosticSeverity> = {
        error: 1,
        warning: 2,
        information: 3,
        hint: 4,
      }
      const targetSeverity = severityMap[args.severity.toLowerCase()]
      if (targetSeverity !== undefined) {
        diagnostics = diagnostics.filter((d) => d.severity === targetSeverity)
      }
    }

    const limited = diagnostics.slice(0, DEFAULT_MAX_DIAGNOSTICS)
    const lines = limited.map(formatDiagnostic)
    if (diagnostics.length > DEFAULT_MAX_DIAGNOSTICS) {
      lines.push(`... and ${diagnostics.length - DEFAULT_MAX_DIAGNOSTICS} more (total ${diagnostics.length}, limit ${DEFAULT_MAX_DIAGNOSTICS})`)
    }
    
    return lines.join("\n") || "No diagnostics found matching filter"
  } catch (e) {
    return `Error: ${e instanceof Error ? e.message : String(e)}`
  }
}
