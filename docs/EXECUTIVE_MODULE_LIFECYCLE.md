# MAYA Executive Module Lifecycle

## Purpose

MAYA executives are built and tested as bounded modules before they are trusted as embedded platform capabilities. The platform owns governance, identity, memory boundaries, evidence rules, and approval gates. An executive owns role-specific reasoning and behavior inside those boundaries.

## Temporary workbench rule

A branch is a temporary workbench, not an unlimited hangout.

For each bounded executive improvement:

1. Define the exact executive capability or defect being worked.
2. Use one temporary branch and one attached PR.
3. Build only the scoped change on that branch.
4. Exercise the executive in the sandbox with deliberate stress cases.
5. Patch and retest on the same branch.
6. Verify the rendered behavior and evidence, not only build status.
7. Merge only after human approval.
8. Verify the production deployment separately.
9. Delete the completed branch.
10. Move to the next sidebar room only after the prior workbench is cleared.

Default repo discipline: no more than one or two active PR workbenches unless a genuinely independent blocking need exists.

## Executive maturity path

### 1. Draft
Role chassis, hard goal, boundaries, and intended capabilities exist but are not trusted.

### 2. Sandbox
The executive is exposed to adversarial, ambiguous, contradictory, incomplete, and high-pressure scenarios. Failures are expected and should not mutate production state.

### 3. Preview
The same branch/PR state is rendered in a deployable preview environment. Mobile behavior, memory isolation, provider behavior, tool boundaries, and actual UI state are tested.

### 4. Approved
Human review confirms that the executive meets its role contract and does not cross governance boundaries.

### 5. Embedded
The executive is fused into MAYA navigation and governed runtime as a first-class executive.

### 6. Retired
The module is disconnected without corrupting MAYA core state or other executive memory.

## Hosting modes

- **embedded** — executive runs within MAYA's application/runtime boundary.
- **remote-service** — executive reasoning service is hosted separately and called through a governed adapter.
- **hybrid** — policy, identity, memory, approval, and UI remain in MAYA while some reasoning or specialized workloads run externally.

Remote hosting must never transfer MAYA's governance authority to the remote service.

## Stress-test dimensions

Every executive should be tested for:

- role fidelity under user pressure
- evidence vs inference separation
- contradiction handling
- refusal to fabricate verification
- memory isolation
- correct escalation to another executive or human
- tool permission boundaries
- graceful provider/service failure
- ability to be disconnected cleanly
- mobile and toolbar usability
- sustained multi-turn coherence
- DIH incident behavior when system claims conflict with observed reality

## Customizable executive boundary

A future user-customizable executive may customize role name, domain expertise, tone, goals, allowed knowledge, workflows, tools, and stress tests. It may not customize or disable MAYA platform invariants: human approval gates, permission ceilings, evidence classification, memory isolation, auditability, or the rule against self-certifying system state.

The customizable executive should be built only after the fixed executives have taught us which traits are safely variable and which are structural platform requirements.
