# MAYA Memory Architecture Map v1.0

Status: implementation map for persistent memory and saved sessions
Parent blueprint: `docs/MAYA_ARCHITECTURE_BLUEPRINT_V1.md`

## Core rule

Every meaningful MAYA surface can create or reference memory, but memory is never one undifferentiated pool. All records are scoped by workspace and then, where applicable, by executive, client, project, session, or surface.

Every saved session records the menu item / surface where the work happened. A session can also link to a client vault, project, participating executive(s), decisions, tasks, files, connector objects, and external-host artifacts.

External hosts remain authoritative for objects they own. MAYA stores references, metadata, permissions, summaries/indexes, and approved durable knowledge rather than duplicating external truth unnecessarily.

## Memory layers

1. Workspace shared memory — founder-approved facts, organization rules, shared decisions, durable preferences, common knowledge.
2. Executive private memory — isolated role-specific working memory for CEO, COO, CMO, CFO, CTO, CIO, CRO, Creative Director, HR, Legal, Admin, Executive Assistant and later custom executives.
3. Client Vault memory — isolated per-client history, documents, decisions, campaigns, meetings, contacts, projects and approved context.
4. Project memory — goals, milestones, owners, blockers, dependencies, decisions, tasks, sessions and artifacts.
5. Session memory — full transcript plus menu surface, participants, client/project links, files, decisions, actions and resume point.
6. Surface memory — durable state owned by a specific MAYA menu/workspace, such as Whiteboard boards, Campaign state, Gallery curation state, or Website dashboard state.
7. Artifact/file memory — metadata and relationships for files; large binaries live in object/external storage and are indexed for retrieval.
8. Connector memory — references to external email, calendar, contacts, repositories, cloud documents, websites, finance/CRM/analytics objects.
9. Audit memory — permissions, promotions to shared memory, supersedes, archives, deletions, connector sync state and security events.

## Menu / surface map

### Core

- Home: workspace summary, active items, recent sessions, alerts. Reads shared/project/client/session indexes; stores only lightweight UI state.
- Community: community discussions, suggestions, moderation state and linked sessions. Surface-scoped memory; durable posts may live in a shared service.
- Tasks: shared Task objects with owner, client/project/session links, status and history.
- Search: retrieval surface only; stores saved searches/preferences if explicitly saved, not duplicate content.

### Executive Team

Each executive surface has private executive memory plus permissioned access to shared, selected client and selected project memory. Sessions record `surface=executive:<role>`.

- CEO / Max: strategic decisions, board context, cross-functional priorities.
- COO / Sam: execution plans, dependencies, blockers, owners, delivery state.
- CMO: positioning, GTM, campaigns, audience and channel learning.
- CFO / Dana: budgets, models, assumptions, ROI, financial risk and portfolio context.
- CTO / Ari: architecture, security, engineering decisions, deployment and technical risk.
- CIO: information architecture, data sources, intelligence quality and governance.
- CRO: pipeline, conversion, revenue expansion and account context.
- Creative Director: brand, creative direction, assets and review history.
- HR: people operations and approved workforce policy; strict private boundaries.
- Legal: legal review context and risk flags; strict private boundaries.
- Office Admin: approved routine coordination and office operations.
- Executive Assistant: founder-facing triage, scheduling, preparation and follow-through.
- Strategy Room: multi-executive session surface. Keeps participating roles, independent analyses, Maya adjudication, final decision and rejected alternatives.
- Titans Council: same pattern later, with stronger governance and explicit Phase 2 gate.

### Specialist Staff

- Mimi / Gallery Sales: gallery/client sales context, artwork interest, approved contact history and gallery sessions.
- Custom Agent: isolated private memory namespace per custom agent plus explicitly granted shared/client/project context.

### Library

Library may use an external large-file host/object store. MAYA owns the metadata, permission, relationship and retrieval index layer.

- Sessions: canonical session index and resume records.
- Saved Files: file metadata, versions, owners, links and external/object-storage pointer.
- Knowledge Vault: curated durable knowledge promoted from sessions, files, connectors or executive work.
- Intel Vault: evidence/intelligence records with provenance, date, source and confidence/freshness metadata.

### Operations

- Decisions: canonical Decision objects linked to session, project, client and Strategy Room; supports superseded/active state.
- Campaigns: campaign strategy, assets, approvals, schedule, execution state, results and linked CMO/Creative/Legal/CFO memory.
- Tool Sandbox: ephemeral by default; only explicitly approved outputs are promoted to durable memory.

### Pocket Office / additional surfaces

- Projects: canonical project containers with persistent project memory.
- Client Vaults: isolated tenant/client memory; never cross-client by default.
- Email: external provider remains source of truth; MAYA stores thread references, metadata, links, drafts/approvals and promoted knowledge.
- Calendar: external provider remains source of truth; MAYA stores event references, links, preparation/follow-up and approved meeting memory.
- Phone + Alerts: alert state and call references; transcripts/notes only if enabled and permissioned.
- Website Dashboard: site/page references, publishing state, analytics links and approved changes.
- Whiteboard Room: external/realtime host may own canvas payloads. MAYA stores board IDs, access, snapshots/versions, linked decisions/tasks/files and indexed text/objects for retrieval.
- Maya Live / Office Meetings: meeting-scoped access, transcript/recording references if enabled, participants, decisions, tasks, artifacts and follow-up.
- Art Gallery: artwork/collection metadata, curation state, client viewing history where appropriate, statements and exhibition configuration. Underlying artwork binaries remain immutable.
- Viewing Room / Projection Room: session/configuration state and references to artwork/media; media may be externally hosted.
- Settings: preferences, permissions and connector configuration metadata; secrets remain in secret storage and are never written into conversational memory.

## Saved session schema requirements

Every durable session must support:
- workspace ID
- session ID
- title
- originating menu item / surface ID
- session type
- participating executive roles / agents
- selected client ID (optional)
- selected project ID (optional)
- full transcript or canonical transcript reference
- linked decisions/tasks/files/external objects
- created/updated timestamps
- resume / handoff state
- memory promotions made from the session

## Large files and outside-host rule

Large files, whiteboards, recordings and other heavy objects are not stored inside chat/session records.

Pattern:
`MAYA metadata + permission + relationship + retrieval index -> external/object-storage object`

MAYA should be able to retrieve the relevant text/chunks/metadata while preserving the authoritative original and version history.

## Connector rule

All connectors use adapters. Connector objects are normalized into MAYA references with provider, external ID, object type, title, timestamps, client/project/session links and role visibility. External systems remain authoritative unless a MAYA-native object is explicitly created.

## Governance

Memory operations: create, update, promote-to-shared, link, supersede, archive, delete/forget, lock, export and audit.

No executive receives another executive's private memory merely because both can access MAYA. No client vault is visible to another client. A shared object is promoted deliberately and remains one source of truth rather than being copied into multiple memory stores.
