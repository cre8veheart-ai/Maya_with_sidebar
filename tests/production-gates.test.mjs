import assert from "node:assert/strict";
import test from "node:test";

import {
  createBetaSession,
  verifyBetaSession,
} from "../lib/beta/session-core.mjs";
import {
  isWorkspaceSessionId,
  resolveWorkspaceSessionId,
} from "../lib/server/workspace-session-core.mjs";
import { evaluateHealth } from "../lib/server/health-core.mjs";

const TEST_SECRET = "test-only-beta-session-secret-32-chars-minimum";

async function withBetaSecret(value, fn) {
  const previous = process.env.BETA_SESSION_SECRET;
  if (value === undefined) delete process.env.BETA_SESSION_SECRET;
  else process.env.BETA_SESSION_SECRET = value;

  try {
    return await fn();
  } finally {
    if (previous === undefined) delete process.env.BETA_SESSION_SECRET;
    else process.env.BETA_SESSION_SECRET = previous;
  }
}

test("health is ready when active runtime dependencies are configured", () => {
  const now = new Date("2026-08-23T20:00:00.000Z");
  const result = evaluateHealth(
    {
      ANTHROPIC_API_KEY: "configured",
    },
    now,
  );

  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.status, "ready");
  assert.equal(result.payload.timestamp, now.toISOString());
  assert.deepEqual(result.payload.checks, {
    app: true,
    anthropicConfigured: true,
  });
});

test("health degrades when the active Anthropic dependency is absent", () => {
  const result = evaluateHealth({});

  assert.equal(result.statusCode, 503);
  assert.equal(result.payload.status, "degraded");
  assert.equal(result.payload.checks.anthropicConfigured, false);
});

test("retired beta and Redis variables do not block runtime health", () => {
  const result = evaluateHealth({
    ANTHROPIC_API_KEY: "configured",
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.status, "ready");
  assert.equal("betaSessionSecretConfigured" in result.payload.checks, false);
  assert.equal("redisConfigured" in result.payload.checks, false);
});

test("beta session tokens validate and reject tampering", async () => {
  await withBetaSecret(TEST_SECRET, () => {
    const token = createBetaSession();
    const session = verifyBetaSession(token);

    assert.ok(session);
    assert.equal(typeof session.sub, "string");
    assert.ok(session.sub.length > 0);
    assert.ok(session.exp > Date.now() / 1000);

    const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
    assert.equal(verifyBetaSession(tampered), null);
  });
});

test("open operation creates an isolated workspace session without sign-in", () => {
  const session = resolveWorkspaceSessionId(undefined, undefined);

  assert.equal(isWorkspaceSessionId(session.sessionId), true);
  assert.equal(session.shouldSetCookie, true);
  assert.equal(session.migrated, false);
});

test("an existing workspace session remains stable", () => {
  const id = "a54db6da-4eb1-4e6c-8f09-cc7350d67d20";
  const session = resolveWorkspaceSessionId(id, undefined);

  assert.equal(session.sessionId, id);
  assert.equal(session.shouldSetCookie, false);
  assert.equal(session.migrated, false);
});

test("a valid legacy beta session migrates without losing its workspace", async () => {
  await withBetaSecret(TEST_SECRET, () => {
    const token = createBetaSession();
    const beta = verifyBetaSession(token);
    const session = resolveWorkspaceSessionId(undefined, token);

    assert.equal(session.sessionId, beta.sub);
    assert.equal(session.shouldSetCookie, true);
    assert.equal(session.migrated, true);
  });
});
