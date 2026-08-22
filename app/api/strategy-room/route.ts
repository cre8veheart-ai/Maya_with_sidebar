import { NextRequest } from "next/server";
import { requireBetaSession, isResponseError } from "@/lib/server/auth";
import { runStrategyRoom } from "@/lib/maya/strategyRoom";
import {
  buildFounderContinuityMessage,
  isAuthorizedFounderSession,
} from "@/lib/maya/founderContinuity";
import {
  FOUNDER_CONTINUITY_COOKIE,
  verifyFounderContinuitySession,
} from "@/lib/maya/founderContinuitySession";
import type { ExecRole, MayaProvider } from "@/lib/maya/types";

const VALID_ROLES = new Set<ExecRole>([
  "ceo", "coo", "cmo", "cfo", "cto", "cio", "cro", "cd", "admin", "hr", "legal",
]);
const VALID_PROVIDERS = new Set<MayaProvider>(["anthropic", "openclaw", "openai"]);

function sanitizeText(raw: unknown, maxLen: number): string {
  if (typeof raw !== "string") return "";
  return raw.slice(0, maxLen).replace(/[\x00-\x1f\x7f]/g, " ").trim();
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = requireBetaSession(req);
  } catch (error) {
    if (isResponseError(error)) return error;
    return Response.json({ error: "Authentication failed", code: "AUTH_ERROR" }, { status: 500 });
  }

  let roles: ExecRole[] = [];
  let prompt = "";
  let provider: MayaProvider = "anthropic";
  let model = "";
  let ludicrousMode = false;

  try {
    const body = await req.json();
    const rawRoles = Array.isArray(body.roles) ? body.roles : [];
    roles = [...new Set(rawRoles.filter((role): role is ExecRole => typeof role === "string" && VALID_ROLES.has(role as ExecRole)))].slice(0, 8);
    prompt = sanitizeText(body.prompt, 8000);
    provider = typeof body.provider === "string" && VALID_PROVIDERS.has(body.provider as MayaProvider)
      ? (body.provider as MayaProvider)
      : ((process.env.MAYA_PROVIDER as MayaProvider) || "anthropic");
    model = sanitizeText(body.model, 100);
    ludicrousMode = body.ludicrousMode === true;
  } catch {
    return Response.json({ error: "Invalid request body", code: "INVALID_REQUEST" }, { status: 400 });
  }

  if (roles.length < 2) {
    return Response.json({ error: "Select at least two executive roles", code: "ROLES_REQUIRED" }, { status: 400 });
  }
  if (!prompt) {
    return Response.json({ error: "A strategy prompt is required", code: "PROMPT_REQUIRED" }, { status: 400 });
  }

  const continuityToken = req.cookies.get(FOUNDER_CONTINUITY_COOKIE)?.value;
  const continuityActive = isAuthorizedFounderSession(session.sessionId) && verifyFounderContinuitySession(
    continuityToken,
    session.sessionId,
  );
  const founderContext = buildFounderContinuityMessage(session.sessionId, continuityActive);

  try {
    const result = await runStrategyRoom({
      roles,
      prompt,
      provider,
      model: model || undefined,
      ludicrousMode,
      founderContext,
    });

    return Response.json(result, {
      headers: {
        "Cache-Control": "no-store",
        "X-Maya-Continuity": continuityActive ? "active" : "inactive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Strategy Room failed";
    return Response.json({ error: message, code: "STRATEGY_ROOM_ERROR" }, { status: 502 });
  }
}
