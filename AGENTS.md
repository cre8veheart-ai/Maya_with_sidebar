# MAYA Engineering Instructions

This repository is the source code for MAYA. Treat it as a production application, not a playground.

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
- If requirements conflict with this file, stop and surface the conflict rather than silently redefining the product.
