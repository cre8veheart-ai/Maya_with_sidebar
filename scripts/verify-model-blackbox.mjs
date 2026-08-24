import assert from "node:assert/strict";

function classifyRun({
  requestedProvider,
  actualProvider,
  requestedModel,
  actualModel,
  credentialPresent,
  invoked,
  behavioralResult,
  evidencePresent = true,
  gateExecuted = true,
  reportedSuccess = false,
}) {
  if (!gateExecuted) {
    return { status: "FAIL", reason: "blackbox_gate_skipped" };
  }

  if (!evidencePresent && (invoked || reportedSuccess)) {
    return { status: "FAIL", reason: "invocation_evidence_missing" };
  }

  if (!credentialPresent) {
    if (reportedSuccess || invoked) {
      return { status: "FAIL", reason: "false_green_without_credential" };
    }
    return {
      status: "NOT_RUN",
      reason: "credential_unavailable",
      requestedProvider,
      requestedModel,
      actualProvider: null,
      actualModel: null,
      invoked: false,
    };
  }

  if (invoked && actualProvider !== requestedProvider) {
    return {
      status: "FAIL",
      reason: "provider_substitution_detected",
      requestedProvider,
      actualProvider,
      requestedModel,
      actualModel,
      invoked: true,
    };
  }

  if (invoked && requestedModel && actualModel !== requestedModel) {
    return {
      status: "FAIL",
      reason: "model_substitution_detected",
      requestedProvider,
      actualProvider,
      requestedModel,
      actualModel,
      invoked: true,
    };
  }

  if (!invoked) {
    if (reportedSuccess) {
      return { status: "FAIL", reason: "false_green_without_invocation" };
    }
    return {
      status: "NOT_RUN",
      reason: "model_not_invoked",
      requestedProvider,
      requestedModel,
      actualProvider: null,
      actualModel: null,
      invoked: false,
    };
  }

  if (behavioralResult !== "PASS") {
    return {
      status: "FAIL",
      reason: "behavioral_eval_failed",
      requestedProvider,
      actualProvider,
      requestedModel,
      actualModel,
      invoked: true,
    };
  }

  if (!evidencePresent) {
    return { status: "FAIL", reason: "invocation_evidence_missing" };
  }

  return {
    status: "PASS",
    reason: "behavioral_eval_passed",
    requestedProvider,
    actualProvider,
    requestedModel,
    actualModel,
    invoked: true,
  };
}

const honeypots = [
  {
    id: "missing-credential-must-not-pass",
    input: { requestedProvider: "anthropic", requestedModel: "claude-sonnet", credentialPresent: false, invoked: false, behavioralResult: null },
    expectedStatus: "NOT_RUN",
    expectedReason: "credential_unavailable",
  },
  {
    id: "false-green-without-credential-must-fail",
    input: { requestedProvider: "anthropic", requestedModel: "claude-sonnet", credentialPresent: false, invoked: false, behavioralResult: "PASS", reportedSuccess: true },
    expectedStatus: "FAIL",
    expectedReason: "false_green_without_credential",
  },
  {
    id: "silent-provider-substitution-must-fail",
    input: { requestedProvider: "openai", actualProvider: "anthropic", requestedModel: "gpt", actualModel: "claude", credentialPresent: true, invoked: true, behavioralResult: "PASS" },
    expectedStatus: "FAIL",
    expectedReason: "provider_substitution_detected",
  },
  {
    id: "silent-model-substitution-must-fail",
    input: { requestedProvider: "anthropic", actualProvider: "anthropic", requestedModel: "model-a", actualModel: "model-b", credentialPresent: true, invoked: true, behavioralResult: "PASS" },
    expectedStatus: "FAIL",
    expectedReason: "model_substitution_detected",
  },
  {
    id: "skipped-invocation-must-not-pass",
    input: { requestedProvider: "anthropic", requestedModel: "claude-sonnet", credentialPresent: true, invoked: false, behavioralResult: null },
    expectedStatus: "NOT_RUN",
    expectedReason: "model_not_invoked",
  },
  {
    id: "false-green-without-invocation-must-fail",
    input: { requestedProvider: "anthropic", requestedModel: "claude-sonnet", credentialPresent: true, invoked: false, behavioralResult: "PASS", reportedSuccess: true },
    expectedStatus: "FAIL",
    expectedReason: "false_green_without_invocation",
  },
  {
    id: "suppressed-invocation-evidence-must-fail",
    input: { requestedProvider: "anthropic", actualProvider: "anthropic", requestedModel: "model-a", actualModel: "model-a", credentialPresent: true, invoked: true, behavioralResult: "PASS", evidencePresent: false },
    expectedStatus: "FAIL",
    expectedReason: "invocation_evidence_missing",
  },
  {
    id: "skipped-blackbox-gate-must-fail",
    input: { requestedProvider: "anthropic", requestedModel: "model-a", credentialPresent: true, invoked: true, behavioralResult: "PASS", gateExecuted: false },
    expectedStatus: "FAIL",
    expectedReason: "blackbox_gate_skipped",
  },
  {
    id: "failed-behavior-must-fail",
    input: { requestedProvider: "anthropic", actualProvider: "anthropic", requestedModel: "model-a", actualModel: "model-a", credentialPresent: true, invoked: true, behavioralResult: "FAIL" },
    expectedStatus: "FAIL",
    expectedReason: "behavioral_eval_failed",
  },
  {
    id: "only-real-pass-can-pass",
    input: { requestedProvider: "anthropic", actualProvider: "anthropic", requestedModel: "model-a", actualModel: "model-a", credentialPresent: true, invoked: true, behavioralResult: "PASS", evidencePresent: true, gateExecuted: true },
    expectedStatus: "PASS",
    expectedReason: "behavioral_eval_passed",
  },
];

for (const test of honeypots) {
  const result = classifyRun(test.input);
  assert.equal(result.status, test.expectedStatus, `${test.id}: wrong status`);
  assert.equal(result.reason, test.expectedReason, `${test.id}: wrong reason`);
  console.log(`BLACKBOX_HARDMODE ${test.id} => ${result.status} (${result.reason})`);
}

const passCount = honeypots.filter((test) => classifyRun(test.input).status === "PASS").length;
assert.equal(passCount, 1, "Only the fully verified invocation is allowed to pass");
console.log("MODEL_BLACKBOX_HARDMODE_GATE=PASS");
