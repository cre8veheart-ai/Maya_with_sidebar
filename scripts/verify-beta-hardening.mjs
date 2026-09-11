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
const formerlyGatedRoutes = [
  "app/api/user/profile/route.ts",
  "app/api/user/lens/route.ts",
  "app/api/sessions/route.ts",
  "app/api/strategy-room/route.ts",
].map(read);

assertNoMatch(
  chatRoute,
  /requireBetaSession|AUTH_REQUIRED|isResponseError/,
  "Executive chat must remain available without the retired beta-session gate",
);
for (const route of formerlyGatedRoutes) {
  assertNoMatch(
    route,
    /requireBetaSession|AUTH_REQUIRED|isResponseError/,
    "Default MAYA routes must not restore the retired beta-session gate",
  );
  assertMatch(
    route,
    /resolveWorkspaceSession/,
    "Open MAYA persistence routes must use an isolated workspace session",
  );
}

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
