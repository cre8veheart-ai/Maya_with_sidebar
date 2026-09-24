# Standard GitHub Governance for MAYA

## Purpose

MAYA uses GitHub's standard repository controls as the primary production-governance boundary. Repository text and workflow output are evidence, not enforcement by themselves.

## Current verified state at creation

- Default branch: `main`
- Branch protection: not enabled
- Active repository rulesets: none
- Therefore standard governance is **not yet technically enforced**.

Do not mark this control as active until the settings below are enabled and verified through GitHub.

## Required `main` ruleset

Configure a ruleset targeting `main` with:

1. Require a pull request before merging.
2. Require one approving review from `@cre8veheart-ai`.
3. Require review from CODEOWNERS for owned paths.
4. Dismiss stale approvals when new commits are pushed.
5. Require all review conversations to be resolved.
6. Require the `npm run verify` status check.
7. Require the transitional `Founder exact-head approval` status until Leslie explicitly approves its retirement after the ruleset is proven.
8. Block force pushes.
9. Block branch deletion.
10. Allow no administrator, GitHub App, bot, agent, or other bypass.
11. Restrict production deployment to commits on `main`.

## Activation evidence

Before claiming the ruleset is active:

- Confirm the repository API reports `main` as protected or returns the active ruleset targeting `main`.
- Open a disposable draft PR without approval and confirm GitHub blocks merging.
- Approve its current head, push another commit, and confirm the stale approval is dismissed.
- Confirm a failing required check blocks merging.
- Confirm neither the founder account nor installed apps can bypass the rule.
- Record the test PR and final ruleset evidence in the MAYA architecture history.

## Transition rule

The custom exact-head workflow remains in place as defense in depth until the standard GitHub ruleset passes the activation evidence above. Removing the workflow before that proof would leave `main` unprotected.

## GitHub Actions runtime

GitHub retired Node 20 for JavaScript actions on 2026-09-23. Workflow action pins must use Node-24-compatible major versions. This does not require changing MAYA's application runtime in the same PR.
