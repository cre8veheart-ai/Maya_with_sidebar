import test from "node:test";
import assert from "node:assert/strict";
import { isValidBearerToken, requireProductionBase, requireWritableBranch } from "../lib/security.mjs";

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
