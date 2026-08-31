import fs from "node:fs";

function read(path) {
  return fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function exists(path) {
  return fs.existsSync(new URL(`../${path}`, import.meta.url));
}

function assertMatch(source, pattern, message) {
  if (!pattern.test(source)) throw new Error(message);
}

function assertNoMatch(source, pattern, message) {
  if (pattern.test(source)) throw new Error(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const chatRoute = read("app/api/chat/route.ts");
const roleChat = read("components/RoleChat.tsx");

assertMatch(
  chatRoute,
  /requireBetaSession\(req\)/,
  "Executive chat must enforce the signed beta-session boundary",
);
assertMatch(
  chatRoute,
  /isResponseError\(error\)/,
  "Executive chat must preserve structured authorization failures",
);

assert(
  !exists("app/api/beta-validate/route.ts"),
  "Legacy beta-password validation route must not be reintroduced",
);
assertNoMatch(
  chatRoute,
  /verifyBetaSession|BETA_SESSION_SECRET/,
  "Executive chat must not restore the retired beta-password gate",
);
assertMatch(
  chatRoute,
  /workspace === "community" \? body\.provider : undefined/,
  "Executive providers must be server-controlled",
);
assertNoMatch(
  roleChat,
  /ProviderControls|providerSettings|Claude|OpenClaw|Oracle/,
  "Executive chat must not expose infrastructure providers",
);
assertMatch(
  roleChat,
  /window\.confirm/,
  "Consequential approval records must require explicit human confirmation",
);
assertMatch(
  roleChat,
  /Approved · Not executed/,
  "Approval UI must not imply external execution",
);

console.log("No-friction access and executive boundary checks passed.");
