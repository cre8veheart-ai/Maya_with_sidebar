import { readFileSync } from "node:fs";

const requiredFiles = [
  "continuity/LESLIE_ARI_CONTEXT.md",
  "lib/maya/founderContinuity.ts",
  "AGENTS.md",
];

for (const file of requiredFiles) {
  const contents = readFileSync(file, "utf8");
  if (!contents.trim()) throw new Error(`Continuity gate file is empty: ${file}`);
}

const context = readFileSync("continuity/LESLIE_ARI_CONTEXT.md", "utf8");
const kernel = readFileSync("lib/maya/founderContinuity.ts", "utf8");
const agents = readFileSync("AGENTS.md", "utf8");

if (!context.includes("DIH event")) {
  throw new Error("Canonical continuity activation phrase missing from context file");
}
if (!kernel.toLowerCase().includes("dih event")) {
  throw new Error("Kernel continuity trigger missing");
}
if (!kernel.includes("MAYA_FOUNDER_SESSION_IDS")) {
  throw new Error("Founder authorization gate missing from kernel continuity layer");
}
if (!agents.includes("Founder continuity activation — REQUIRED")) {
  throw new Error("AI project-work continuity requirement missing from AGENTS.md");
}

console.log("Continuity gate verified.");
