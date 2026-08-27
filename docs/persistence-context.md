# MAYA persistence context

MAYA persistence is scoped by an authenticated user and the workspace they own. A Client Vault is an optional narrower context inside that workspace.

Hierarchy:

`authenticated user -> open MAYA workspace -> optional active Client Vault -> executive/session`

Rules:
- A general executive session belongs to the open MAYA workspace.
- A session started while a Client Vault is active belongs to that client via `sessions.client_id`.
- A client identifier is accepted only after verifying that the client belongs to the resolved workspace.
- Browser-provided workspace/client identifiers are selectors, never proof of authorization.
- Privileged Supabase service-role access remains server-only.
- API routes must resolve the authenticated user before calling `resolveMayaPersistenceContext`.
- Until an authenticated user resolver exists, persistent Library APIs must fail closed rather than trust a browser header.
