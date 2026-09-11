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

async function withAuthMode(value, fn) {
  const previous = process.env.MAYA_AUTH_BOUNDARY_MODE;
  if (value === undefined) delete process.env.MAYA_AUTH_BOUNDARY_MODE;
  else process.env.MAYA_AUTH_BOUNDARY_MODE = value;

  try {
    return await fn();
  } finally {
    if (previous === undefined) delete process.env.MAYA_AUTH_BOUNDARY_MODE;
    else process.env.MAYA_AUTH_BOUNDARY_MODE = previous;
  }
}

async function withOverrideSessionId(value, fn) {
  const previous = process.env.MAYA_AUTH_OVERRIDE_SESSION_ID;
  if (value === undefined) delete process.env.MAYA_AUTH_OVERRIDE_SESSION_ID;
  else process.env.MAYA_AUTH_OVERRIDE_SESSION_ID = value;

  try {
    return await fn();
  } finally {
    if (previous === undefined) delete process.env.MAYA_AUTH_OVERRIDE_SESSION_ID;
    else process.env.MAYA_AUTH_OVERRIDE_SESSION_ID = previous;
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
  await withAuthMode("beta", () =>
    withBetaSecret(TEST_SECRET, () => {
      const token = createBetaSession();
      const session = verifyBetaSession(token);

      assert.ok(session);
      assert.equal(typeof session.sub, "string");
      assert.ok(session.sub.length > 0);
      assert.ok(session.exp > Date.now() / 1000);

      const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
      assert.equal(verifyBetaSession(tampered), null);
    })
  );
});

test("missing beta session fails closed with a structured 401 response", async () => {
  await withAuthMode("beta", () =>
    withBetaSecret(TEST_SECRET, async () => {
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
    })
  );
});

test("open auth mode bypasses beta session checks", async () => {
  await withAuthMode(undefined, () =>
    withOverrideSessionId(undefined, () => {
      assert.deepEqual(authenticateBetaToken(undefined), {
        sessionId: "owner-final-auth",
      });
    })
  );
});

test("open auth mode uses configured override session id", async () => {
  await withAuthMode("open", () =>
    withOverrideSessionId("leslie-owner", () => {
      assert.deepEqual(authenticateBetaToken(undefined), {
        sessionId: "leslie-owner",
      });
    })
  );
});

test("valid beta session authenticates without provider or network access", async () => {
  await withAuthMode("beta", () =>
    withBetaSecret(TEST_SECRET, () => {
      const token = createBetaSession();
      const auth = authenticateBetaToken(token);

      assert.equal(typeof auth.sessionId, "string");
      assert.ok(auth.sessionId.length > 0);
    })
  );
});
