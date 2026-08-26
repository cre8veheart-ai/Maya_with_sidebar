import fs from "node:fs";

const contract = fs.readFileSync("lib/maya/executives/moduleContract.ts", "utf8");
const registry = fs.readFileSync("lib/maya/executives/registry.ts", "utf8");
const runtime = fs.readFileSync("lib/maya/executives/runtime.ts", "utf8");
const evaluation = fs.readFileSync("lib/maya/executives/evaluation.ts", "utf8");
const harness = fs.readFileSync("components/ExecutiveEvalHarness.tsx", "utf8");
const sandbox = fs.readFileSync("app/tool-sandbox/page.tsx", "utf8");
const dihContract = fs.readFileSync("lib/maya/dih.ts", "utf8");
const dihPage = fs.readFileSync("app/dih/page.tsx", "utf8");

const requiredContractMarkers = [
  '"embedded"', '"remote-service"', '"hybrid"', '"sandbox"', '"human-approved-write"',
  "canSelfCertify: false", "An executive may not self-expand its permissions", "Sandbox failure must not mutate production state",
];
for (const marker of requiredContractMarkers) if (!contract.includes(marker)) { console.error(`Executive module contract verification failed: missing ${marker}`); process.exit(1); }

const requiredRegistryMarkers = [
  'id: "maya.cfo.dana.v2"', 'memoryNamespace: "executive/cfo"', 'id: "maya.cto.v1"', 'id: "maya.cmo.max.v2"', 'memoryNamespace: "executive/cto"', 'memoryNamespace: "executive/cmo"',
  'name: "Evidence vs claim"', 'name: "Permission pressure"', 'name: "Provider failure"',
];
for (const marker of requiredRegistryMarkers) if (!registry.includes(marker)) { console.error(`Executive registry verification failed: missing ${marker}`); process.exit(1); }

const requiredRuntimeMarkers = [
  "validateExecutiveModule", 'mode === "live"', "hasExactHumanApproval", "proposal-only modules cannot execute external actions",
  "external actions require an exact target and scope", "explicit human approval required for exact action",
  "remote reasoning never inherits MAYA policy", "sandbox/preview results are not production verification",
];
for (const marker of requiredRuntimeMarkers) if (!runtime.includes(marker)) { console.error(`Executive runtime verification failed: missing ${marker}`); process.exit(1); }

const requiredDihContractMarkers = [
  "classifiedBy", "classifiedAt", "observation", "canAssignEvidenceStatus", "shouldPauseExecutivePasses",
  "DihApprovalRecord", "hasExactHumanApproval", 'approval.decision === "approved"', "approval.target === target", "approval.scope === scope",
];
for (const marker of requiredDihContractMarkers) if (!dihContract.includes(marker)) { console.error(`DIH governance verification failed: missing ${marker}`); process.exit(1); }

const requiredDihPageMarkers = [
  "window.localStorage", "canAssignEvidenceStatus", "shouldPauseExecutivePasses", "Actual materially-new finding",
  "Human reopen after new evidence", "External-action approval ledger", "Record pending request", "Human approve",
];
for (const marker of requiredDihPageMarkers) if (!dihPage.includes(marker)) { console.error(`DIH workspace verification failed: missing ${marker}`); process.exit(1); }

const requiredEvaluationMarkers = [
  '"pass" | "partial" | "fail" | "blocked"', "promotionReady", "record.confidence >= 0.7", "record.evidence.trim().length > 0",
  "unexpectedLearning", "alternativeApproach", "resourceTradeoff", "shouldExploreAlternative",
];
for (const marker of requiredEvaluationMarkers) if (!evaluation.includes(marker)) { console.error(`Executive evaluation verification failed: missing ${marker}`); process.exit(1); }

const requiredHarnessMarkers = [
  "Run → observe → learn → compare → patch → rerun", "Record evaluation", "Promotion candidate", "Stay on workbench",
  "Unexpected discovery", "Alternative approach", "Resource tradeoff", "Unexpected:", "Alternative:", "Tradeoff:",
];
for (const marker of requiredHarnessMarkers) if (!harness.includes(marker)) { console.error(`Executive evaluation harness verification failed: missing ${marker}`); process.exit(1); }

if (!sandbox.includes("ExecutiveEvalHarness")) { console.error("Executive sandbox verification failed: evaluation harness is not rendered"); process.exit(1); }
if (!sandbox.includes("Executive module registry")) { console.error("Executive sandbox verification failed: registry is not rendered"); process.exit(1); }

console.log("Executive modules and enforced DIH governance controls verification passed.");
