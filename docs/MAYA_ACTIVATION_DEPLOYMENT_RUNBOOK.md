# MAYA Activation + Deployment Runbook

Status: Printable operator runbook  
Authority: `docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md`  
Governing sections: Source of truth; Founder-authorized production rule; Required validation; Vercel; Current Working Checkpoint

Use this runbook while activating Claude Code, preparing local MAYA development, and moving approved work through the canonical `main` deployment path.

## Direct links

- Repo: https://github.com/cre8veheart-ai/Maya_with_sidebar
- Rulesets: https://github.com/cre8veheart-ai/Maya_with_sidebar/settings/rules
- Actions: https://github.com/cre8veheart-ai/Maya_with_sidebar/actions
- Actions secrets: https://github.com/cre8veheart-ai/Maya_with_sidebar/settings/secrets/actions
- Pull requests: https://github.com/cre8veheart-ai/Maya_with_sidebar/pulls
- Branches: https://github.com/cre8veheart-ai/Maya_with_sidebar/branches
- Claude workflow file: https://github.com/cre8veheart-ai/Maya_with_sidebar/blob/main/.github/workflows/claude.yml
- Full verification workflow file: https://github.com/cre8veheart-ai/Maya_with_sidebar/blob/main/.github/workflows/full-verification.yml
- Founder approval workflow file: https://github.com/cre8veheart-ai/Maya_with_sidebar/blob/main/.github/workflows/founder-exact-head-approval.yml

## Canonical deployment target

- GitHub repository: `cre8veheart-ai/Maya_with_sidebar`
- Production branch: `main`
- Vercel team: `mayav11`
- Vercel project: `maya-with-sidebar`

## Before you start

- Work on a feature branch, not directly on `main`.
- Keep secrets server-only.
- Do not treat a green CI run as proof of runtime behavior.
- Use the canonical native Vercel integration for preview and production behavior.
- Merge to `main` only after Founder approval for the exact final PR state.

## Part 1 — Activate Claude Code in GitHub Actions

### A. Add the required secret

Open: https://github.com/cre8veheart-ai/Maya_with_sidebar/settings/secrets/actions

Create this repository secret:

```text
ANTHROPIC_API_KEY
```

### B. Run the smoke test

1. Open https://github.com/cre8veheart-ai/Maya_with_sidebar/actions
2. Select **Claude Code**
3. Click **Run workflow**
4. Use the default smoke prompt unless you have a reason to change it
5. Run it on the branch you want to test

### C. Success criteria

- The workflow finishes successfully
- The summary reports a successful smoke run
- No branch edits, commits, or pull requests are created by the smoke test

## Part 2 — Activate MAYA locally

From your cloned repository root:

```bash
cd /path/to/Maya_with_sidebar
npm ci
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

### Minimum local configuration

- `ANTHROPIC_API_KEY`
- Optional provider variables only if you are testing those providers
- Keep all provider, session, Redis, OAuth, and service-role secrets server-only

## Part 3 — Use Claude Code in this repository

### Manual test path

1. Open https://github.com/cre8veheart-ai/Maya_with_sidebar/actions
2. Run **Claude Code**
3. Review the workflow output

### Comment trigger path

The workflow listens for `@claude` from the repo owner in:

- issue comments
- pull request review comments
- pull request reviews
- issue titles or bodies

Use it like this:

```text
@claude <task request>
```

## Part 4 — Protect the production path

Open: https://github.com/cre8veheart-ai/Maya_with_sidebar/settings/rules

Create a branch ruleset for `main` with these settings:

- require a pull request before merging
- require 1 approval
- dismiss stale approvals
- require conversation resolution before merging
- require status checks to pass before merging
- require branches to be up to date before merging
- block force pushes
- restrict deletions

Required checks should include these exact reported checks:

```text
npm run verify
Founder exact-head approval
```

`npm ci` is already run inside the `npm run verify` workflow job and should not be added as a separate required status check unless GitHub shows a separate check with that exact name in the ruleset UI.

## Part 5 — Move approved work through the canonical deployment path

1. Create or update a feature branch
2. Open or update a pull request into `main`
3. Let GitHub Actions run
4. Confirm the required check **`npm run verify`** passes in the **MAYA Full Verification** workflow
5. Confirm the preview deployment behaves correctly
6. Confirm the required check **`Founder exact-head approval`** is satisfied through the **Founder Exact-Head Approval** workflow
7. Merge the pull request into `main`
8. Confirm the canonical Vercel project deploys production from `main`
9. Verify production behavior in the browser

## Required verification before merge

Run:

```bash
npm ci
npm run verify
```

The repository workflow `MAYA Full Verification` runs:

- checkout
- Node 20 setup
- `npm ci`
- `npm run verify`

## Exact merge/deploy checklist

- [ ] Work is on a branch, not directly on `main`
- [ ] PR targets `main`
- [ ] Rulesets protect `main`
- [ ] `ANTHROPIC_API_KEY` exists in Actions secrets
- [ ] Claude Code smoke test passes
- [ ] The required check `npm run verify` passes in the MAYA Full Verification workflow
- [ ] Preview deployment matches expected behavior
- [ ] The required check `Founder exact-head approval` passes
- [ ] PR is merged into `main`
- [ ] Canonical Vercel project deploys from `main`
- [ ] Production behavior is verified in browser, not just green CI

## Founder approval meaning

The workflow `Founder Exact-Head Approval` emits the required status check `Founder exact-head approval` and requires approval for the current PR head SHA.

Meaning:

- old approvals do not count after new commits
- approval must match the current PR head exactly
- merge authority still belongs to the Founder for the exact final PR state

## Fast activation order

1. Add `ANTHROPIC_API_KEY` to GitHub Actions secrets
2. Confirm the `main` ruleset is active
3. Run the Claude Code smoke test
4. Open or update a pull request
5. Wait for the required check **`npm run verify`** in **MAYA Full Verification**
6. Confirm preview deployment behavior
7. Satisfy the required check **`Founder exact-head approval`**
8. Merge to `main`
9. Confirm production deployment on the canonical Vercel project

## Caution

A successful GitHub run alone is not enough. MAYA requires browser and API verification, and production deployment must come from the canonical `maya-with-sidebar` Vercel project on `main`.
