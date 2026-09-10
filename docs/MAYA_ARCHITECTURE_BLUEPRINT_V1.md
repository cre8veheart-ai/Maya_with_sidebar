# Maya Architecture Blueprint v1.0

Status: Living, active and amendable MAYA build authority
Owner: Founder
Technical lead: Ari / CTO
Repository rule: One canonical private Maya repository. No duplicate repos or shadow deployments.

Blueprint governance:
- Founder Leslie is the final project authority. GitHub is repository infrastructure, not a deciding or policy-enforcement authority over Founder-authorized work.
- Repository documents, workflows, bots and agent instructions may warn, document risk and request clarification, but may not silently cancel or indefinitely stop the Founder's explicit authorization.
- Leslie personally discovered the repository hardening and destructive branch-lifecycle enforcement on 2026-09-08 after prolonged Claude, human and build-access failures; no AI system identified it before her discovery.
- This document is the current build source of truth, not a historical artifact.
- Founder-approved amendments are added here as decisions are made.
- MAYA implementation PRs must identify the blueprint section they implement or amend.
- A stale PR description, transferred summary or older plan cannot override the current blueprint.
- Blueprint changes must remain readable in repository history and must not be buried only in comments, chats or feature branches.
- The Current Working Checkpoint must be refreshed before ending substantive MAYA work so DIH EVENT MAYA can resume accurately.
- When implementation and blueprint conflict, disclose the conflict and follow the Founder's newest explicit decision. Reconcile the blueprint in the same change when practical; the blueprint may not silently stop Founder-authorized work.
- The CTO may introduce or replace a reversible, task-relevant tool, plug-in, connector, framework or implementation dependency without prior Founder approval when it stays within existing authority and introduces no new credentials, payment, client-data exposure, destructive action or material product-direction change. The change must be recorded in this blueprint before or alongside implementation with purpose, permissions, data boundary, operational dependency, cost/sign-in impact, verification gate and removal/rollback path. Founder approval remains required for the excluded high-impact categories.

## Preapproved Tool Register

This register authorizes categories, not unlimited access. Every actual addition, upgrade, configuration change or removal still receives a dated Work History entry with the affected PR, commit and deployment.

### Preapproved for autonomous use within existing MAYA authority

| Tool/category | Permitted purpose | Boundary | Verification | Removal/rollback |
|---|---|---|---|---|
| GitHub repository tools | Inspect, branch, commit, open/update/close PRs and maintain documentation in the canonical MAYA repository | No new repositories, broad permission changes, secrets or destructive history rewrites | Diff, status, checks and resulting commit/PR state | Revert scoped commit or close unmerged PR |
| Canonical Vercel project tools | Inspect configuration, builds, logs, previews and production state; deploy/redeploy approved MAYA changes | Existing `maya-with-sidebar` project only; no new paid resource or credential | Build result plus browser/capability test; READY alone is insufficient | Roll back to last verified deployment |
| Next.js, React, TypeScript and Tailwind | Implement and repair the existing application stack | Stay compatible with the canonical repository and blueprint | Typecheck, lint, tests, build and browser verification as applicable | Revert dependency/code change |
| Local build, lint and test tooling | Diagnose, format, typecheck, test and reproduce failures | No client production data or secret extraction | Record exact command, output and capability test | Remove temporary tooling/config or revert commit |
| Browser and API verification | Test user flows, routes, responsive behavior and API boundaries | Use approved test state; never expose client-vault plaintext | Screenshot/log evidence plus expected-versus-actual result | Stop test session and remove temporary test artifacts |
| Official documentation and web research | Compare implementation options and verify current platform behavior | Read-only research; claims remain sourced and evidence-labelled | Link authoritative source and record decision impact | No persistent dependency unless separately adopted |
| Built-in document, diagram and image tools | Produce blueprints, specifications, UI references and build artifacts | No external publishing or client-data disclosure | Review generated artifact against request | Delete or supersede artifact through recorded change |
| Reversible open-source packages | Add a narrowly scoped package when needed for an approved feature or test | No telemetry, new account, paid plan, secret, client-data transfer or material architecture shift | Dependency audit, build/test and runtime capability test | Remove package, lockfile change and dependent code |

### Founder decision required before use

- Any new credential, OAuth grant, account registration or broadened permission.
- Any paid plan, usage commitment or service likely to create material cost.
- Any external service receiving client data, user memory, prompts, files or analytics.
- Authentication, encryption, key management, database, vault-storage or recovery architecture changes.
- New AI/model providers that receive MAYA or client context.
- External sending, publishing, financial execution or repository-administration authority.
- Destructive or difficult-to-reverse operations.
- Any tool that materially changes MAYA's product direction or zero-access promise.

### Tool-entry template

Each adopted tool or material version change must record: UTC date; tool/version; purpose; blueprint requirement; permissions; data accessed; sign-in and cost impact; files/services changed; PR/commit/deployment; expected behavior; test performed; actual result; errors and regressions; attempted fixes; final verification; rollback/removal steps; current status (`ACTIVE`, `REMOVED`, `ROLLED BACK`, `BLOCKED` or `SUPERSEDED`).

### Candidate Tool Watchlist

This is the discovery queue for tools not yet known or adopted. A candidate may be added whenever research or implementation exposes a useful capability. Listing is not installation, endorsement, connection or proof.

Candidate statuses:
- `CANDIDATE` — potentially useful; not yet evaluated.
- `RESEARCHING` — documentation, permissions, costs and alternatives under review.
- `TRIAL` — reversible isolated test in progress; no production/client data unless separately approved.
- `REJECTED` — unsuitable; retain the reason so it is not repeatedly reconsidered.
- `PROMOTED` — adopted and moved into the active tool history with full verification and rollback record.

Each candidate entry must state:
- Tool/provider and capability it might supply
- MAYA problem or future trigger it could address
- Existing built-in/current-stack alternative
- Expected permissions, sign-in, cost and data exposure
- Zero-access/client-vault compatibility
- Lock-in and removal risk
- What evidence would justify a trial
- Current status and dated disposition

Discovery rule: use the most direct built-in or already-connected capability first. Search for a new plugin or provider only when a concrete MAYA need would materially benefit. Never claim a candidate is installed, connected or functional without verification.

Initial candidate categories (providers intentionally undecided):
- Durable workflow/retry engine for reliable session filing and closeout
- Client-side cryptography/key-recovery library suitable for zero-access vaults
- Portable encrypted export/manifest verifier
- Error monitoring with strict redaction and no client plaintext
- End-to-end browser testing for Pocket Desk and multi-client isolation
- Accessibility and mobile regression testing
- Dependency/security scanning without repository administration authority
- Offline/local-first synchronization conflict testing


## Current Working Checkpoint

Last updated: 2026-09-09 UTC
Update authority: Founder-approved working state
Resume phrase: **DIH EVENT MAYA**

### Active engineering-control checkpoint

- Active branch: `copilot/freebird-gallery`.
- Focus slice: governed in-app GitHub authorization controls with owner/allowlist-gated main-merge button and PR fallback when required checks are not green.
- VERIFIED locally on commit `c4aa447`: `npm ci` completed and `npm run verify` passed (lint, tests, continuity/security gates, build).
- Remaining UNVERIFIED until live use: end-to-end OAuth callback with `GITHUB_AUTH_ALLOWED_USERS`, and a successful authorized branch merge through `/api/github/main-push` in a connected deployment.
- Exact first next action: run the connected OAuth flow in preview, then validate one success path (green checks -> merge) and one fallback path (checks not green -> PR link/creation).

### What we were building

The Pocket Office client-vault and context model:

- MAYA is fully available in General mode without a client.
- Executives retain persistent user memory independent of clients.
- Greyed-out client names appear in the Client menu until individually signed in.
- One client sign-in activates the complete MAYA Pocket Office for that client.
- Multiple clients may remain active simultaneously on the Pocket Desk.
- Only the foreground-selected client supplies business, Library, project, session and memory context to executive answers.
- Client-created MAYA work files only to that client's encrypted vault.
- Client sign-out files and closes that client; leaving MAYA files and signs out every active client.
- Vaults are optional, portable, user-controlled and designed for zero RAIN plaintext access.

### Where work stopped

- PR #64 was verified stale and safely closed without merge.
- PR #88 was closed without merge and retained only as a blocked historical design record; its server-readable Supabase implementation is noncanonical.
- PR #96 is the single active implementation PR, created cleanly from current `main` for the governed Pocket Desk context foundation.
- The canonical blueprint now contains a best-effort GitHub PR-history backfill from PR #9 through PR #95, with evidence limits and unresolved legacy branches marked.
- The Client menu, General/client workspace switching, Pocket Desk foreground/background behavior and user-memory/client-memory composition are now recorded in this blueprint.
- The blueprint and repository instructions on `main` now govern future work.

### First next action

Run live preview verification for the new GitHub settings controls and then proceed with the next Pocket Office client-vault slice after this governance flow is proven.

### Resume protocol

When **DIH EVENT MAYA** is invoked:

1. Read founder continuity and this living blueprint from `main`.
2. Present this Current Working Checkpoint before proposing or taking substantive action.
3. Verify the referenced PR, branch, deployment and blocker against live platform state.
4. Continue from **First next action** unless the founder amends direction.
5. Update this checkpoint before ending substantive MAYA work.

### Amendment protocol

- Founder-approved amendments are written into the active blueprint before dependent implementation continues.
- Superseded requirements are removed from the active design so agents cannot follow stale instructions.
- Material deletions or replacements are summarized in the Amendment History below.
- PR descriptions, code comments and implementation documents are then synchronized to the amended blueprint.
- Reversible tooling changes within existing authority may be implemented autonomously, but each must be logged here before or alongside implementation. The entry must state what it replaces or adds, why it is needed, what data it can access, sign-in/permission and cost impact, failure modes, rollback/removal path and verification gate. Ask the Founder first when new credentials, payment, client-data exposure, destructive action or a material product-direction choice is involved.
- A work session is not considered closed until the checkpoint states the verified stop point and first next action.

## Work History Trail

This trail is append-only. The Current Working Checkpoint may be rewritten to show the latest resume state, but completed history entries must not be silently edited or deleted. Corrections are added as new entries referencing the corrected entry.

Each substantive MAYA work session must append:

- UTC date/time
- Trigger or task
- Blueprint sections used or amended
- Live evidence checked
- Changes made
- Verified result
- Stop reason or remaining blocker
- Exact first next action
- Relevant PR, branch, commit and deployment links or identifiers
- Failures, exact error evidence and affected boundary
- Every attempted fix, including unsuccessful attempts
- The fix that resolved the failure, or why it remains unresolved
- Verification performed after each fix
- Regressions introduced or discovered
- Rollbacks, reversals, removals and superseded approaches
- Follow-up debt, owner and next verification gate

Failure-record rules:
- Never rewrite a failed attempt as if it succeeded.
- Never delete a failure because a later fix worked.
- Link each fix to the failure it addresses and each verification to the exact fix tested.
- Distinguish VERIFIED, CONTRADICTED, UNVERIFIED and UNKNOWN claims.
- Builds, green checks, comments and status summaries are not proof of runtime behavior without the required capability test.
- If a fix fails, append the result and next attempt; do not overwrite the prior entry.
- Security, data-isolation, persistence and deployment failures remain visible permanently, including their containment and final resolution.

### 2026-09-02 — PR #64 disposition

- Trigger: DIH EVENT MAYA / finish the PR #64 blocker.
- Evidence: GitHub reported PR #64 open but `mergeable_state: dirty`; current `main` had advanced 33 commits; canonical Vercel production for PR #95 commit `dd86a3f` was READY.
- Change: Added an evidence comment and closed PR #64 without merging.
- Result: Obsolete integration branch safely retired; no conflict merge performed.
- Next: Continue from current mainline rather than PR #64.

### 2026-09-02 — Pocket Office client-vault architecture

- Trigger: Founder clarified MAYA access, client registration, vault isolation, Pocket Desk behavior and menu configuration.
- Blueprint sections amended: Shared Services / Client Vaults; Current Working Checkpoint.
- Evidence: PR #88 used a server-owned Supabase service-role path capable of plaintext access.
- Changes: Blocked that implementation from merge; specified zero-access client-side encryption, ciphertext-only storage, General/user memory, isolated selected-client context, multiple active clients, greyed-out menu names, complete MAYA availability after one client sign-in, closeout, off-site transfer, portability and erasure.
- Result: Product architecture recorded; safe implementation remains incomplete.
- Stop reason: PR #88 is stale/non-mergeable and its storage design conflicts with the zero-access blueprint.
- First next action: Reconcile PR #88 with current `main`, replace server-readable storage with a ciphertext-only design, then implement and verify the Client menu/Pocket Desk contract.

### 2026-09-02 — Founder-first tooling and change-control rule

- Trigger: Founder required that potentially better build tools or necessary architecture changes be brought forward before use and written into the blueprint so later errors can be traced.
- Blueprint sections amended: Blueprint governance; Amendment protocol.
- Change: Prohibited unapproved introduction or replacement of tools, providers, plug-ins, connectors, frameworks and material architecture dependencies.
- Required decision record: purpose, alternatives/tradeoffs, permissions and data access, sign-in impact, failure modes, rollback/removal path, and capability verification.
- Result: APPROVED process rule is active. Research and recommendations are allowed; adoption or connection waits for Founder approval and blueprint entry.
- Failure-trace rule: all implementation errors, failed fixes, regressions and reversals must reference the approving blueprint entry and affected PR/commit/deployment.
- First next action: apply this gate before changing PR #88's encryption/storage approach or adding any supporting dependency.

### 2026-09-02 — Correction: autonomous, traceable tooling authority

- Trigger: Founder clarified that useful tools may be implemented without asking first; the essential requirement is a complete traceable record.
- Corrects: the earlier 2026-09-02 “Founder-first tooling and change-control rule.”
- Active rule: CTO may autonomously add, replace or remove reversible task-relevant tooling within existing authority.
- Mandatory record: purpose, affected boundary, permissions, data access, sign-in and cost impact, PR/commit/deployment, expected test, actual result, errors, attempted fixes, verification and rollback/removal path.
- Founder decision still required before: obtaining or repurposing credentials, accepting payment/cost commitments, exposing client data, destructive or difficult-to-reverse action, or changing material product direction.
- Result: APPROVED amendment recorded. The earlier approval-first wording is superseded and must not govern future routine tooling work.
- First next action: apply this trace-first rule to all tooling used while rebuilding PR #88.

### 2026-09-02 — Initial preapproved-tool register

- Trigger: Founder authorized creation of a preapproved-tool list.
- Blueprint sections amended: Preapproved Tool Register.
- Change: Preapproved routine use of the existing GitHub/Vercel/application stack, local verification tooling, browser/API testing, authoritative research, build-artifact tools and narrowly scoped reversible open-source packages.
- Guardrail: new credentials, costs, client-data transfers, authentication/encryption/storage changes, AI providers, external authority, destructive actions and material product changes still require Founder decision.
- Result: APPROVED register created. This does not install or connect any new external service.
- Verification: blueprint contains explicit purpose, boundary, verification and rollback requirements for each preapproved category.
- First next action: log each actual tool adoption or change against the template while continuing PR #88.

### 2026-09-02 — Candidate-tool watchlist clarification

- Trigger: Founder clarified that the register should also capture tools that may become useful before their exact need or suitability is known.
- Blueprint sections amended: Preapproved Tool Register / Candidate Tool Watchlist.
- Change: Added evidence-labelled discovery statuses and an evaluation template; seeded capability categories relevant to current MAYA risks without selecting providers.
- Result: APPROVED discovery queue created. No candidate was installed, connected or granted access.
- Guardrail: candidates are not treated as working tools; promotion requires a concrete need, boundary review, trace entry and capability verification.
- First next action: evaluate candidates only when a MAYA build requirement or failure creates a concrete trigger.

### 2026-09-02 — PR #88 retired; PR #96 Pocket Desk foundation opened

- Trigger: Founder directed the MAYA build to proceed.
- Blueprint sections used: Current Working Checkpoint; Client Vaults; Core Menu; Permission Rules; Preapproved Tool Register.
- Live evidence: PR #88 was open, `mergeable: false`, `mergeable_state: dirty`, based on stale main, and contained the contradicted server-readable Supabase path.
- Change: Closed PR #88 without merge and labelled it a blocked design record. Created `maya-pocket-desk-context-v1` from current `main` and opened PR #96.
- PR #96 implementation: added a visible `Workspace: General` Pocket Desk control above all tools, an explicit no-client-context state and a Client Workspaces page.
- Security containment: Add/Register remains disabled; no password, key, client record, local fake vault, database table or storage path was introduced.
- Result: PARTIALLY VERIFIED. GitHub `npm run verify`, preview workflow and Vercel Preview Comments all completed successfully for head `124d9847`; browser/mobile capability verification remains pending.
- Failure/reversal record: PR #88 could not be safely reconciled as implementation because it was dirty and architecturally contradicted; replacement-from-main was chosen rather than preserving the unsafe path.
- Rollback: close PR #96 without merge; no production or client data is affected.
- Exact next action: verify PR #96 CI, preview and mobile/desktop browser behavior; fix any failure in the same PR; then design/test zero-access client-side cryptography before enabling registration.
- References: PR #88; branch `maya-supabase-session-vaults`; PR #96; branch `maya-pocket-desk-context-v1`; head `124d9847d48b3b724408de6a5a479b13a2d4de47`.

### Historical Build Backfill — PR #9 forward (recorded 2026-09-02)

Scope and evidence:
- VERIFIED source: GitHub pull-request metadata retrieved from the canonical repository on 2026-09-02 UTC.
- A PR title records the stated change or intent only; it is not proof that the capability worked at runtime.
- `MERGED` verifies GitHub merge state. `CLOSED UNMERGED` verifies the work was not merged through that PR. `OPEN` verifies unresolved branch/PR state.
- Head SHAs identify the inspected PR revisions. They do not prove production deployment or runtime behavior.
- Checks, comments, failure logs, deployments and runtime tests were not uniformly recoverable for every historical PR in this pass. Those details remain UNKNOWN unless separately recorded below or in a later correction entry.
- Missing PR numbers from #9–#95: #10, #13, #26, #33, #34, #35, #36, #37, #38, #39, #40, #41, #69, #89, #91, #92, #93, #94. GitHub returned no pull-request record for those numbers; they may be issues, deleted/unavailable records, or unused numbers, and are not reconstructed.
- This is the best authoritative backfill available from the PR ledger. Later evidence must be appended as a correction/enrichment and must not silently rewrite this ledger.

| PR | Created (UTC) | Verified disposition | Stated intent/title (not runtime proof) | Inspected head |
|---|---|---|---|---|
| [#9](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/9) | 2026-07-23 | MERGED | Working on Maya functionality | `34f36164c9` |
| [#11](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/11) | 2026-08-06 | MERGED | Add GitHub Actions workflows for Vercel production and preview deployments | `333cce1007` |
| [#12](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/12) | 2026-08-07 | CLOSED UNMERGED DRAFT | Skip Vercel deploy steps when VERCEL_TOKEN secret is not configured | `53982e77e8` |
| [#14](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/14) | 2026-08-07 | MERGED | Implementing Anthropocene API for texting | `caac0d2531` |
| [#15](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/15) | 2026-08-08 | CLOSED UNMERGED DRAFT | Fix selectedPostId desync on filter change and add provider validation | `5083852717` |
| [#16](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/16) | 2026-08-09 | CLOSED UNMERGED | Secure private beta access | `14ded297e4` |
| [#17](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/17) | 2026-08-10 | CLOSED UNMERGED DRAFT | Security: stop leaking BETA_INVITE_CODES secrets from beta-validate endpoint | `f147fd3ffa` |
| [#18](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/18) | 2026-08-11 | MERGED | Copilot/connect chat gpt to maya | `326c847ec1` |
| [#19](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/19) | 2026-08-11 | CLOSED UNMERGED DRAFT | feat: add layered CEO intelligence and role memory | `643a5a5f54` |
| [#20](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/20) | 2026-08-12 | CLOSED UNMERGED DRAFT | Fix CEO mobile chat layout and Vercel HTML leakage | `06aed383bc` |
| [#21](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/21) | 2026-08-13 | CLOSED UNMERGED DRAFT | feat: add Gemini as hidden executive intelligence layer | `f8e01c55b9` |
| [#22](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/22) | 2026-08-13 | CLOSED UNMERGED DRAFT | fix: restore executive-first CEO chat interface | `e9f84c6f3d` |
| [#23](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/23) | 2026-08-15 | MERGED | feat: consolidate and harden MAYA private beta foundation | `8bbb8d550b` |
| [#24](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/24) | 2026-08-16 | MERGED | Removing invite-code gate component from the app | `6116a8b9ed` |
| [#25](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/25) | 2026-08-16 | CLOSED UNMERGED DRAFT | Guard Vercel preview deployment when PR secrets are unavailable | `a39d49d1e2` |
| [#27](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/27) | 2026-08-17 | MERGED | Integration: land PRs #23, #24, #16–#17, #19–#22 onto main | `6b2166113a` |
| [#28](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/28) | 2026-08-19 | CLOSED UNMERGED DRAFT | feat: GitHub OAuth integration — connect, read, and write repos from Maya | `c696419430` |
| [#29](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/29) | 2026-08-19 | CLOSED UNMERGED DRAFT | [WIP] Fix missing UI buttons after PR #27 merge | `2ff5bc11c4` |
| [#30](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/30) | 2026-08-21 | MERGED | fix: remove stale beta proxy redirect | `a89717df30` |
| [#31](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/31) | 2026-08-21 | MERGED | feat: simplify CEO page to centered chat | `4fc2a60b1f` |
| [#32](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/32) | 2026-08-21 | MERGED | CTO foundation: secure backend + resilient CEO frontend | `40083e0826` |
| [#42](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/42) | 2026-08-21 | CLOSED UNMERGED | CI: require automated tests before build | `0a8e492744` |
| [#43](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/43) | 2026-08-21 | MERGED | Add founder continuity activation gate | `4acc1904b4` |
| [#44](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/44) | 2026-08-22 | MERGED | Make Strategy Room run real executive adjudication | `282f812f61` |
| [#45](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/45) | 2026-08-22 | CLOSED UNMERGED DRAFT | feat: executive role fidelity + ThinkTank foundation | `ed51018501` |
| [#46](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/46) | 2026-08-23 | MERGED | Security hardening: disable in-app GitHub authority | `25c167e579` |
| [#47](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/47) | 2026-08-23 | MERGED | feat: executive role fidelity on secured baseline | `f92dba88ef` |
| [#48](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/48) | 2026-08-23 | CLOSED UNMERGED | Add automated production test gate | `6c515f6969` |
| [#49](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/49) | 2026-08-24 | MERGED | Add Maya Architecture Blueprint v1 | `729d9b12ca` |
| [#50](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/50) | 2026-08-24 | MERGED | Add standalone CEO executive chassis | `5706884501` |
| [#51](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/51) | 2026-08-24 | MERGED | Add CEO adversarial pushback evaluations | `277bb97034` |
| [#52](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/52) | 2026-08-24 | MERGED | Add standalone CTO executive chassis | `3be8c40296` |
| [#53](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/53) | 2026-08-24 | CLOSED UNMERGED | Add standalone CTO executive chassis | `d2b1fbb879` |
| [#54](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/54) | 2026-08-24 | MERGED | Add CEO↔CTO Maya adjudication contract | `4ca36d8bb2` |
| [#55](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/55) | 2026-08-24 | MERGED | Add executable CEO↔CTO conflict fixtures | `5db7447ec6` |
| [#56](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/56) | 2026-08-24 | CLOSED UNMERGED | Add branch and repository sprawl detector | `6545f6588b` |
| [#57](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/57) | 2026-08-24 | MERGED | security: establish MAYA repository guardrails | `655f84d800` |
| [#58](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/58) | 2026-08-24 | MERGED | security: enforce branch lifecycle in production | `60a7a6ec7c` |
| [#59](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/59) | 2026-08-24 | MERGED | security: purge legacy Copilot branch sprawl | `156407494f` |
| [#60](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/60) | 2026-08-24 | CLOSED UNMERGED | Build Dana CFO and Ari CTO executive chassis | `32f4a6cedc` |
| [#61](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/61) | 2026-08-25 | CLOSED UNMERGED DRAFT | DIH Event Mode: governed incident workspace | `49716a8bef` |
| [#62](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/62) | 2026-08-25 | MERGED | Build Maya executive core and specialist staff | `1339cc5d1a` |
| [#63](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/63) | 2026-08-25 | MERGED | Deepen Maya executive operating profiles | `2a195a0c43` |
| [#64](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/64) | 2026-08-25 | CLOSED UNMERGED | Integrate governed MAYA executives, DIH, and beta access | `dc14fb8ebd` |
| [#65](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/65) | 2026-08-26 | CLOSED UNMERGED | Wire Sam and Admin Secretary operating layer | `498bcf42e5` |
| [#66](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/66) | 2026-08-27 | MERGED | Govern Admin Secretary operating contract | `245cefef32` |
| [#67](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/67) | 2026-08-27 | OPEN | Wire persistent memory, saved sessions, and menu-surface context | `9e35162330` |
| [#68](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/68) | 2026-08-27 | MERGED | MAYA persistent memory foundation — Supabase integration | `25bdeb48f4` |
| [#70](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/70) | 2026-08-28 | OPEN | MAYA workspace persistence boundary and session reads | `9fb800c5ad` |
| [#71](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/71) | 2026-08-28 | OPEN | Build White Boardroom connector foundation | `377d4c9ef4` |
| [#72](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/72) | 2026-08-28 | MERGED | Add Adobe Creative Studio production hub | `ea3db8d7c3` |
| [#73](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/73) | 2026-08-28 | MERGED | Fix mobile executive workspace and add session files | `a1d61c60bb` |
| [#74](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/74) | 2026-08-28 | MERGED | Fix Sessions mobile overflow | `53dfd79974` |
| [#75](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/75) | 2026-08-28 | MERGED | Bind Notion connections to Client Vaults | `bb991ef4f0` |
| [#76](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/76) | 2026-08-29 | OPEN DRAFT | Complete standalone executive backbone and build gates | `8ac48982a2` |
| [#77](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/77) | 2026-08-30 | MERGED | Build MAYA White Boardroom | `c31cd0233c` |
| [#78](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/78) | 2026-08-30 | MERGED | Finish Erica as MAYA's standalone CMO executive | `64976dfc5f` |
| [#79](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/79) | 2026-08-30 | MERGED | Finish Dana as MAYA's standalone CFO executive | `739b0a6c3b` |
| [#80](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/80) | 2026-08-30 | MERGED | Build Ari as MAYA's standalone CTO operating clone | `0d2703f4ea` |
| [#81](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/81) | 2026-08-31 | CLOSED UNMERGED | Add Ari's gated CTO delivery command center | `e4a44be718` |
| [#82](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/82) | 2026-08-31 | MERGED | Restore executive boundaries and enforce full verification | `0609268a82` |
| [#83](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/83) | 2026-08-31 | MERGED | Add Ari's gated CTO delivery command center | `37f7d4e524` |
| [#84](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/84) | 2026-08-31 | MERGED | Restore protected chat API boundary | `4992d0112c` |
| [#85](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/85) | 2026-08-31 | MERGED | Wire Codex coding workspace into DIH continuity | `5d33f2dd03` |
| [#86](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/86) | 2026-08-31 | MERGED | Build authenticated persistent workspace foundation | `5bdac22404` |
| [#87](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/87) | 2026-08-31 | MERGED | Restore no-friction MAYA chat access | `4336939dd2` |
| [#88](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/88) | 2026-08-31 | OPEN | Design zero-access encrypted Pocket Office vaults | `fde4227dfb` |
| [#90](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/90) | 2026-08-31 | MERGED | Add Adobe Fonts library to White Boardroom | `2756aac1b7` |
| [#95](https://github.com/cre8veheart-ai/Maya_with_sidebar/pull/95) | 2026-08-31 | MERGED | Make MAYA own automatic session closeouts | `3530a4a60d` |

#### Historical phase reading (evidence-bounded)

- PRs #9–#31: early functionality, provider/chat integration, beta-access changes, CI/Vercel workflow work and CEO interface iteration. Several proposed fixes/features were closed unmerged; PR #27 explicitly stated an integration purpose, but that title alone does not prove every referenced capability survived intact.
- PRs #32–#49: secure-backend, continuity, Strategy Room, executive-role, repository-security and blueprint foundations. PR #46's stated removal of in-app GitHub authority superseded PR #28's unmerged OAuth proposal at the PR-intent level; runtime enforcement remains UNVERIFIED by this ledger alone.
- PRs #50–#66: standalone executive chassis work, adjudication fixtures, branch/security guardrails, executive core/profile work, DIH work and Admin Secretary governance. PR #53 duplicated the CTO title and closed unmerged; PR #52 is the verified merged CTO PR in that pair.
- PRs #67–#76: persistent memory/session boundaries, Supabase, White Boardroom, Adobe, mobile/session fixes and Client Vault/Notion work. PRs #67, #70, #71 and #76 remain open; therefore none may be assumed canonical over current `main`.
- PRs #77–#95: White Boardroom, standalone CMO/CFO/CTO work, protected chat, Codex/DIH continuity, authenticated persistence, no-friction access, client vaults, Adobe Fonts and automatic session closeouts. PR #88 remains open and its earlier server-readable vault path is explicitly blocked by the zero-access amendment.
- Verified reversal/fix signals from disposition and titles: #24 removed the invite-code gate after earlier beta-access work; #30 removed a stale beta proxy redirect; #46 disabled in-app GitHub authority after the unmerged #28 proposal; #82 stated restoration of executive boundaries; #84 stated restoration of the protected chat boundary; #87 restored no-friction access after #86 introduced authenticated persistence. These are verified historical change claims and merge states, not complete runtime proofs.
- Known unresolved legacy branches at backfill time: #67, #70, #71, #76 and #88. They require reconciliation or closure; their descriptions cannot override this blueprint.
- Known verified disposition already investigated in depth: PR #64 was stale/dirty and closed without merge on 2026-09-02. PR #88's server-readable design was contradicted by the founder-approved zero-access requirement and marked do-not-merge.

#### Backfill failures, limitations and next enrichment gate

- Failed attempt: the first all-PR API retrieval produced output too large for a reliable working capture.
- Fix: repeated the same authoritative GitHub collection request and reduced it to compact metadata fields before writing the ledger.
- Verification after fix: 65 PR records from #9 through #95 were parsed; each ledger row includes number, creation date, disposition, title and head SHA.
- Remaining UNKNOWN: exact code delta, CI result, preview/production deployment, runtime result, regression, failure log and corrective commit for many individual PRs.
- Next enrichment gate: when a historical PR becomes relevant to active work, fetch its diff, comments, checks and linked deployment, then append a dated correction/enrichment entry using VERIFIED / CONTRADICTED / UNVERIFIED / UNKNOWN.
- No historical title, body, green check or READY deployment may be promoted to runtime proof without the corresponding capability test.

### Amendment History

- 2026-09-08: Applied one Founder-authorized production rule to all engineering agents. Claude and Ari may build branches and pull requests; a merge to `main` requires Leslie's fresh approval for the exact latest commit, and later commits invalidate prior approval.
- 2026-09-08: Founder Leslie personally discovered and ordered removal of repository hardening and automatic branch-deletion controls. Established Founder authority over repository-local policies; conflicts now require disclosure and Founder decision rather than an automatic stop.
- 2026-09-02: Made the blueprint the living build authority on `main`.
- 2026-09-02: Established General user memory plus isolated foreground-client context.
- 2026-09-02: Established multiple active Pocket Desk clients with zero background context contribution.
- 2026-09-02: Rejected server-readable client-vault plaintext; required client-side encryption and ciphertext-only storage.
- 2026-09-02: Established client menu activation, closeout, off-site transfer, portability and erasure rules.
- 2026-09-02: Initially required Founder approval before tooling changes; superseded later the same day.
- 2026-09-02: Authorized autonomous reversible tooling changes within existing authority, with mandatory blueprint traceability and Founder approval retained for credentials, costs, client-data exposure, destructive action and material product-direction changes.
- 2026-09-02: Created the initial preapproved-tool register and mandatory per-tool trace template.

## 1. Platform Rule

Maya Core is the stable frame. Major capabilities are built as separable plug-in modules or shared services inside the same private repository unless and until there is a clear reason to extract them.

Every feature must answer four questions before build:
1. Where does it live?
2. What does it own?
3. What does it connect to?
4. What permissions does it have?

If an architectural choice has meaningful tradeoffs, stop and discuss options before hard-wiring the decision.

## 2. Maya Core — Locked Frame

Core responsibilities:
- Authentication and session handling
- Secrets handling
- Founder continuity
- Permission policy and least privilege
- Maya orchestration and adjudication
- Deployment gates and CI verification
- Alerts and auditability
- Shared application shell and navigation

Rule: Core changes require deliberate review. Feature code should not casually leak into Core.

## 3. Executive Suite — Standalone Plug-ins

Each executive is a standalone agent module with its own:
- Identity and executive contract
- Scope and authority
- Role-specific reasoning instructions
- Model/runtime configuration
- Tool permissions
- Context and memory boundaries
- Tests/evals
- Structured interface back to Maya

Maya coordinates executives; executives do not depend on being embedded inside Maya Core.

Planned executive modules:
- CEO — reference/gold-standard executive chassis; build first
- CTO — architecture, security, engineering, deployment, technical risk
- CFO — budget, runway, ROI, pricing economics, financial risk
- CMO — market, positioning, GTM, campaigns, growth strategy
- COO — operations, delivery, dependencies, execution
- CIO — information architecture, data strategy, intelligence
- CRO — revenue, pipeline, conversion, expansion
- Creative Director — visual/message quality and brand execution
- HR — people operations and workforce policy
- Legal — contracts/compliance review and legal-risk flagging
- Office Admin — routine office coordination and approved execution
- Executive Assistant — founder-facing triage, scheduling, preparation and follow-through

Strategy Room is an orchestration surface, not an executive. Executives analyze independently; Maya weighs disagreement and adjudicates rather than averaging.

Titans Council remains Phase 2 until the ordinary Strategy Room is proven.

## 4. Shared Maya Services

Executives use shared services through controlled interfaces. Shared capabilities are built once and are not duplicated inside each executive.

### Email
Shared communication service for read, draft, queue, approval, send and thread linkage.
Connects to: Executive Assistant, Office Admin, CMO, CEO, Client Vaults, Campaigns, Projects.
Architecture choice later: provider adapter strategy and external-send approval thresholds.

### Campaigns
One campaign engine for planning, assets, approvals, scheduling, execution and results.
Connects to: CMO, Creative Director, Legal, CFO, Analytics, Email, Website.
Rule: CMO owns campaign strategy; Campaign Service owns execution plumbing.

### Projects
Project containers, milestones, owners, dependencies, status and linked artifacts.
Connects to: COO, CTO, CEO, Executive Assistant, Tasks, Meetings, Whiteboard.

### Client Vaults
Client-specific documents, history, decisions, campaigns and controlled context.
Connects to: every MAYA executive and menu tool, Projects, Library, Email, Meetings and the Pocket Desk.

Authoritative workspace and memory rules:
- MAYA remains fully available in General mode with no client active.
- Executives maintain persistent user memory independent of clients: user-approved preferences, working style, goals, decisions, general projects and prior General sessions.
- Signing a client in activates the complete MAYA Pocket Office for that client; it does not limit which executives or menu tools are available.
- Multiple clients may remain active simultaneously on the Pocket Desk, but exactly one workspace is foreground-selected at a time: General or one active client.
- Selecting a client supplies that client's authorized business information, Library, imported materials, projects, sessions, prior work, decisions, recommendations and client memory as context for executive answers.
- In client mode, executive context is user memory plus only the foreground-selected client's authorized context. Active background clients contribute zero context.
- New memories and work created in a client workspace are scoped and filed only to that client and project.
- Client information never enters user/general memory without an explicit user-directed promotion.
- Switching clients atomically replaces prompt context, retrieval results, caches, drafts, memory namespace and filing destination; no cross-client blending is permitted.
- Signing a client out files and closes only that client. If no clients remain selected, MAYA returns to General mode with all tools available and user memory intact.
- Leaving MAYA files and signs out every active client independently, clears decrypted client state and keys, and returns client names to greyed-out.
- Client vault removal, transfer or erasure never deletes the user's General memory.

Vault rule: optional client-side encryption, user-held credentials and keys, zero RAIN plaintext access, strong tenant isolation, user-directed portability and permanent erasure.

### Website Dashboard
Maya-native control surface for website content, status, analytics and approved publishing.
Connects to: CMO, Creative Director, CTO, Analytics.
Recommended staged authority: read/preview first; controlled publish later.

### Calendar
Shared meetings, availability, reminders and approved scheduling.
Connects to: Executive Assistant, Office Admin, COO, Projects, Maya Live.

### Phone + Alerts
Founder-facing alert surface.
Green = answered/complete. Yellow = waiting.
Keep alerts minimal: person/item + state + tap-through to underlying work.

### Analytics / Intel
Shared evidence and intelligence service.
Connects to: CIO, CFO, CMO, CRO, Vaults, Campaigns, Website.
Rule: separate raw data adapters from executive interpretation.

## 5. Whiteboard Room — Visual Workbench

Whiteboard Room is a first-class Maya workspace, not just a drawing page.

Core capabilities:
- Persistent collaborative canvases
- Freeform notes, diagrams, decision cards, assets and files
- Campaign boards
- Strategy boards
- Creative/mood boards
- Art curation boards
- Live-build boards
- Saved boards/stacks
- Reusable templates

Presentation rule:
Whiteboard work should be structurally exportable into presentation form without rebuilding from scratch.

Planned presentation outputs:
- PowerPoint-compatible deck generation/export
- PDF briefing
- Presenter mode

Architectural decision later: PowerPoint-native generation vs structured deck model with exporters.

## 6. Maya Live — Human + AI Collaboration Platform

Maya owns the branded experience. External infrastructure may power selected realtime plumbing behind the curtain.

Modes:
- Office Meetings
- Presentation Mode
- Podcast Mode
- Later: Broadcast/Webinar Mode

### Office Meetings
Humans and AI agents can join by invitation.

Meeting flow:
Invite Portal -> Lobby -> Live Room -> Workspaces -> Decisions/Tasks/Artifacts -> Follow-up

Host controls:
- Invite/remove participants
- Mic on/mute
- Camera on/off
- Mute all
- Screen sharing
- Workspace sharing
- Make Presenter / revoke presenter
- Recording controls if enabled
- End meeting

Human guests/vendors:
- Meeting-scoped access only
- No inherited access to Maya, executives, secrets, GitHub, vaults or other projects

AI participants:
- Can be active/silent
- Can present/observe
- Can share approved workspaces when host-authorized
- Do not gain broader permissions because they joined a meeting

Security rule:
An invitation grants access to the meeting, not to Maya.

### Presentation Mode
Clean presenter surface for slides, Whiteboard, project demos and live builds.
Editing clutter hidden while presenting.

### Podcast Mode
Maya-branded live podcast environment with:
- Host + human guests + AI executive/agent guests
- Green room/backstage
- Mic controls
- Screen/media sharing
- Recording
- Transcript if enabled
- Chapter markers
- Clips/highlights
- Show notes
- Post-show assets to Library

External distribution destinations are modular and decided later.

## 7. Art Gallery Module

The Art Gallery is a real HTML website/module, not a Whiteboard page.

Separation of concerns:
- Gallery = destination
- Whiteboard = curation/workspace
- Viewing Room = immersive inspection
- Projection Room = immersive exhibition experience

### HTML Gallery
Public or selectively private gallery website.
Supports artwork, collections, statements and exhibition navigation.

### Viewing Room
A client can take an individual piece into a dedicated room.

Capabilities:
- Virtual gallery-light dimmer
- Ambient lighting controls
- Focused artwork illumination
- Wall/background presentation options
- Scale/zoom
- Optional frame/mat visualization
- Title and artist statement

Rule: environmental lighting changes must not alter the underlying artwork file.

### Immersive Projection Room
Van-Gogh-experience-style presentation layer.

Capabilities may include:
- Large-scale projection across virtual walls/surfaces
- Multi-surface layouts
- Sequenced works
- Transitions
- Optional sound/narration
- Virtual preview of a physical exhibition package

Later decision gates:
- Browser-only immersive mode
- Actual projector output
- Multi-projector synchronization
- Projection mapping
- AR/room-scale visualization

## 8. Core Menu / Navigation Frame

Current known menu structure includes:

Core:
- Home
- Community
- Tasks
- Search

Executive Suite:
- CEO
- COO
- CMO
- CFO
- CTO
- CIO
- CRO
- Creative Director
- HR
- Legal
- Office Admin
- Strategy Room
- Titans Council (Phase 2)

Library:
- Sessions
- Saved Files
- Knowledge Vault
- Intel Vault

Operations:
- Decisions
- Campaigns
- Tool Sandbox

Platform:
- Settings

Planned/additional Pocket Office menu capabilities:
- Whiteboard Room (foldout)
- Projects
- Client Vaults
- Email
- Website Dashboard
- Maya Live / Office Meetings
- Calendar
- Phone + Alerts
- Executive Assistant
- Art Gallery

Menu rule: avoid top-level clutter. Use foldouts for related workspaces and modes.

## 9. Data and Object Rules

Prefer shared objects rather than copies.
Examples:
- One Task object referenced by Project, Executive and Meeting
- One File object referenced by Campaign, Client Vault and Whiteboard
- One Decision record referenced by Strategy Room, Project and Session
- One Email thread linked to Client, Campaign and Project as needed

This prevents fragmentation and duplicate truth.

## 10. Permission Rules

Default: least privilege.

Permissions are scoped separately for:
- Reading
- Drafting
- Editing
- Sending/publishing
- Tool execution
- Financial actions
- Repository/deployment actions
- Meeting participation
- Screen/workspace sharing
- Client/Vault access

Speaking/presenting permission never implies data/tool permission.
Meeting access never implies platform access.
Executive authority never bypasses Maya Core security policy.

## 11. Build Order

1. Freeze/maintain Maya Core
2. CEO standalone chassis
3. CEO adversarial/eval tests
4. CTO standalone module
5. CEO + CTO Strategy Room conflict tests
6. CFO
7. CMO
8. COO
9. CRO
10. CIO
11. Creative Director
12. Legal / HR / Admin / Executive Assistant
13. Shared services in priority order
14. Whiteboard Room
15. Maya Live / Office Meetings
16. Art Gallery + Viewing Room
17. Immersive Projection Room
18. Broader broadcast/distribution capabilities

The build order may change for product priority, but architecture rules stay stable.

## 12. Decision Gates — Discuss Before Locking

The following are intentionally undecided until implementation requires them:
- OpenClaw/runtime strategy per executive
- Base model/provider per executive
- Realtime meeting infrastructure
- Video/audio/screen-share provider
- PowerPoint generation/export architecture
- Email provider adapter architecture
- Database/storage choices for new services
- Realtime Whiteboard collaboration technology
- Recording/transcription stack
- External livestream/podcast destinations
- Projector/multi-projector implementation
- AR support
- Whether any module later deserves its own repository/deployment

At each gate: present viable options, consequences, recommendation, then choose deliberately.

## 13. Architectural North Star

Stable Core -> Modular Capabilities -> Shared Services -> Controlled Connections -> One Source of Truth

Maya should feel like one seamless Pocket Office while remaining modular, testable, secure and replaceable under the hood.

## 14. Claude Engineering Access

Founder decision — 2026-09-05 (supersedes the restrictive 2026-09-04 Claude policy):

- Claude uses Anthropic's standard Claude Code GitHub Action behavior and normal working tools.
- Claude has repository contents, issues and pull-request read/write authority through the installed GitHub integration and may inspect code, edit files, run commands and tests, create commits and branches, open or update pull requests, and inspect CI.
- No repository instruction may silently reduce Claude to review-only mode or substitute a custom restricted tool profile for Anthropic defaults.
- The official Vercel MCP connection is available to Claude project sessions. Each Claude environment must complete Vercel OAuth when first prompted; credentials are never committed to the repository.
- Claude-created branches and pull requests may trigger preview builds through the canonical GitHub-to-Vercel integration.
- Granted technical permission and authorization to use it are separate. Claude and Ari may inspect, edit, test, branch, and open or update pull requests without separate merge permission.
- Production authority remains with Founder Leslie. Claude may merge an eligible pull request only after GitHub user `cre8veheart-ai` posts the exact comment `@claude merge` on that pull request after its latest commit.
- Ari/Codex may merge an eligible pull request only after GitHub user `cre8veheart-ai` posts the exact comment `@ari merge` after its latest commit, or Leslie gives an explicit current-turn instruction naming that exact pull request and directing its merge.
- Any later commit invalidates an earlier merge authorization. A fresh authorization is required for the new final commit.
- Pull-request preview deployments remain automatic and reversible. Production may come only from `main` after the Founder-authorized merge; green checks or a READY preview are not themselves merge permission.
- Standard engineering safeguards remain: do not expose secrets, do not copy client-vault plaintext into engineering context, report failures accurately, and preserve one canonical repository and deployment path.

### Work History Trail — 2026-09-08 Founder-authorized agent merges

- Founder authorization: Claude and Ari may perform normal engineering work and create pull requests; either may merge to the Vercel production path only with Leslie's permission for the exact final PR state.
- Change: PR #111 adds a fresh post-commit `@claude merge` gate, limits the `@claude` workflow caller to `cre8veheart-ai`, removes unused OIDC permission, pins the Anthropic action, and records the equivalent `@ari merge` operating rule in `AGENTS.md`.
- Data and permission boundary: no credential is added; work remains confined to approved feature/fix branches, and client-vault plaintext remains prohibited.
- Verification: VERIFIED on code commit `bc45e5a4cb37c81bc36be7b0968891187a58a063` — GitHub Actions run `34276400392` passed full verification and the Claude MCP security job; both Vercel previews reported successful deployment.
- Remaining live proof: Claude's first branch/PR creation and the first Founder-approved production merge remain UNVERIFIED until exercised.
- Exact next action: verify the final documentation-only commit, mark PR #111 ready, then obtain Leslie's fresh merge authorization.

### Work History Trail — 2026-09-09 authorized main-push workflow

- Trigger/task: implement owner-authorized “Authorize + Push to Main” flow with fresh re-auth, required-check gating, explicit confirmation and PR fallback.
- Blueprint sections used: §10 Permission Rules, §14 Claude Engineering Access, Current Working Checkpoint/Work History governance.
- Live evidence checked: existing GitHub OAuth/status/write routes, repository validation gates (`npm ci`, `npm run verify`), and current settings runtime state.
- Changes made: added `/api/github/main-push` guarded merge route; added GitHub auth/user allowlist and main-push allowlist config helpers; enforced optional OAuth login allowlist in callback; exposed main-push capability via status route; added in-app settings controls for authorize/disconnect and main-push confirmation; documented new env variables in `.env.example`.
- Verified result: VERIFIED locally on branch `copilot/freebird-gallery` at commit `c4aa447` with passing `npm run verify`; build includes `/api/github/main-push` route.
- Stop reason or remaining blocker: live OAuth and merge behavior remain UNVERIFIED until exercised in a connected preview/production-like environment with real GitHub app credentials.
- Exact first next action: run one connected success path and one fallback path to confirm audit logging, stale-auth rejection and PR fallback behavior.
- Relevant branch/commit/deployment identifiers: branch `copilot/freebird-gallery`, commit `c4aa447`; no deployment executed in this session.
- Failures and fixes: lint surfaced one navigation warning for `window.location.href` in settings; fixed by switching to `useRouter().push`; post-fix verification passed.

### Work History Trail — 2026-09-05 Claude access restoration

- Founder authorization: remove the Claude-specific restrictions and restore Anthropic-default working capabilities across MAYA sessions and builds.
- Changes: replaced the review-only Claude workflow with Anthropic's standard write-enabled workflow; removed the restrictive `CLAUDE.md`; restored GitHub OAuth repository/workflow scopes and the runtime write endpoint; added the official Vercel MCP project connection.
- Verification target: full repository verification, Claude `@claude` branch/PR test, and a Vercel preview build from that branch.
- Remaining external step: a Claude environment may require a one-time Vercel OAuth approval before direct Vercel MCP tools appear. This is an external account authorization, not a repository restriction.

### Work History Trail — 2026-09-04 governed Claude access

- Evidence: current `main` at `8493459c5e09287859b06703a08769502989f529` has an unprotected branch, an existing full-verification workflow, Vercel preview/production workflows, and a branch-lifecycle rule rejecting `copilot/*` branches.
- Change: created `feature/governed-claude-access`; added `.github/workflows/claude.yml` and `CLAUDE.md`.
- Result: VERIFIED that both files coexist on branch commit `bc7c5247a6dac12625b683ecab11fa2c5e002834`. Runtime Claude invocation remains UNVERIFIED until the workflow is merged to the default branch and a Founder-authored `@claude` test is executed.
- Security boundary: workflow trigger is restricted to GitHub actor `cre8veheart-ai`; production deploy, merge, secrets changes, and repository administration are prohibited in Claude instructions.
- Unresolved blocker: `main` remains unprotected. Branch protection must be enabled before this path is considered production-ready.
- Exact next action: open the governed Claude PR, require full verification, then enable `main` protection before merge and run a Founder-authored `@claude` test.
