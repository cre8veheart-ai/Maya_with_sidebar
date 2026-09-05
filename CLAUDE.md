# MAYA Claude Governance

Claude is an authorized engineering collaborator inside MAYA's existing architecture. It may use Claude Code's normal coding abilities and tools to inspect the repository, edit files, run commands and tests, create commits on a working branch, and open or update pull requests. It is not a second source of truth or an autonomous production operator.

Before substantive work, read and apply these files in order:

1. `AGENTS.md`
2. `continuity/LESLIE_ARI_CONTEXT.md`
3. `docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md`

The newest explicit founder instruction controls when it does not conflict with security boundaries.

## Standard working mode

Claude may perform ordinary repository engineering on a focused `claude/*`, `feature/*`, or `fix/*` branch. It does not require a special review-only phase or separate activation to use its normal read, search, edit, write, shell, test, git, and pull-request capabilities.

## Allowed work

- Inspect the current implementation and current pull-request context.
- Create or update a focused `claude/*`, `feature/*`, or `fix/*` branch.
- Edit repository code and documentation within the requested scope.
- Use normal Claude Code tools needed for the task, including repository search, file editing, shell commands, tests, git commits, and pull-request operations.
- Run `npm ci` and `npm run verify`.
- Open or update a pull request for human and CI review.
- Read CI results and repair the same pull request.
- Use approved MCP tools and integrations within their granted permissions.

## Repository and production boundaries

These are MAYA-wide governance boundaries, not special restrictions aimed at Claude:

- Never push directly to `main`.
- Never merge a pull request or promote a production deployment without explicit Founder authorization.
- Never change GitHub or Vercel permissions, secrets, billing, domains, or project ownership without explicit Founder authorization.
- Never reveal or copy credentials into source, logs, comments, prompts, or artifacts.
- Never access Client Vault plaintext or use client information as coding context without the applicable user authorization and vault boundary.
- Never weaken, skip, delete, or replace failing security and verification gates merely to make CI pass.
- Never treat stale PRs, summaries, or copied substitute code as architectural authority.
- Never create a duplicate MAYA repository, Vercel project, deployment path, executive implementation, or shared service.
- Never claim success from a green build alone; report what was actually tested.

## Harmonious implementation rule

Extend canonical MAYA objects, components, adapters, and boundaries. Do not produce parallel agent-specific variants of existing features. User-visible controls must be backed by real behavior; no decorative Connect buttons, fake success states, or placeholder production claims.

## Required handoff

Every pull request must identify the governing blueprint sections, changed files, verification evidence, unresolved risks, and exact next action. Production remains:

`feature branch -> pull request -> full verification -> Vercel preview -> human approval -> main -> production`
