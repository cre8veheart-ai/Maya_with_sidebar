import { NextRequest } from "next/server";
import { requireBetaSession, isResponseError } from "@/lib/server/auth";
import { supabaseRest } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    requireBetaSession(req);
  } catch (error) {
    if (isResponseError(error)) return error;
    return Response.json(
      { ok: false, service: "maya-memory", code: "UNAUTHORIZED" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await supabaseRest<Array<{ id: string }>>("workspaces?select=id&limit=1");

    return Response.json(
      { ok: true, service: "maya-memory", database: "reachable" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("MAYA memory health check failed", error);
    return Response.json(
      { ok: false, service: "maya-memory", database: "unreachable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
