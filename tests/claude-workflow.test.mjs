import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const workflow = fs.readFileSync(
  new URL("../.github/workflows/claude.yml", import.meta.url),
  "utf8",
);

test("claude workflow only triggers from comments and reviews", () => {
  assert.match(workflow, /^\s*issue_comment:\s*$/m);
  assert.match(workflow, /^\s*pull_request_review_comment:\s*$/m);
  assert.match(workflow, /^\s*pull_request_review:\s*$/m);
  assert.doesNotMatch(workflow, /^\s*issues:\s*$/m);
  assert.doesNotMatch(workflow, /github\.event_name == 'issues'/);
});
