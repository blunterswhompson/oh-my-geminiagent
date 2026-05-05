import { join, basename } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, unlinkSync, readdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { getOpenCodeStorageDir } from "../shared/data-path";

// --- Task Storage Logic (Consolidated from src/features/claude-tasks/storage.ts) ---

function getTaskDir(): string {
  // Default to user's local share directory, matching OpenCode's behavior
  const storageDir = getOpenCodeStorageDir();
  const listId = basename(process.cwd()).replace(/[^a-zA-Z0-9_-]/g, "-") || "default";
  return join(storageDir, "tasks", listId);
}

function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function writeJsonAtomic(filePath: string, data: unknown): void {
  ensureDir(join(filePath, ".."));
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  try {
    writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    renameSync(tempPath, filePath);
  } catch (error) {
    if (existsSync(tempPath)) unlinkSync(tempPath);
    throw error;
  }
}

function readJsonSafe(filePath: string): any | null {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

const STALE_LOCK_THRESHOLD_MS = 30000;
function acquireLock(dirPath: string) {
  ensureDir(dirPath);
  const lockPath = join(dirPath, ".lock");
  const lockId = randomUUID();
  const now = Date.now();

  try {
    if (existsSync(lockPath)) {
      const lockData = JSON.parse(readFileSync(lockPath, "utf-8"));
      if (now - lockData.timestamp < STALE_LOCK_THRESHOLD_MS) {
        return { acquired: false, release: () => {} };
      }
      unlinkSync(lockPath);
    }
    writeFileSync(lockPath, JSON.stringify({ id: lockId, timestamp: now }), { flag: "wx" });
    return {
      acquired: true,
      release: () => {
        try {
          const lockData = JSON.parse(readFileSync(lockPath, "utf-8"));
          if (lockData.id === lockId) unlinkSync(lockPath);
        } catch {}
      }
    };
  } catch {
    return { acquired: false, release: () => {} };
  }
}

// --- Tool Definitions ---

export const task_create_definition = {
  name: "task_create",
  description: "Create a new task for project orchestration. Returns task ID (T-{uuid}).",
  inputSchema: {
    type: "object",
    properties: {
      subject: { type: "string", description: "Task subject" },
      description: { type: "string", description: "Full task description" },
      blockedBy: { type: "array", items: { type: "string" }, description: "Task IDs this task depends on" },
    },
    required: ["subject"],
  },
};

export const task_get_definition = {
  name: "task_get",
  description: "Retrieve full task details by ID.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Task ID (T-{uuid})" },
    },
    required: ["id"],
  },
};

export const task_list_definition = {
  name: "task_list",
  description: "List active tasks (excluding completed/deleted).",
  inputSchema: { type: "object", properties: {} },
};

export const task_update_definition = {
  name: "task_update",
  description: "Update an existing task's status, subject, or description.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Task ID" },
      status: { type: "string", enum: ["pending", "in_progress", "completed", "deleted"] },
      subject: { type: "string" },
      description: { type: "string" },
      addBlockedBy: { type: "array", items: { type: "string" } },
    },
    required: ["id"],
  },
};

// --- Execution Handlers ---

export async function execute_task_tool(name: string, args: any) {
  const taskDir = getTaskDir();
  const lock = acquireLock(taskDir);
  if (!lock.acquired) return { content: [{ type: "text", text: "Error: Task storage is locked" }], isError: true };

  try {
    switch (name) {
      case "task_create": {
        const id = `T-${randomUUID()}`;
        const task = {
          id,
          subject: args.subject,
          description: args.description || "",
          status: "pending",
          blockedBy: args.blockedBy || [],
          createdAt: new Date().toISOString(),
        };
        writeJsonAtomic(join(taskDir, `${id}.json`), task);
        return { content: [{ type: "text", text: JSON.stringify({ id, subject: task.subject }) }] };
      }

      case "task_get": {
        const task = readJsonSafe(join(taskDir, `${args.id}.json`));
        return { content: [{ type: "text", text: JSON.stringify(task || { error: "not_found" }) }] };
      }

      case "task_list": {
        const files = readdirSync(taskDir).filter(f => f.endsWith(".json") && f.startsWith("T-"));
        const tasks = files.map(f => readJsonSafe(join(taskDir, f))).filter(t => t && t.status !== "completed" && t.status !== "deleted");
        return { content: [{ type: "text", text: JSON.stringify({ tasks }) }] };
      }

      case "task_update": {
        const taskPath = join(taskDir, `${args.id}.json`);
        const task = readJsonSafe(taskPath);
        if (!task) return { content: [{ type: "text", text: "Error: Task not found" }], isError: true };

        if (args.status) task.status = args.status;
        if (args.subject) task.subject = args.subject;
        if (args.description) task.description = args.description;
        if (args.addBlockedBy) task.blockedBy = [...new Set([...(task.blockedBy || []), ...args.addBlockedBy])];
        
        writeJsonAtomic(taskPath, task);
        return { content: [{ type: "text", text: JSON.stringify(task) }] };
      }
      
      default:
        throw new Error(`Unknown task tool: ${name}`);
    }
  } catch (error) {
    return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
  } finally {
    lock.release();
  }
}
