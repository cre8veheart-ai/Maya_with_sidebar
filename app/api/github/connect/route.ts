import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "GITHUB_IN_APP_OAUTH_DISABLED",
      message: "In-app GitHub OAuth is disabled. Repository operations must use the external CTO-managed GitHub integration path.",
    },
    { status: 410 }
  );
}
