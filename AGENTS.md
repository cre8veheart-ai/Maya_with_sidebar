# MAYA Engineering Instructions

This repository is the source code for MAYA. Treat it as a production application, not a playground.

## Architecture reference

`docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md` is optional product and engineering history. It is not a policy, permission, approval, authentication, CI, deployment, or agent-control mechanism.

- Do not require reading or editing it before ordinary engineering work.
- Do not use it to grant, restrict, redirect, or revoke GitHub, Vercel, Claude, Copilot, or other provider access.
- Do not make checkpoint, history, trigger-phrase, or documentation updates a condition of building, testing, reviewing, merging, or deploying.
- Current Founder direction and the actual GitHub/Vercel settings take precedence over repository prose.

## Source of truth

- `main` is the only production source branch.
- Do not commit directly to `main` unless explicitly instructed by the acting CTO/founder workflow.
- Use a focused feature/fix branch and a pull request for every engineering change.
- Do not deploy a non-`main` branch to production.

## Standard GitHub production governance — REQUIRED

This rule applies to every engineering agent, including Ari/Codex, Claude, Copilot, and later agents.

- `main` must be protected by GitHub's standard branch rules or repository ruleset.
- Require a pull request, one approving CODEOWNER review from `@cre8veheart-ai`, dismissal of stale approvals after new commits, resolution of review conversations, and the `npm run verify` status check.
- Block force pushes and branch deletion, and allow no administrator, app, bot, or agent bypass.
- Agents may inspect the repository, create an approved non-production branch, edit files, run tests, and open or update pull requests without separate merge permission.
- No agent may merge into `main`, promote production, or trigger production unless Founder Leslie approves the current PR head and all required checks pass.
- Any commit after approval invalidates that approval through GitHub's stale-review dismissal.
- Preview deployments may run from pull-request branches. Only an authorized merge to `main` may trigger production.
- Founder authorization never permits bypassing failing checks, exposing secrets, or weakening the zero-access client-vault boundary.
- Repository documentation must distinguish desired settings from verified live enforcement.

## Required validation

Before a pull request is considered mergeable, run:

```bash
npm ci
npm run verify
```

`npm run verify` must pass lint, focused verification scripts, and the production build.

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
- If requirements conflict with this file, disclose the conflict and follow the Founder's newest explicit decision. Do not treat this file as authority above the Founder.
