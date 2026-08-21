import { createHmac, timingSafeEqual } from "crypto";

export const FOUNDER_CONTINUITY_COOKIE = "maya_founder_continuity";
const CONTINUITY_TTL_SECONDS = 60 * 60 * 8;

type ContinuitySession = {
  sub: string;
  exp: number;
  scope: "founder-continuity";
};

function signingSecret(): string {
  const value = process.env.BETA_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("BETA_SESSION_SECRET is not configured");
  }
  return value;
}

function encode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", signingSecret())
    .update(`founder-continuity:${payload}`)
    .digest("base64url");
}

export function createFounderContinuitySession(sessionId: string): string {
  const session: ContinuitySession = {
    sub: sessionId,
    exp: Math.floor(Date.now() / 1000) + CONTINUITY_TTL_SECONDS,
    scope: "founder-continuity",
  };
  const payload = encode(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

export function verifyFounderContinuitySession(
  token: string | undefined,
  sessionId: string,
): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  try {
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return false;
    }

    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as ContinuitySession;

    return (
      parsed.scope === "founder-continuity" &&
      parsed.sub === sessionId &&
      typeof parsed.exp === "number" &&
      parsed.exp > Date.now() / 1000
    );
  } catch {
    return false;
  }
}

export const founderContinuityMaxAge = CONTINUITY_TTL_SECONDS;
