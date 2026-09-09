import test from "node:test";
import assert from "node:assert/strict";
import { isValidBearerToken, requireFounderMergeApproval, requireProductionBase, requireReleaseReady, requireWritableBranch } from "../lib/security.mjs";

test("authentication fails closed", () => {
  assert.equal(isValidBearerToken(undefined, "secret"), false);
  assert.equal(isValidBearerToken("secret", undefined), false);
  assert.equal(isValidBearerToken("wrong", "secret"), false);
  assert.equal(isValidBearerToken("secret", "secret"), true);
});

test("writes require approved explicit branches", () => {
  for (const branch of ["claude/notion-review", "feature/notion-filing", "fix/mcp-auth"]) {
    assert.equal(requireWritableBranch(branch), branch);
  }
  for (const branch of [undefined, "main", "master", "release/beta", "production", "copilot/fix", "feature/../main", "feature//bad"]) {
    assert.throws(() => requireWritableBranch(branch));
  }
});

test("pull requests target main only", () => {
  assert.equal(requireProductionBase("main"), "main");
  assert.throws(() => requireProductionBase("release"));
});

test("merge requires successful checks, deployment status, and a mergeable PR", () => {
  const pull = { mergeable: true };
  const checkRuns = {
    check_runs: [
      { name: "MAYA Full Verification", status: "completed", conclusion: "success" },
      { name: "preview", status: "completed", conclusion: "success" },
    ],
  };
  assert.equal(requireReleaseReady(pull, checkRuns, { state: "success" }), true);

  assert.throws(() => requireReleaseReady({ mergeable: false }, checkRuns, { state: "success" }));
  assert.throws(() => requireReleaseReady(pull, { check_runs: [] }, { state: "success" }));
  assert.throws(() => requireReleaseReady(pull, { check_runs: [{ name: "verify", status: "in_progress", conclusion: null }] }, { state: "success" }));
  assert.throws(() => requireReleaseReady(pull, { check_runs: [{ name: "verify", status: "completed", conclusion: "failure" }] }, { state: "success" }));
  assert.throws(() => requireReleaseReady(pull, checkRuns, { state: "pending" }));
});

test("merge permission must come from the founder after the latest commit", () => {
  const headCommittedAt = "2026-09-08T18:00:00Z";
  assert.equal(requireFounderMergeApproval([
    { user: { login: "cre8veheart-ai" }, body: "@claude merge", created_at: "2026-09-08T18:01:00Z" },
  ], headCommittedAt), true);

  assert.throws(() => requireFounderMergeApproval([
    { user: { login: "someone-else" }, body: "@claude merge", created_at: "2026-09-08T18:01:00Z" },
  ], headCommittedAt));

  assert.throws(() => requireFounderMergeApproval([
    { user: { login: "cre8veheart-ai" }, body: "@claude merge", created_at: "2026-09-08T17:59:00Z" },
  ], headCommittedAt));

  assert.throws(() => requireFounderMergeApproval([
    { user: { login: "cre8veheart-ai" }, body: "@claude please merge", created_at: "2026-09-08T18:01:00Z" },
  ], headCommittedAt));
});
