import { readFileSync } from "node:fs";

const route = readFileSync("app/api/chat/route.ts", "utf8");
const store = readFileSync("lib/storage/persistentMemory.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260831220000_isolated_client_vault_memory.sql",
  "utf8",
);

for (const required of [
  "resolveWorkspaceSession",
  "loadMemoryContext",
  "saveSessionTurn",
  '"X-Maya-Memory": "supabase-v1"',
]) {
  if (!route.includes(required)) throw new Error(`Chat route missing: ${required}`);
}
if (route.includes('return "anthropic";')) {
  throw new Error("Chat route still defaults to the prohibited Anthropic provider");
}
if (!store.includes('import "server-only"')) {
  throw new Error("Persistent memory store is not server-only");
}
if (/workspaceId\s*=\s*sanitizeText\(body\./.test(route)) {
  throw new Error("Chat route trusts a browser-supplied workspace identity");
}
if (!route.includes("MAYA_WORKSPACE_COOKIE") || !route.includes("buildWorkspaceCookie")) {
  throw new Error("Chat route does not maintain a signed frictionless workspace identity");
}
if (/requireBetaSession|AUTH_REQUIRED|isResponseError/.test(route)) {
  throw new Error("Chat route reintroduced the retired beta-session gate");
}

for (const table of [
  "maya_client_vaults",
  "maya_sessions",
  "maya_session_messages",
  "maya_memory_entries",
]) {
  if (!migration.includes(`alter table public.${table} enable row level security`)) {
    throw new Error(`${table} is missing RLS`);
  }
  if (!migration.includes(`revoke all on public.${table} from anon, authenticated`)) {
    throw new Error(`${table} is browser-accessible`);
  }
}
if (!migration.includes("foreign key (workspace_id, client_id)")) {
  throw new Error("Client relationships do not enforce the workspace boundary");
}
if (!migration.includes("foreign key (workspace_id, session_id)")) {
  throw new Error("Messages do not enforce the workspace/session boundary");
}

console.log("Isolated Supabase client-vault memory boundary verified.");
