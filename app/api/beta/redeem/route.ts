import { NextRequest, NextResponse } from "next/server";
import { redeemInvite } from "@/lib/beta/invites";
import {
  BETA_SESSION_COOKIE,
  betaSessionMaxAge,
  createBetaSession,
  hasBetaSessionSecret,
} from "@/lib/beta/session";

export async function POST(req: NextRequest) {
  if (!hasBetaSessionSecret()) {
    return NextResponse.json(
      { error: "Beta sessions are not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let code = "";
  try {
    const body = (await req.json()) as { code?: unknown };
    code = typeof body.code === "string" ? body.code.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!code || !(await redeemInvite(code))) {
    return NextResponse.json(
      { error: "This beta access code is invalid or has already been used." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: BETA_SESSION_COOKIE,
    value: createBetaSession(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: betaSessionMaxAge,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
