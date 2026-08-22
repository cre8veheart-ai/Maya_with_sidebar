import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "GITHUB_IN_APP_OAUTH_DISABLED",
      message: "GitHub OAuth callbacks are disabled for MAYA.",
    },
    { status: 410 }
  );
}
