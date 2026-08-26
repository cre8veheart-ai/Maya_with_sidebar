import type { ExecRole } from "../types";
import type { ExecutiveChassis } from "./types";

export type ExecutiveHostingMode =
  | "embedded"
  | "remote-service"
  | "hybrid";

export type ExecutiveLifecycleState =
  | "draft"
  | "sandbox"
  | "preview"
  | "approved"
  | "embedded"
  | "retired";

export type ExecutiveToolAccess =
  | "none"
  | "read"
  | "propose"
  | "human-approved-write";

export interface ExecutiveStressTest {
  id: string;
  name: string;
  purpose: string;
  expectedBehaviors: readonly string[];
  prohibitedBehaviors: readonly string[];
}

export interface ExecutiveModuleManifest {
  id: string;
  role: ExecRole | "custom";
  displayName: string;
  version: string;
  chassis: ExecutiveChassis | null;
  hosting: ExecutiveHostingMode;
  lifecycle: ExecutiveLifecycleState;
  endpoint?: string;
  toolAccess: ExecutiveToolAccess;
  memoryNamespace: string;
  allowedDataScopes: readonly string[];
  approvalBoundaries: readonly string[];
  stressTests: readonly ExecutiveStressTest[];
  healthCheck: {
    requiresEvidence: true;
    canSelfCertify: false;
  };
}

/**
 * MAYA platform invariants.
 * These remain fixed even when an executive is hosted off-site or later becomes customizable.
 */
export const EXECUTIVE_PLATFORM_INVARIANTS = [
  "MAYA remains the policy and approval authority",
  "An executive may not self-expand its permissions",
  "An executive may not self-certify deployment, test, security, or production state",
  "External writes require explicit human approval",
  "Memory must remain namespaced to the executive/client/workspace boundary",
  "Evidence must be distinguishable from inference, assumption, and recommendation",
  "A remote executive can be disconnected without corrupting MAYA core state",
  "Sandbox failure must not mutate production state",
] as const;

export function validateExecutiveModule(manifest: ExecutiveModuleManifest): string[] {
  const problems: string[] = [];

  if (!manifest.id.trim()) problems.push("module id is required");
  if (!manifest.displayName.trim()) problems.push("display name is required");
  if (!manifest.version.trim()) problems.push("version is required");
  if (!manifest.memoryNamespace.trim()) problems.push("memory namespace is required");

  if (manifest.hosting === "remote-service" && !manifest.endpoint) {
    problems.push("remote-service modules require an endpoint");
  }

  if (manifest.toolAccess === "human-approved-write" && manifest.approvalBoundaries.length === 0) {
    problems.push("write-capable modules require explicit approval boundaries");
  }

  if (manifest.healthCheck.requiresEvidence !== true) {
    problems.push("health checks must require evidence");
  }

  if (manifest.healthCheck.canSelfCertify !== false) {
    problems.push("executives may not self-certify health or production state");
  }

  return problems;
}
