import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { DESIGN_MD_FILENAME } from "./constants";

/**
 * Locates and reads DESIGN.md by walking up from the current file path.
 * Searches up to the workspace directory.
 */
export function findDesignMd(startPath: string, workspaceDirectory: string): string | null {
  let current = startPath;
  
  // If startPath is a file, start from its directory
  try {
    if (existsSync(current) && !require("fs").statSync(current).isDirectory()) {
      current = dirname(current);
    }
  } catch {
    current = dirname(current);
  }

  while (current.startsWith(workspaceDirectory)) {
    const designMdPath = join(current, DESIGN_MD_FILENAME);
    if (existsSync(designMdPath)) {
      try {
        return readFileSync(designMdPath, "utf-8");
      } catch {
        // Ignore read errors
      }
    }
    
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  
  // Last resort: check workspace directory directly
  const rootDesignMdPath = join(workspaceDirectory, DESIGN_MD_FILENAME);
  if (existsSync(rootDesignMdPath)) {
    try {
      return readFileSync(rootDesignMdPath, "utf-8");
    } catch {
      return null;
    }
  }
  
  return null;
}
