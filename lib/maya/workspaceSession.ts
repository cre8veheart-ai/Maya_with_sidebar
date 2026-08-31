import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const MAYA_WORKSPACE_COOKIE = "maya_workspace";
export const mayaWorkspaceMaxAge = 60 * 60 * 24 * 30;

type WorkspaceClaim = {
  sub: string;
  exp: number;
  scope: "maya-workspace";
};

function secret(): string {
  const value = process.env.MAYA_WORKSPACE_SECRET || process.env.BETA_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("MAYA workspace signing secret is not configured");
  }
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret())
    .update(`maya-workspace:${payload}`)
    .digest("base64url");
}

function encode(claim: WorkspaceClaim): string {
  return Buffer.from(JSON.stringify(claim)).toString("base64url");
}

function decode(token: string | undefined): WorkspaceClaim | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  try {
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const claim = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as WorkspaceClaim;
    return claim.scope === "maya-workspace" &&
      typeof claim.sub === "string" &&
      typeof claim.exp === "number" &&
      claim.exp > Date.now() / 1000
      ? claim
      : null;
  } catch {
    return null;
  }
}

export function resolveWorkspaceSession(token: string | undefined): {
  workspaceId: string;
  token?: string;
} {
  const existing = decode(token);
  if (existing) return { workspaceId: existing.sub };

  const claim: WorkspaceClaim = {
    sub: randomUUID(),
    exp: Math.floor(Date.now() / 1000) + mayaWorkspaceMaxAge,
    scope: "maya-workspace",
  };
  const payload = encode(claim);
  return { workspaceId: claim.sub, token: `${payload}.${sign(payload)}` };
}

export function buildWorkspaceCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return [
    `${MAYA_WORKSPACE_COOKIE}=${token}`,
    "Path=/",
    `Max-Age=${mayaWorkspaceMaxAge}`,
    "HttpOnly",
    "SameSite=Strict",
  ].join("; ") + secure;
}
