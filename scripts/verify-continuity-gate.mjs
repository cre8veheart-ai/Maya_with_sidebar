import { readFileSync } from "node:fs";

const requiredFiles = [
  "continuity/LESLIE_ARI_CONTEXT.md",
  "lib/maya/founderContinuity.ts",
  "lib/maya/founderContinuitySession.ts",
  "app/api/chat/route.ts",
  "AGENTS.md",
];

for (const file of requiredFiles) {
  const contents = readFileSync(file, "utf8");
  if (!contents.trim()) throw new Error(`Continuity gate file is empty: ${file}`);
}

const context = readFileSync("continuity/LESLIE_ARI_CONTEXT.md", "utf8");
const kernel = readFileSync("lib/maya/founderContinuity.ts", "utf8");
const session = readFileSync("lib/maya/founderContinuitySession.ts", "utf8");
const route = readFileSync("app/api/chat/route.ts", "utf8");
const agents = readFileSync("AGENTS.md", "utf8");

if (!context.includes("MAYA continuity")) {
  throw new Error("Canonical continuity activation phrase missing from context file");
}
if (!context.includes("NULL ONBOARDING")) {
  throw new Error("NULL ONBOARDING contract missing from continuity context");
}
if (!kernel.toLowerCase().includes("maya continuity")) {
  throw new Error("Kernel continuity trigger missing");
}
if (!kernel.includes("MAYA_FOUNDER_SESSION_IDS")) {
  throw new Error("Founder authorization gate missing from kernel continuity layer");
}
if (!session.includes("maya_founder_continuity")) {
  throw new Error("Signed founder continuity cookie missing");
}
if (!session.includes("founder-continuity:")) {
  throw new Error("Domain-separated continuity signature missing");
}
if (!route.includes("verifyFounderContinuitySession")) {
  throw new Error("Continuity persistence is not wired into /api/chat");
}
if (!route.includes("shouldActivateFounderContinuity")) {
  throw new Error("Continuity activation is not wired into /api/chat");
}
if (!route.includes("HttpOnly") || !route.includes("SameSite=Strict")) {
  throw new Error("Continuity cookie hardening is missing");
}
if (!route.includes("X-Maya-Continuity")) {
  throw new Error("Runtime continuity state header missing");
}
if (!agents.includes("Founder continuity activation — REQUIRED")) {
  throw new Error("AI project-work continuity requirement missing from AGENTS.md");
}

console.log("NULL ONBOARDING continuity gate verified.");
