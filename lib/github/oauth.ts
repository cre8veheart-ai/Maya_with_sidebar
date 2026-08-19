const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID ?? "",
    redirect_uri: getCallbackUrl(),
    scope: "repo admin:repo_hook read:user user:email",
    state,
  });
  return `${GITHUB_OAUTH_URL}?${params.toString()}`;
}

export function getCallbackUrl(): string {
  const base =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${base}/api/auth/github/callback`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  token_type: string;
  scope: string;
}> {
  const res = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: getCallbackUrl(),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub token exchange failed: ${res.status}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description ?? data.error}`);
  }

  return data;
}
