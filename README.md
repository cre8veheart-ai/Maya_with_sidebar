# Maya_with_sidebar
Maya_sidebar_claudebuild

## Private beta configuration

Before inviting users, configure `BETA_INVITE_CODES` and a unique `BETA_SESSION_SECRET` in production. One-time invite redemption uses Upstash Redis through the Vercel Marketplace; Vercel KV is no longer first-party. Configure the integration's `KV_REST_API_URL` and `KV_REST_API_TOKEN` for production before enabling the beta. The app fails closed if any of these values are missing.
