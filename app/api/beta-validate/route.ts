import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  isLikelyAutomatedRequest,
} from "@/lib/server/requestGuard";

function sanitize(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = checkRateLimit(`beta-validate:${ip}`, {
      windowMs: 60_000,
      max: 12,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { valid: false, error: "Too many attempts. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        }
      );
    }

    if (isLikelyAutomatedRequest(req.headers)) {
      return NextResponse.json({ valid: false }, { status: 403 });
    }

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
