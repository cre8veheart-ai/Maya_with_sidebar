import { randomUUID } from "crypto";
import { kv } from "@vercel/kv";
import type { ExecRole, MayaMessage } from "./types";

export type MemoryScope = "shared" | "executive";

export interface PersistentMemoryRecord {
  id: string;
  workspaceId: string;
  scope: MemoryScope;
  role?: ExecRole;
  kind: "fact" | "decision" | "preference" | "project" | "client" | "knowledge" | "intel";
  content: string;
  createdAt: string;
  updatedAt: string;
  sourceSessionId?: string;
  status: "active" | "superseded" | "archived";
}

export interface PersistentSessionRecord {
  id: string;
  workspaceId: string;
  role: ExecRole;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: MayaMessage[];
}

export interface ExternalObjectReference {
  id: string;
  workspaceId: string;
  provider: string;
  externalId: string;
  objectType: "file" | "email" | "calendar" | "contact" | "record";
  title: string;
  mimeType?: string;
  sizeBytes?: number;
  clientId?: string;
  projectId?: string;
  sessionId?: string;
  roleVisibility?: ExecRole[];
  createdAt: string;
  updatedAt: string;
}

const SESSION_LIMIT = 120;
const MEMORY_LIMIT = 80;

export function persistentMemoryConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function workspaceKey(workspaceId: string, suffix: string): string {
  return `maya:v1:${workspaceId}:${suffix}`;
}

function executiveMemoryIndex(workspaceId: string, role: ExecRole): string {
  return workspaceKey(workspaceId, `memory:executive:${role}`);
}

function sharedMemoryIndex(workspaceId: string): string {
  return workspaceKey(workspaceId, "memory:shared");
}

function memoryRecordKey(workspaceId: string, id: string): string {
  return workspaceKey(workspaceId, `memory:record:${id}`);
}

function sessionRecordKey(workspaceId: string, sessionId: string): string {
  return workspaceKey(workspaceId, `session:${sessionId}`);
}

function sessionIndex(workspaceId: string, role: ExecRole): string {
  return workspaceKey(workspaceId, `sessions:${role}`);
}

function externalObjectKey(workspaceId: string, id: string): string {
  return workspaceKey(workspaceId, `external:${id}`);
}

export async function saveMemory(input: Omit<PersistentMemoryRecord, "id" | "createdAt" | "updatedAt" | "status"> & { id?: string }): Promise<PersistentMemoryRecord | null> {
  if (!persistentMemoryConfigured()) return null;
  const now = new Date().toISOString();
  const record: PersistentMemoryRecord = {
    ...input,
    id: input.id ?? randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: "active",
  };
  const index = record.scope === "shared"
    ? sharedMemoryIndex(record.workspaceId)
    : executiveMemoryIndex(record.workspaceId, record.role as ExecRole);
  await kv.set(memoryRecordKey(record.workspaceId, record.id), record);
  await kv.lpush(index, record.id);
  await kv.ltrim(index, 0, MEMORY_LIMIT - 1);
  return record;
}

async function listMemoryByIndex(workspaceId: string, index: string, limit = 12): Promise<PersistentMemoryRecord[]> {
  if (!persistentMemoryConfigured()) return [];
  const ids = await kv.lrange<string>(index, 0, Math.max(0, limit - 1));
  if (!ids.length) return [];
  const records = await Promise.all(ids.map((id) => kv.get<PersistentMemoryRecord>(memoryRecordKey(workspaceId, id))));
  return records.filter((record): record is PersistentMemoryRecord => Boolean(record && record.status === "active"));
}

export async function loadMemoryContext(workspaceId: string, role: ExecRole): Promise<{ shared: PersistentMemoryRecord[]; executive: PersistentMemoryRecord[] }> {
  if (!persistentMemoryConfigured()) return { shared: [], executive: [] };
  const [shared, executive] = await Promise.all([
    listMemoryByIndex(workspaceId, sharedMemoryIndex(workspaceId), 12),
    listMemoryByIndex(workspaceId, executiveMemoryIndex(workspaceId, role), 12),
  ]);
  return { shared, executive };
}

export async function saveSessionTurn(params: {
  workspaceId: string;
  sessionId: string;
  role: ExecRole;
  userMessage: MayaMessage;
  assistantMessage: MayaMessage;
}): Promise<PersistentSessionRecord | null> {
  if (!persistentMemoryConfigured()) return null;
  const key = sessionRecordKey(params.workspaceId, params.sessionId);
  const existing = await kv.get<PersistentSessionRecord>(key);
  const now = new Date().toISOString();
  const messages = [...(existing?.messages ?? []), params.userMessage, params.assistantMessage].slice(-SESSION_LIMIT);
  const title = existing?.title || params.userMessage.content.slice(0, 80) || "Maya session";
  const record: PersistentSessionRecord = {
    id: params.sessionId,
    workspaceId: params.workspaceId,
    role: params.role,
    title,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    messages,
  };
  await kv.set(key, record);
  if (!existing) {
    const index = sessionIndex(params.workspaceId, params.role);
    await kv.lpush(index, params.sessionId);
    await kv.ltrim(index, 0, 99);
  }
  return record;
}

export async function loadSession(workspaceId: string, sessionId: string): Promise<PersistentSessionRecord | null> {
  if (!persistentMemoryConfigured()) return null;
  return (await kv.get<PersistentSessionRecord>(sessionRecordKey(workspaceId, sessionId))) ?? null;
}

export async function listSessions(workspaceId: string, role: ExecRole, limit = 30): Promise<PersistentSessionRecord[]> {
  if (!persistentMemoryConfigured()) return [];
  const ids = await kv.lrange<string>(sessionIndex(workspaceId, role), 0, Math.max(0, limit - 1));
  const records = await Promise.all(ids.map((id) => loadSession(workspaceId, id)));
  return records.filter((record): record is PersistentSessionRecord => Boolean(record));
}

export async function saveExternalObjectReference(input: Omit<ExternalObjectReference, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<ExternalObjectReference | null> {
  if (!persistentMemoryConfigured()) return null;
  const now = new Date().toISOString();
  const record: ExternalObjectReference = {
    ...input,
    id: input.id ?? randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await kv.set(externalObjectKey(record.workspaceId, record.id), record);
  return record;
}

export function buildMemoryContextMessage(context: { shared: PersistentMemoryRecord[]; executive: PersistentMemoryRecord[] }): string | null {
  const shared = context.shared.map((record) => `- [shared/${record.kind}] ${record.content}`);
  const executive = context.executive.map((record) => `- [private executive/${record.kind}] ${record.content}`);
  if (!shared.length && !executive.length) return null;
  return [
    "MAYA PERSISTENT MEMORY (trusted server-side context)",
    shared.length ? `Shared workspace memory:\n${shared.join("\n")}` : "",
    executive.length ? `Private memory for this executive only:\n${executive.join("\n")}` : "",
    "Do not imply that private executive memory is visible to other executives unless it has been promoted to shared memory.",
  ].filter(Boolean).join("\n\n");
}
