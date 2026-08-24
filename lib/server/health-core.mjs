export function evaluateHealth(env = process.env, now = new Date()) {
  const checks = {
    app: true,
    anthropicConfigured: Boolean(env.ANTHROPIC_API_KEY),
    betaSessionSecretConfigured: Boolean(
      env.BETA_SESSION_SECRET && env.BETA_SESSION_SECRET.length >= 32,
    ),
    redisConfigured: Boolean(env.KV_REST_API_URL && env.KV_REST_API_TOKEN),
  };

  const ready = Object.values(checks).every(Boolean);

  return {
    statusCode: ready ? 200 : 503,
    payload: {
      service: "maya-with-sidebar",
      status: ready ? "ready" : "degraded",
      checks,
      timestamp: now.toISOString(),
    },
  };
}
