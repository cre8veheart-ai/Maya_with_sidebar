import { timingSafeEqual } from "node:crypto";

const WRITABLE_BRANCH = /^(?:claude|feature|fix)\/[A-Za-z0-9._/-]+$/;

export function isValidBearerToken(candidate, expected) {
  if (!candidate || !expected) return false;
  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function requireWritableBranch(branch) {
  if (!branch || !WRITABLE_BRANCH.test(branch)) {
    throw new Error("Writes require an explicit claude/*, feature/*, or fix/* branch.");
  }
  if (branch.includes("..") || branch.includes("//") || branch.endsWith("/")) {
    throw new Error("Invalid write branch.");
  }
  return branch;
}

export function requireProductionBase(base) {
  if (base !== "main") throw new Error("Pull requests must target main.");
  return base;
}
