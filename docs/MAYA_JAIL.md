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
| MJ-002 | RELEASED — FOUNDER OVERRIDE | In-app GitHub write endpoint | `app/api/github/write/route.ts` | Earlier restriction superseded by the Founder on 2026-09-05 | Authenticated branch/file/PR/workflow actions restored; repository allowlist remains |
| MJ-003 | RELEASED — FOUNDER OVERRIDE | GitHub OAuth repository/workflow scopes | `lib/github/config.ts` | Earlier restriction superseded by the Founder on 2026-09-05 | Standard repository and workflow scopes restored; repository allowlist remains |
| MJ-004 | CONVICTED | Empty repo allowlist treated as broad access | GitHub integration configuration | Missing allowlist could become access to every repo visible to connected account | Changed to fail closed |
| MJ-005 | CLEARED | GitHub write-control UI | `components/GitHubControls.tsx` | Server write authority is restored by Founder authorization | Write controls may use the authenticated server endpoint |
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
