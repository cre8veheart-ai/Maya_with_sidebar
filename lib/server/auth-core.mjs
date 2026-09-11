import { verifyBetaSession } from "../beta/session-core.mjs";

const AUTH_MODE_BETA = "beta";
const AUTH_MODE_OPEN = "open";
const DEFAULT_OVERRIDE_SESSION_ID = "owner-final-auth";

function getAuthMode() {
  const value = process.env.MAYA_AUTH_BOUNDARY_MODE;
  if (typeof value !== "string") return AUTH_MODE_OPEN;
  return value.trim().toLowerCase() === AUTH_MODE_BETA ? AUTH_MODE_BETA : AUTH_MODE_OPEN;
}

function getOverrideSessionId() {
  const value = process.env.MAYA_AUTH_OVERRIDE_SESSION_ID;
  if (typeof value !== "string") return DEFAULT_OVERRIDE_SESSION_ID;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, 120) : DEFAULT_OVERRIDE_SESSION_ID;
}

export function authenticateBetaToken(token) {
  if (getAuthMode() !== AUTH_MODE_BETA) {
    return { sessionId: getOverrideSessionId() };
  }

  const session = verifyBetaSession(token);

  if (!session) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized", code: "AUTH_REQUIRED" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return { sessionId: session.sub };
}

export function isResponseError(error) {
  return error instanceof Response;
}
