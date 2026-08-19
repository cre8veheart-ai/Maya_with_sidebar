import { NextResponse } from "next/server";
import { clearGitHubToken } from "@/lib/github/session";

export async function POST() {
  clearGitHubToken();
  return NextResponse.json({ disconnected: true });
}
