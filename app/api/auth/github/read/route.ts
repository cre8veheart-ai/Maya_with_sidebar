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
  const path = searchParams.get("path");
  const ref = searchParams.get("ref") ?? undefined;

  if (!owner || !repo || !path) {
    return NextResponse.json({ error: "Missing owner, repo, or path" }, { status: 400 });
  }

  try {
    const client = new GitHubClient(token);
    const file = await client.getFileContent(owner, repo, path, ref);
    const decoded = Buffer.from(file.content, "base64").toString("utf-8");
    return NextResponse.json({ path: file.path, sha: file.sha, content: decoded });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to read file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
