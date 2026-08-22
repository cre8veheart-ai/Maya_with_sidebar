import { NextResponse } from "next/server";

/**
 * MAYA product runtime has no GitHub write authority.
 *
 * Repository mutation belongs to externally governed engineering tooling with
 * explicit branch/review/release controls, not to the running application.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "GitHub write actions are disabled by MAYA policy",
      code: "GITHUB_WRITE_DISABLED",
    },
    { status: 403 }
  );
}
