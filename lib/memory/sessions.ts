import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function createMayaSession(input: { workspaceId: string; title: string; clientId?: string | null; mode?: string }) {
  const db = getSupabaseServerClient();
  const { data, error } = await db.from("sessions").insert({ workspace_id: input.workspaceId, client_id: input.clientId ?? null, title: input.title, mode: input.mode ?? "standard" }).select().single();
  if (error) throw error;
  return data;
}

export async function appendMessage(input: { sessionId: string; authorType: "user" | "executive" | "system"; content: string; executiveId?: string | null; metadata?: Record<string, unknown> }) {
  const db = getSupabaseServerClient();
  const { data, error } = await db.from("messages").insert({ session_id: input.sessionId, executive_id: input.executiveId ?? null, author_type: input.authorType, content: input.content, metadata: input.metadata ?? {} }).select().single();
  if (error) throw error;
  return data;
}

export async function getSessionMessages(sessionId: string, limit = 500) {
  const db = getSupabaseServerClient();
  const { data, error } = await db.from("messages").select("*").eq("session_id", sessionId).order("created_at", { ascending: true }).limit(Math.min(limit, 1000));
  if (error) throw error;
  return data ?? [];
}
