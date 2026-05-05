import { writeFileSync, mkdirSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { AGENT_MODEL_REQUIREMENTS } from "../src/shared/model-requirements";
import { createSisyphusAgent } from "../src/agents/sisyphus";
import { createHephaestusAgent } from "../src/agents/hephaestus/agent";
import { createOracleAgent } from "../src/agents/oracle";
import { createLibrarianAgent } from "../src/agents/librarian";
import { createExploreAgent } from "../src/agents/explore";
import { createMultimodalLookerAgent } from "../src/agents/multimodal-looker";
import { createMetisAgent } from "../src/agents/metis";
import { createAtlasAgent } from "../src/agents/atlas/agent";
import { createMomusAgent } from "../src/agents/momus";
import { createSisyphusJuniorAgentWithOverrides } from "../src/agents/sisyphus-junior";

import { REFACTOR_TEMPLATE } from "../src/features/builtin-commands/templates/refactor";
import { START_WORK_TEMPLATE } from "../src/features/builtin-commands/templates/start-work";
import { HANDOFF_TEMPLATE } from "../src/features/builtin-commands/templates/handoff";
import { REMOVE_AI_SLOPS_TEMPLATE } from "../src/features/builtin-commands/templates/remove-ai-slops";
import { INIT_DEEP_TEMPLATE } from "../src/features/builtin-commands/templates/init-deep";
import { RALPH_LOOP_TEMPLATE } from "../src/features/builtin-commands/templates/ralph-loop";
import { STOP_CONTINUATION_TEMPLATE } from "../src/features/builtin-commands/templates/stop-continuation";

const sanitize = (text: string | undefined, name: string) => {
  if (text === undefined) {
    console.error(`❌ Error: Template/Instructions for "${name}" is undefined!`);
    return "";
  }
  return text.replace(/@/g, "\\\\@");
};

async function sync() {
  console.log("🚀 Synchronizing Gemini Extension components...");

  // 0. Generate R&D Index
  try {
    console.log("🔍 Generating R&D Index...");
    execSync("bun run script/generate-rd-index.ts");
  } catch (e) {
    console.warn("⚠️ Could not generate RESEARCH.md");
  }

  // 1. Render Agents
  const agentsDir = join(process.cwd(), "agents");
  mkdirSync(agentsDir, { recursive: true });

  const agentFactories: Record<string, (m: string) => string | undefined> = {
    sisyphus: (m: string) => createSisyphusAgent(m).prompt,
    hephaestus: (m: string) => createHephaestusAgent(m).prompt,
    oracle: (m: string) => createOracleAgent(m).prompt,
    librarian: (m: string) => createLibrarianAgent(m).prompt,
    explore: (m: string) => createExploreAgent(m).prompt,
    "multimodal-looker": (m: string) => createMultimodalLookerAgent(m).prompt,
    metis: (m: string) => createMetisAgent(m).prompt,
    momus: (m: string) => createMomusAgent(m).prompt,
    atlas: (m: string) => createAtlasAgent({ model: m }).prompt,
    "sisyphus-junior": (m: string) => createSisyphusJuniorAgentWithOverrides(m).prompt,
  };

  for (const [name, factory] of Object.entries(agentFactories)) {
    const requirement = AGENT_MODEL_REQUIREMENTS[name as keyof typeof AGENT_MODEL_REQUIREMENTS];
    const preferredModel = (requirement as any)?.fallbackChain?.[0]?.model || "google/gemini-3.1-pro-preview";
    let instructions = factory(preferredModel);

    // Inject R&D Library Index into Librarian
    if (name === "librarian") {
      try {
        const researchSummary = readFileSync(join(process.cwd(), "RESEARCH.md"), "utf8");
        instructions += `\n\n---\n\n## R&D LIBRARY (Internal Reference)\n\nThis is a library of specialized agents and commands available in the \`geminirnd/\` directory. Use these for advanced research, implementation, or domain-specific tasks.\n\n${researchSummary}`;
      } catch (e) {
        console.warn("⚠️ Could not inject RESEARCH.md into Librarian prompt");
      }
    }
    
    const content = `---
name: ${name}
model: ${preferredModel}
---
${sanitize(instructions, name)}`;

    writeFileSync(join(agentsDir, `${name}.md`), content);
    console.log(`✅ Rendered agents/${name}.md`);
  }

  // 2. Render Commands
  const commandsDir = join(process.cwd(), "commands");
  mkdirSync(commandsDir, { recursive: true });

  const commandTemplates = {
    refactor: { template: REFACTOR_TEMPLATE, desc: "Intelligent refactor", hint: "<target>" },
    "start-work": { template: START_WORK_TEMPLATE, desc: "Start work session", hint: "[plan]" },
    handoff: { template: HANDOFF_TEMPLATE, desc: "Create handoff context", hint: "[goal]" },
    "remove-ai-slops": { template: REMOVE_AI_SLOPS_TEMPLATE, desc: "Remove AI smells", hint: "" },
    "init-deep": { template: INIT_DEEP_TEMPLATE, desc: "Init knowledge base", hint: "" },
    "ralph-loop": { template: RALPH_LOOP_TEMPLATE, desc: "Self-referential loop", hint: "" },
    "stop-continuation": { template: STOP_CONTINUATION_TEMPLATE, desc: "Stop continuation", hint: "" },
  };

  for (const [name, { template, desc, hint }] of Object.entries(commandTemplates)) {
    const content = `description = "${desc}"
argument_hint = "${hint}"

prompt = """
${sanitize(template, name)}
"""`;
    writeFileSync(join(commandsDir, `${name}.toml`), content);
    console.log(`✅ Rendered commands/${name}.toml`);
  }

  // 3. Special Case: omomomo (Markdown source)
  try {
    const omomomoSource = readFileSync(join(process.cwd(), ".opencode/command/omomomo.md"), "utf8");
    const omomomoContent = `description = "Easter egg command"
prompt = """
${sanitize(omomomoSource)}
"""`;
    writeFileSync(join(commandsDir, "omomomo.toml"), omomomoContent);
    console.log("✅ Rendered commands/omomomo.toml");
  } catch (e) {
    console.warn("⚠️ Could not render omomomo.toml");
  }

  console.log("\n✨ Extension sync complete!");
}

sync().catch(console.error);
