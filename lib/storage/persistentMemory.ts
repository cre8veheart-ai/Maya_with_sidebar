import "server-only";

import { supabaseRest } from "@/lib/supabase/server";
import type { ExecRole, MayaMessage } from "@/lib/maya/types";

export type MemoryScope = "shared" | "executive" | "client" | "project" | "surface";

type MemoryRow = {
  memory_id: string;
  scope: MemoryScope;
  kind: string;
  content: string;
  executive_role: ExecRole | null;
  client_id: string | null;
  project_id: string | null;
  surface: string | null;
  updated_at: string;
};

export type MemoryContext = {
  shared: MemoryRow[];
  executive: MemoryRow[];
  client: MemoryRow[];
  project: MemoryRow[];
  surface: MemoryRow[];
};

function eq(value: string): string {
  return `eq.${encodeURIComponent(value)}`;
}

function clean(value: string, max: number): string {
  return value.slice(0, max).replace(/[\x00-\x1f\x7f]/g, " ").trim();
}

async function listMemory(
  workspaceId: string,
  filter: string,
  limit: number,
): Promise<MemoryRow[]> {
  return supabaseRest<MemoryRow[]>(
    `maya_memory_entries?select=memory_id,scope,kind,content,executive_role,client_id,project_id,surface,updated_at&workspace_id=${eq(workspaceId)}&status=eq.active&${filter}&order=updated_at.desc&limit=${limit}`,
  );
}

export async function loadMemoryContext(input: {
  workspaceId: string;
  role: ExecRole;
  surface: string;
  clientId?: string;
  projectId?: string;
}): Promise<MemoryContext> {
  const [shared, executive, client, project, surface] = await Promise.all([
    listMemory(input.workspaceId, "scope=eq.shared", 12),
    listMemory(input.workspaceId, `scope=eq.executive&executive_role=${eq(input.role)}`, 12),
    input.clientId
      ? listMemory(input.workspaceId, `scope=eq.client&client_id=${eq(input.clientId)}`, 16)
      : Promise.resolve([]),
    input.projectId
      ? listMemory(input.workspaceId, `scope=eq.project&project_id=${eq(input.projectId)}`, 16)
      : Promise.resolve([]),
    listMemory(input.workspaceId, `scope=eq.surface&surface=${eq(input.surface)}`, 12),
  ]);
  return { shared, executive, client, project, surface };
}

export function buildMemoryContextMessage(context: MemoryContext): string | null {
  const lines = [
    ...context.shared.map((row) => `- [shared/${row.kind}] ${row.content}`),
    ...context.executive.map((row) => `- [private executive/${row.kind}] ${row.content}`),
    ...context.client.map((row) => `- [selected client/${row.kind}] ${row.content}`),
    ...context.project.map((row) => `- [selected project/${row.kind}] ${row.content}`),
    ...context.surface.map((row) => `- [current surface/${row.kind}] ${row.content}`),
  ];
  if (!lines.length) return null;
  return [
    "MAYA PERSISTENT MEMORY — TRUSTED SERVER CONTEXT",
    ...lines,
    "",
    "Respect every scope boundary. Never expose private executive memory to another executive. Never use one client's memory in another client's workspace. Shared memory is visible only when deliberately promoted.",
  ].join("\n");
}

export async function saveSessionTurn(input: {
  workspaceId: string;
  sessionId: string;
  role: ExecRole;
  surface: string;
  clientId?: string;
  projectId?: string;
  participants: string[];
  userMessage: MayaMessage;
  assistantMessage: MayaMessage;
}): Promise<void> {
  const now = new Date().toISOString();
  const sessionId = clean(input.sessionId, 160);
  const surface = clean(input.surface, 160);
  if (!sessionId || !surface) throw new Error("Session identity is required");

  await supabaseRest("maya_sessions?on_conflict=workspace_id,session_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      workspace_id: input.workspaceId,
      session_id: sessionId,
      title: clean(input.userMessage.content, 100) || "Maya session",
      surface,
      executive_role: input.role,
      client_id: input.clientId || null,
      project_id: input.projectId || null,
      participants: input.participants,
      updated_at: now,
    }),
  });

  await supabaseRest("maya_session_messages", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify([
      {
        workspace_id: input.workspaceId,
        session_id: sessionId,
        role: "user",
        content: clean(input.userMessage.content, 32000),
      },
      {
        workspace_id: input.workspaceId,
        session_id: sessionId,
        role: "assistant",
        content: clean(input.assistantMessage.content, 32000),
      },
    ]),
  });
}
