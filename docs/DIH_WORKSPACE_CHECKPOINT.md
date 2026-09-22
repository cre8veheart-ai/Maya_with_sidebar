# DIH CODING WORKSPACE CHECKPOINT

Status: Active handoff
Recorded: 2026-09-22 UTC
Owner: Leslie / Founder
Technical lead: Ari / Acting CTO

## Activation

Canonical phrase: **DIH EVENT MAYA**

The phrase is a workspace recovery shortcut. It does not alter application authentication or authorization.

## Canonical coordinates

| Surface | Canonical target |
| --- | --- |
| GitHub | `cre8veheart-ai/Maya_with_sidebar` |
| Visibility | Private |
| Production branch | `main` |
| Vercel team | `mayav11` |
| Vercel project | `maya-with-sidebar` |
| Production commit | `2dd925765687630c3b242fd519ad4321d6a44422` |
| Production state | READY |
| Full verification | `npm ci && npm run verify` |

## Verified workspace authority

The connected GitHub workspace has admin, maintain, pull, push, and triage permission for the canonical repository. Use repository permissions as authorization evidence; do not treat the DIH phrase itself as authorization.

## Executive roster

| Executive | Role |
| --- | --- |
| Max | CEO |
| Erica | CMO |
| Dana | CFO |
| Ari | CTO |
| Sam | COO |
| Unnamed | Executive Assistant |

MAYA is the orchestration and intelligence platform, not an executive persona.

## Hard boundaries

- `main` is the only production source branch.
- Use a focused branch and pull request for changes.
- Production deploys originate from `main` only.
- Keep credentials and secrets server-only.
- `/api/chat` must preserve the current server-side auth boundary and fail safely.
- External actions require explicit human approval.
- Do not use Copilot legacy branches as architectural authority.
- Do not create duplicate repositories or shadow production projects.
- Do not claim a change passed until the complete verification suite provides evidence.

## Current build edge

Completed:
- Printable MAYA activation/deployment runbook added and linked from the repository docs.
- Claude GitHub Actions smoke workflow isolated from project MCP and expanded for fuller diagnostics.
- Founder exact-head merge approval plus anti-drift branch discipline recorded in `AGENTS.md`, the runbook, and the living blueprint.
- `.env.example` refreshed to cover the active GitHub OAuth/repository-scoping variables and the Adobe fonts project-id variable with safe placeholders.
- Session continuity rules now explicitly require every substantive session to end at a recorded stop point and the next session to resume from that exact next action.

Current working branch:
- `copilot/make-rulesets-for-maya`

Current branch head at checkpoint:
- `774120c01c4235d4341453f13eb66b17e78ad0dc`

## Next build package

**Activation + continuity verification**

1. Populate only the actually needed local/repository env values from the refreshed `.env.example`.
2. Rerun the updated Claude smoke workflow from the active branch and capture the fuller diagnostics.
3. Confirm the `main` protection settings enforce `npm run verify` plus `Founder exact-head approval`.
4. Keep the PR branch focused and prevent unattended commit drift.
5. Resume from the recorded blueprint checkpoint unless Leslie changes direction.

## Resume sequence

On the next **DIH EVENT MAYA**:
1. Read `AGENTS.md`.
2. Read `docs/MAYA_SESSION_PROTOCOL.md`.
3. Read `docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md` and its Current Working Checkpoint.
4. Read this checkpoint.
5. Confirm the active branch, exact branch head, open PR state, and latest production deployment.
6. Continue the activation + continuity verification path unless Leslie changes direction.
