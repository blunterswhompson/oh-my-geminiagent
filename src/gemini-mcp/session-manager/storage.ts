import { isSqliteBackend } from "../shared/opencode-storage-detection"
import { log } from "../shared/logger"
import { getFileAllSessions, getFileMainSessions, fileSessionExists, getFileSessionInfo, getFileSessionMessages, getFileSessionTodos } from "./file-storage"
import type { SessionInfo, SessionMessage, SessionMetadata, TodoItem } from "./types"

export interface GetMainSessionsOptions {
  directory?: string
}

export async function getMainSessions(options: GetMainSessionsOptions): Promise<SessionMetadata[]> {
  return getFileMainSessions(options.directory)
}

export async function getAllSessions(): Promise<string[]> {
  return getFileAllSessions()
}

export { getMessageDir } from "../shared/opencode-message-dir"

export async function sessionExists(sessionID: string): Promise<boolean> {
  return fileSessionExists(sessionID)
}

export async function readSessionMessages(sessionID: string): Promise<SessionMessage[]> {
  return getFileSessionMessages(sessionID)
}

export async function readSessionTodos(sessionID: string): Promise<TodoItem[]> {
  return getFileSessionTodos(sessionID)
}

export async function readSessionTranscript(sessionID: string): Promise<number> {
  // This originally pointed to file-storage, preserving parity
  return 0 
}

export async function getSessionInfo(sessionID: string): Promise<SessionInfo | null> {
  return getFileSessionInfo(sessionID)
}
