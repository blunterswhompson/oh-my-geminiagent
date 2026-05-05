export const grep_app_definition = {
  name: "grep_app",
  description: "Search for code patterns on GitHub across millions of repositories using grep.app.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "The search query (regex supported)" },
      caseSensitive: { type: "boolean", description: "Whether the search should be case sensitive" },
      regexp: { type: "boolean", description: "Whether the query should be treated as a regular expression" }
    },
    required: ["query"]
  }
};

export async function execute_grep_app(args: any) {
  const { query, caseSensitive, regexp } = args;
  const baseUrl = "https://grep.app/api/search";
  const params = new URLSearchParams({
    q: query,
    case: caseSensitive ? "true" : "false",
    regexp: regexp ? "true" : "false"
  });

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Grep.app API error: ${response.statusText}`);
    }

    const data = await response.json() as any;
    if (!data.results || data.results.count === 0) {
      return { content: [{ type: "text", text: "No matches found on grep.app" }] };
    }

    const formattedResults = data.results.hits.map((hit: any) => {
      const repo = hit.repo.name;
      const file = hit.path;
      const line = hit.content.snippet;
      return `[${repo}] ${file}:\n${line}\n`;
    }).join("\n---\n");

    return {
      content: [{ type: "text", text: `Found ${data.results.count} matches:\n\n${formattedResults}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error calling grep.app: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true
    };
  }
}
