import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  BETA_SESSION_COOKIE,
  betaSessionMaxAge,
  createBetaSession,
  hasBetaSessionSecret,
} from "@/lib/beta/session";

function hasAccessCode(): boolean {
  return Boolean(process.env.BETA_ACCESS_CODE?.trim());
}

function matchesAccessCode(candidate: string): boolean {
  const configured = process.env.BETA_ACCESS_CODE?.trim() ?? "";
  const actual = Buffer.from(candidate);
  const expected = Buffer.from(configured);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function POST(req: NextRequest) {
  if (!hasBetaSessionSecret() || !hasAccessCode()) {
    return NextResponse.json(
      { error: "Beta access is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let code = "";
  try {
    const body = (await req.json()) as { code?: unknown };
    code = typeof body.code === "string" ? body.code.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!code || !matchesAccessCode(code)) {
    return NextResponse.json(
      { error: "Invalid beta access code." },
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
