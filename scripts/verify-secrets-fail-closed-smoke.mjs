import { readFileSync } from "node:fs";
import { evaluateHealth } from "../lib/server/health-core.mjs";

function lineOf(source, pattern) {
  const lines = source.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (pattern.test(lines[i])) return i + 1;
  }
  return -1;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  const chatProvidersFile = "lib/maya/chatProviders.ts";
  const chatProviders = readFileSync(chatProvidersFile, "utf8");

  const missingAnthropic = evaluateHealth({}, new Date("2026-01-01T00:00:00.000Z"));
  assert(
    missingAnthropic.statusCode === 503 && missingAnthropic.payload.status === "degraded",
    "lib/server/health-core.mjs:1 health must degrade when ANTHROPIC_API_KEY is absent",
  );

  const anthropicGuardLine = lineOf(chatProviders, /provider === "anthropic" && !process\.env\.ANTHROPIC_API_KEY/);
  assert(
    anthropicGuardLine !== -1,
    `${chatProvidersFile}:missing anthropic fail-closed provider guard`,
  );

  const openAiGuardLine = lineOf(chatProviders, /provider === "openai" && !process\.env\.OPENAI_API_KEY\?\.trim\(\)/);
  assert(
    openAiGuardLine !== -1,
    `${chatProvidersFile}:missing openai fail-closed provider guard`,
  );

  const openClawGuardLine = lineOf(chatProviders, /provider === "openclaw" && !process\.env\.OPENCLAW_BASE_URL/);
  assert(
    openClawGuardLine !== -1,
    `${chatProvidersFile}:missing openclaw fail-closed provider guard`,
  );

  console.log("SMOKE_SECRETS_FAIL_CLOSED=PASS | root-cause: none");
} catch (error) {
  const message = error instanceof Error ? error.message : "unknown fail-closed secret failure";
  console.error(`SMOKE_SECRETS_FAIL_CLOSED=FAIL | root-cause: ${message}`);
  process.exit(1);
}
