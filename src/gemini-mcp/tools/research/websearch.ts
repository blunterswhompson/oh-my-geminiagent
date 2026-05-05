export const websearch_definition = {
  name: "websearch",
  description: "Search the web for any topic using Exa or Tavily.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "The search query" },
      numResults: { type: "number", description: "Number of results to return (default: 5)" },
      provider: { type: "string", enum: ["exa", "tavily"], description: "The search provider to use" }
    },
    required: ["query"]
  }
};

export async function execute_websearch(args: any) {
  const { query, numResults = 5, provider: requestedProvider } = args;
  const exaKey = process.env.EXA_API_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY;
  
  const provider = requestedProvider || (tavilyKey ? "tavily" : "exa");

  try {
    if (provider === "tavily") {
      if (!tavilyKey) throw new Error("Tavily API key not found");
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query: query,
          max_results: numResults
        })
      });

      if (!response.ok) throw new Error(`Tavily API error: ${response.statusText}`);
      const data = await response.json() as any;
      
      const results = data.results.map((r: any) => `- [${r.title}](${r.url})\n  ${r.content}`).join("\n\n");
      return { content: [{ type: "text", text: `Web search results (Tavily):\n\n${results}` }] };
    }

    // Default to Exa
    const exaUrl = "https://api.exa.ai/search";
    const response = await fetch(exaUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": exaKey || ""
      },
      body: JSON.stringify({
        query: query,
        num_results: numResults,
        use_autoprompt: true
      })
    });

    if (!response.ok) throw new Error(`Exa API error: ${response.statusText}`);
    const data = await response.json() as any;
    
    const results = data.results.map((r: any) => `- [${r.title}](${r.url})\n  ${r.text || "No snippet available"}`).join("\n\n");
    return { content: [{ type: "text", text: `Web search results (Exa):\n\n${results}` }] };

  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error calling web search: ${error instanceof Error ? error.message : String(error)}` 
      }],
      isError: true
    };
  }
}
