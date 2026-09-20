import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(path, "utf8");
}

function lineOf(source, pattern) {
  const lines = source.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (pattern.test(lines[i])) return i + 1;
  }
  return -1;
}

function assertMatch(source, pattern, file, message) {
  if (!pattern.test(source)) {
    throw new Error(`${file}:missing ${message}`);
  }
}

function assertNoMatch(source, pattern, file, message) {
  const line = lineOf(source, pattern);
  if (line !== -1) {
    throw new Error(`${file}:${line} ${message}`);
  }
}

try {
  const claudeWorkflowFile = ".github/workflows/claude.yml";
  const founderWorkflowFile = ".github/workflows/founder-exact-head-approval.yml";

  const claudeWorkflow = read(claudeWorkflowFile);
  const founderWorkflow = read(founderWorkflowFile);

  assertMatch(claudeWorkflow, /^\s*workflow_dispatch\s*:/m, claudeWorkflowFile, "must remain manual-dispatch only");
  assertNoMatch(claudeWorkflow, /^\s*issue_comment\s*:/m, claudeWorkflowFile, "unexpected issue_comment trigger reintroduced");
  assertNoMatch(claudeWorkflow, /pull_request_review(_comment)?/m, claudeWorkflowFile, "noisy review trigger reintroduced");

  assertMatch(
    founderWorkflow,
    /github\.event_name == 'issue_comment' && github\.event\.issue\.pull_request && github\.actor == 'cre8veheart-ai'/,
    founderWorkflowFile,
    "founder issue_comment actor gate missing",
  );
  assertNoMatch(founderWorkflow, /pull_request_review(_comment)?/m, founderWorkflowFile, "review trigger should not be present");

  console.log("SMOKE_WORKFLOW_CONTAINMENT=PASS | root-cause: none");
} catch (error) {
  const message = error instanceof Error ? error.message : "unknown workflow containment failure";
  console.error(`SMOKE_WORKFLOW_CONTAINMENT=FAIL | root-cause: ${message}`);
  process.exit(1);
}
