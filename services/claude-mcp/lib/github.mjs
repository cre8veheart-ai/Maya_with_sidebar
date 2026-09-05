const REPO = "cre8veheart-ai/Maya_with_sidebar";
const API = `https://api.github.com/repos/${REPO}`;

function token() {
  const value = process.env.GITHUB_TOKEN;
  if (!value) throw new Error("GITHUB_TOKEN is not configured.");
  return value;
}

export async function github(path, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token()}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const message = body?.message || `GitHub request failed (${response.status})`;
    throw new Error(message);
  }
  return body;
}

export function encodePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}
