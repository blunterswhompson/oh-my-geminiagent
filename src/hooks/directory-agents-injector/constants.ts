import { join } from "node:path";
import { OPENCODE_STORAGE } from "../../shared";
export const AGENTS_INJECTOR_STORAGE = join(
  OPENCODE_STORAGE,
  "directory-agents",
);
export const PRIMARY_CONTEXT_FILENAME = "GEMINI.md";
export const FALLBACK_CONTEXT_FILENAMES = ["AGENTS.md", "CLAUDE.md"];

/** @deprecated Use PRIMARY_CONTEXT_FILENAME */
export const AGENTS_FILENAME = PRIMARY_CONTEXT_FILENAME;
