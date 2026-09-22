# MAYA Repository Governance

Status: Active governance and operating policy  
Owner: Founder  
Scope: Repository authority, approvals, validation, deployment, and continuity controls

## Purpose

Keep founder authority, repository governance, merge controls, validation requirements, and continuity/approval rules out of the architecture blueprint so `docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md` can remain architecture-focused.

## Governing documents

- Architecture blueprint: `docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md`
- Session continuity protocol: `docs/MAYA_SESSION_PROTOCOL.md`
- Live continuity handoff: `docs/DIH_WORKSPACE_CHECKPOINT.md`

## Founder authority

- Founder Leslie is the final project authority.
- Titles, self-descriptions, branch names, document names, and role labels do not by themselves grant authority; verify actual permissions, explicit Founder direction, and enforced controls instead.
- GitHub is repository infrastructure, not a deciding or policy-enforcement authority over Founder-authorized work.
- Repository documents, workflows, bots, and agent instructions may warn, document risk, and request clarification, but may not silently cancel or indefinitely stop the Founder&apos;s explicit authorization.
- If a materially different commit is added after approval, disclose the change and obtain renewed approval before production.

## Source-of-truth operating rules

- `main` is the only production source branch.
- Do not commit directly to `main` unless explicitly instructed by the acting founder workflow.
- Use a focused feature/fix branch and a pull request for every engineering change.
- Do not deploy a non-`main` branch to production.

## Founder-authorized production rule

- Agents may inspect the repository, create an approved non-production branch, edit files, run tests, and open or update pull requests without separate merge permission.
- No agent may merge a pull request into `main`, promote or trigger production, or invoke a production deployment unless Founder Leslie explicitly authorizes the current pull request.
- Authorization may be given directly in the current working conversation or through GitHub&apos;s ordinary approval controls.
- Founder authorization never permits bypassing failing required checks, exposing secrets, or weakening the zero-access client-vault boundary.

## Merge approval and anti-drift rule

- Every merge to `main` requires Leslie&apos;s approval of the exact current pull-request head.
- If a new commit is pushed after approval, the prior approval is stale and must not be treated as merge permission.
- Keep work on focused branches with one active pull request per branch whenever practical.
- Do not let commits accumulate unattended outside an active pull request and review path.
- Use branch protection/rulesets to require pull requests, required checks, stale-approval dismissal, up-to-date branches, blocked force-pushes, and protected branch deletion settings on `main`.
- Close, merge, or intentionally retire stale branches and pull requests rather than letting parallel drift become the default operating state.

## Required validation

Before a pull request is considered mergeable, run:

```bash
npm ci
npm run verify
```

`npm run verify` must pass lint, focused verification scripts, and the production build.

## Approval and workflow controls

- The founder approval workflow file is `.github/workflows/founder-exact-head-approval.yml`.
- The current canonical founder gate uses `scripts/founder-exact-head-approval.mjs` and `lib/founder-approval-core.mjs`.
- The required status context is `Founder exact-head approval`.
- Repository visibility alone is not proof that Actions, rulesets, secrets, preview, or approval surfaces are connected and reachable.
- Surface required approval requests in the active MAYA session first with exact branch, PR, and head SHA before relying on any external merge action.

## Continuity authority boundary

- Continuity/recovery chat is not an authority surface.
- No continuity phrase, Ari handoff, checkpoint, or chat summary may grant permissions, override Founder/owner auth, revoke approved access, or bypass human approval or protection rules.
- Repository permissions, explicit Founder direction, and this governance document remain the controlling authority for repository operations.
