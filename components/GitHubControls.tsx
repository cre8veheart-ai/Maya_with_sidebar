"use client";

import { useEffect, useState } from "react";
import type { GitHubAuditEntry, GitHubRepoConfig } from "@/lib/github/types";

interface GitHubStatusResponse {
  configured: boolean;
  connected: boolean;
  requestedScopes: string[];
  allowedRepos: string[];
  repoConfig: GitHubRepoConfig | null;
  permissions: {
    read: boolean;
    write: boolean;
    workflow: boolean;
  };
  user?: {
    login: string;
    avatarUrl: string;
    name: string;
    email: string;
  };
  audit: GitHubAuditEntry[];
  scopes?: string[];
  connectionError?: string;
}

interface RepoListItem {
  id: number;
  fullName: string;
  defaultBranch: string;
  private: boolean;
}

const READ_ACTIONS = [
  { value: "repo", label: "Repository summary" },
  { value: "contents", label: "Repository contents" },
  { value: "pulls", label: "Pull requests" },
  { value: "issues", label: "Issues" },
  { value: "workflows", label: "Workflows" },
  { value: "workflowRuns", label: "Workflow runs" },
  { value: "branches", label: "Branches" },
];

const WRITE_ACTIONS = [
  { value: "createBranch", label: "Create branch" },
  { value: "upsertFile", label: "Create / update file" },
  { value: "createPullRequest", label: "Create pull request" },
  { value: "dispatchWorkflow", label: "Dispatch workflow" },
];

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export default function GitHubControls() {
  const [status, setStatus] = useState<GitHubStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [repos, setRepos] = useState<RepoListItem[]>([]);
  const [repoConfig, setRepoConfig] = useState<GitHubRepoConfig>({
    owner: "",
    repo: "",
    branch: "main",
  });
  const [readAction, setReadAction] = useState("repo");
  const [writeAction, setWriteAction] = useState("createBranch");
  const [path, setPath] = useState("");
  const [stateFilter, setStateFilter] = useState("open");
  const [workflowId, setWorkflowId] = useState("");
  const [sourceBranch, setSourceBranch] = useState("main");
  const [newBranch, setNewBranch] = useState("");
  const [filePath, setFilePath] = useState("README.md");
  const [fileContent, setFileContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("chore: update via Maya");
  const [fileSha, setFileSha] = useState("");
  const [prTitle, setPrTitle] = useState("Maya update");
  const [prBody, setPrBody] = useState("");
  const [prHead, setPrHead] = useState("");
  const [prBase, setPrBase] = useState("main");
  const [workflowRef, setWorkflowRef] = useState("main");
  const [workflowInputs, setWorkflowInputs] = useState("{}");
  const [approved, setApproved] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function loadStatus() {
    setLoading(true);
    setError("");

    try {
      const data = await parseJson<GitHubStatusResponse>(
        await fetch("/api/github/status", { cache: "no-store" })
      );
      setStatus(data);
      if (data.repoConfig) {
        setRepoConfig(data.repoConfig);
        setSourceBranch(data.repoConfig.branch);
        setPrBase(data.repoConfig.branch);
        setWorkflowRef(data.repoConfig.branch);
      }
      if (data.connectionError) {
        setError(data.connectionError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load GitHub status");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStatus();
  }, []);

  async function saveRepository() {
    setBusy(true);
    setError("");

    try {
      const payload = await parseJson<{ repoConfig: GitHubRepoConfig }>(
        await fetch("/api/github/repository", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoConfig }),
        })
      );
      setRepoConfig(payload.repoConfig);
      setResult(JSON.stringify(payload, null, 2));
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save repository");
    } finally {
      setBusy(false);
    }
  }

  async function loadRepos() {
    setBusy(true);
    setError("");

    try {
      const payload = await parseJson<{ repos: RepoListItem[] }>(
        await fetch("/api/github/repos", { cache: "no-store" })
      );
      setRepos(payload.repos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load repositories");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    setError("");

    try {
      await parseJson(await fetch("/api/github/disconnect", { method: "POST" }));
      setRepos([]);
      setResult("");
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disconnect GitHub");
    } finally {
      setBusy(false);
    }
  }

  async function runReadAction() {
    setBusy(true);
    setError("");

    try {
      const payload = await parseJson<{ result: unknown }>(
        await fetch("/api/github/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: readAction,
            owner: repoConfig.owner,
            repo: repoConfig.repo,
            branch: repoConfig.branch,
            path,
            state: stateFilter,
            workflowId,
          }),
        })
      );
      setResult(JSON.stringify(payload.result, null, 2));
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "GitHub read failed");
    } finally {
      setBusy(false);
    }
  }

  async function runWriteAction() {
    setBusy(true);
    setError("");

    try {
      const parsedInputs =
        writeAction === "dispatchWorkflow"
          ? (JSON.parse(workflowInputs || "{}") as Record<string, string>)
          : {};

      const payload = await parseJson<{ result: unknown }>(
        await fetch("/api/github/write", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: writeAction,
            owner: repoConfig.owner,
            repo: repoConfig.repo,
            branch: repoConfig.branch,
            approved,
            approvalNote,
            confirmationText,
            sourceBranch,
            newBranch,
            path: filePath,
            content: fileContent,
            message: commitMessage,
            sha: fileSha,
            title: prTitle,
            body: prBody,
            head: prHead,
            base: prBase,
            workflowId,
            ref: workflowRef,
            inputs: parsedInputs,
          }),
        })
      );
      setResult(JSON.stringify(payload.result, null, 2));
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "GitHub write failed");
    } finally {
      setBusy(false);
    }
  }

  const repoHint =
    status?.allowedRepos.length && status.allowedRepos[0]
      ? status.allowedRepos.join(", ")
      : "Any repo visible to the connected GitHub account";

  return (
    <section className="rounded-2xl border border-[#313244] bg-[#1e1e2e] p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#89b4fa]">GitHub access</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#a6adc8]">
            Connect GitHub, choose the active repo, inspect repo data, and run
            approval-gated write or workflow actions from Maya.
          </p>
        </div>
        {status?.connected ? (
          <button
            type="button"
            onClick={() => void disconnect()}
            className="rounded-lg border border-[#f38ba8] px-3 py-2 text-[12px] font-semibold text-[#f38ba8] hover:bg-[#3a1f28]"
          >
            Disconnect GitHub
          </button>
        ) : (
          <a
            href="/api/github/connect"
            className="rounded-lg bg-[#89b4fa] px-3 py-2 text-[12px] font-semibold text-[#1e1e2e] hover:bg-[#b4d0fb]"
          >
            Connect GitHub
          </a>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-[#313244] bg-[#181825] p-4 text-[12px] text-[#a6adc8]">
        {loading ? (
          <p>Loading GitHub status…</p>
        ) : (
          <>
            <p>
              OAuth configured:{" "}
              <span className="font-semibold text-[#cdd6f4]">
                {status?.configured ? "Yes" : "No"}
              </span>
            </p>
            <p className="mt-1">
              Connection:{" "}
              <span className="font-semibold text-[#cdd6f4]">
                {status?.connected ? `Connected as ${status.user?.login}` : "Not connected"}
              </span>
            </p>
            <p className="mt-1">Allowed repos: {repoHint}</p>
            <p className="mt-1">
              Requested scopes: {(status?.requestedScopes ?? []).join(", ") || "—"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.07em]">
              <span
                className={`rounded-full px-2.5 py-1 ${
                  status?.permissions.read
                    ? "bg-[#1e2e2b] text-[#a6e3a1]"
                    : "bg-[#313244] text-[#6c7086]"
                }`}
              >
                Read
              </span>
              <span
                className={`rounded-full px-2.5 py-1 ${
                  status?.permissions.write
                    ? "bg-[#332a1a] text-[#f9e2af]"
                    : "bg-[#313244] text-[#6c7086]"
                }`}
              >
                Write
              </span>
              <span
                className={`rounded-full px-2.5 py-1 ${
                  status?.permissions.workflow
                    ? "bg-[#1e2333] text-[#89b4fa]"
                    : "bg-[#313244] text-[#6c7086]"
                }`}
              >
                Workflow / Build
              </span>
            </div>
            {status?.scopes?.length ? (
              <p className="mt-3 break-words text-[11px] text-[#6c7086]">
                Granted scopes: {status.scopes.join(", ")}
              </p>
            ) : null}
          </>
        )}
      </div>

      {status?.connected ? (
        <>
          <div className="mt-5 rounded-xl border border-[#313244] bg-[#181825] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-semibold text-[#cdd6f4]">
                  Active repository
                </h3>
                <p className="mt-1 text-[11px] text-[#6c7086]">
                  Maya only acts against the selected repo/branch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadRepos()}
                className="rounded-lg border border-[#45475a] px-3 py-2 text-[11px] font-semibold text-[#cdd6f4] hover:bg-[#313244]"
              >
                Load repos
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="text-[12px] text-[#a6adc8]">
                <span className="mb-1 block">Owner</span>
                <input
                  value={repoConfig.owner}
                  onChange={(e) =>
                    setRepoConfig((prev) => ({ ...prev, owner: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                />
              </label>
              <label className="text-[12px] text-[#a6adc8]">
                <span className="mb-1 block">Repository</span>
                <input
                  value={repoConfig.repo}
                  onChange={(e) =>
                    setRepoConfig((prev) => ({ ...prev, repo: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                />
              </label>
              <label className="text-[12px] text-[#a6adc8]">
                <span className="mb-1 block">Branch</span>
                <input
                  value={repoConfig.branch}
                  onChange={(e) =>
                    setRepoConfig((prev) => ({ ...prev, branch: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                />
              </label>
            </div>

            {repos.length > 0 ? (
              <div className="mt-3 max-h-40 overflow-y-auto rounded-lg border border-[#313244] bg-[#1e1e2e] p-2">
                {repos.map((repo) => (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => {
                      const [owner, name] = repo.fullName.split("/");
                      setRepoConfig({
                        owner,
                        repo: name,
                        branch: repo.defaultBranch,
                      });
                      setSourceBranch(repo.defaultBranch);
                      setPrBase(repo.defaultBranch);
                      setWorkflowRef(repo.defaultBranch);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[12px] text-[#cdd6f4] hover:bg-[#313244]"
                  >
                    <span>{repo.fullName}</span>
                    <span className="text-[10px] text-[#6c7086]">
                      {repo.private ? "private" : "public"} · {repo.defaultBranch}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <button
              type="button"
              disabled={busy}
              onClick={() => void saveRepository()}
              className="mt-4 rounded-lg bg-[#89b4fa] px-3 py-2 text-[12px] font-semibold text-[#1e1e2e] disabled:opacity-50"
            >
              Save active repo
            </button>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <section className="rounded-xl border border-[#313244] bg-[#181825] p-4">
              <h3 className="text-[13px] font-semibold text-[#cdd6f4]">Read actions</h3>
              <div className="mt-4 space-y-3">
                <label className="block text-[12px] text-[#a6adc8]">
                  <span className="mb-1 block">Action</span>
                  <select
                    value={readAction}
                    onChange={(e) => setReadAction(e.target.value)}
                    className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                  >
                    {READ_ACTIONS.map((action) => (
                      <option key={action.value} value={action.value}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                </label>

                {readAction === "contents" ? (
                  <label className="block text-[12px] text-[#a6adc8]">
                    <span className="mb-1 block">Path</span>
                    <input
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                      placeholder="app/api/chat/route.ts"
                      className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                    />
                  </label>
                ) : null}

                {readAction === "pulls" || readAction === "issues" ? (
                  <label className="block text-[12px] text-[#a6adc8]">
                    <span className="mb-1 block">State</span>
                    <select
                      value={stateFilter}
                      onChange={(e) => setStateFilter(e.target.value)}
                      className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                    >
                      <option value="open">open</option>
                      <option value="closed">closed</option>
                      <option value="all">all</option>
                    </select>
                  </label>
                ) : null}

                {readAction === "workflowRuns" ? (
                  <label className="block text-[12px] text-[#a6adc8]">
                    <span className="mb-1 block">Workflow ID or file name (optional)</span>
                    <input
                      value={workflowId}
                      onChange={(e) => setWorkflowId(e.target.value)}
                      placeholder="ci.yml or 123456"
                      className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                    />
                  </label>
                ) : null}

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runReadAction()}
                  className="rounded-lg bg-[#89b4fa] px-3 py-2 text-[12px] font-semibold text-[#1e1e2e] disabled:opacity-50"
                >
                  Run read action
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-[#313244] bg-[#181825] p-4">
              <h3 className="text-[13px] font-semibold text-[#cdd6f4]">
                Write / build actions
              </h3>
              <p className="mt-1 text-[11px] text-[#6c7086]">
                Writes are blocked unless you explicitly approve them below.
              </p>

              <div className="mt-4 space-y-3">
                <label className="block text-[12px] text-[#a6adc8]">
                  <span className="mb-1 block">Action</span>
                  <select
                    value={writeAction}
                    onChange={(e) => setWriteAction(e.target.value)}
                    className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                  >
                    {WRITE_ACTIONS.map((action) => (
                      <option key={action.value} value={action.value}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                </label>

                {writeAction === "createBranch" ? (
                  <>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">Source branch</span>
                      <input
                        value={sourceBranch}
                        onChange={(e) => setSourceBranch(e.target.value)}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">New branch</span>
                      <input
                        value={newBranch}
                        onChange={(e) => setNewBranch(e.target.value)}
                        placeholder="maya/feature-branch"
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                  </>
                ) : null}

                {writeAction === "upsertFile" ? (
                  <>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">File path</span>
                      <input
                        value={filePath}
                        onChange={(e) => setFilePath(e.target.value)}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">Branch</span>
                      <input
                        value={repoConfig.branch}
                        onChange={(e) =>
                          setRepoConfig((prev) => ({ ...prev, branch: e.target.value }))
                        }
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">Commit message</span>
                      <input
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">Existing SHA (optional)</span>
                      <input
                        value={fileSha}
                        onChange={(e) => setFileSha(e.target.value)}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">File content</span>
                      <textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        rows={8}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 font-mono text-[11px] text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                  </>
                ) : null}

                {writeAction === "createPullRequest" ? (
                  <>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">Head branch</span>
                      <input
                        value={prHead}
                        onChange={(e) => setPrHead(e.target.value)}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">Base branch</span>
                      <input
                        value={prBase}
                        onChange={(e) => setPrBase(e.target.value)}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">PR title</span>
                      <input
                        value={prTitle}
                        onChange={(e) => setPrTitle(e.target.value)}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">PR body</span>
                      <textarea
                        value={prBody}
                        onChange={(e) => setPrBody(e.target.value)}
                        rows={6}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                  </>
                ) : null}

                {writeAction === "dispatchWorkflow" ? (
                  <>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">Workflow ID or file name</span>
                      <input
                        value={workflowId}
                        onChange={(e) => setWorkflowId(e.target.value)}
                        placeholder="ci.yml or 123456"
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">Ref</span>
                      <input
                        value={workflowRef}
                        onChange={(e) => setWorkflowRef(e.target.value)}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                    <label className="block text-[12px] text-[#a6adc8]">
                      <span className="mb-1 block">Inputs JSON</span>
                      <textarea
                        value={workflowInputs}
                        onChange={(e) => setWorkflowInputs(e.target.value)}
                        rows={5}
                        className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 font-mono text-[11px] text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                      />
                    </label>
                  </>
                ) : null}

                <label className="flex items-start gap-2 rounded-lg border border-[#45475a] bg-[#1e1e2e] px-3 py-2 text-[12px] text-[#a6adc8]">
                  <input
                    type="checkbox"
                    checked={approved}
                    onChange={(e) => setApproved(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>I explicitly approve this write or build action.</span>
                </label>

                <label className="block text-[12px] text-[#a6adc8]">
                  <span className="mb-1 block">Approval note</span>
                  <input
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    placeholder="Why this repo change or workflow run is allowed"
                    className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                  />
                </label>

                <label className="block text-[12px] text-[#a6adc8]">
                  <span className="mb-1 block">Type APPROVE to unlock</span>
                  <input
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[#cdd6f4] focus:border-[#89b4fa] focus:outline-none"
                  />
                </label>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runWriteAction()}
                  className="rounded-lg bg-[#f9e2af] px-3 py-2 text-[12px] font-semibold text-[#1e1e2e] disabled:opacity-50"
                >
                  Run write / build action
                </button>
              </div>
            </section>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
            <section className="rounded-xl border border-[#313244] bg-[#181825] p-4">
              <h3 className="text-[13px] font-semibold text-[#cdd6f4]">
                Last API result
              </h3>
              <pre className="mt-3 max-h-[28rem] overflow-auto rounded-lg bg-[#11111b] p-3 text-[11px] leading-relaxed text-[#cdd6f4]">
                {result || "No result yet."}
              </pre>
            </section>

            <section className="rounded-xl border border-[#313244] bg-[#181825] p-4">
              <h3 className="text-[13px] font-semibold text-[#cdd6f4]">Audit log</h3>
              <div className="mt-3 max-h-[28rem] space-y-2 overflow-auto">
                {(status?.audit ?? []).length === 0 ? (
                  <p className="text-[12px] text-[#6c7086]">No GitHub activity yet.</p>
                ) : (
                  status?.audit.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-lg border border-[#313244] bg-[#1e1e2e] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#89b4fa]">
                          {entry.kind} · {entry.action}
                        </p>
                        <span className="text-[10px] text-[#6c7086]">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-[#cdd6f4]">{entry.target}</p>
                      <p className="mt-1 text-[11px] text-[#a6adc8]">
                        {entry.status}: {entry.detail}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-lg border border-[#f38ba8] bg-[#3a1f28] px-3 py-2 text-[12px] text-[#f9e2af]">
          {error}
        </p>
      ) : null}
    </section>
  );
}
