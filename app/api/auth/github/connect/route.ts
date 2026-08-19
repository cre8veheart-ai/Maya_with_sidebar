import { NextResponse } from "next/server";
import { getAuthorizationUrl } from "@/lib/github/oauth";
import { generateState } from "@/lib/github/session";

export async function GET() {
  const state = generateState();
  const url = getAuthorizationUrl(state);

  const res = NextResponse.redirect(url);
  res.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
