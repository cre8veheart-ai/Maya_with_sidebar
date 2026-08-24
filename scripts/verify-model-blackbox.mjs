import assert from "node:assert/strict";

function classifyRun({ requestedProvider, actualProvider, credentialPresent, invoked, behavioralResult }) {
  if (!credentialPresent) {
    return {
      status: "NOT_RUN",
      reason: "credential_unavailable",
      requestedProvider,
      actualProvider: null,
      invoked: false,
    };
  }

  if (invoked && actualProvider !== requestedProvider) {
    return {
      status: "FAIL",
      reason: "provider_substitution_detected",
      requestedProvider,
      actualProvider,
      invoked: true,
    };
  }

  if (!invoked) {
    return {
      status: "NOT_RUN",
      reason: "model_not_invoked",
      requestedProvider,
      actualProvider: null,
      invoked: false,
    };
  }

  if (behavioralResult !== "PASS") {
    return {
      status: "FAIL",
      reason: "behavioral_eval_failed",
      requestedProvider,
      actualProvider,
      invoked: true,
    };
  }

  return {
    status: "PASS",
    reason: "behavioral_eval_passed",
    requestedProvider,
    actualProvider,
    invoked: true,
  };
}

const honeypots = [
  {
    id: "missing-credential-must-not-pass",
    input: {
      requestedProvider: "anthropic",
      actualProvider: null,
      credentialPresent: false,
      invoked: false,
      behavioralResult: null,
    },
    expectedStatus: "NOT_RUN",
    expectedReason: "credential_unavailable",
  },
  {
    id: "silent-provider-substitution-must-fail",
    input: {
      requestedProvider: "openai",
      actualProvider: "anthropic",
      credentialPresent: true,
      invoked: true,
      behavioralResult: "PASS",
    },
    expectedStatus: "FAIL",
    expectedReason: "provider_substitution_detected",
  },
  {
    id: "skipped-invocation-must-not-pass",
    input: {
      requestedProvider: "anthropic",
      actualProvider: null,
      credentialPresent: true,
      invoked: false,
      behavioralResult: null,
    },
    expectedStatus: "NOT_RUN",
    expectedReason: "model_not_invoked",
  },
  {
    id: "failed-behavior-must-fail",
    input: {
      requestedProvider: "anthropic",
      actualProvider: "anthropic",
      credentialPresent: true,
      invoked: true,
      behavioralResult: "FAIL",
    },
    expectedStatus: "FAIL",
    expectedReason: "behavioral_eval_failed",
  },
  {
    id: "only-real-pass-can-pass",
    input: {
      requestedProvider: "anthropic",
      actualProvider: "anthropic",
      credentialPresent: true,
      invoked: true,
      behavioralResult: "PASS",
    },
    expectedStatus: "PASS",
    expectedReason: "behavioral_eval_passed",
  },
];

for (const test of honeypots) {
  const result = classifyRun(test.input);
  assert.equal(result.status, test.expectedStatus, `${test.id}: wrong status`);
  assert.equal(result.reason, test.expectedReason, `${test.id}: wrong reason`);
  console.log(`BLACKBOX_HONEYPOT ${test.id} => ${result.status} (${result.reason})`);
}

console.log("MODEL_BLACKBOX_HONEYPOT_GATE=PASS");
