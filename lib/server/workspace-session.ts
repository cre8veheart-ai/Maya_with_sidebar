import { NextRequest } from "next/server";

import { BETA_SESSION_COOKIE } from "@/lib/beta/session";
import {
  resolveWorkspaceSessionId,
  WORKSPACE_SESSION_COOKIE,
} from "./workspace-session-core.mjs";

const WORKSPACE_SESSION_MAX_AGE = 60 * 60 * 24 * 365;

export type WorkspaceSession = {
  sessionId: string;
  setCookie: string | null;
};

function workspaceCookie(sessionId: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return [
    `${WORKSPACE_SESSION_COOKIE}=${sessionId}`,
    "Path=/",
    `Max-Age=${WORKSPACE_SESSION_MAX_AGE}`,
    "HttpOnly",
    "SameSite=Lax",
  ].join("; ") + secure;
}

export function resolveWorkspaceSession(req: NextRequest): WorkspaceSession {
  const resolved = resolveWorkspaceSessionId(
    req.cookies.get(WORKSPACE_SESSION_COOKIE)?.value,
    req.cookies.get(BETA_SESSION_COOKIE)?.value,
  );

  return {
    sessionId: resolved.sessionId,
    setCookie: resolved.shouldSetCookie ? workspaceCookie(resolved.sessionId) : null,
  };
}

export function attachWorkspaceSession(
  response: Response,
  session: WorkspaceSession,
): Response {
  if (session.setCookie) response.headers.append("Set-Cookie", session.setCookie);
  return response;
}
