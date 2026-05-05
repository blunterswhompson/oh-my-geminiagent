import { withLspClient } from "./lsp-client-wrapper"
import { applyWorkspaceEdit } from "./workspace-edit"
import type { Range, WorkspaceEdit } from "./types"

export async function execute_lsp_prepare_rename(args: { filePath: string; line: number; character: number }) {
  try {
    const result = await withLspClient(args.filePath, async (client) => {
      return (await client.prepareRename(args.filePath, args.line, args.character)) as
        | Range
        | { range: Range; placeholder: string }
        | null
    })

    if (!result) {
      return "Rename is not available at this location"
    }

    return "Rename is available at this location"
  } catch (e) {
    return `Error: ${e instanceof Error ? e.message : String(e)}`
  }
}

export async function execute_lsp_rename(args: { filePath: string; line: number; character: number; newName: string }) {
  try {
    const result = await withLspClient(args.filePath, async (client) => {
      return (await client.rename(
        args.filePath,
        args.line,
        args.character,
        args.newName
      )) as WorkspaceEdit | null
    })

    if (!result) {
      return "No rename edits provided by server"
    }

    const report = await applyWorkspaceEdit(result)
    return report
  } catch (e) {
    return `Error: ${e instanceof Error ? e.message : String(e)}`
  }
}
