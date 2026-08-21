# MAYA BUILD STATUS

**Checkpoint:** 2026-08-21 11:xx AM PT
**Acting CTO:** Ari
**Founder:** Leslie
**Source of truth:** `main` on `cre8veheart-ai/Maya_with_sidebar`

## Current verified state

- GitHub connection is active through the founder-owned account.
- Connected GitHub account has admin permission on this repository.
- Production Vercel project `maya-with-sidebar` exists and its latest production deployment is READY.
- That production deployment is sourced from GitHub repo `cre8veheart-ai/Maya_with_sidebar`, branch `main`.
- CEO currently uses the simplified `CeoChatOnly` UI.
- Other executive routes currently use the shared `RoleChat` system.
- `RoleChat` sends role-specific context/lens to `/api/chat` and persists session records.
- Three Vercel projects currently exist for Maya (`maya-with-sidebar`, `maya-with-sidebar-kkha`, `maya-with-sidebar-wgvu`). Canonicalization to one production project is still required.

## Product architecture decisions locked

- MAYA is the intelligence/orchestration platform, not an executive persona.
- Executives are separate conversational specialists.
- User names every session manually.
- A session is the persistent, scrollable working surface and stores all activity.
- Multiple executives can participate in one session.
- Each participating executive gets its own prompt/response box.
- MAYA settings control intelligence modes and orchestration (for example Deep, Turbo, Add Executive).
- Shared toolbar/submenus stay folded and disappear during active consultation.
- Session recommendations are compact, expandable, hyperlinked bullet points.
- All session activity, recommendations, decisions, executive responses, and actions attach to the same session.

## CTO operating rules

- Founder sets product direction.
- Acting CTO owns architecture, delegation, technical acceptance, repo integrity, release discipline, and escalation.
- Copilot has no CTO authority, merge authority, deployment authority, permission-management authority, or architectural authority.
- Contractors/AI tools do not redefine architecture or production without CTO approval.
- Credit/use conservation is a standing constraint: batch checks, avoid redundant calls, and minimize founder intervention.

## Audit still required before new architecture work

1. Full MAYA health/function check on current production.
2. Confirm no password wall, beta wall, or deployment protection blocks normal user access.
3. Verify current production route behavior and `/api/chat` health.
4. Verify contributor permissions and who can actually write/merge/deploy.
5. Resolve the three-Vercel-project duplication and designate one canonical production project.
6. Confirm `main` is the only production source branch and that deployment provenance matches it.
7. Review runtime/build errors before adding new executive architecture.

## Next action

**CTO: perform the full MAYA production health + access + GitHub/Vercel audit, report pass/fail findings, then proceed only after the baseline is clean.**
