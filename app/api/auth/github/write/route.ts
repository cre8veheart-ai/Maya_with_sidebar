import { NextRequest, NextResponse } from "next/server";
import { getGitHubToken } from "@/lib/github/session";
import { GitHubClient } from "@/lib/github/client";

export async function POST(req: NextRequest) {
  const token = getGitHubToken();
  if (!token) {
    return NextResponse.json({ error: "Not connected to GitHub" }, { status: 401 });
  }

  let body: { owner?: string; repo?: string; path?: string; message?: string; content?: string; sha?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { owner, repo, path, message, content, sha } = body;
  if (!owner || !repo || !path || !message || content === undefined) {
    return NextResponse.json(
      { error: "Missing required fields: owner, repo, path, message, content" },
      { status: 400 }
    );
  }

  try {
    const client = new GitHubClient(token);
    const result = await client.createOrUpdateFile(owner, repo, path, message, content, sha);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    const message2 = err instanceof Error ? err.message : "Failed to write file";
    return NextResponse.json({ error: message2 }, { status: 500 });
  }
}
