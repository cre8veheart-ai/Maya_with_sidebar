import { NextRequest } from "next/server";
import type { UserProfile } from "@/lib/maya/types";
import {
  attachWorkspaceSession,
  resolveWorkspaceSession,
  type WorkspaceSession,
} from "@/lib/server/workspace-session";
import {
  clearUserProfile,
  getUserProfile,
  saveUserProfile,
} from "@/lib/storage/userVault";

export const dynamic = "force-dynamic";

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

function parseProfile(raw: unknown): UserProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const profile: UserProfile = {
    name: clean(value.name, 100),
    title: clean(value.title, 100),
    company: clean(value.company, 120),
    industry: clean(value.industry, 120),
    companySize: clean(value.companySize, 60),
    primaryRole: clean(value.primaryRole, 80),
    useCase: clean(value.useCase, 1000),
    approvedAt: clean(value.approvedAt, 40),
    // Invite codes are authentication material and never belong in profile storage.
    inviteCodes: [],
  };
  return profile.name ? profile : null;
}

export async function GET(req: NextRequest) {
  const session = resolveWorkspaceSession(req);
  const workspaceId = session.sessionId;

  try {
    return noStore(session, { profile: await getUserProfile(workspaceId) });
  } catch (error) {
    console.error("MAYA profile read failed", error);
    return noStore(session, { error: "Profile storage unavailable", code: "STORAGE_ERROR" }, 503);
  }
}

export async function POST(req: NextRequest) {
  const session = resolveWorkspaceSession(req);
  const workspaceId = session.sessionId;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return noStore(session, { error: "Invalid request body", code: "INVALID_REQUEST" }, 400);
  }

  try {
    if (body.clear === true) {
      await clearUserProfile(workspaceId);
      return noStore(session, { profile: null });
    }

    const profile = parseProfile(body.profile);
    if (!profile) {
      return noStore(session, { error: "Valid profile required", code: "INVALID_PROFILE" }, 400);
    }

    await saveUserProfile(workspaceId, profile);
    return noStore(session, { profile });
  } catch (error) {
    console.error("MAYA profile write failed", error);
    return noStore(session, { error: "Profile storage unavailable", code: "STORAGE_ERROR" }, 503);
  }
}
