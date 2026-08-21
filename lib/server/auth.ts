import { NextRequest } from "next/server";
import {
  BETA_SESSION_COOKIE,
  verifyBetaSession,
} from "@/lib/beta/session";

export type AuthenticatedSession = {
  sessionId: string;
};

export function requireBetaSession(req: NextRequest): AuthenticatedSession {
  const token = req.cookies.get(BETA_SESSION_COOKIE)?.value;
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

export function isResponseError(error: unknown): error is Response {
  return error instanceof Response;
}
