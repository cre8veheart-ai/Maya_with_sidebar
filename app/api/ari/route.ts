import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/ari/systemPrompt";

// Allowed message roles — anything else is rejected
const VALID_ROLES = new Set(["user", "assistant"]);

export async function POST(req: NextRequest) {
  // ── API key guard ──────────────────────────────────────────────────────────
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on this server." },
      { status: 500 }
    );
  }

  // ── Parse + validate body ─────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });
  }

  const { messages, context, execLens } = body as Record<string, unknown>;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages must be a non-empty array." },
      { status: 400 }
    );
  }

  // Validate each message — role must be user/assistant, content must be string
  for (const msg of messages) {
    if (
      !msg ||
      typeof msg !== "object" ||
      typeof (msg as Record<string, unknown>).content !== "string" ||
      !VALID_ROLES.has((msg as Record<string, unknown>).role as string)
    ) {
      return NextResponse.json(
        { error: "Each message must have role ('user'|'assistant') and string content." },
        { status: 400 }
      );
    }
  }

  const contextString =
    typeof context === "string" && context.trim() ? context.trim() : undefined;

  // execLens sharpens Maya toward a specific executive function (ceo, cfo, etc.)
  const lensString =
    typeof execLens === "string" && execLens.trim() ? execLens.trim() : undefined;

  // ── Build prompt and call OpenAI ──────────────────────────────────────────
  const systemPrompt = buildSystemPrompt(contextString, lensString);
  const client = new OpenAI({ apiKey });

  let streamResponse: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
  try {
    streamResponse = await client.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      temperature: 0.65,
      max_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        ...(messages as { role: "user" | "assistant"; content: string }[]),
      ],
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "OpenAI request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // ── Stream tokens back to the client ─────────────────────────────────────
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamResponse) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
      } catch {
        // Stream interrupted — close cleanly rather than leaving client hanging
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
