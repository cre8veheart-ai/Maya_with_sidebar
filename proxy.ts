import { NextRequest, NextResponse } from "next/server";

const COOKIE = "maya_beta_session";

function base64UrlToBytes(value: string): ArrayBuffer {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return buffer;
}

async function validSession(token: string | undefined): Promise<boolean> {
  const secret = process.env.BETA_SESSION_SECRET;
  if (!token || !secret || secret.length < 32) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("HMAC", key, base64UrlToBytes(signature), new TextEncoder().encode(payload));
    if (!valid) return false;
    const data = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") return NextResponse.next();
  if (await validSession(request.cookies.get(COOKIE)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
