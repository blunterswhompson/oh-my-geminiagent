/**
 * model-resilience hook for Gemini CLI extension.
 * Dynamically adjusts agent models based on provider availability.
 */

async function main() {
  try {
    const providers = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    };

    const agentMappings = [
      { agent: "sisyphus", preferred: "claude-opus-4-7", fallback: "model: inherit", key: "ANTHROPIC_API_KEY" },
      { agent: "oracle", preferred: "gpt-5.4", fallback: "model: inherit", key: "OPENAI_API_KEY" },
    ];

    let systemDirectives: string[] = [];
    let toasts: string[] = [];

    for (const config of agentMappings) {
      if (!providers[config.key as keyof typeof providers]) {
        systemDirectives.push(`[RESILIENCE] Agent '${config.agent}' preferred model '${config.preferred}' is unavailable (missing ${config.key}). Forcing '${config.fallback}'.`);
        toasts.push(`⚠️ ${config.agent} fallback: ${config.fallback} (missing ${config.key})`);
      }
    }

    if (systemDirectives.length > 0) {
      process.stdout.write(JSON.stringify({
        system_directive: systemDirectives.join("\n"),
        toast: toasts.join("\n")
      }));
    } else {
      process.stdout.write(JSON.stringify({}));
    }
    process.exit(0);
  } catch (error) {
    // Fail safe: proceed without changes if an error occurs
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  }
}

main().catch(() => process.exit(0));
