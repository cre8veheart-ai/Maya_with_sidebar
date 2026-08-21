export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    app: true,
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    betaSessionSecretConfigured: Boolean(
      process.env.BETA_SESSION_SECRET && process.env.BETA_SESSION_SECRET.length >= 32,
    ),
    redisConfigured: Boolean(
      process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
    ),
  };

  const ready = Object.values(checks).every(Boolean);

  return Response.json(
    {
      service: "maya-with-sidebar",
      status: ready ? "ready" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
