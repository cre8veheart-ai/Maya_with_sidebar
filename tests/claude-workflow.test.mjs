import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const workflow = readFileSync(
  new URL("../.github/workflows/claude.yml", import.meta.url),
  "utf8",
);

test("claude workflow only listens for explicit comment or review triggers", () => {
  assert.match(workflow, /\bon:\s*\n(?:.*\n)*?\s{2}issue_comment:\n\s{4}types: \[created\]/m);
  assert.match(workflow, /\s{2}pull_request_review_comment:\n\s{4}types: \[created\]/);
  assert.match(workflow, /\s{2}pull_request_review:\n\s{4}types: \[submitted\]/);
  assert.doesNotMatch(workflow, /\n\s{2}issues:\n/);
});

test("claude workflow job does not evaluate issue body or title triggers", () => {
  assert.match(workflow, /github\.event_name == 'issue_comment'/);
  assert.match(workflow, /github\.event_name == 'pull_request_review_comment'/);
  assert.match(workflow, /github\.event_name == 'pull_request_review'/);
  assert.doesNotMatch(workflow, /github\.event_name == 'issues'/);
  assert.doesNotMatch(workflow, /github\.event\.issue\.(body|title)/);
});
