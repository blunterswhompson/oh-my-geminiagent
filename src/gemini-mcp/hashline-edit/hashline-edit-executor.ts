import { applyHashlineEditsWithReport } from "./edit-operations"
import { canonicalizeFileText, restoreFileText } from "./file-text-canonicalization"
import { normalizeHashlineEdits, type RawHashlineEdit } from "./normalize-edits"
import type { HashlineEdit } from "./types"
import { HashlineMismatchError } from "./validation"

interface HashlineEditArgs {
  filePath: string
  edits: RawHashlineEdit[]
  delete?: boolean
  rename?: string
}

function canCreateFromMissingFile(edits: HashlineEdit[]): boolean {
  if (edits.length === 0) return false
  return edits.every((edit) => (edit.op === "append" || edit.op === "prepend") && !edit.pos)
}

export async function executeHashlineEditTool(args: HashlineEditArgs): Promise<string> {
  try {
    const filePath = args.filePath
    const { delete: deleteMode, rename } = args

    if (deleteMode && rename) {
      return "Error: delete and rename cannot be used together"
    }
    if (deleteMode && args.edits.length > 0) {
      return "Error: delete mode requires edits to be an empty array"
    }

    if (!deleteMode && (!args.edits || !Array.isArray(args.edits) || args.edits.length === 0)) {
      return "Error: edits parameter must be a non-empty array"
    }

    const edits = deleteMode ? [] : normalizeHashlineEdits(args.edits)

    const file = Bun.file(filePath)
    const exists = await file.exists()
    if (!exists && !deleteMode && !canCreateFromMissingFile(edits)) {
      return `Error: File not found: ${filePath}`
    }

    if (deleteMode) {
      if (!exists) return `Error: File not found: ${filePath}`
      await Bun.file(filePath).delete()
      return `Successfully deleted ${filePath}`
    }

    const rawOldContent = exists ? Buffer.from(await file.arrayBuffer()).toString("utf8") : ""
    const oldEnvelope = canonicalizeFileText(rawOldContent)

    const applyResult = applyHashlineEditsWithReport(oldEnvelope.content, edits)
    const canonicalNewContent = applyResult.content

    if (canonicalNewContent === oldEnvelope.content && !rename) {
      let diagnostic = `No changes made to ${filePath}. The edits produced identical content.`
      if (applyResult.noopEdits > 0) {
        diagnostic += ` No-op edits: ${applyResult.noopEdits}. Re-read the file and provide content that differs from current lines.`
      }
      return `Error: ${diagnostic}`
    }

    const writeContent = restoreFileText(canonicalNewContent, oldEnvelope)

    if (rename && rename !== filePath) {
      await Bun.write(rename, writeContent)
      await Bun.file(filePath).delete()
      return `Moved ${filePath} to ${rename}`
    } else {
      await Bun.write(filePath, writeContent)
      return `Updated ${filePath}`
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (error instanceof HashlineMismatchError) {
      return `Error: hash mismatch - ${message}\nTip: reuse LINE#ID entries from the latest read/edit output, or batch related edits in one call.`
    }
    return `Error: ${message}`
  }
}
