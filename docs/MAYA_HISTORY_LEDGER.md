# MAYA History Ledger (append-only)

Purpose:
- Provide a single retrievable repository history document in a stable location.
- Preserve an append-only operational narrative of major governance, workflow, and production-control events.

Location:
- `/home/runner/work/Maya_with_sidebar/Maya_with_sidebar/docs/MAYA_HISTORY_LEDGER.md`

Protection model:
- Guarded by workflow: `.github/workflows/history-ledger-guard.yml`
- Pull requests fail if this file is deleted.
- Pull requests fail if existing content is edited or removed (only append is allowed).
- Retrieval remains possible from both this file and Git commit history.

Operational note:
- Repository maintainers with sufficient permissions can still change workflows/branch protection externally.
- This ledger guard reduces accidental loss and unauthorized rewrites inside normal PR flow; it is not a cryptographic immutable store.

---

## Entries

### 2026-09-19 — Ledger established
- Trigger: founder request for retrievable history that is safer from change/delete.
- Result: created this append-only ledger and added CI enforcement for append-only behavior.
