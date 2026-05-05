/**
 * look_at bridge tool for Gemini CLI.
 * 
 * In OpenCode, this spawned a sub-session. 
 * In Gemini CLI, this instructs the orchestrator to delegate to the 'multimodal-looker' sub-agent.
 */

export const look_at_definition = {
  name: "look_at",
  description: "Focus on a specific file or image asset for detailed analysis. Use this when you need to 'see' something clearly (UI mockups, diagrams, PDFs).",
  inputSchema: {
    type: "object",
    properties: {
      file_path: { type: "string", description: "Absolute path to the file to analyze" },
      image_data: { type: "string", description: "Base64 encoded image data (if from clipboard)" },
      goal: { type: "string", description: "What specific information to extract" },
    },
    required: ["goal"],
  },
};

export async function execute_look_at(args: any) {
  const { file_path, image_data, goal } = args;
  
  let assetDescription = "";
  if (file_path) assetDescription = `File at path: ${file_path}`;
  else if (image_data) assetDescription = "Provided Base64 image data";
  else return { content: [{ type: "text", text: "Error: Must provide either 'file_path' or 'image_data'" }], isError: true };

  const instruction = [
    `I have prepared the asset for analysis.`,
    ``,
    `**MANDATORY NEXT STEP**: You must now delegate this analysis to the 'multimodal-looker' sub-agent.`,
    ``,
    `**DELEGATION PROMPT**:`,
    `Agent: multimodal-looker`,
    `Goal: ${goal}`,
    `Asset: ${assetDescription}`,
    image_data ? `Image Data: [Attached Base64]` : `File Path: ${file_path}`,
    ``,
    `Wait for the sub-agent's report before continuing.`,
  ].join("\n");

  return {
    content: [{ type: "text", text: instruction }],
  };
}
