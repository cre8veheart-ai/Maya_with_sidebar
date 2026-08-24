import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const cto = await readFile(new URL("../lib/maya/executives/cto.ts", import.meta.url), "utf8");
const lens = await readFile(new URL("../lib/maya/execLens.ts", import.meta.url), "utf8");

assert.match(cto, /export const ctoChassis/);
assert.match(cto, /role: "cto"/);
assert.match(cto, /CTO PERSONALITY \/ QUALITY LAYER/);
assert.match(cto, /Visionary architect and pragmatic builder/);
assert.match(cto, /technical-architecture/);
assert.match(cto, /security-architecture/);
assert.match(cto, /technical-verification/);
assert.match(cto, /production-deploy/);
assert.match(cto, /credential-change/);
assert.match(cto, /permission-expansion/);
assert.match(cto, /Never claim code was changed, tests passed, a deployment occurred/);
assert.match(cto, /Preserve material technical dissent/);
assert.match(cto, /over-engineering/);

assert.match(lens, /import \{ ctoChassis \} from "\.\/executives\/cto"/);
assert.match(lens, /role === "cto"/);
assert.match(lens, /ctoChassis\.systemContract/);
assert.match(lens, /ctoChassis\.responseContract/);

console.log("CTO standalone chassis verification passed");
