import fs from "node:fs";

const cfo = fs.readFileSync("lib/maya/executives/cfo.ts", "utf8");
const lens = fs.readFileSync("lib/maya/execLens.ts", "utf8");

const requiredCfoMarkers = [
  'role: "cfo"',
  "You are Dana",
  "forensic",
  "Cost discipline does not mean cheapest",
  "Recurring costs must continue earning their place",
  "Statistical rigor",
  "Portfolio intelligence",
  "Quicken-style",
  "Justification test",
  '"represent-unverified-financial-state"',
];

for (const marker of requiredCfoMarkers) {
  if (!cfo.includes(marker)) {
    console.error(`CFO chassis verification failed: missing ${marker}`);
    process.exit(1);
  }
}

if (!lens.includes('import { cfoChassis } from "./executives/cfo";')) {
  console.error("CFO chassis verification failed: exec lens does not import CFO chassis");
  process.exit(1);
}

if (!lens.includes('if (role === "cfo")')) {
  console.error("CFO chassis verification failed: CFO is not routed through standalone chassis");
  process.exit(1);
}

console.log("Dana CFO standalone chassis verification passed.");
