import { createHmac, timingSafeEqual } from "crypto";

type AccessPayload = {
  code: string;
  exp: number;
};

const COOKIE_NAME = "maya_beta_access";
const MAX_AGE_SECONDS = 14 * 24 * 60 * 60;

function getSigningSecret(): string | null {
  return (
    process.env.BETA_GATE_SECRET ??
    process.env.OPENAI_API_KEY ??
    process.env.BETA_INVITE_CODES ??
    null
  );
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function getBetaAccessCookieName(): string {
  return COOKIE_NAME;
}

export function getBetaAccessCookieMaxAge(): number {
  return MAX_AGE_SECONDS;
}

export function createBetaAccessToken(inviteCode: string): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  const payload: AccessPayload = {
    code: inviteCode.trim().toLowerCase(),
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };

  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const signature = sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export function isValidBetaAccessToken(token: string | undefined): boolean {
  const secret = getSigningSecret();
  if (!secret || !token) return false;

  const [encoded, providedSignature] = token.split(".");
  if (!encoded || !providedSignature) return false;

  const expected = sign(encoded, secret);
  const expectedBytes = Buffer.from(expected, "utf8");
  const providedBytes = Buffer.from(providedSignature, "utf8");

  if (expectedBytes.length !== providedBytes.length) return false;
  if (!timingSafeEqual(expectedBytes, providedBytes)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as AccessPayload;
    if (!payload || typeof payload.exp !== "number") return false;
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}
