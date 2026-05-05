import { existsSync, readdirSync } from "fs"
import { join } from "path"
import type { AvailableCategory } from "../agents/dynamic-agent-prompt-builder"
import type { OhMyOpenCodeConfig } from "../config"
import { CATEGORY_DESCRIPTIONS } from "../tools/delegate-task/constants"
import { mergeCategories } from "../shared/merge-categories"

export function createAvailableCategories(
  pluginConfig: OhMyOpenCodeConfig,
  directory?: string,
): AvailableCategory[] {
  const categories = mergeCategories(pluginConfig.categories)

  const available: AvailableCategory[] = Object.entries(categories).map(([name, categoryConfig]) => {
    const model =
      typeof categoryConfig.model === "string" ? categoryConfig.model : undefined

    return {
      name,
      description:
        pluginConfig.categories?.[name]?.description ??
        CATEGORY_DESCRIPTIONS[name] ??
        "General tasks",
      model,
    }
  })

  // Add R&D Library categories if enabled
  if (pluginConfig.feature_rnd_library && directory) {
    const libraryAgentsDir = join(directory, "geminirnd", "agent")
    if (existsSync(libraryAgentsDir)) {
      try {
        const folders = readdirSync(libraryAgentsDir, { withFileTypes: true })
          .filter(entry => entry.isDirectory())
          .map(entry => entry.name)
        
        for (const name of folders) {
          if (!available.some(c => c.name === name)) {
            available.push({
              name,
              description: `Library: ${name}`,
            })
          }
        }
      } catch {
        // Ignore errors during discovery
      }
    }
  }

  return available
}
