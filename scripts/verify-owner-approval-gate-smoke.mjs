import { readFileSync } from "node:fs";
import {
  hasExactFounderApproval,
  isApprovalWorkflowRelevantEvent,
} from "../lib/founder-approval-core.mjs";

function lineOf(source, pattern) {
  const lines = source.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (pattern.test(lines[i])) return i + 1;
  }
  return -1;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  const founderWorkflowFile = ".github/workflows/founder-exact-head-approval.yml";
  const founderCoreFile = "lib/founder-approval-core.mjs";
  const founderWorkflow = readFileSync(founderWorkflowFile, "utf8");

  assert(
    isApprovalWorkflowRelevantEvent(
      "issue_comment",
      {
        issue: { pull_request: { url: "https://example.test/pr/1" } },
        comment: { user: { login: "vercel[bot]" }, body: "APPROVE abc123" },
      },
      "cre8veheart-ai",
    ) === false,
    `${founderCoreFile}:7 non-founder comments must not trigger approval checks`,
  );

  assert(
    isApprovalWorkflowRelevantEvent(
      "issue_comment",
      {
        issue: { pull_request: { url: "https://example.test/pr/1" } },
        comment: { user: { login: "cre8veheart-ai" }, body: "APPROVE abc123" },
      },
      "cre8veheart-ai",
    ) === true,
    `${founderCoreFile}:14 founder APPROVE comments must trigger approval checks`,
  );

  assert(
    hasExactFounderApproval(
      [
        { user: { login: "cre8veheart-ai" }, author_association: "OWNER", body: "APPROVE stale" },
      ],
      "cre8veheart-ai",
      "abc123",
    ) === false,
    `${founderCoreFile}:18 approval must match exact current head sha`,
  );

  const actorGateLine = lineOf(founderWorkflow, /github\.actor == 'cre8veheart-ai'/);
  assert(actorGateLine !== -1, `${founderWorkflowFile}:missing founder actor gate in workflow condition`);

  console.log("SMOKE_OWNER_APPROVAL_GATE=PASS | root-cause: none");
} catch (error) {
  const message = error instanceof Error ? error.message : "unknown owner approval gate failure";
  console.error(`SMOKE_OWNER_APPROVAL_GATE=FAIL | root-cause: ${message}`);
  process.exit(1);
}
