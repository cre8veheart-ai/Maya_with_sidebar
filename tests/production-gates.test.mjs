import assert from "node:assert/strict";
import test from "node:test";

import {
  createBetaSession,
  verifyBetaSession,
} from "../lib/beta/session-core.mjs";
import { authenticateBetaToken } from "../lib/server/auth-core.mjs";
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

test("health is ready only when every required dependency is configured", () => {
  const now = new Date("2026-08-23T20:00:00.000Z");
  const result = evaluateHealth(
    {
      ANTHROPIC_API_KEY: "configured",
      BETA_SESSION_SECRET: TEST_SECRET,
      KV_REST_API_URL: "https://example.invalid",
      KV_REST_API_TOKEN: "configured",
    },
    now,
  );

  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.status, "ready");
  assert.equal(result.payload.timestamp, now.toISOString());
  assert.deepEqual(result.payload.checks, {
    app: true,
    anthropicConfigured: true,
    betaSessionSecretConfigured: true,
    redisConfigured: true,
  });
});

test("health degrades when a required dependency is absent", () => {
  const result = evaluateHealth({
    ANTHROPIC_API_KEY: "configured",
    BETA_SESSION_SECRET: TEST_SECRET,
  });

  assert.equal(result.statusCode, 503);
  assert.equal(result.payload.status, "degraded");
  assert.equal(result.payload.checks.redisConfigured, false);
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

test("missing beta session fails closed with a structured 401 response", async () => {
  await withBetaSecret(TEST_SECRET, async () => {
    let thrown;
    try {
      authenticateBetaToken(undefined);
    } catch (error) {
      thrown = error;
    }

    assert.ok(thrown instanceof Response);
    assert.equal(thrown.status, 401);
    assert.equal(thrown.headers.get("cache-control"), "no-store");
    assert.deepEqual(await thrown.json(), {
      error: "Unauthorized",
      code: "AUTH_REQUIRED",
    });
  });
});

test("valid beta session authenticates without provider or network access", async () => {
  await withBetaSecret(TEST_SECRET, () => {
    const token = createBetaSession();
    const auth = authenticateBetaToken(token);

    assert.equal(typeof auth.sessionId, "string");
    assert.ok(auth.sessionId.length > 0);
  });
});
