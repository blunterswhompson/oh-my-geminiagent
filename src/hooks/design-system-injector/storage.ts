const sessionInjected = new Set<string>();

/**
 * Marks DESIGN.md as injected for a session.
 */
export function markAsInjected(sessionID: string): void {
  sessionInjected.add(sessionID);
}

/**
 * Checks if DESIGN.md has been injected for a session.
 */
export function isInjected(sessionID: string): boolean {
  return sessionInjected.has(sessionID);
}

/**
 * Clears injection state for a session.
 */
export function clearInjectedState(sessionID: string): void {
  sessionInjected.delete(sessionID);
}
