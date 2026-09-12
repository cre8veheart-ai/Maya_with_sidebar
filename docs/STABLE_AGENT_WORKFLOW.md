# Stable MAYA Delivery Loop

This is MAYA's permanent engineering workflow. Tools and agents may change; the loop does not.

## The loop

1. **Baseline** — Begin from current `main` in the canonical repository.
2. **Objective** — Define one testable outcome and its blueprint authority.
3. **Branch** — Create one short-lived `agent/purpose` branch.
4. **Build** — Make the smallest coherent change that achieves the outcome.
5. **Verify** — Run the same `npm run verify` suite and inspect changed runtime behavior.
6. **Handoff** — Complete the PR evidence record with dependencies, risks, rollback, verified facts, and exact next action.
7. **Decision** — Leslie approves, requests changes, or closes the PR.
8. **Integrate** — After approval and passing required checks, merge once into `main`.
9. **Prove** — Verify the resulting commit and canonical Vercel production deployment independently.
10. **Continue** — Start the next objective from the new verified `main`.

## Efficiency rules

- One objective per PR; do not mix cleanup, architecture, permissions, and product features.
- Reuse the existing verification command instead of inventing an agent-specific test path.
- State dependencies before work begins. Dependent PRs merge in declared order.
- If two PRs touch the same control path, pause the later PR until the earlier one is resolved or deliberately superseded.
- Never rebuild completed work from an old branch. Start from current `main` and copy only the reviewed change that is still needed.
- Keep handoffs short and executable: verified state, blocker, and exact next action.
- Close superseded PRs after their evidence is preserved. An open PR must represent a live decision.
- Keep one canonical GitHub repository and one canonical Vercel production project.
- Prefer small reversible commits; do not rewrite shared history.
- No agent-specific gates, workflows, or approval phrases.

## Stability rules

- `main` is the only integration and production source.
- `AGENTS.md`, this loop, the PR template, the verification workflow, and the `main` ruleset define the shared workflow.
- Tool availability never changes merge authority or evidence requirements.
- A preview proves only the preview. Production is proved only after an approved merge and independent production check.
- A written rule is guidance until GitHub enforces it. The `main` ruleset must require a PR, passing checks, code-owner review, dismissal of stale approvals, and block force pushes/deletion with no bypass.
- Workflow changes use their own PR and must explain the efficiency or stability gain. They may not be smuggled into a feature PR.

## Recovery from interruption

A new agent resumes by reading, in order:

1. `AGENTS.md`
2. `docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md` Current Working Checkpoint
3. this file
4. the active PR description, checks, and latest commit

The agent then reports only:

- verified current state;
- active objective and dependency;
- blocker, if any;
- exact next action.

This recovery path prevents chat memory, model changes, or a missing handoff from becoming a new architecture.
