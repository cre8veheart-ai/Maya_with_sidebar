import { NextResponse } from "next/server";
import { getGitHubToken } from "@/lib/github/session";
import { GitHubClient } from "@/lib/github/client";

export async function GET() {
  const token = getGitHubToken();
  if (!token) {
    return NextResponse.json({ connected: false });
  }

  try {
    const client = new GitHubClient(token);
    const user = await client.getUser();
    return NextResponse.json({ connected: true, user });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
