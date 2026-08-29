import fs from "node:fs";

const roles = ["ceo", "coo", "cmo", "cfo", "cto", "cio", "cro", "cd", "admin", "hr", "legal"];
const pageByRole = {
  ceo: "app/ceo/page.tsx",
  coo: "app/coo/page.tsx",
  cmo: "app/cmo/page.tsx",
  cfo: "app/cfo/page.tsx",
  cto: "app/cto/page.tsx",
  cio: "app/cio/page.tsx",
  cro: "app/cro/page.tsx",
  cd: "app/cd/page.tsx",
  admin: "app/office-admin/page.tsx",
  hr: "app/hr/page.tsx",
  legal: "app/legal/page.tsx",
};

function read(path) {
  return fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function must(source, needle, message) {
  if (!source.includes(needle)) throw new Error(message);
}

const types = read("lib/maya/types.ts");
const baselines = read("lib/maya/roleBaselines.ts");
const operating = read("lib/executives/roles.ts");
const registry = read("lib/executives/registry.ts");
const routing = read("lib/maya/execRouting.ts");
const lens = read("lib/maya/execLens.ts");
const chatRoute = read("app/api/chat/route.ts");
const memorySessions = read("lib/memory/sessions.ts");
const executiveMemory = read("lib/memory/executives.ts");

for (const role of roles) {
  must(types, `"${role}"`, `${role}: missing ExecRole type`);
  must(baselines, `${role}: \``, `${role}: missing role baseline`);
  must(operating, `role: "${role}"`, `${role}: missing operating profile`);
  must(routing, `${role}:`, `${role}: missing route metadata`);
  must(lens, `${role}: "`, `${role}: missing hard role goal`);
  must(chatRoute, `"${role}"`, `${role}: chat runtime does not accept role`);

  const page = read(pageByRole[role]);
  if (role === "ceo") {
    must(page, "CeoChatOnly", "ceo: standalone CEO chat surface missing");
  } else {
    must(page, `RoleChat role="${role}"`, `${role}: standalone RoleChat wiring missing`);
  }
}

for (const agent of ["max", "dana", "ari", "sam", "cmo", "cio", "cro", "cd", "hr", "legal", "admin"]) {
  must(registry, `id: "${agent}"`, `${agent}: missing central MAYA registry entry`);
}

must(memorySessions, "createMayaSession", "shared persistence: session creator missing");
must(memorySessions, "appendMessage", "shared persistence: message append missing");
must(memorySessions, "getSessionMessages", "shared persistence: session retrieval missing");
must(executiveMemory, "ensureExecutiveProfiles", "executive persistence: profile sync missing");
must(executiveMemory, "getExecutiveMemoryContext", "executive persistence: memory retrieval missing");

console.log(`Standalone executive structural gates passed for ${roles.length} roles.`);
console.log("NOTE: structural pass does not prove authenticated Supabase writes, memory recall, client binding, or live model quality.");
