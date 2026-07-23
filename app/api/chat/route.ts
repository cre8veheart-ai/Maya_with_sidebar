import { NextRequest } from "next/server";
import OpenAI from "openai";
import { buildExecSystemPrompt, type ExecProfile } from "@/lib/maya/execLens";
import type { ExecRole, RoleLens, MayaMessage } from "@/lib/maya/types";
import {
  checkRateLimit,
  getClientIp,
  isLikelyAutomatedRequest,
} from "@/lib/server/requestGuard";

export const maxDuration = 25;

const VALID_ROLES = new Set<ExecRole>([
  "ceo", "coo", "cmo", "cfo", "cto", "cio", "cro", "cd", "admin", "hr", "legal",
]);

/** Strip control characters and cap field length to prevent prompt injection. */
function sanitizeText(raw: unknown, maxLen: number): string {
  if (typeof raw !== "string") return "";
  return raw.slice(0, maxLen).replace(/[\x00-\x1f\x7f]/g, " ").trim();
}

function parseLens(raw: unknown): RoleLens {
  if (!raw || typeof raw !== "object") throw new Error("Invalid lens");
  const { role, overrides } = raw as Record<string, unknown>;

  if (typeof role !== "string" || !VALID_ROLES.has(role as ExecRole)) {
    throw new Error("Invalid role");
  }

  const safeOverrides = Array.isArray(overrides)
    ? overrides
        .filter(
          (o): o is { key: string; value: string } =>
            !!o &&
            typeof o === "object" &&
            typeof (o as Record<string, unknown>).key === "string" &&
            typeof (o as Record<string, unknown>).value === "string"
        )
        .slice(0, 50)
        .map((o) => ({
          key: sanitizeText(o.key, 100),
          value: sanitizeText(o.value, 500),
        }))
        .filter((o) => o.key.length > 0)
    : [];

  return { role: role as ExecRole, overrides: safeOverrides };
}

function parseMessages(raw: unknown): MayaMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is { role: string; content: string } =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .slice(0, 100)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: sanitizeText(m.content, 8000),
    }));
}

function parseProfile(raw: unknown): ExecProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.name !== "string" || typeof p.title !== "string") return null;
  return {
    name: sanitizeText(p.name, 100),
    title: sanitizeText(p.title, 100),
    company: sanitizeText(p.company, 100),
    industry: sanitizeText(p.industry, 100),
  };
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rateLimit = checkRateLimit(`chat:${ip}`, {
    windowMs: 5 * 60_000,
    max: 20,
  });
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        error: "Rate limit reached. Please wait before sending more prompts.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  if (isLikelyAutomatedRequest(req.headers)) {
    return new Response(JSON.stringify({ error: "Request blocked" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let lens: RoleLens;
  let messages: MayaMessage[];
  let profile: ExecProfile | null;

  try {
    const body = await req.json();
    lens = parseLens(body.lens);
    messages = parseMessages(body.messages);
    profile = parseProfile(body.profile);

    const latestUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!latestUserMessage || latestUserMessage.content.length < 2) {
      return new Response(
        JSON.stringify({ error: "Missing valid user message" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const systemPrompt = buildExecSystemPrompt(lens, profile);

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
