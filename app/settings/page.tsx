"use client";

import { useEffect, useState } from "react";
import ProviderControls from "@/components/ProviderControls";
import { loadProviderSettings, saveProviderSettings } from "@/lib/maya/providerStorage";
import type { ProviderSettings } from "@/lib/maya/types";

type GitHubStatus = {
  configured: boolean;
  connected: boolean;
  requestedScopes: string[];
  allowedRepos: string[];
  user?: { login?: string };
  connectionError?: string;
  mainPush?: {
    enabled: boolean;
    canAuthorize: boolean;
    authMaxAgeSeconds: number;
    allowedUsers: string[];
  };
};

export default function SettingsPage() {
  const [providerSettings, setProviderSettings] = useState<ProviderSettings>({
    provider: "anthropic",
    anthropicModel: "",
    openClawModel: "",
    openAiModel: "",
    ludicrousMode: false,
  });
  const [gitHubStatus, setGitHubStatus] = useState<GitHubStatus | null>(null);
  const [gitHubBusy, setGitHubBusy] = useState(false);
  const [sourceBranch, setSourceBranch] = useState("");
  const [gitHubNotice, setGitHubNotice] = useState("");

  useEffect(() => {
    setProviderSettings(loadProviderSettings());
    void refreshGitHubStatus();
  }, []);

  function updateProviderSettings(next: ProviderSettings) {
    setProviderSettings(next);
    saveProviderSettings(next);
  }

  async function refreshGitHubStatus() {
    try {
      const response = await fetch("/api/github/status", { cache: "no-store" });
      const payload = (await response.json()) as GitHubStatus;
      setGitHubStatus(payload);
    } catch (error) {
      setGitHubNotice(error instanceof Error ? error.message : "Unable to load GitHub status");
    }
  }

  function authorizeGitHub() {
    window.location.href = "/api/github/connect";
  }

  async function disconnectGitHub() {
    setGitHubBusy(true);
    setGitHubNotice("");
    try {
      const response = await fetch("/api/github/disconnect", { method: "POST" });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Disconnect failed");
      }
      setGitHubNotice("GitHub disconnected.");
      await refreshGitHubStatus();
    } catch (error) {
      setGitHubNotice(error instanceof Error ? error.message : "Disconnect failed");
    } finally {
      setGitHubBusy(false);
    }
  }

  async function authorizeAndPushMain() {
    if (!sourceBranch.trim()) {
      setGitHubNotice("Enter the source branch you want to merge into main.");
      return;
    }
    const confirmation = window.prompt("Type AUTHORIZE MAIN PUSH to confirm");
    if (!confirmation) {
      return;
    }

    setGitHubBusy(true);
    setGitHubNotice("");
    try {
      const response = await fetch("/api/github/main-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceBranch: sourceBranch.trim(),
          baseBranch: "main",
          confirmation,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        staleAuth?: boolean;
        fallback?: string;
        pullRequestUrl?: string;
      };

      if (!response.ok) {
        if (payload.staleAuth) {
          setGitHubNotice("Session expired for main push. Re-authorize GitHub and try again.");
          return;
        }
        if (payload.fallback === "pull_request") {
          setGitHubNotice(
            payload.pullRequestUrl
              ? `Checks are not green. Use PR instead: ${payload.pullRequestUrl}`
              : "Checks are not green. Use PR flow instead of direct main push.",
          );
          return;
        }
        throw new Error(payload.error || "Main push failed");
      }

      setGitHubNotice("Main push authorized and completed.");
      await refreshGitHubStatus();
    } catch (error) {
      setGitHubNotice(error instanceof Error ? error.message : "Main push failed");
    } finally {
      setGitHubBusy(false);
    }
  }

  return (
    <div className="max-w-6xl p-8">
      <h1 className="text-2xl font-bold text-[#89b4fa]">Settings</h1>
      <p className="mt-2 text-[#cdd6f4]">Choose Maya&apos;s model provider and intelligence settings.</p>

      <div className="mt-6">
        <ProviderControls settings={providerSettings} onChange={updateProviderSettings} />
      </div>

      <div className="mt-6 rounded-xl border border-[#313244] bg-[#1e1e2e] p-4 text-sm text-[#cdd6f4]">
        <h2 className="text-base font-semibold text-white">GitHub Authorization + Main Push</h2>
        <p className="mt-2 text-[#a6adc8]">
          Use one authorize flow, then run owner-approved main pushes with explicit confirmation.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={authorizeGitHub}
            disabled={gitHubBusy || gitHubStatus?.configured === false}
            className="rounded-md border border-[#89b4fa] px-3 py-2 text-xs font-semibold text-[#89b4fa] disabled:opacity-50"
          >
            {gitHubStatus?.connected ? "Re-authorize GitHub" : "Authorize GitHub"}
          </button>
          <button
            type="button"
            onClick={() => void disconnectGitHub()}
            disabled={gitHubBusy || !gitHubStatus?.connected}
            className="rounded-md border border-[#45475a] px-3 py-2 text-xs font-semibold text-[#cdd6f4] disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>

        {gitHubStatus && (
          <div className="mt-4 space-y-1 text-xs text-[#a6adc8]">
            <p>Connection: {gitHubStatus.connected ? "Connected" : "Not connected"}</p>
            <p>User: {gitHubStatus.user?.login || "-"}</p>
            <p>Allowed repos: {gitHubStatus.allowedRepos.join(", ") || "-"}</p>
            <p>Scopes: {gitHubStatus.requestedScopes.join(", ") || "-"}</p>
            <p>
              Main push authorized users: {gitHubStatus.mainPush?.allowedUsers.join(", ") || "-"}
            </p>
            {gitHubStatus.connectionError ? <p>Error: {gitHubStatus.connectionError}</p> : null}
          </div>
        )}

        <div className="mt-4 rounded-lg border border-[#45475a] p-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#bac2de]">
            Source branch to merge into main
          </label>
          <input
            type="text"
            value={sourceBranch}
            onChange={(event) => setSourceBranch(event.target.value)}
            placeholder="feature/ready-to-promote"
            className="mt-2 w-full rounded-md border border-[#313244] bg-[#11111b] px-3 py-2 text-sm text-[#cdd6f4] outline-none focus:border-[#89b4fa]"
          />
          <button
            type="button"
            onClick={() => void authorizeAndPushMain()}
            disabled={gitHubBusy || !gitHubStatus?.connected || !gitHubStatus?.mainPush?.canAuthorize}
            className="mt-3 rounded-md border border-[#f38ba8] px-3 py-2 text-xs font-semibold text-[#f38ba8] disabled:opacity-50"
          >
            Authorize + Push to Main
          </button>
          <p className="mt-2 text-[11px] text-[#a6adc8]">
            Requires fresh OAuth, green checks, and confirmation phrase.
          </p>
        </div>

        {gitHubNotice ? (
          <p className="mt-3 rounded-md border border-[#45475a] bg-[#11111b] p-2 text-xs text-[#f9e2af]">
            {gitHubNotice}
          </p>
        ) : null}
      </div>
    </div>
  );
}
