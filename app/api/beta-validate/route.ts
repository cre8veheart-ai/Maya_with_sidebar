import { NextRequest, NextResponse } from "next/server";
import { redeemInvite } from "@/lib/beta/invites";
import { BETA_SESSION_COOKIE, betaSessionMaxAge, createBetaSession, hasBetaSessionSecret, verifyBetaSession } from "@/lib/beta/session";

function normalizeCode(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}



export async function GET(request: NextRequest) {
  return NextResponse.json({ authorized: Boolean(verifyBetaSession(request.cookies.get(BETA_SESSION_COOKIE)?.value)) });
}

export async function POST(request: NextRequest) {
  try {
    const code = normalizeCode((await request.json()).code);
    if (!hasBetaSessionSecret() || !(await redeemInvite(code))) return NextResponse.json({ valid: false }, { status: 401 });

    const response = NextResponse.json({ valid: true });
    response.cookies.set(BETA_SESSION_COOKIE, createBetaSession(), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: betaSessionMaxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
