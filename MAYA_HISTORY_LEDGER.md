# MAYA History Ledger (append-only, root canonical)

Purpose:
- Keep retrievable operational history in a canonical root location.
- Preserve an append-only narrative of major governance, workflow, and production-control events.

Canonical location:
- `/home/runner/work/Maya_with_sidebar/Maya_with_sidebar/MAYA_HISTORY_LEDGER.md`

Protection model:
- Guarded by workflow: `.github/workflows/history-ledger-guard.yml`
- Pull requests fail if this file is deleted.
- Pull requests fail if existing content is edited or removed (only append is allowed).
- Retrieval remains possible from both this file and Git commit history.

Operational note:
- Repository maintainers with sufficient permissions can still change workflows/branch protection externally.
- This guard reduces accidental loss and unauthorized rewrites inside normal PR flow; it is not a cryptographic immutable store.

---

## Entries

### 2026-09-19 — Root ledger canonicalized
- Trigger: founder request to embed history in root directory for safer default retrievability.
- Result: root ledger established as canonical location; docs ledger retained as pointer.

### 2026-09-19 — Full stabilization execution (freeze, inventory, classify, fix, validate)
- Trigger: founder request to implement full stabilization plan end-to-end.
- Baseline freeze: working branch locked to minimal workflow edits before further changes.

#### Alteration inventory (workflows, auth, connectors, governance, open PR deltas)
- Workflows:
  - `.github/workflows/claude.yml`
  - `.github/workflows/founder-exact-head-approval.yml`
  - `.github/workflows/full-verification.yml`
  - `.github/workflows/history-ledger-guard.yml`
- Auth paths:
  - `lib/server/auth-core.mjs`
  - `lib/server/auth.ts`
  - `app/api/chat/route.ts`
- Connector/control points:
  - `app/api/github/write/route.ts`
  - `lib/github/config.ts`
- Governance docs:
  - `docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md`
  - `MAYA_HISTORY_LEDGER.md` (root canonical)
  - `docs/MAYA_HISTORY_LEDGER.md` (pointer)
- Open PR deltas reviewed as unresolved risk surface:
  - `#67 #70 #71 #76 #96 #126 #127 #129 #131 #132 #136 #137 #138 #140`

#### Classification (keep / revert / harden)
- KEEP:
  - `full-verification.yml` as required build gate.
  - `founder-exact-head-approval.yml` for founder approval flow.
  - GitHub write-path scope checks in `app/api/github/write/route.ts`.
- REVERT:
  - Claude auto comment/review-trigger execution path (loop source).
  - docs-ledger-as-canonical location (superseded by root canonical ledger).
- HARDEN:
  - Founder approval issue-comment path restricted to founder actor only.
  - Ledger protection moved to root canonical file and enforced append-only.

#### Fixes applied in strict order
1) Workflow stability:
   - Reduced `claude.yml` to `workflow_dispatch` only.
   - Restricted founder approval issue-comment runs to founder actor.
2) Authority/safety boundaries:
   - Root canonical append-only history ledger maintained.
   - Ledger guard updated to enforce `MAYA_HISTORY_LEDGER.md` in root.
3) Product-path functionality:
   - No product runtime behavior altered in this slice; core app routes preserved.

#### Validation and regression spot checks
- Required validation executed:
  - `npm ci` PASSED
  - `npm run verify` PASSED
- Spot checks observed in verify chain:
  - credential audit PASS
  - node tests PASS
  - beta/persistence/session-closeout scripts PASS
  - production build PASS

#### Before vs after ledger
- BEFORE:
  - Claude workflow included auto-trigger paths that created loop/noise churn.
  - Founder approval comment path could still react to broader issue-comment traffic.
  - Canonical history location not anchored at root.
- AFTER:
  - Claude workflow is manual-only (`workflow_dispatch`) to stop loop churn.
  - Founder approval issue-comment path is founder-actor constrained.
  - Root canonical append-only history ledger is guarded by CI.

#### Unresolved / follow-up items (explicit)
- Live default-branch confirmation of new workflow behavior remains UNVERIFIED until post-merge events execute on `main`.
- Open legacy PR stack remains a reintroduction risk until triaged/closed/rebased:
  - `#67 #70 #71 #76 #96 #126 #127 #129 #131 #132 #136 #137 #138 #140`
