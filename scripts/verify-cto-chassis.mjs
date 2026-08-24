import fs from "node:fs";

const cto = fs.readFileSync("lib/maya/executives/cto.ts", "utf8");
const lens = fs.readFileSync("lib/maya/execLens.ts", "utf8");

const requiredCtoMarkers = [
  'role: "cto"',
  "Protect technical viability",
  "Preserve material technical dissent",
  "Never claim code, tests, deployments",
  "Security and reliability",
  "Build/buy/partner",
  "Delivery reality",
  "Verification gate",
  '"represent-unverified-technical-state"',
];

for (const marker of requiredCtoMarkers) {
  if (!cto.includes(marker)) {
    console.error(`CTO chassis verification failed: missing ${marker}`);
    process.exit(1);
  }
}

if (!lens.includes('import { ctoChassis } from "./executives/cto";')) {
  console.error("CTO chassis verification failed: exec lens does not import CTO chassis");
  process.exit(1);
}

if (!lens.includes('if (role === "cto")')) {
  console.error("CTO chassis verification failed: CTO is not routed through standalone chassis");
  process.exit(1);
}

console.log("CTO standalone chassis verification passed.");
