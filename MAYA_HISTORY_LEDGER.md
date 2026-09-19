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
