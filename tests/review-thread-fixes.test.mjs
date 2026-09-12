import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const auditScript = path.join(repoRoot, "scripts", "audit-credential-leaks.mjs");
const verificationWorkflow = path.join(
  repoRoot,
  ".github",
  "workflows",
  "full-verification.yml",
);
const retiredMcpDir = path.join(repoRoot, "services", "claude-mcp");

function runCredentialAudit(files) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "maya-credential-audit-"));

  try {
    for (const [name, contents] of Object.entries(files)) {
      fs.writeFileSync(path.join(tempDir, name), contents, "utf8");
    }

    return spawnSync(process.execPath, [auditScript], {
      cwd: tempDir,
      encoding: "utf8",
    });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

test("credential audit rejects generic OpenAI sk- keys", () => {
  const result = runCredentialAudit({
    ".env.local": `OPENAI_API_KEY ${["sk", "1234567890abcdefghijklmnopqrstuv"].join("-")}\n`,
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /embedded-provider-key \.env\.local:1/);
});

test("credential audit still rejects provider-specific sk-ant- keys", () => {
  const result = runCredentialAudit({
    ".env.local": `ANTHROPIC_API_KEY=${["sk", "ant", "1234567890abcdef"].join("-")}\n`,
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /embedded-provider-key \.env\.local:1/);
});

test("credential audit does not flag ordinary words containing sk-", () => {
  const result = runCredentialAudit({
    "notes.txt": `${["the", "sk", "1234567890abcdefghijklmnop", "format"].join("-")}\nrisk-concentration\n`,
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /MAYA CREDENTIAL AUDIT: PASS/);
});

test("full verification covers main pushes", () => {
  const workflow = load(fs.readFileSync(verificationWorkflow, "utf8"));

  assert.deepEqual(workflow.on.push.branches, ["main"]);
});

test("retired Claude MCP service remnants are gone", () => {
  assert.equal(fs.existsSync(retiredMcpDir), false);
});
