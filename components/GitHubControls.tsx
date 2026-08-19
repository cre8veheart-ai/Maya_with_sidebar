"use client";

import { useEffect, useState, useCallback } from "react";

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
}

interface GitHubRepo {
  id: number;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
}

export default function GitHubControls() {
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/auth/github/status");
      const data = await res.json();
      setConnected(data.connected);
      setUser(data.user ?? null);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  const fetchRepos = useCallback(async () => {
    setLoadingRepos(true);
    try {
      const res = await fetch("/api/auth/github/repos");
      const data = await res.json();
      setRepos(data.repos ?? []);
    } finally {
      setLoadingRepos(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (connected) fetchRepos();
    else setRepos([]);
  }, [connected, fetchRepos]);

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await fetch("/api/auth/github/disconnect", { method: "POST" });
      setConnected(false);
      setUser(null);
      setRepos([]);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#313244] bg-[#1e1e2e] p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
          GitHub
        </span>
        {!loadingStatus && (
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              connected ? "bg-[#a6e3a1]" : "bg-[#585b70]"
            }`}
          />
        )}
        {!loadingStatus && (
          <span className="text-[12px] text-[#a6adc8]">
            {connected ? "Connected" : "Not connected"}
          </span>
        )}
      </div>

      {loadingStatus && (
        <span className="text-[12px] text-[#585b70]">Checking connection…</span>
      )}

      {!loadingStatus && !connected && (
        <a
          href="/api/auth/github/connect"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#313244] text-[#cdd6f4] text-[13px] font-semibold hover:bg-[#45475a] transition-colors w-fit"
        >
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Connect GitHub
        </a>
      )}

      {!loadingStatus && connected && user && (
        <div className="flex items-center gap-3">
          {user.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={user.login}
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          <div>
            <span className="block text-[13px] font-semibold text-[#cdd6f4]">
              {user.name || user.login}
            </span>
            <span className="block text-[11px] text-[#6c7086]">@{user.login}</span>
          </div>
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="ml-auto px-3 py-1 rounded-md text-[12px] font-semibold bg-[#313244] text-[#f38ba8] hover:bg-[#3b1f2b] transition-colors disabled:opacity-50"
          >
            {disconnecting ? "Disconnecting…" : "Disconnect"}
          </button>
        </div>
      )}

      {connected && (
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-2">
            Repositories
          </span>
          {loadingRepos ? (
            <span className="text-[12px] text-[#585b70]">Loading repos…</span>
          ) : repos.length === 0 ? (
            <span className="text-[12px] text-[#585b70]">No repositories found.</span>
          ) : (
            <ul className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
              {repos.map((r) => (
                <li key={r.id}>
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#313244] transition-colors text-[12px] text-[#cdd6f4]"
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        r.private ? "bg-[#f9e2af]" : "bg-[#89b4fa]"
                      }`}
                    />
                    <span className="truncate">{r.full_name}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
