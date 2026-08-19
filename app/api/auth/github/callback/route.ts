import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/github/oauth";
import { storeGitHubToken } from "@/lib/github/session";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = req.cookies.get("github_oauth_state")?.value;

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  if (!state || state !== storedState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    storeGitHubToken(tokenData.access_token);

    const base =
      process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
    const res = NextResponse.redirect(`${base}/settings?github=connected`);
    res.cookies.delete("github_oauth_state");
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
