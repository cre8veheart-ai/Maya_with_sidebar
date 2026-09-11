import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildSnapshot, compareSnapshots } from "../scripts/decoy-drift-core.mjs";

function write(filePath, source) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, source);
}

test("decoy drift report detects restored sentinel files as probable reintroduction", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "maya-decoy-"));
  write(path.join(root, "package.json"), JSON.stringify({ name: "fixture", scripts: {}, dependencies: {}, devDependencies: {} }, null, 2));
  write(path.join(root, "README.md"), "# Fixture\n");

  const baseline = buildSnapshot(root, "baseline");

  write(path.join(root, "lib/maya/founderContinuity.ts"), "export const trigger = 'MAYA_FOUNDER_SESSION_IDS';\n");

  const current = buildSnapshot(root, "current");
  const report = compareSnapshots(baseline, current);

  assert.equal(report.decision, "probable_reintroduction_attempt");
  assert.deepEqual(report.fileDrift.restoredSentinels, ["lib/maya/founderContinuity.ts"]);
});

test("decoy drift report detects script changes as confirmed manual change", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "maya-decoy-"));
  write(path.join(root, "package.json"), JSON.stringify({ name: "fixture", scripts: { test: "node --test" }, dependencies: {}, devDependencies: {} }, null, 2));
  write(path.join(root, "README.md"), "# Fixture\n");

  const baseline = buildSnapshot(root, "baseline");

  write(path.join(root, "package.json"), JSON.stringify({ name: "fixture", scripts: { test: "node --test", alert: "node notify.mjs" }, dependencies: {}, devDependencies: {} }, null, 2));

  const current = buildSnapshot(root, "current");
  const report = compareSnapshots(baseline, current);

  assert.equal(report.decision, "confirmed_manual_change");
  assert.equal(report.configDrift.scripts.added[0]?.key, "alert");
});
