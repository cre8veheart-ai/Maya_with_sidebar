import type { ChatSession, ExecRole, MayaMessage } from "./types";
import { LocalStorageAdapter } from "@/lib/storage/localStorageAdapter";

const adapter = new LocalStorageAdapter();

export function generateSessionId(): string {
  return `sess_${crypto.randomUUID()}`;
}

export function deriveTitle(messages: MayaMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "Untitled session";
  const words = first.content.trim().split(/\s+/).slice(0, 7).join(" ");
  return words.length < first.content.trim().length ? `${words}…` : words;
}

export async function loadSessions(): Promise<ChatSession[]> {
  return adapter.getSessions();
}

export async function loadSession(id: string): Promise<ChatSession | null> {
  return adapter.getSession(id);
}

export async function loadLastSessionForRole(role: ExecRole): Promise<ChatSession | null> {
  const sessions = await adapter.getSessions();
  return sessions.find((s) => s.role === role) ?? null;
}

export async function persistSession(session: ChatSession): Promise<void> {
  return adapter.saveSession(session);
}

export async function removeSession(id: string): Promise<void> {
  return adapter.deleteSession(id);
}
