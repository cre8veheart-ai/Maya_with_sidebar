#!/usr/bin/env node

import path from "node:path";
import {
  REPORT_FILE,
  buildSnapshot,
  compareSnapshots,
  loadBaseline,
  writeJson,
  writeMarkdown,
} from "./decoy-drift-core.mjs";

const args = process.argv.slice(2);
const failOnSuspicious = args.includes("--fail-on-suspicious");
const rootArg = args.find((value) => !value.startsWith("--"));
const root = path.resolve(rootArg ?? process.cwd());

const baseline = loadBaseline(root);
const current = buildSnapshot(root, "decoy-current");
const report = compareSnapshots(baseline, current);
const jsonPath = writeJson(root, REPORT_FILE, report);
const markdownPath = writeMarkdown(root, report);

console.log(`MAYA_DECOY_REPORT=${report.decision}`);
console.log(`ROOT=${root}`);
console.log(`JSON=${jsonPath}`);
console.log(`MARKDOWN=${markdownPath}`);
for (const reason of report.reasons) {
  console.log(`REASON=${reason}`);
}

if (failOnSuspicious && (report.decision === "suspicious_drift" || report.decision === "probable_reintroduction_attempt")) {
  process.exit(2);
}
