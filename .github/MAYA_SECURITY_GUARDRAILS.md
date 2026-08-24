# MAYA Security Guardrails

Effective: 2026-08-24

These guardrails apply to all human and automated contributors to this repository.

## Non-negotiable controls

1. Repository visibility must remain **private**. No automation, agent, workflow, integration, or contributor may make the repository public or change visibility without explicit founder approval.
2. No automation or agent may create, rotate, revoke, expose, print, copy, or otherwise alter repository secrets, API keys, tokens, OAuth credentials, deployment credentials, or environment variables unless explicitly authorized for that exact action.
3. No automation or agent may change repository ownership, collaborator permissions, GitHub App permissions, installation scope, branch protection, rulesets, or administrative settings without explicit founder approval.
4. No force-pushes to `main`. No direct history rewrites of `main`.
5. No repository duplication, mirroring, forking, transfer, export, or backup repository creation without explicit founder approval.
6. Branch creation is task-scoped only. One task = one branch unless a recovery branch is explicitly required. Duplicate, retry, `-again`, `-v2`, `-final`, or similarly proliferating branches are prohibited when an existing branch can be reused.
7. Temporary branches must be deleted after merge or abandonment. Branch count must be treated as a controlled resource and reviewed before new executive-module work begins.
8. `copilot/*` branches are not permitted for new MAYA work. New branches must use an approved namespace such as `ari/`, `feat/`, `fix/`, or `security/` and must describe one bounded task.
9. Security-sensitive changes must be isolated, reviewed, and verified before merge. Security tests must be non-destructive by default.
10. Any attempted permission escalation, secret access, visibility change, token manipulation, repo duplication, or unexplained branch creation is a stop condition. Do not continue the build until the event is reviewed.

## Build rule

Executive modules are built one at a time against the verified core. Each module must pass its verification gate before the next executive is integrated.

## Cleanup rule

Retain `main`, active unmerged work, and branches containing unique unmerged recovery material. Delete merged, superseded, duplicate, abandoned, and obsolete experiment branches after verification that they contain no unique required work.
