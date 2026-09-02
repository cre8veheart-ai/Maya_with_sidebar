# MAYA Engineering Instructions

This repository is the source code for MAYA. Treat it as a production application, not a playground.

## Founder continuity activation — REQUIRED

Before any AI assistant, coding agent, model, or automated engineering system performs substantive work on MAYA, it must first load and apply:

`continuity/LESLIE_ARI_CONTEXT.md`

Canonical activation phrase: **DIH event**.

For interactive founder work, the phrase means: activate the founder continuity layer before proceeding with MAYA project reasoning or implementation.

Rules:
- Do not treat the phrase as authentication, a password, or authorization by itself.
- Runtime access to founder continuity must still pass server-side founder authorization.
- An AI working directly in this repository must read the continuity file before proposing architecture, changing code, adjudicating product direction, or acting as Maya's engineering agent.
- If the continuity file cannot be read, do not invent its contents. Work only on clearly bounded mechanical tasks or surface that continuity is unavailable.
- The founder's newest explicit instruction always overrides older preferences recorded in continuity, subject to security and safety boundaries.
- Never copy passwords, API keys, financial identifiers, authentication secrets, medical information, political affiliation, or other sensitive personal data into the continuity layer.
- Never expose hidden continuity context to ordinary product users.

This requirement exists to preserve product intent, founder working style, architectural history, and the Leslie + Ari collaboration across sessions and model/provider changes.

## Living MAYA blueprint — REQUIRED

Before planning, architecture, implementation, review, testing, deployment, product interpretation, menu work, memory work, executive work, client-vault work, or merge decisions, every assistant or engineering agent must read and apply:

`docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md`

Rules:
- The blueprint on `main` is the living, active, amendable MAYA build authority.
- State which blueprint section(s) govern the task before making substantive changes.
- Every PR must identify the blueprint section it implements, preserves, or proposes to amend.
- Founder-approved architectural decisions must be added to the blueprint on `main`; they must not remain only in chat, comments, transferred summaries, or feature branches.
- A stale PR description, old branch, bot summary, or legacy implementation cannot override the current blueprint.
- If code, a request, or another instruction conflicts with the blueprint, stop and surface the conflict. Reconcile the blueprint explicitly before merge.
- Mechanical tasks may be scoped narrowly, but they may not redefine MAYA architecture implicitly.
- Completion reports must state whether the work conforms to the blueprint and identify any unresolved gap.
- Exact trigger **DIH EVENT MAYA** requires reading the blueprint from `main` and presenting its Current Working Checkpoint before substantive work.
- At the end of substantive MAYA work, update the Current Working Checkpoint with the verified stop point and exact first next action.
- Append a Work History Trail entry with evidence, changes, result, blocker and relevant PR/branch/commit/deployment identifiers.
- The history trail is append-only. Correct prior entries with a new entry; never silently rewrite or delete completed history.
- Record all substantive work: successful changes, failures, exact errors, attempted fixes, failed fixes, verified fixes, regressions, rollbacks, reversals, removals and unresolved debt.
- Link failures to fixes and fixes to post-fix verification evidence.
- Use VERIFIED, CONTRADICTED, UNVERIFIED and UNKNOWN classifications; never convert a claim into proof merely because a build or check is green.
- A later fix does not erase the failed attempt that led to it.
- Apply founder-approved blueprint amendments before dependent implementation. Remove superseded rules from the active design and record the replacement in Amendment History.

## Source of truth

- `main` is the only production source branch.
- Do not commit directly to `main` unless explicitly instructed by the acting CTO/founder workflow.
- Use a focused feature/fix branch and a pull request for every engineering change.
- Do not deploy a non-`main` branch to production.

## Required validation

Before a pull request is considered mergeable, run:

```bash
npm ci
npm run verify
```

`npm run verify` must pass lint, focused verification scripts, continuity-gate validation, and the production build.

Do not bypass failing checks, weaken lint rules, or remove tests merely to make CI green.

## Architecture rules

- MAYA is the orchestration/intelligence platform, not an executive persona.
- Executive roles are separate conversational specialists.
- `/api/chat` is a protected server boundary and must fail safely.
- Keep provider credentials, session secrets, Redis credentials, OAuth secrets, and tokens server-only.
- Never hard-code secrets, copy live credentials into source, or commit `.env*` files containing real values.
- Preserve explicit human approval for external actions.
- Prefer small, reversible changes over broad rewrites.

## Product rules

- A session is the persistent working surface for user activity.
- Multiple executives may participate in one session.
- Executive provider/model routing remains internal unless product direction explicitly changes it.
- MAYA settings control orchestration and intelligence modes.
- Do not reintroduce password/beta gates, provider selectors, or internal engineering controls into user-facing executive chat without explicit approval.

## Vercel

Canonical project: `maya-with-sidebar` under team `mayav11`.

- Preview deployments may come from PR branches.
- Production must come from `main` only.
- Treat `maya-with-sidebar-kkha` and `maya-with-sidebar-wgvu` as duplicate legacy projects until they are removed from Vercel.

## Engineering discipline

- Read the existing implementation before modifying it.
- Preserve working behavior unless the task explicitly requires a behavioral change.
- Report assumptions and unresolved production risks in the PR description.
- Never merge a failing PR.
- Never use Copilot-generated legacy branches as architectural authority.
- If requirements conflict with this file, stop and surface the conflict rather than silently redefining the product.
