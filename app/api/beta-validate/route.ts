import { NextRequest, NextResponse } from "next/server";

function sanitize(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const submitted = sanitize(body.code);

    if (!submitted) {
      return NextResponse.json({ valid: false });
    }

    const pool = (process.env.BETA_INVITE_CODES ?? "")
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    if (!pool.length || !pool.includes(submitted)) {
      return NextResponse.json({ valid: false });
    }

    // Return 3 shareable codes from the pool (excluding the one just used)
    const others = pool.filter((c) => c !== submitted);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    const inviteCodes = shuffled.slice(0, 3).map((c) => c.toUpperCase());

    return NextResponse.json({ valid: true, inviteCodes });
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
