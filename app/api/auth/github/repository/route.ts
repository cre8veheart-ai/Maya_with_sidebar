import { NextRequest, NextResponse } from "next/server";
import { getGitHubToken } from "@/lib/github/session";
import { GitHubClient } from "@/lib/github/client";

export async function GET(req: NextRequest) {
  const token = getGitHubToken();
  if (!token) {
    return NextResponse.json({ error: "Not connected to GitHub" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 });
  }

  try {
    const client = new GitHubClient(token);
    const data = await client.getRepo(owner, repo);
    return NextResponse.json({ repository: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get repository";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
