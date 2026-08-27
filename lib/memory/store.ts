import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type MemoryScope = "workspace" | "client" | "executive" | "session";

export async function saveMemory(input: {
  workspaceId: string;
  content: string;
  memoryType: string;
  scope: MemoryScope;
  clientId?: string | null;
  executiveId?: string | null;
  sessionId?: string | null;
  importance?: number;
  metadata?: Record<string, unknown>;
}) {
  const db = getSupabaseServerClient();
  const { data, error } = await db.from("memories").insert({
    workspace_id: input.workspaceId,
    client_id: input.clientId ?? null,
    executive_id: input.executiveId ?? null,
    session_id: input.sessionId ?? null,
    scope: input.scope,
    memory_type: input.memoryType,
    content: input.content,
    importance: input.importance ?? 5,
    metadata: input.metadata ?? {},
  }).select().single();
  if (error) throw error;
  return data;
}

export async function recentMemories(input: {
  workspaceId: string;
  clientId?: string;
  executiveId?: string;
  limit?: number;
}) {
  const db = getSupabaseServerClient();
  let q = db.from("memories").select("*").eq("workspace_id", input.workspaceId)
    .order("importance", { ascending: false }).order("created_at", { ascending: false })
    .limit(Math.min(input.limit ?? 25, 100));
  if (input.clientId) q = q.eq("client_id", input.clientId);
  if (input.executiveId) q = q.eq("executive_id", input.executiveId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
