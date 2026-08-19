import { NextResponse } from "next/server";
import { getGitHubToken } from "@/lib/github/session";
import { GitHubClient } from "@/lib/github/client";

export async function GET() {
  const token = getGitHubToken();
  if (!token) {
    return NextResponse.json({ error: "Not connected to GitHub" }, { status: 401 });
  }

  try {
    const client = new GitHubClient(token);
    const repos = await client.listRepos();
    return NextResponse.json({ repos });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list repos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
