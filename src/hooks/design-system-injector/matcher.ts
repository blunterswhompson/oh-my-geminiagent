import { existsSync, readFileSync } from "fs";
import { extname, join } from "path";
import { FRONTEND_EXTENSIONS } from "./constants";

let cachedHasUiDependencies: boolean | null = null;

const UI_DEPENDENCIES = [
  "react",
  "vue",
  "svelte",
  "tailwind",
  "bootstrap",
  "mui",
  "shadcn",
  "next",
  "vite",
  "astro",
  "solid-js",
  "angular",
];

/**
 * Checks if a project has UI-related dependencies in package.json.
 */
export function hasUiDependencies(workspaceDirectory: string): boolean {
  if (cachedHasUiDependencies !== null) {
    return cachedHasUiDependencies;
  }

  const packageJsonPath = join(workspaceDirectory, "package.json");
  if (!existsSync(packageJsonPath)) {
    cachedHasUiDependencies = false;
    return false;
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const deps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    cachedHasUiDependencies = UI_DEPENDENCIES.some((uiDep) => deps[uiDep] !== undefined);
    return cachedHasUiDependencies;
  } catch {
    cachedHasUiDependencies = false;
    return false;
  }
}

/**
 * Checks if a file path belongs to a frontend file based on its extension
 * and optionally the presence of UI dependencies in the project.
 */
export function isFrontendFile(filePath: string, workspaceDirectory?: string): boolean {
  const ext = extname(filePath).toLowerCase();
  const isFrontendExt = FRONTEND_EXTENSIONS.includes(ext);

  if (!isFrontendExt) {
    return false;
  }

  // Hybrid check: if it's a frontend extension, we also verify if the project 
  // actually has UI dependencies (if workspaceDirectory is provided).
  if (workspaceDirectory) {
    return hasUiDependencies(workspaceDirectory);
  }

  return true;
}
