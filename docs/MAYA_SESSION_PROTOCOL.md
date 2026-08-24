# MAYA SESSION PROTOCOL

Status: Working continuity protocol
Owner: Founder
Technical lead: Ari / CTO

## Purpose

Keep Maya work recoverable across sessions without reconstructing the project from conversation history.

## Code Phrase

**DIH EVENT MAYA**

When this phrase is used, treat it as a request to recover the canonical Maya working context and continue from the latest recorded checkpoint.

Recovery sequence:
1. Locate the canonical private Maya repository.
2. Locate the current Maya architecture blueprint and active working branch/PR.
3. Read the latest session checkpoint.
4. Confirm the last completed build edge, unresolved decisions, and next approved action.
5. Continue from that point unless the Founder changes direction.

## Canonical Architecture Source

Primary blueprint:

`docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md`

The architecture blueprint is the source of truth for:
- Maya Core
- Executive Suite
- Shared Maya Services
- Whiteboard Room
- Maya Live / Office Meetings
- Podcast and presentation modes
- Art Gallery / Viewing Room / Immersive Projection Room
- Menu/navigation architecture
- Shared object rules
- Permission rules
- Build order
- Decision gates

Related visual/product blueprints should remain associated with the Maya architecture rather than becoming independent competing specifications.

## Session Checkpoint Rule

Before a Maya build session ends, record:
- Date/time
- Current branch and PR
- What was built or changed
- What was tested
- What passed/failed
- Security/permission changes
- Open architectural decisions
- Exact next build step

A chat session ending must not be treated as the end of Maya's working state.

## Working Branch Rule

Use one canonical Maya working branch/PR for the active architecture work whenever practical. Do not create duplicate Maya repositories or shadow deployments merely to continue work.

## Build-vs-Chat Rule

A Maya conversation does not itself authorize a code change. Design discussion can remain conversational. Code changes occur only when the Founder explicitly asks to build, implement, fix, test, commit, merge, deploy, or otherwise act on the repository.

## Decision Gate Rule

When an implementation choice has meaningful tradeoffs, stop before hard-wiring it. Present the viable options, consequences, and CTO recommendation, then record the chosen decision in the architecture blueprint.

## Continuity Principle

Ari should preserve durable Maya working context across sessions to the extent supported by the system. The repository blueprint and session checkpoints provide the concrete source of truth when conversational memory is incomplete.

## Current Recovery Target

Architecture blueprint PR: **#49**

Active architecture branch: **`ari/maya-architecture-blueprint-v1`**

Current build edge: **CEO standalone executive chassis** after the architecture blueprint is established.

Next sequence:
1. CEO chassis
2. CEO adversarial/evaluation tests
3. CTO standalone module
4. CEO + CTO Strategy Room conflict tests

## North Star

**Stable Core -> Modular Capabilities -> Shared Services -> Controlled Connections -> One Source of Truth**

Maya should feel like one seamless Pocket Office while remaining modular, testable, secure, and replaceable under the hood.
