#!/usr/bin/env node

import path from "node:path";
import {
  BASELINE_FILE,
  buildSnapshot,
  ensureStoreDir,
  writeJson,
} from "./decoy-drift-core.mjs";

const root = path.resolve(process.argv[2] ?? process.cwd());
ensureStoreDir(root);
const snapshot = buildSnapshot(root, "decoy-baseline");
const output = writeJson(root, BASELINE_FILE, snapshot);

console.log(`MAYA_DECOY_BASELINE=CREATED`);
console.log(`ROOT=${root}`);
console.log(`OUTPUT=${output}`);
