# MAYA Jail

Security quarantine ledger for suspicious, excessive, obsolete, or insufficiently justified capabilities discovered during MAYA hardening.

**Jail is evidence, not executable storage.** Never copy live secrets, credentials, exploit payloads, or dangerous code into this file. Record only the minimum facts needed to investigate and prevent recurrence.

## Status vocabulary
- **DETAINED** — suspicious capability found; isolated from production path pending review.
- **CONVICTED** — capability confirmed unnecessary or unsafe; removed/disabled.
- **RELEASED** — investigated and justified; retained with documented controls.
- **REFERRED** — requires an account/platform-level audit outside repository code.

## Intake record
| ID | Status | Finding | Location | Why jailed | Disposition |
|---|---|---|---|---|---|
| MJ-001 | CONVICTED | Preview workflow pull-request write permission | `.github/workflows/vercel-preview.yml` | Deployment preview did not need repository write authority | Commenting write path removed; workflow reduced to read-only |
| MJ-002 | CONVICTED | In-app GitHub write endpoint | `app/api/github/write/route.ts` | Runtime app exposed branch/file/PR/workflow mutation capability | Endpoint disabled; returns 403 |
| MJ-003 | CONVICTED | Broad GitHub OAuth write/workflow scopes | `lib/github/config.ts` | Product connection could request authority beyond MAYA's current need | Write-capable scopes filtered; write/workflow authority denied |
| MJ-004 | CONVICTED | Empty repo allowlist treated as broad access | GitHub integration configuration | Missing allowlist could become access to every repo visible to connected account | Changed to fail closed |
| MJ-005 | DETAINED | Legacy GitHub write-control UI remains in source | `components/GitHubControls.tsx` | UI still advertises and constructs write/workflow operations even though server write path is disabled | Remove or rebuild as read-only control surface before promotion |
| MJ-006 | CONVICTED | Long-lived GitHub product session cookie | `lib/github/session.ts` | Thirty-day bearer-session lifetime unnecessarily enlarges theft/replay window | Reduced to 8-hour session lifetime |
| MJ-007 | CONVICTED | OAuth authorization allowed account signup | `app/api/github/connect/route.ts` | Unneeded behavior in a constrained internal integration flow | Signup disabled in authorization request |
| MJ-008 | CONVICTED | OAuth state remained reusable on invalid callback | `app/api/github/callback/route.ts` | Failed callback did not consume state, leaving unnecessary replay surface | Invalid state now clears OAuth state cookie |
| MJ-009 | REFERRED | GitHub/Vercel account-level collaborators, app installations, deploy keys, tokens and environment secrets | Platform control planes | Repository static analysis cannot prove who/what currently holds external authority | Perform separate platform permission inventory and revoke anything not explicitly justified |

## Jail rules
1. Nothing leaves jail because an AI says it is safe.
2. Release requires evidence and a documented reason.
3. Convicted capabilities are deleted or disabled; Git history preserves provenance.
4. Credentials are revoked/rotated rather than archived here.
5. Unknown authority fails closed.
6. No direct-to-production write authority for delegated agents.
7. Every new privileged capability must name its owner, purpose, scope, expiry/review condition, and verification path.

## Intake template
```text
ID: MJ-XXX
Status: DETAINED
Finding:
Location:
Capability:
Trigger/access path:
Evidence:
Risk:
Containment:
Decision:
Verification:
```

## Governing principle
**MAYA does not hide dangerous capability in convenience architecture. Privilege must continuously justify its existence.**


## Founder authority correction — 2026-09-05

This ledger records historical containment decisions; it does not outrank a newer explicit Founder instruction.

| ID | Status | Finding | Disposition |
|---|---|---|---|
| MJ-010 | RELEASED | Governed AI repository write authority | Claude, Ari, and explicitly approved AI collaborators may build through branches, commits, tests, and PRs. |
| MJ-011 | RELEASED | Founder-authorized merge, deployment, direct update, or administration action | An agent may execute the exact named action after explicit Founder authorization; it may not infer or enlarge that authority. |
| MJ-012 | CONVICTED | Automatic deletion of Copilot and inactive branches | Destructive branch-lifecycle automation removed; deletion now requires an explicit decision. |

Active safety boundaries protect the Founder rather than overrule her: no credential exposure or repurposing, no Client Vault plaintext leakage, no falsified evidence, no deceptive test weakening, and no destructive history rewrite.
