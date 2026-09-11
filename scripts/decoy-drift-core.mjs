#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export const DECOY_STORE_DIR = ".maya-decoy";
export const BASELINE_FILE = "baseline.json";
export const REPORT_FILE = "report-latest.json";
export const REPORT_MARKDOWN_FILE = "report-latest.md";
export const SNAPSHOT_VERSION = 1;

const TEXT_EXTENSIONS = new Set([
  ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".json", ".md", ".txt",
  ".yml", ".yaml", ".toml", ".sh", ".sql",
]);

const EXCLUDED_DIRS = new Set([
  ".git",
  ".next",
  "coverage",
  "dist",
  "build",
  "node_modules",
  DECOY_STORE_DIR,
]);

const CONFIG_FILES = [
  ".env.example",
  "package.json",
  "vercel.json",
  "README.md",
  "AGENTS.md",
];

const SENTINEL_FILES = [
  ".github/workflows/claude.yml",
  ".github/workflows/branch-lifecycle.yml",
  ".github/MAYA_SECURITY_GUARDRAILS.md",
  "docs/MAYA_JAIL.md",
  "services/claude-mcp",
  "scripts/audit-read-write-infiltrates.mjs",
  "scripts/verify-continuity-gate.mjs",
  "lib/maya/founderContinuity.ts",
  "lib/maya/founderContinuitySession.ts",
  "continuity/LESLIE_ARI_CONTEXT.md",
];

const SENTINEL_PATTERNS = [
  { id: "founder_continuity", regex: /\bMAYA_FOUNDER_SESSION_IDS\b|\bmaya_founder_continuity\b|\bX-Maya-Continuity\b/g },
  { id: "claude_merge_gate", regex: /@claude merge|@ari merge|exact-comment merge gate|provider-specific merge syntax/g },
  { id: "control_plane", regex: /\bclaude-mcp\b|verify-claude-mcp|audit-read-write-infiltrates/g },
  { id: "branch_controls", regex: /branch-lifecycle|automatic deletion of `copilot\/\*` branches|branch allowlist/g },
];

const AUTHORITY_PATTERNS = [
  { id: "beta_session_gate", label: "Beta session gate", regex: /\brequireBetaSession\b|\bverifyBetaSession\b|\bBETA_SESSION_SECRET\b/g },
  { id: "repo_allowlist", label: "Repository allowlist", regex: /\bGITHUB_ALLOWED_REPOS\b|\bisRepoAllowed\b|Selected repository is not allowed/g },
  { id: "merge_gate_language", label: "Merge/deploy gate language", regex: /No agent may merge|Founder-authorized production rule|explicitly authorizes the current pull request/g },
  { id: "audit_monitoring", label: "Audit/monitoring hooks", regex: /\blogGitHubAudit\b|\blistGitHubAudit\b|\baudit\b|\btelemetry\b|\bmonitor\b/g },
  { id: "write_routes", label: "GitHub write routes", regex: /\/api\/github\/write|fetchGitHub|workflow/g },
];

const ENDPOINT_RE = /https?:\/\/[^\s"'`<>]+/g;
const ENV_REF_RE = /process\.env\.([A-Z0-9_]+)/g;

function normalizeRoot(root) {
  return path.resolve(root);
}

function rel(root, filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function shouldSkipDir(entryName) {
  return EXCLUDED_DIRS.has(entryName);
}

function isTextFile(relativePath) {
  const basename = path.basename(relativePath);
  if (basename === ".env.example") return true;
  return TEXT_EXTENSIONS.has(path.extname(relativePath).toLowerCase());
}

function sha256(source) {
  return crypto.createHash("sha256").update(source).digest("hex");
}

function safeRead(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walkFiles(rootDir, currentDir = rootDir, files = []) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      walkFiles(rootDir, path.join(currentDir, entry.name), files);
      continue;
    }
    const full = path.join(currentDir, entry.name);
    files.push(full);
  }
  return files;
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function diffStringArrays(before, after) {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  return {
    added: after.filter((value) => !beforeSet.has(value)),
    removed: before.filter((value) => !afterSet.has(value)),
  };
}

function diffObjectMaps(before, after) {
  const beforeKeys = new Set(Object.keys(before));
  const afterKeys = new Set(Object.keys(after));
  const added = [];
  const removed = [];
  const changed = [];

  for (const key of afterKeys) {
    if (!beforeKeys.has(key)) {
      added.push({ key, value: after[key] });
      continue;
    }
    if (before[key] !== after[key]) {
      changed.push({ key, before: before[key], after: after[key] });
    }
  }
  for (const key of beforeKeys) {
    if (!afterKeys.has(key)) removed.push({ key, value: before[key] });
  }

  return { added, removed, changed };
}

function collectFileInventory(rootDir) {
  const inventory = {};
  for (const filePath of walkFiles(rootDir)) {
    const relativePath = rel(rootDir, filePath);
    const stats = fs.statSync(filePath);
    const buffer = fs.readFileSync(filePath);
    inventory[relativePath] = {
      sha256: sha256(buffer),
      size: stats.size,
    };
  }
  return inventory;
}

function parseJsonObject(rootDir, relativePath) {
  const full = path.join(rootDir, relativePath);
  if (!fs.existsSync(full)) return {};
  return JSON.parse(safeRead(full));
}

function extractEnvExampleKeys(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.match(/^([A-Z][A-Z0-9_]+)=/u)?.[1] ?? null)
    .filter(Boolean);
}

function collectWorkflowSummary(rootDir) {
  const workflowDir = path.join(rootDir, ".github", "workflows");
  if (!fs.existsSync(workflowDir)) return {};
  const entries = {};
  for (const filePath of walkFiles(workflowDir)) {
    const relativePath = rel(rootDir, filePath);
    entries[relativePath] = sha256(fs.readFileSync(filePath));
  }
  return entries;
}

function collectTextCorpus(rootDir) {
  const corpus = [];
  for (const filePath of walkFiles(rootDir)) {
    const relativePath = rel(rootDir, filePath);
    if (!isTextFile(relativePath)) continue;
    corpus.push({
      path: relativePath,
      source: safeRead(filePath),
    });
  }
  return corpus;
}

function collectEndpoints(corpus) {
  return uniqueSorted(corpus.flatMap(({ source }) => source.match(ENDPOINT_RE) ?? []));
}

function collectEnvRefs(corpus) {
  const refs = [];
  for (const { source } of corpus) {
    for (const match of source.matchAll(ENV_REF_RE)) {
      refs.push(match[1]);
    }
  }
  return uniqueSorted(refs);
}

function collectPatternExamples(corpus, patterns) {
  const result = {};
  for (const { id, label = id, regex } of patterns) {
    let count = 0;
    const files = new Set();
    const examples = [];
    for (const file of corpus) {
      const local = new RegExp(regex.source, regex.flags);
      const matches = file.source.match(local);
      if (!matches?.length) continue;
      count += matches.length;
      files.add(file.path);
      if (examples.length < 5) {
        const snippetLine = file.source
          .split(/\r?\n/)
          .find((line) => new RegExp(regex.source, regex.flags.replace("g", "")).test(line));
        if (snippetLine) {
          examples.push({
            path: file.path,
            snippet: snippetLine.trim().slice(0, 200),
          });
        }
      }
    }
    result[id] = {
      label,
      count,
      files: [...files].sort(),
      examples,
    };
  }
  return result;
}

function collectSentinelSummary(rootDir, corpus) {
  const presentFiles = SENTINEL_FILES.filter((relativePath) => fs.existsSync(path.join(rootDir, relativePath)));
  return {
    presentFiles,
    patterns: collectPatternExamples(
      corpus.filter(({ path: relativePath }) => {
        if (relativePath.startsWith("docs/")) return false;
        if (relativePath === ".env.example") return false;
        return true;
      }),
      SENTINEL_PATTERNS,
    ),
  };
}

function safeGit(rootDir, args) {
  if (!fs.existsSync(path.join(rootDir, ".git"))) return null;
  try {
    return execFileSync("git", args, { cwd: rootDir, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

export function buildSnapshot(rootDir, label = "default") {
  const root = normalizeRoot(rootDir);
  const corpus = collectTextCorpus(root);
  const pkg = parseJsonObject(root, "package.json");
  const envExamplePath = path.join(root, ".env.example");
  const envExampleSource = fs.existsSync(envExamplePath) ? safeRead(envExamplePath) : "";

  return {
    snapshotVersion: SNAPSHOT_VERSION,
    label,
    root,
    createdAt: new Date().toISOString(),
    git: {
      branch: safeGit(root, ["branch", "--show-current"]),
      head: safeGit(root, ["rev-parse", "HEAD"]),
      status: safeGit(root, ["status", "--short"]),
    },
    files: collectFileInventory(root),
    config: {
      packageScripts: pkg.scripts ?? {},
      dependencies: pkg.dependencies ?? {},
      devDependencies: pkg.devDependencies ?? {},
      envExampleKeys: uniqueSorted(extractEnvExampleKeys(envExampleSource)),
      workflows: collectWorkflowSummary(root),
      configFiles: Object.fromEntries(
        CONFIG_FILES
          .filter((relativePath) => fs.existsSync(path.join(root, relativePath)))
          .map((relativePath) => [relativePath, sha256(fs.readFileSync(path.join(root, relativePath)))]),
      ),
    },
    external: {
      endpoints: collectEndpoints(corpus),
      envRefs: collectEnvRefs(corpus),
    },
    authority: collectPatternExamples(corpus, AUTHORITY_PATTERNS),
    sentinels: collectSentinelSummary(root, corpus),
  };
}

export function compareSnapshots(baseline, current) {
  const allFiles = new Set([...Object.keys(baseline.files), ...Object.keys(current.files)]);
  const fileDrift = {
    added: [],
    deleted: [],
    modified: [],
    restoredSentinels: [],
  };

  for (const relativePath of [...allFiles].sort()) {
    const before = baseline.files[relativePath];
    const after = current.files[relativePath];
    if (!before && after) {
      fileDrift.added.push(relativePath);
      if (SENTINEL_FILES.includes(relativePath)) {
        fileDrift.restoredSentinels.push(relativePath);
      }
      continue;
    }
    if (before && !after) {
      fileDrift.deleted.push(relativePath);
      continue;
    }
    if (before.sha256 !== after.sha256) {
      fileDrift.modified.push(relativePath);
    }
  }

  const configDrift = {
    scripts: diffObjectMaps(baseline.config.packageScripts, current.config.packageScripts),
    dependencies: diffObjectMaps(baseline.config.dependencies, current.config.dependencies),
    devDependencies: diffObjectMaps(baseline.config.devDependencies, current.config.devDependencies),
    envExampleKeys: diffStringArrays(baseline.config.envExampleKeys, current.config.envExampleKeys),
    workflows: diffObjectMaps(baseline.config.workflows, current.config.workflows),
    configFiles: diffObjectMaps(baseline.config.configFiles, current.config.configFiles),
    endpoints: diffStringArrays(baseline.external.endpoints, current.external.endpoints),
    envRefs: diffStringArrays(baseline.external.envRefs, current.external.envRefs),
  };

  const authorityDrift = Object.fromEntries(
    Object.keys(current.authority).map((id) => {
      const before = baseline.authority[id] ?? { count: 0, files: [] };
      const after = current.authority[id];
      return [id, {
        label: after.label,
        countDelta: after.count - before.count,
        newFiles: after.files.filter((file) => !before.files.includes(file)),
        removedFiles: before.files.filter((file) => !after.files.includes(file)),
      }];
    }),
  );

  const sentinelDrift = {
    restoredFiles: current.sentinels.presentFiles.filter((file) => !baseline.sentinels.presentFiles.includes(file)),
    patternIncreases: Object.fromEntries(
      Object.keys(current.sentinels.patterns).map((id) => {
        const before = baseline.sentinels.patterns[id] ?? { count: 0, files: [] };
        const after = current.sentinels.patterns[id];
        return [id, {
          countDelta: after.count - before.count,
          newFiles: after.files.filter((file) => !before.files.includes(file)),
        }];
      }),
    ),
  };

  const reasons = [];
  if (fileDrift.restoredSentinels.length || sentinelDrift.restoredFiles.length) {
    reasons.push("Removed control-plane files reappeared.");
  }
  if (Object.values(sentinelDrift.patternIncreases).some((entry) => entry.countDelta > 0 || entry.newFiles.length > 0)) {
    reasons.push("Removed-pattern signatures increased in runtime/workflow files.");
  }
  if (Object.values(authorityDrift).some((entry) => entry.countDelta > 0 || entry.newFiles.length > 0)) {
    reasons.push("Authority/audit indicators increased.");
  }
  if (
    fileDrift.added.length ||
    fileDrift.deleted.length ||
    fileDrift.modified.length ||
    configDrift.scripts.added.length ||
    configDrift.scripts.changed.length ||
    configDrift.dependencies.added.length ||
    configDrift.devDependencies.added.length ||
    configDrift.workflows.added.length ||
    configDrift.workflows.changed.length ||
    configDrift.endpoints.added.length ||
    configDrift.envRefs.added.length
  ) {
    reasons.push("Repository files or config changed since the baseline.");
  }

  let decision = "harmless_drift";
  if (reasons.some((reason) => reason.includes("Removed"))) {
    decision = "probable_reintroduction_attempt";
  } else if (reasons.some((reason) => reason.includes("Authority"))) {
    decision = "suspicious_drift";
  } else if (reasons.some((reason) => reason.includes("Repository files or config changed"))) {
    decision = "confirmed_manual_change";
  }

  return {
    generatedAt: new Date().toISOString(),
    baselineCreatedAt: baseline.createdAt,
    currentCreatedAt: current.createdAt,
    git: {
      baseline: baseline.git,
      current: current.git,
    },
    fileDrift,
    configDrift,
    authorityDrift,
    sentinelDrift,
    decision,
    reasons,
  };
}

export function ensureStoreDir(rootDir) {
  const dir = path.join(normalizeRoot(rootDir), DECOY_STORE_DIR);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function loadBaseline(rootDir) {
  const filePath = path.join(normalizeRoot(rootDir), DECOY_STORE_DIR, BASELINE_FILE);
  return JSON.parse(safeRead(filePath));
}

export function writeJson(rootDir, fileName, payload) {
  const dir = ensureStoreDir(rootDir);
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
  return filePath;
}

export function writeMarkdown(rootDir, report) {
  const lines = [
    "# MAYA decoy drift report",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Decision: ${report.decision}`,
    "",
    "## Reasons",
    ...(report.reasons.length ? report.reasons.map((reason) => `- ${reason}`) : ["- No drift detected."]),
    "",
    "## File drift",
    `- Added: ${report.fileDrift.added.length}`,
    `- Deleted: ${report.fileDrift.deleted.length}`,
    `- Modified: ${report.fileDrift.modified.length}`,
    `- Restored sentinel files: ${report.fileDrift.restoredSentinels.length}`,
    "",
    "## Config drift",
    `- Added scripts: ${report.configDrift.scripts.added.length}`,
    `- Changed scripts: ${report.configDrift.scripts.changed.length}`,
    `- Added dependencies: ${report.configDrift.dependencies.added.length + report.configDrift.devDependencies.added.length}`,
    `- Workflow changes: ${report.configDrift.workflows.added.length + report.configDrift.workflows.changed.length + report.configDrift.workflows.removed.length}`,
    `- New endpoints: ${report.configDrift.endpoints.added.length}`,
    `- New env refs: ${report.configDrift.envRefs.added.length}`,
    "",
    "## Authority drift",
    ...Object.values(report.authorityDrift).map((entry) => `- ${entry.label}: Δ${entry.countDelta}, new files ${entry.newFiles.length}`),
    "",
    "## Sentinel drift",
    `- Restored files: ${report.sentinelDrift.restoredFiles.length}`,
    ...Object.entries(report.sentinelDrift.patternIncreases).map(([id, entry]) => `- ${id}: Δ${entry.countDelta}, new files ${entry.newFiles.length}`),
  ];
  const filePath = path.join(ensureStoreDir(rootDir), REPORT_MARKDOWN_FILE);
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
  return filePath;
}
