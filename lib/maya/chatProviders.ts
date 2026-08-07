import Anthropic from "@anthropic-ai/sdk";
import type { MayaMessage, MayaProvider } from "./types";

const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-5";
const DEFAULT_OPENCLAW_MODEL = "openclaw";

interface ProviderRequest {
  provider: MayaProvider;
  messages: MayaMessage[];
  systemPrompt: string;
  execContextMessage: string | null;
  model?: string;
  ludicrousMode?: boolean;
}

function buildMessageThread(
  messages: MayaMessage[],
  execContextMessage: string | null
) {
  return [
    ...(execContextMessage
      ? [{ role: "user" as const, content: execContextMessage }]
      : []),
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

async function* streamAnthropicResponse({
  messages,
  systemPrompt,
  execContextMessage,
  model,
}: ProviderRequest): AsyncGenerator<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const anthropic = new Anthropic({ apiKey });
  const stream = await anthropic.messages.create({
    model: model || process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL,
    max_tokens: 1400,
    temperature: 0.5,
    stream: true,
    system: systemPrompt,
    messages: buildMessageThread(messages, execContextMessage),
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      yield chunk.delta.text;
    }
  }
}

async function openClawTextResponse({
  messages,
  systemPrompt,
  execContextMessage,
  model,
  ludicrousMode,
}: ProviderRequest): Promise<string> {
  const baseUrl = process.env.OPENCLAW_BASE_URL;
  if (!baseUrl) {
    throw new Error("OPENCLAW_BASE_URL not configured");
  }

  const endpoint = new URL("/v1/chat/completions", baseUrl);
  const apiKey = process.env.OPENCLAW_API_KEY?.trim();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers.Authorization = ["Bearer", apiKey].join(" ");
  }

  const openClawSystemPrompt = ludicrousMode
    ? [
        systemPrompt,
        "",
        "LUDICROUS MODE:",
        "- Operate with maximum executive intensity and urgency",
        "- Synthesize quickly, make strong recommendations, and surface leverage",
        "- Prefer decisive action plans, compressed timelines, and bold but practical options",
        "- Keep the answer polished and executive-safe, not reckless",
      ].join("\n")
    : systemPrompt;

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: model || process.env.OPENCLAW_MODEL || DEFAULT_OPENCLAW_MODEL,
      stream: false,
      temperature: ludicrousMode ? 0.7 : 0.5,
      max_tokens: ludicrousMode ? 2200 : 1400,
      messages: [
        { role: "system", content: openClawSystemPrompt },
        ...buildMessageThread(messages, execContextMessage),
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      errorBody || `OpenClaw request failed with status ${response.status}`
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string | Array<{ type?: string; text?: string }>;
      };
    }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) =>
        part && part.type === "text" && typeof part.text === "string"
          ? part.text
          : ""
      )
      .join("");
  }

  throw new Error("OpenClaw returned no assistant content");
}

async function* streamOpenClawResponse(
  request: ProviderRequest
): AsyncGenerator<string> {
  yield await openClawTextResponse(request);
}

export async function createChatProviderStream(
  request: ProviderRequest
): Promise<AsyncGenerator<string>> {
  if (request.provider === "openclaw") {
    return streamOpenClawResponse(request);
  }

  return streamAnthropicResponse(request);
}
