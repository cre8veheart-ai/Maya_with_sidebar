import { NextRequest } from "next/server";

import {
  attachWorkspaceSession,
  resolveWorkspaceSession,
  type WorkspaceSession,
} from "@/lib/server/workspace-session";
import {
  buildMayaSessionCloseout,
  MAYA_SESSION_INACTIVITY_MS,
  type MayaPocketOfficeSession,
} from "@/lib/maya/sessionLifecycle";
import type { ExecRole, MayaMessage } from "@/lib/maya/types";
import {
  listPocketOfficeSessions,
  savePocketOfficeSession,
} from "@/lib/storage/sessionVault";

export const dynamic = "force-dynamic";

const VALID_ROLES = new Set<ExecRole | "strategy-room">([
  "ceo", "coo", "cmo", "cfo", "cto", "cio", "cro", "cd",
  "admin", "hr", "legal", "strategy-room",
]);

function noStore(session: WorkspaceSession, payload: unknown, status = 200) {
  return attachWorkspaceSession(Response.json(payload, {
    status,
    headers: { "Cache-Control": "no-store" },
  }), session);
}

function clean(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.slice(0, max).replace(/[\x00-\x1f\x7f]/g, " ").trim()
    : "";
}

function parseRole(value: unknown): MayaPocketOfficeSession["role"] | null {
  const role = clean(value, 30) as MayaPocketOfficeSession["role"];
  return VALID_ROLES.has(role) ? role : null;
}

function parseTranscript(value: unknown): MayaMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is { role: "user" | "assistant"; content: string } =>
        Boolean(item) &&
        typeof item === "object" &&
        ((item as { role?: unknown }).role === "user" ||
          (item as { role?: unknown }).role === "assistant") &&
        typeof (item as { content?: unknown }).content === "string",
    )
    .slice(-100)
    .map((item) => ({
      role: item.role,
      content: clean(item.content, 8000),
    }))
    .filter((item) => item.content.length > 0);
}

function parseSession(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const id = clean(raw.id, 120);
  const clientVaultId = clean(raw.clientVaultId, 120);
  const role = parseRole(raw.role);
  const title = clean(raw.title, 160);
  const transcript = parseTranscript(raw.transcript);
  if (!id || !clientVaultId || !role || !title || transcript.length === 0) {
    return null;
  }
  return { id, clientVaultId, role, title, transcript };
}

async function closeStale(
  workspaceId: string,
  sessions: MayaPocketOfficeSession[],
): Promise<MayaPocketOfficeSession[]> {
  const now = Date.now();
  return Promise.all(
    sessions.map(async (session) => {
      if (
        session.status !== "active" ||
        now - Date.parse(session.lastActivityAt) < MAYA_SESSION_INACTIVITY_MS
      ) {
        return session;
      }

      const closedAt = new Date().toISOString();
      return savePocketOfficeSession(workspaceId, {
        ...session,
        status: "auto_closed",
        closedAt,
        closeout: buildMayaSessionCloseout(session.transcript, new Date(closedAt)),
      });
    }),
  );
}

export async function GET(req: NextRequest) {
  const sessionState = resolveWorkspaceSession(req);
  const workspaceId = sessionState.sessionId;

  const clientVaultId = clean(
    req.nextUrl.searchParams.get("clientVaultId") || "personal",
    120,
  );
  const roleValue = req.nextUrl.searchParams.get("role");
  let role: MayaPocketOfficeSession["role"] | undefined;
  if (roleValue) {
    const parsedRole = parseRole(roleValue);
    if (!parsedRole) {
      return noStore(sessionState, { error: "Invalid session scope", code: "INVALID_SCOPE" }, 400);
    }
    role = parsedRole;
  }
  if (!clientVaultId) {
    return noStore(sessionState, { error: "Invalid session scope", code: "INVALID_SCOPE" }, 400);
  }

  const limit = Math.min(
    Math.max(Number(req.nextUrl.searchParams.get("limit")) || 30, 1),
    100,
  );

  try {
    const sessions = await listPocketOfficeSessions(
      workspaceId,
      clientVaultId,
      role,
      limit,
    );
    return noStore(sessionState, { sessions: await closeStale(workspaceId, sessions) });
  } catch (error) {
    console.error("MAYA session read failed", error);
    return noStore(
      sessionState,
      { error: "Session storage unavailable", code: "STORAGE_ERROR" },
      503,
    );
  }
}

export async function POST(req: NextRequest) {
  const sessionState = resolveWorkspaceSession(req);
  const workspaceId = sessionState.sessionId;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return noStore(sessionState, { error: "Invalid request body", code: "INVALID_REQUEST" }, 400);
  }

  const input = parseSession(body.session);
  const action = body.action === "close" ? "close" : "checkpoint";
  if (!input) {
    return noStore(sessionState, { error: "Valid session required", code: "INVALID_SESSION" }, 400);
  }

  const now = new Date();
  const closing = action === "close";
  const session: MayaPocketOfficeSession = {
    ...input,
    status: closing ? "auto_closed" : "active",
    lastActivityAt: now.toISOString(),
    closedAt: closing ? now.toISOString() : null,
    closeout: closing ? buildMayaSessionCloseout(input.transcript, now) : null,
  };

  try {
    return noStore(sessionState, {
      session: await savePocketOfficeSession(workspaceId, session),
    });
  } catch (error) {
    console.error("MAYA session write failed", error);
    return noStore(
      sessionState,
      { error: "Session storage unavailable", code: "STORAGE_ERROR" },
      503,
    );
  }
}
