import { randomUUID } from "node:crypto";

import { verifyBetaSession } from "../beta/session-core.mjs";

export const WORKSPACE_SESSION_COOKIE = "maya_workspace_session";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isWorkspaceSessionId(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function resolveWorkspaceSessionId(workspaceToken, legacyBetaToken) {
  if (isWorkspaceSessionId(workspaceToken)) {
    return { sessionId: workspaceToken, shouldSetCookie: false, migrated: false };
  }

  const legacySession = verifyBetaSession(legacyBetaToken);
  const sessionId = isWorkspaceSessionId(legacySession?.sub)
    ? legacySession.sub
    : randomUUID();

  return {
    sessionId,
    shouldSetCookie: true,
    migrated: Boolean(legacySession),
  };
}
