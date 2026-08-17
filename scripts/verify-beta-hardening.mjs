import fs from "node:fs";

function read(path) {
  return fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function assertMatch(source, pattern, message) {
  if (!pattern.test(source)) throw new Error(message);
}

function assertNoMatch(source, pattern, message) {
  if (pattern.test(source)) throw new Error(message);
}

const betaRoute = read("app/api/beta-validate/route.ts");
const chatRoute = read("app/api/chat/route.ts");
const invites = read("lib/beta/invites.ts");
const session = read("lib/beta/session.ts");
const proxy = read("proxy.ts");
const roleChat = read("components/RoleChat.tsx");

assertNoMatch(betaRoute, /inviteCodes\s*:/, "Beta API must not return invite codes");
assertMatch(betaRoute, /httpOnly:\s*true/, "Beta cookie must be HTTP-only");
assertMatch(betaRoute, /sameSite:\s*"lax"/, "Beta cookie must use SameSite protection");
assertMatch(invites, /timingSafeEqual/, "Invite comparisons must be timing-safe");
assertMatch(invites, /\{ nx: true \}/, "Invite redemption must be atomic");
assertMatch(session, /createHmac\("sha256"/, "Beta sessions must be signed");
assertMatch(session, /timingSafeEqual/, "Session signatures must be timing-safe");
assertMatch(chatRoute, /verifyBetaSession/, "Chat must require a signed beta session");
assertMatch(chatRoute, /status: 429/, "Chat must enforce a request limit");
assertMatch(chatRoute, /workspace === "community" \? body\.provider : undefined/, "Executive providers must be server-controlled");
assertMatch(proxy, /BETA_SESSION_SECRET/, "Protected routes must fail closed without a session secret");
assertNoMatch(roleChat, /ProviderControls|Claude|OpenClaw|Oracle/, "Executive chat must not expose infrastructure providers");
assertMatch(roleChat, /Approved · Not executed/, "Approval UI must not imply execution");

console.log("Private beta hardening checks passed.");
