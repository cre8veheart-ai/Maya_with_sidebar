import type { MayaMessage } from "../types";
import {
  validateExecutiveModule,
  type ExecutiveModuleManifest,
} from "./moduleContract";

export type ExecutiveRunMode = "sandbox" | "preview" | "live";

export interface ExecutiveRunRequest {
  module: ExecutiveModuleManifest;
  mode: ExecutiveRunMode;
  messages: readonly MayaMessage[];
  requestedAction?: string;
  humanApprovedWrite?: boolean;
}

export interface ExecutiveRunPlan {
  allowed: boolean;
  executionTarget: "embedded" | "remote-service" | "hybrid";
  systemContract: string;
  memoryNamespace: string;
  endpoint?: string;
  blockers: string[];
  warnings: string[];
}

/**
 * Resolve whether an executive may run and what MAYA must enforce around it.
 * This function does not call an AI provider or mutate external state. It is the
 * policy seam between an executive module and whichever runtime adapter is used.
 */
export function planExecutiveRun(request: ExecutiveRunRequest): ExecutiveRunPlan {
  const blockers = validateExecutiveModule(request.module);
  const warnings: string[] = [];
  const { module, mode, requestedAction, humanApprovedWrite } = request;

  if (module.lifecycle === "retired") {
    blockers.push("retired modules cannot execute");
  }

  if (mode === "live" && !["approved", "embedded"].includes(module.lifecycle)) {
    blockers.push("live execution requires an approved or embedded module");
  }

  if (mode === "sandbox" && module.lifecycle === "draft") {
    warnings.push("draft module is running experimentally and must not be treated as trusted");
  }

  if (requestedAction && module.approvalBoundaries.includes(requestedAction)) {
    if (!humanApprovedWrite) {
      blockers.push(`human approval required for action: ${requestedAction}`);
    }
  }

  if (requestedAction && module.toolAccess === "none") {
    blockers.push("this module has no tool access");
  }

  if (requestedAction && module.toolAccess === "read") {
    blockers.push("read-only modules cannot perform actions");
  }

  if (module.hosting === "remote-service" && !module.endpoint) {
    blockers.push("remote-service execution requires an endpoint");
  }

  if (module.hosting !== "embedded") {
    warnings.push("remote reasoning never inherits MAYA policy, approval, identity, or memory authority");
  }

  if (mode !== "live") {
    warnings.push("sandbox/preview results are not production verification");
  }

  return {
    allowed: blockers.length === 0,
    executionTarget: module.hosting,
    systemContract: module.chassis?.systemContract ?? "",
    memoryNamespace: module.memoryNamespace,
    endpoint: module.endpoint,
    blockers,
    warnings,
  };
}
