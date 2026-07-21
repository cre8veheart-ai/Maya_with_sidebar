import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { MemoryFact, MemoryCategory, MemoryConfidence } from "@/lib/types/memory";

// ── Memory extraction API ─────────────────────────────────────────────────────
// Receives a completed conversation and extracts persistent facts about the
// executive's organization. These facts accumulate across sessions — the
// mechanism by which MAYA becomes more intelligent and irreplaceable over time.

const EXTRACTION_SYSTEM_PROMPT = `You are an intelligence extraction system embedded inside MAYA, an executive operating system.

Your job is to read a conversation between an executive and MAYA, then extract persistent facts that would make future conversations more intelligent and relevant.

Extract only facts that are:
- Durable (true beyond this single conversation — not one-off tasks)
- Specific to this executive's organization, not generic business knowledge
- Actionable context that would improve future responses if known upfront

Categories to extract into:
- org-context: How the org is structured, what it does, who the key players are
- exec-pattern: How this executive thinks, their priorities, communication style, what they value
- active-priority: What they are focused on right now (initiatives, challenges, goals)
- cross-functional: How functions relate to each other, tensions, dependencies, collaboration patterns
- strategic-context: Key facts about the business, market position, competitive landscape
- decision-pattern: How decisions get made, what criteria matter, what they avoid

Rules:
- Return a JSON array of fact objects. If nothing durable was learned, return an empty array.
- Maximum 5 facts per extraction.
- Each fact must be a single clear sentence of 10–30 words.
- Do not restate generic business concepts — only org-specific intelligence.
- Do not extract anything the executive explicitly said was hypothetical or example-only.
- Assign confidence: "high" (stated directly), "medium" (clearly implied), "low" (inferred pattern).

Response format — return ONLY valid JSON, no markdown, no explanation:
[
  {
    "category": "org-context",
    "content": "The executive leads a creative agency with 15 years of CD experience.",
    "confidence": "high"
  }
]`;

function generateId() {
  return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });
  }

  const { messages, sessionId, existingFacts } = body as Record<string, unknown>;

  if (!Array.isArray(messages) || messages.length < 2) {
    // Nothing meaningful to extract from a single-message exchange
    return NextResponse.json({ facts: [] });
  }

  // Format conversation for extraction
  const conversationText = (messages as { role: string; content: string }[])
    .map((m) => `${m.role === "user" ? "Executive" : "Maya"}: ${m.content}`)
    .join("\n\n");

  // Include existing facts so the model avoids duplicating what's already known
  const existingContext =
    Array.isArray(existingFacts) && existingFacts.length > 0
      ? `\n\nAlready known facts (do not duplicate):\n${(existingFacts as MemoryFact[])
          .map((f) => `- ${f.content}`)
          .join("\n")}`
      : "";

  const client = new OpenAI({ apiKey });

  let raw: string;
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2, // low temperature — extraction should be precise
      max_tokens: 600,
      messages: [
        { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Extract persistent org intelligence from this conversation:${existingContext}\n\nConversation:\n${conversationText}`,
        },
      ],
    });
    raw = response.choices[0]?.message?.content?.trim() ?? "[]";
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OpenAI request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // Parse and validate extracted facts
  let extracted: { category: string; content: string; confidence: string }[];
  try {
    extracted = JSON.parse(raw);
    if (!Array.isArray(extracted)) extracted = [];
  } catch {
    // Model returned malformed JSON — skip silently, don't break the user's session
    return NextResponse.json({ facts: [] });
  }

  const now = new Date().toISOString();
  const validCategories = new Set<MemoryCategory>([
    "org-context",
    "exec-pattern",
    "active-priority",
    "cross-functional",
    "strategic-context",
    "decision-pattern",
  ]);
  const validConfidence = new Set<MemoryConfidence>(["high", "medium", "low"]);

  const facts: MemoryFact[] = extracted
    .filter(
      (f) =>
        f &&
        typeof f.content === "string" &&
        f.content.trim().length > 0 &&
        validCategories.has(f.category as MemoryCategory)
    )
    .slice(0, 5)
    .map((f) => ({
      id: generateId(),
      category: f.category as MemoryCategory,
      content: f.content.trim(),
      confidence: validConfidence.has(f.confidence as MemoryConfidence)
        ? (f.confidence as MemoryConfidence)
        : "medium",
      sourceSessionId: typeof sessionId === "string" ? sessionId : undefined,
      createdAt: now,
      updatedAt: now,
    }));

  return NextResponse.json({ facts });
}
