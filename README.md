# Maya with Sidebar

Maya is an invite-only executive workspace with role-specific AI chat and community feedback features.

## Private beta setup

The beta fails closed until all required production variables are configured.

1. Install an [Upstash Redis integration](https://vercel.com/marketplace?category=storage&search=redis) through the Vercel Marketplace. Vercel KV is no longer first-party.
2. Set the following in the project's production environment:

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Enables the default AI provider. |
| `BETA_INVITE_CODES` | Comma-separated invite codes. Store only codes you are prepared to consume once. |
| `BETA_SESSION_SECRET` | Unique 32+ character secret used to sign beta sessions. |
| `KV_REST_API_URL` | Upstash Redis REST endpoint. |
| `KV_REST_API_TOKEN` | Upstash Redis REST credential. |

Generate a session secret locally:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Configure these values in [Environment Variables](https://vercel.com/docs/projects/environment-variables), then redeploy.

### Access behavior

- A valid invite code is redeemed atomically in Redis and cannot be used again.
- Redemption issues an HTTP-only, same-site session cookie valid for 14 days.
- Protected pages redirect unauthenticated visitors to the invite screen.
- `/api/chat` requires that signed beta session.
- Chat is capped at 20 requests per session per hour. The current implementation is process-local; use Redis-backed rate limiting before scaling beta traffic.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Fill every beta variable in `.env.local`; invite redemption requires a reachable Upstash Redis REST database. Run checks before opening a PR:

```bash
npm run build
npm run lint
```

## Claude GitHub MCP access

This repository now includes a project-scoped Claude MCP configuration in `/home/runner/work/Maya_with_sidebar/Maya_with_sidebar/.mcp.json`.

- It uses the official `ghcr.io/github/github-mcp-server` Docker image.
- It passes through a locally exported `GITHUB_PERSONAL_ACCESS_TOKEN`, so Claude can use GitHub read/write MCP tools without committing a token to the repository.
- It affects Claude engineering tooling only; MAYA product runtime GitHub authority remains disabled.

To use it:

1. Install Docker and make sure it is running.
2. Create a GitHub token with the minimum repository permissions Claude needs for your work. For repository write tasks, that usually means repository contents read/write and pull requests read/write for this repository.
3. Export the token before launching Claude:

   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_GITHUB_PAT
   ```

4. Open Claude in this repository.
5. Restart Claude so it loads the project MCP servers.
6. Run `claude mcp list` if you want to confirm the server is available.

The token stays local to your machine. It is not stored in the repository or exposed to MAYA's product runtime.

## Current beta limitations

- User profiles and role lenses have authenticated server API routes backed by Supabase. During the private beta they are isolated by the signed beta-session subject, so they persist for that authorized session but are not yet portable across separately authenticated devices.
- Surveys, provider preferences, and community posts still use browser storage and are not synced across browsers.
- Documents, sessions, knowledge vault, search, decisions, campaigns, external-source connections, and action approvals are UI-only workflows; they do not yet store data, upload files, call connectors, or create external records.
- There is no automated test suite. The project should not be released until `npm run build` passes for the beta branch.
