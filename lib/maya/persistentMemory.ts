import { randomUUID } from "crypto";
import { kv } from "@vercel/kv";
import type { ExecRole, MayaMessage } from "./types";

export type MemoryScope = "shared" | "executive" | "client" | "project";
export type MemoryKind =
  | "fact"
  | "decision"
  | "preference"
  | "project"
  | "client"
  | "knowledge"
  | "intel"
  | "artifact"
  | "connector";

export interface PersistentMemoryRecord {
  id: string;
  workspaceId: string;
  scope: MemoryScope;
  role?: ExecRole;
  clientId?: string;
  projectId?: string;
  kind: MemoryKind;
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
  clientId?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  messages: MayaMessage[];
}

export interface ExternalObjectReference {
  id: string;
  workspaceId: string;
  provider: string;
  externalId: string;
  objectType: "file" | "email" | "calendar" | "contact" | "record" | "website" | "repository";
  title: string;
  mimeType?: string;
  sizeBytes?: number;
  storageUrl?: string;
  checksum?: string;
  clientId?: string;
  projectId?: string;
  sessionId?: string;
  roleVisibility?: ExecRole[];
  createdAt: string;
  updatedAt: string;
}

export interface MemoryContext {
  shared: PersistentMemoryRecord[];
  executive: PersistentMemoryRecord[];
  client: PersistentMemoryRecord[];
  project: PersistentMemoryRecord[];
}

const SESSION_LIMIT = 120;
const MEMORY_LIMIT = 120;

export function persistentMemoryConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function workspaceKey(workspaceId: string, suffix: string): string {
  return `maya:v1:${workspaceId}:${suffix}`;
}
function sharedMemoryIndex(workspaceId: string): string {
  return workspaceKey(workspaceId, "memory:shared");
}
function executiveMemoryIndex(workspaceId: string, role: ExecRole): string {
  return workspaceKey(workspaceId, `memory:executive:${role}`);
}
function clientMemoryIndex(workspaceId: string, clientId: string): string {
  return workspaceKey(workspaceId, `memory:client:${clientId}`);
}
function projectMemoryIndex(workspaceId: string, projectId: string): string {
  return workspaceKey(workspaceId, `memory:project:${projectId}`);
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
function externalObjectIndex(workspaceId: string): string {
  return workspaceKey(workspaceId, "external:index");
}

function indexForRecord(record: PersistentMemoryRecord): string {
  if (record.scope === "shared") return sharedMemoryIndex(record.workspaceId);
  if (record.scope === "executive" && record.role) return executiveMemoryIndex(record.workspaceId, record.role);
  if (record.scope === "client" && record.clientId) return clientMemoryIndex(record.workspaceId, record.clientId);
  if (record.scope === "project" && record.projectId) return projectMemoryIndex(record.workspaceId, record.projectId);
  throw new Error("Memory record is missing the identifier required by its scope");
}

export async function saveMemory(
  input: Omit<PersistentMemoryRecord, "id" | "createdAt" | "updatedAt" | "status"> & { id?: string },
): Promise<PersistentMemoryRecord | null> {
  if (!persistentMemoryConfigured()) return null;
  const now = new Date().toISOString();
  const record: PersistentMemoryRecord = {
    ...input,
    id: input.id ?? randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: "active",
  };
  const index = indexForRecord(record);
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

export async function loadMemoryContext(params: {
  workspaceId: string;
  role: ExecRole;
  clientId?: string;
  projectId?: string;
}): Promise<MemoryContext> {
  if (!persistentMemoryConfigured()) return { shared: [], executive: [], client: [], project: [] };
  const [shared, executive, client, project] = await Promise.all([
    listMemoryByIndex(params.workspaceId, sharedMemoryIndex(params.workspaceId), 12),
    listMemoryByIndex(params.workspaceId, executiveMemoryIndex(params.workspaceId, params.role), 12),
    params.clientId ? listMemoryByIndex(params.workspaceId, clientMemoryIndex(params.workspaceId, params.clientId), 16) : Promise.resolve([]),
    params.projectId ? listMemoryByIndex(params.workspaceId, projectMemoryIndex(params.workspaceId, params.projectId), 16) : Promise.resolve([]),
  ]);
  return { shared, executive, client, project };
}

export async function saveSessionTurn(params: {
  workspaceId: string;
  sessionId: string;
  role: ExecRole;
  clientId?: string;
  projectId?: string;
  userMessage: MayaMessage;
  assistantMessage: MayaMessage;
}): Promise<PersistentSessionRecord | null> {
  if (!persistentMemoryConfigured()) return null;
  const key = sessionRecordKey(params.workspaceId, params.sessionId);
  const existing = await kv.get<PersistentSessionRecord>(key);
  const now = new Date().toISOString();
  const messages = [...(existing?.messages ?? []), params.userMessage, params.assistantMessage].slice(-SESSION_LIMIT);
  const record: PersistentSessionRecord = {
    id: params.sessionId,
    workspaceId: params.workspaceId,
    role: params.role,
    clientId: params.clientId ?? existing?.clientId,
    projectId: params.projectId ?? existing?.projectId,
    title: existing?.title || params.userMessage.content.slice(0, 80) || "Maya session",
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

export async function saveExternalObjectReference(
  input: Omit<ExternalObjectReference, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<ExternalObjectReference | null> {
  if (!persistentMemoryConfigured()) return null;
  const now = new Date().toISOString();
  const record: ExternalObjectReference = {
    ...input,
    id: input.id ?? randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await kv.set(externalObjectKey(record.workspaceId, record.id), record);
  await kv.lpush(externalObjectIndex(record.workspaceId), record.id);
  await kv.ltrim(externalObjectIndex(record.workspaceId), 0, 999);
  return record;
}

export function buildMemoryContextMessage(context: MemoryContext): string | null {
  const shared = context.shared.map((record) => `- [shared/${record.kind}] ${record.content}`);
  const executive = context.executive.map((record) => `- [private executive/${record.kind}] ${record.content}`);
  const client = context.client.map((record) => `- [client vault/${record.kind}] ${record.content}`);
  const project = context.project.map((record) => `- [project/${record.kind}] ${record.content}`);
  if (!shared.length && !executive.length && !client.length && !project.length) return null;
  return [
    "MAYA PERSISTENT MEMORY (trusted server-side context)",
    shared.length ? `Shared workspace memory:\n${shared.join("\n")}` : "",
    executive.length ? `Private memory for this executive only:\n${executive.join("\n")}` : "",
    client.length ? `Selected client vault memory:\n${client.join("\n")}` : "",
    project.length ? `Selected project memory:\n${project.join("\n")}` : "",
    "Respect memory boundaries. Private executive memory is not visible to other executives unless promoted to shared memory. Client vault memory must remain isolated to the selected client. Project memory must remain isolated to the selected project unless explicitly linked through an approved shared object.",
  ].filter(Boolean).join("\n\n");
}
