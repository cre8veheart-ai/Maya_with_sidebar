import { createMcpHandler, withMcpAuth } from "mcp-handler";
import type { AuthInfo } from "@modelcontextprotocol/server";
import { z } from "zod";
import { github, encodePath } from "../../../lib/github.mjs";
import { isValidBearerToken, requireProductionBase, requireWritableBranch } from "../../../lib/security.mjs";

export const runtime = "nodejs";
export const maxDuration = 60;

const text = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "github_get_file",
      {
        title: "Read MAYA file",
        description: "Read a UTF-8 file from the MAYA repository.",
        inputSchema: z.object({ path: z.string().min(1), ref: z.string().default("main") }),
      },
      async ({ path, ref }) => {
        const result = await github(`/contents/${encodePath(path)}?ref=${encodeURIComponent(ref)}`);
        if (Array.isArray(result) || result.type !== "file") throw new Error("Path is not a file.");
        return text({ path: result.path, sha: result.sha, content: Buffer.from(result.content, "base64").toString("utf8") });
      },
    );

    server.registerTool(
      "github_list_directory",
      {
        title: "List MAYA directory",
        description: "List a directory in the MAYA repository.",
        inputSchema: z.object({ path: z.string().default(""), ref: z.string().default("main") }),
      },
      async ({ path, ref }) => {
        const result = await github(`/contents/${encodePath(path)}?ref=${encodeURIComponent(ref)}`);
        if (!Array.isArray(result)) throw new Error("Path is not a directory.");
        return text(result.map((item: any) => ({ name: item.name, path: item.path, type: item.type, sha: item.sha })));
      },
    );

    server.registerTool(
      "github_list_branches",
      { title: "List MAYA branches", description: "List MAYA repository branches.", inputSchema: z.object({}) },
      async () => {
        const result = await github("/branches?per_page=100");
        return text(result.map((item: any) => ({ name: item.name, protected: item.protected, sha: item.commit.sha })));
      },
    );

    server.registerTool(
      "github_create_branch",
      {
        title: "Create MAYA work branch",
        description: "Create an approved non-production branch from main or another ref.",
        inputSchema: z.object({ branch: z.string().min(1), fromBranch: z.string().default("main") }),
      },
      async ({ branch, fromBranch }) => {
        requireWritableBranch(branch);
        const source = await github(`/git/ref/heads/${encodePath(fromBranch)}`);
        const result = await github("/git/refs", {
          method: "POST",
          body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: source.object.sha }),
        });
        return text({ branch, sha: result.object.sha });
      },
    );

    server.registerTool(
      "github_create_or_update_file",
      {
        title: "Write MAYA work-branch file",
        description: "Create or update a text file on an explicit approved non-production branch.",
        inputSchema: z.object({
          path: z.string().min(1),
          content: z.string(),
          message: z.string().min(1),
          branch: z.string().min(1),
          sha: z.string().optional(),
        }),
      },
      async ({ path, content, message, branch, sha }) => {
        requireWritableBranch(branch);
        let currentSha = sha;
        if (!currentSha) {
          try {
            const current = await github(`/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`);
            if (!Array.isArray(current) && current.type === "file") currentSha = current.sha;
          } catch (error) {
            if (!(error instanceof Error) || !error.message.includes("Not Found")) throw error;
          }
        }
        const result = await github(`/contents/${encodePath(path)}`, {
          method: "PUT",
          body: JSON.stringify({
            message,
            content: Buffer.from(content, "utf8").toString("base64"),
            branch,
            ...(currentSha ? { sha: currentSha } : {}),
          }),
        });
        return text({ branch, path: result.content.path, sha: result.content.sha, commit: result.commit.sha });
      },
    );

    server.registerTool(
      "github_create_pull_request",
      {
        title: "Open MAYA draft pull request",
        description: "Open a draft pull request from an approved work branch into main.",
        inputSchema: z.object({ title: z.string().min(1), head: z.string().min(1), base: z.literal("main").default("main"), body: z.string().default("") }),
      },
      async ({ title, head, base, body }) => {
        requireWritableBranch(head);
        requireProductionBase(base);
        const result = await github("/pulls", { method: "POST", body: JSON.stringify({ title, head, base, body, draft: true }) });
        return text({ number: result.number, url: result.html_url, draft: result.draft });
      },
    );

    server.registerTool(
      "github_search_code",
      {
        title: "Search MAYA code",
        description: "Search code within the MAYA repository.",
        inputSchema: z.object({ query: z.string().min(1) }),
      },
      async ({ query }) => {
        const response = await fetch(`https://api.github.com/search/code?q=${encodeURIComponent(`${query} repo:cre8veheart-ai/Maya_with_sidebar`)}`, {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result?.message || "GitHub search failed.");
        return text(result.items.map((item: any) => ({ name: item.name, path: item.path, sha: item.sha, url: item.html_url })));
      },
    );
  },
  { serverInfo: { name: "maya-claude-mcp", version: "1.1.0" }, maxSubscriptions: 0 },
);

async function verifyToken(_request: Request, bearerToken?: string): Promise<AuthInfo | undefined> {
  const expected = process.env.MCP_ACCESS_TOKEN;
  if (!isValidBearerToken(bearerToken, expected)) return undefined;
  return { token: bearerToken!, scopes: ["maya:repo"], clientId: "maya-claude" };
}

const authenticated = withMcpAuth(handler, verifyToken, {
  required: true,
  requiredScopes: ["maya:repo"],
  resourceMetadataPath: "/.well-known/oauth-protected-resource",
});

export { authenticated as GET, authenticated as POST, authenticated as DELETE };
