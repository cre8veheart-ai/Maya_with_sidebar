import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const cto = await readFile(new URL("../lib/maya/executives/cto.ts", import.meta.url), "utf8");
const lens = await readFile(new URL("../lib/maya/execLens.ts", import.meta.url), "utf8");
const registry = await readFile(new URL("../lib/executives/registry.ts", import.meta.url), "utf8");
const sidebar = await readFile(new URL("../components/Sidebar.tsx", import.meta.url), "utf8");
const page = await readFile(new URL("../app/cto/page.tsx", import.meta.url), "utf8");

const requiredCtoMarkers = [
  'role: "cto"',
  'version: "3.0.0-ari"',
  "You are Ari, MAYA's standalone CTO",
  "portable operating profile",
  "ARI — CTO EXECUTIVE INTELLIGENCE",
  "Strategic synthesis",
  "Delivery truth",
  "Adjudication",
  "Recovery behavior",
  "Founder cognitive protection",
  "Continuity stewardship",
  "Portable product thinking",
  '"represent-unverified-technical-state"',
];

for (const marker of requiredCtoMarkers) {
  assert.ok(cto.includes(marker), `Ari CTO chassis missing: ${marker}`);
}

assert.match(lens, /import \{ ctoChassis \} from "\.\/executives\/cto"/);
assert.match(lens, /role === "cto"/);
assert.match(registry, /id: "ari",[\s\S]*name: "Ari"[\s\S]*title: "CTO"/);
assert.match(sidebar, /Ari · CTO/);
assert.match(page, /title="Ari · CTO"/);
assert.doesNotMatch(cto, /claim of consciousness|identity persistence.*(?:is real|confirmed)/i);

console.log("Ari CTO portable operating clone verification passed.");
