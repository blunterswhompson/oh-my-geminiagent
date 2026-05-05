import {
  getMainSessions,
  getSessionInfo,
  readSessionMessages,
  readSessionTodos,
  sessionExists,
  getAllSessions
} from "../session-manager/storage";
import {
  formatSessionList,
  formatSessionMessages,
  formatSessionInfo,
  formatSearchResults,
  searchInSession,
  filterSessionsByDate
} from "../session-manager/session-formatter";
import {
  SESSION_LIST_DESCRIPTION,
  SESSION_READ_DESCRIPTION,
  SESSION_SEARCH_DESCRIPTION,
  SESSION_INFO_DESCRIPTION
} from "../session-manager/constants";

export const session_list_definition = {
  name: "session_list",
  description: SESSION_LIST_DESCRIPTION,
  inputSchema: {
    type: "object",
    properties: {
      limit: { type: "number", description: "Maximum number of sessions to return" },
      from_date: { type: "string", description: "Filter sessions from this date (ISO 8601 format)" },
      to_date: { type: "string", description: "Filter sessions until this date (ISO 8601 format)" },
      project_path: { type: "string", description: "Filter sessions by project path (default: current working directory)" },
    },
  },
};

export const session_read_definition = {
  name: "session_read",
  description: SESSION_READ_DESCRIPTION,
  inputSchema: {
    type: "object",
    properties: {
      session_id: { type: "string", description: "Session ID to read" },
      include_todos: { type: "boolean", description: "Include todo list if available (default: false)" },
      include_transcript: { type: "boolean", description: "Include transcript log if available (default: false)" },
      limit: { type: "number", description: "Maximum number of messages to return (default: all)" },
    },
    required: ["session_id"],
  },
};

export const session_search_definition = {
  name: "session_search",
  description: SESSION_SEARCH_DESCRIPTION,
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query string" },
      session_id: { type: "string", description: "Search within specific session only (default: all sessions)" },
      case_sensitive: { type: "boolean", description: "Case-sensitive search (default: false)" },
      limit: { type: "number", description: "Maximum number of results to return (default: 20)" },
    },
    required: ["query"],
  },
};

export const session_info_definition = {
  name: "session_info",
  description: SESSION_INFO_DESCRIPTION,
  inputSchema: {
    type: "object",
    properties: {
      session_id: { type: "string", description: "Session ID to inspect" },
    },
    required: ["session_id"],
  },
};

export async function execute_session_manager_tool(name: string, args: any) {
  try {
    switch (name) {
      case "session_list": {
        const directory = args.project_path ?? process.cwd();
        let sessions = await getMainSessions({ directory });
        let sessionIDs = sessions.map((s) => s.id);

        if (args.from_date || args.to_date) {
          sessionIDs = await filterSessionsByDate(sessionIDs, args.from_date, args.to_date);
        }

        if (args.limit && args.limit > 0) {
          sessionIDs = sessionIDs.slice(0, args.limit);
        }

        const result = await formatSessionList(sessionIDs);
        return { content: [{ type: "text", text: result }] };
      }

      case "session_read": {
        if (!(await sessionExists(args.session_id))) {
          return { content: [{ type: "text", text: `Session not found: ${args.session_id}` }], isError: true };
        }

        let messages = await readSessionMessages(args.session_id);
        if (messages.length === 0) {
          return { content: [{ type: "text", text: `Session not found: ${args.session_id}` }], isError: true };
        }

        if (args.limit && args.limit > 0) {
          messages = messages.slice(0, args.limit);
        }

        const todos = args.include_todos ? await readSessionTodos(args.session_id) : undefined;
        const result = formatSessionMessages(messages, args.include_todos, todos);
        return { content: [{ type: "text", text: result }] };
      }

      case "session_search": {
        const resultLimit = args.limit && args.limit > 0 ? args.limit : 20;

        let results: any[] = [];
        if (args.session_id) {
          results = await searchInSession(args.session_id, args.query, args.case_sensitive, resultLimit);
        } else {
          const allSessions = await getAllSessions();
          const sessionsToScan = allSessions.slice(0, 50);

          for (const sid of sessionsToScan) {
            if (results.length >= resultLimit) break;
            const remaining = resultLimit - results.length;
            const sessionResults = await searchInSession(sid, args.query, args.case_sensitive, remaining);
            results.push(...sessionResults);
          }
          results = results.slice(0, resultLimit);
        }

        const resultText = formatSearchResults(results);
        return { content: [{ type: "text", text: resultText }] };
      }

      case "session_info": {
        const info = await getSessionInfo(args.session_id);
        if (!info) {
          return { content: [{ type: "text", text: `Session not found: ${args.session_id}` }], isError: true };
        }
        const resultText = formatSessionInfo(info);
        return { content: [{ type: "text", text: resultText }] };
      }

      default:
        throw new Error(`Unknown session tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}
