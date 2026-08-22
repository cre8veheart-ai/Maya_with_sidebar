import { createChatProviderStream } from "./chatProviders";
import { buildExecSystemPrompt } from "./execLens";
import type { ExecRole, MayaProvider } from "./types";

export interface StrategyRoomPerspective {
  role: ExecRole;
  response: string;
}

export interface StrategyRoomResult {
  perspectives: StrategyRoomPerspective[];
  synthesis: string;
}

async function collectStream(stream: AsyncGenerator<string>): Promise<string> {
  let output = "";
  for await (const chunk of stream) output += chunk;
  return output.trim();
}

function buildRolePrompt(role: ExecRole, prompt: string): string {
  return [
    `You are contributing the ${role.toUpperCase()} perspective inside MAYA's Strategy Room.`,
    "Give an independent executive recommendation from your function's point of view.",
    "Do not average toward consensus. Surface your strongest recommendation, key evidence/assumptions, and the most important risk.",
    "Do not claim that actions were executed.",
    "",
    `FOUNDER QUESTION: ${prompt}`,
  ].join("\n");
}

function buildMayaSynthesisPrompt(prompt: string, perspectives: StrategyRoomPerspective[]): string {
  const evidence = perspectives
    .map(({ role, response }) => `${role.toUpperCase()} PERSPECTIVE:\n${response}`)
    .join("\n\n---\n\n");

  return [
    "You are MAYA, the adjudicating intelligence for a multi-agent executive decision system.",
    "Your job is not to summarize or average the executives. Evaluate their competing reasoning and choose the strongest path.",
    "Explicitly identify meaningful disagreements and reject weaker paths when warranted.",
    "Return a decisive, practical answer using these headings:",
    "Decision",
    "Why this wins",
    "Rejected / secondary paths",
    "Risks and assumptions",
    "Next moves",
    "Recovery path",
    "Never claim an external action occurred unless evidence in the prompt says it did.",
    "",
    `FOUNDER QUESTION: ${prompt}`,
    "",
    "EXECUTIVE PERSPECTIVES:",
    evidence,
  ].join("\n");
}

export async function runStrategyRoom({
  roles,
  prompt,
  provider,
  model,
  ludicrousMode,
  founderContext,
}: {
  roles: ExecRole[];
  prompt: string;
  provider: MayaProvider;
  model?: string;
  ludicrousMode?: boolean;
  founderContext?: string | null;
}): Promise<StrategyRoomResult> {
  const perspectives = await Promise.all(
    roles.map(async (role) => {
      const stream = await createChatProviderStream({
        provider,
        messages: [{ role: "user", content: buildRolePrompt(role, prompt) }],
        systemPrompt: buildExecSystemPrompt(role),
        execContextMessage: founderContext || null,
        model,
        ludicrousMode,
        useGeminiAdvisory: false,
      });

      return { role, response: await collectStream(stream) };
    }),
  );

  const synthesisStream = await createChatProviderStream({
    provider,
    messages: [{ role: "user", content: buildMayaSynthesisPrompt(prompt, perspectives) }],
    systemPrompt: [
      "You are MAYA, the orchestration and adjudication layer for an executive decision platform.",
      "Select the strongest reasoning path rather than averaging viewpoints.",
      "Be concise, explicit about tradeoffs, and action-oriented.",
    ].join(" "),
    execContextMessage: founderContext || null,
    model,
    ludicrousMode,
    useGeminiAdvisory: false,
  });

  return {
    perspectives,
    synthesis: await collectStream(synthesisStream),
  };
}
