const GITHUB_API = "https://api.github.com";

export class GitHubClient {
  constructor(private token: string) {}

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    // Validate that path only contains safe characters to prevent SSRF via path manipulation
    if (!/^\/[A-Za-z0-9/_.\-?=%&+:@,]*$/.test(path)) {
      throw new Error("Invalid API path");
    }
    const url = new URL(path, GITHUB_API);
    if (url.origin !== GITHUB_API) {
      throw new Error("Invalid API origin");
    }
    const res = await fetch(url.toString(), {
      ...options,
      headers: {
        Authorization: `token ${this.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`GitHub API ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  }

  getUser() {
    return this.request<{ login: string; name: string; email: string; avatar_url: string }>("/user");
  }

  listRepos(perPage = 50) {
    return this.request<Array<{
      id: number;
      name: string;
      full_name: string;
      private: boolean;
      description: string | null;
      html_url: string;
      default_branch: string;
    }>>(`/user/repos?per_page=${perPage}&sort=updated`);
  }

  getRepo(owner: string, repo: string) {
    return this.request<{
      id: number;
      name: string;
      full_name: string;
      private: boolean;
      description: string | null;
      html_url: string;
      default_branch: string;
      stargazers_count: number;
      language: string | null;
    }>(`/repos/${owner}/${repo}`);
  }

  async getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<{
    content: string;
    sha: string;
    path: string;
    encoding: string;
  }> {
    const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    return this.request(`/repos/${owner}/${repo}/contents/${path}${query}`);
  }

  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    content: string,
    sha?: string
  ) {
    return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        ...(sha ? { sha } : {}),
      }),
    });
  }
}
