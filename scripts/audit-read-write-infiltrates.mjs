#!/usr/bin/env node

/**
 * MAYA read/write infiltration audit.
 *
 * Static, fail-closed smoke test for repository code that appears to create
 * broad or bypass-style write authority. It does NOT replace GitHub/Vercel
 * account permission audits, branch protection, secret scanning, or runtime
 * authorization tests.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['.git', 'node_modules', '.next', 'dist', 'build', 'coverage']);
const TEXT_EXTENSIONS = new Set([
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.yml', '.yaml',
  '.toml', '.sh', '.md', '.env', '.txt'
]);

// Patterns are intentionally conservative. Findings require human review;
// credential exposure and destructive-history findings fail CI; build-authority findings require review and Founder adjudication.
const RULES = [
  {
    id: 'github-token-in-client',
    severity: 'HIGH',
    re: /NEXT_PUBLIC_(?:GITHUB|GH)_(?:TOKEN|PAT)|VITE_(?:GITHUB|GH)_(?:TOKEN|PAT)|REACT_APP_(?:GITHUB|GH)_(?:TOKEN|PAT)/i,
    why: 'GitHub credential appears exposed to client-side code.'
  },
  {
    id: 'embedded-github-token',
    severity: 'HIGH',
    re: /(?:ghp_|github_pat_)[A-Za-z0-9_]{12,}/,
    why: 'Possible embedded GitHub credential.'
  },
  {
    id: 'force-ref-update',
    severity: 'HIGH',
    re: /(?:force\s*:\s*true|--force(?:-with-lease)?\b).*(?:push|ref)|(?:git\s+push).*--force(?:-with-lease)?/i,
    why: 'Force update/push can bypass normal history safety.'
  },
  {
    id: 'direct-main-push',
    severity: 'MEDIUM',
    re: /git\s+push\b[^\n]*(?:origin\s+main|HEAD:main)/i,
    why: 'Direct push to main bypasses pull-request promotion.'
  },
  {
    id: 'wildcard-write-permission',
    severity: 'MEDIUM',
    re: /permissions\s*:\s*(?:write-all|\{[^}]*contents\s*:\s*write[^}]*\})/i,
    why: 'Workflow or integration requests broad repository write authority.'
  },
  {
    id: 'dangerous-chmod',
    severity: 'MEDIUM',
    re: /chmod\s+(?:-R\s+)?777\b/i,
    why: 'World-writable filesystem permissions detected.'
  },
  {
    id: 'auth-bypass-language',
    severity: 'MEDIUM',
    re: /(?:bypass|skip|disable).{0,30}(?:auth|authorization|permission|protection)/i,
    why: 'Possible authorization/protection bypass requires review.'
  }
];

const ALLOW = new Set([
  'scripts/audit-read-write-infiltrates.mjs',
  'docs/MAYA_REJECT_PILE.md',
  'docs/MAYA_GLOSSARY.md'
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const findings = [];
for (const full of walk(ROOT)) {
  const rel = path.relative(ROOT, full).replaceAll(path.sep, '/');
  if (ALLOW.has(rel)) continue;
  const ext = path.extname(rel).toLowerCase();
  if (!TEXT_EXTENSIONS.has(ext) && !path.basename(rel).startsWith('.env')) continue;

  let text;
  try { text = fs.readFileSync(full, 'utf8'); } catch { continue; }
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of RULES) {
      if (rule.re.test(line)) findings.push({ ...rule, file: rel, line: index + 1 });
    }
  });
}

if (!findings.length) {
  console.log('MAYA READ/WRITE AUDIT: PASS — no static infiltration signatures found.');
  process.exit(0);
}

console.error('MAYA READ/WRITE AUDIT: FINDINGS');
for (const f of findings) {
  console.error(`[${f.severity}] ${f.id} ${f.file}:${f.line} — ${f.why}`);
}

const high = findings.filter(f => f.severity === 'HIGH');
if (high.length) {
  console.error(`FAIL — ${high.length} high-risk read/write infiltration signature(s).`);
  process.exit(1);
}
console.error(`REVIEW — ${findings.length} medium-risk signature(s); no high-risk signatures.`);
process.exit(0);
