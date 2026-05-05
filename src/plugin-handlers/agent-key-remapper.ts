import { getAgentListDisplayName, getAgentRuntimeName } from "../shared/agent-display-names"

function rewriteAgentNameForListDisplay(
  key: string,
  value: unknown,
): unknown {
  if (typeof value !== "object" || value === null) {
    return value
  }

  const agent = value as Record<string, unknown>
  return {
    ...agent,
    name: getAgentRuntimeName(key),
  }
}

export function remapAgentKeysToDisplayNames(
  agents: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(agents)) {
    const displayName = getAgentListDisplayName(key)
    if (displayName && displayName !== key) {
      // Add display name key for UI visibility and ordering
      result[displayName] = rewriteAgentNameForListDisplay(key, value)
      
      // Keep short key for tool calling but hide it from the UI to avoid duplicates
      if (typeof value === "object" && value !== null) {
        result[key] = { ...value, hidden: true }
      } else {
        result[key] = value
      }
    } else {
      result[key] = value
    }
  }

  return result
}
