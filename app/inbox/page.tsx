"use client";

import { useState, useRef } from "react";
import PageShell from "@/components/PageShell";

type SourceType = "paste" | "url" | "message";
type ActionType = "analyze" | "repurpose" | "vault" | "content-tools";

interface InboxItem {
  id: string;
  type: SourceType;
  label: string;
  content: string;
  url?: string;
  platform?: string;
  createdAt: string;
  unread: boolean;
  mayaResponse?: string;
  loadingAction?: ActionType;
}

const PLATFORM_OPTIONS = ["LinkedIn", "X / Twitter", "Instagram", "Article", "Email", "Transcript", "Other"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SourceBadge({ type, platform }: { type: SourceType; platform?: string }) {
  const label = type === "url" ? (platform ?? "URL") : type === "message" ? "Message" : (platform ?? "Paste");
  const colors: Record<string, string> = {
    LinkedIn: "text-[#89b4fa] border-[#89b4fa]/30",
    "X / Twitter": "text-[#cba6f7] border-[#cba6f7]/30",
    Instagram: "text-[#f38ba8] border-[#f38ba8]/30",
    Message: "text-[#a6e3a1] border-[#a6e3a1]/30",
  };
  const color = colors[label] ?? "text-[#585b70] border-[#313244]";
  return (
    <span className={`text-[9px] font-semibold uppercase tracking-wider border px-1.5 py-0.5 rounded ${color}`}>
      {label}
    </span>
  );
}

function ActionBar({
  item,
  onAction,
}: {
  item: InboxItem;
  onAction: (id: string, action: ActionType) => void;
}) {
  const actions: { id: ActionType; label: string; icon: string }[] = [
    { id: "analyze", label: "Ask MAYA", icon: "✦" },
    { id: "repurpose", label: "Repurpose", icon: "🔄" },
    { id: "vault", label: "Save to Vault", icon: "🔒" },
    { id: "content-tools", label: "Send to Content Tools", icon: "✍️" },
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#313244]">
      {actions.map((a) => (
        <button
          key={a.id}
          onClick={() => onAction(item.id, a.id)}
          disabled={item.loadingAction === a.id}
          className="flex items-center gap-1.5 text-[11px] text-[#a6adc8] border border-[#313244] px-3 py-1.5 rounded-lg hover:bg-[#313244] hover:text-[#89b4fa] hover:border-[#89b4fa]/40 transition-all disabled:opacity-50"
        >
          <span>{a.icon}</span>
          <span>{item.loadingAction === a.id ? "Working…" : a.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [tab, setTab] = useState<"all" | "messages" | "content">("all");

  // Paste tab state
  const [pasteText, setPasteText] = useState("");
  const [pastePlatform, setPastePlatform] = useState("LinkedIn");
  const [pasteType, setPasteType] = useState<SourceType>("paste");

  // URL tab state
  const [urlInput, setUrlInput] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  // Message tab state
  const [msgText, setMsgText] = useState("");

  const [addMode, setAddMode] = useState<"paste" | "url" | "message" | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  function addItem(item: Omit<InboxItem, "id" | "createdAt" | "unread">) {
    const newItem: InboxItem = {
      ...item,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      unread: true,
    };
    setItems((prev) => [newItem, ...prev]);
    setActiveItem(newItem.id);
    setAddMode(null);
    setPasteText("");
    setUrlInput("");
    setMsgText("");
  }

  function handlePasteSubmit() {
    if (!pasteText.trim()) return;
    addItem({ type: pasteType, label: pasteText.slice(0, 60) + (pasteText.length > 60 ? "…" : ""), content: pasteText, platform: pastePlatform });
  }

  async function handleUrlImport() {
    const url = urlInput.trim();
    if (!url) return;
    setUrlLoading(true);
    setUrlError("");
    try {
      const res = await fetch(`/api/import-url?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("Could not fetch that URL");
      const data = await res.json();
      addItem({ type: "url", label: data.title ?? url, content: data.text, url, platform: data.platform ?? "Article" });
    } catch (e) {
      setUrlError(e instanceof Error ? e.message : "Failed to import URL");
    } finally {
      setUrlLoading(false);
    }
  }

  function handleMessageSubmit() {
    if (!msgText.trim()) return;
    addItem({ type: "message", label: msgText.slice(0, 60) + (msgText.length > 60 ? "…" : ""), content: msgText });
  }

  async function handleAction(id: string, action: ActionType) {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (action === "vault") {
      try {
        const stored = JSON.parse(localStorage.getItem("maya_vault_items") ?? "[]");
        stored.unshift({ id: item.id, title: item.label, content: item.content, addedAt: new Date().toISOString() });
        localStorage.setItem("maya_vault_items", JSON.stringify(stored.slice(0, 200)));
        setItems((prev) => prev.map((i) => i.id === id ? { ...i, mayaResponse: "✓ Saved to Knowledge Vault" } : i));
      } catch { /* no-op */ }
      return;
    }

    if (action === "content-tools") {
      sessionStorage.setItem("maya_content_source", JSON.stringify({ id: item.id, label: item.label, content: item.content }));
      window.location.href = "/content";
      return;
    }

    setItems((prev) => prev.map((i) => i.id === id ? { ...i, loadingAction: action, unread: false } : i));

    const promptMap: Record<string, string> = {
      analyze: `Analyze this content and give me the key takeaways, underlying themes, and strategic value in 3-4 bullet points:\n\n${item.content}`,
      repurpose: `I want to repurpose this content. Give me 3 versions: (1) a LinkedIn post, (2) a Twitter/X thread opener, and (3) a one-paragraph email teaser:\n\n${item.content}`,
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptMap[action] }],
          lens: { role: "cmo", overrides: [] },
        }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setItems((prev) => prev.map((i) => i.id === id ? { ...i, mayaResponse: full } : i));
      }
    } catch {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, mayaResponse: "MAYA couldn't process that right now." } : i));
    } finally {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, loadingAction: undefined } : i));
    }
  }

  const filtered = items.filter((i) => {
    if (tab === "messages") return i.type === "message";
    if (tab === "content") return i.type !== "message";
    return true;
  });

  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <PageShell
      title="Inbox"
      subtitle="Receive messages, drop content, import from anywhere — everything activates inside MAYA"
      action={
        <div className="flex gap-2">
          <button onClick={() => setAddMode("message")} className="text-[12px] text-[#a6adc8] border border-[#313244] px-3 py-1.5 rounded-lg hover:bg-[#313244] transition-colors">
            ✉️ Message
          </button>
          <button onClick={() => setAddMode("paste")} className="text-[12px] text-[#a6adc8] border border-[#313244] px-3 py-1.5 rounded-lg hover:bg-[#313244] transition-colors">
            📋 Paste Content
          </button>
          <button onClick={() => setAddMode("url")} className="text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-3 py-1.5 rounded-lg hover:bg-[#89b4fa]/10 transition-colors">
            🔗 Import URL
          </button>
        </div>
      }
    >
      <div className="flex flex-col xl:flex-row gap-5">
        {/* Left — list */}
        <div className="xl:w-[420px] shrink-0 flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex gap-1">
            {([["all", "All"], ["messages", "Messages"], ["content", "Content"]] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={[
                  "text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors",
                  tab === id ? "bg-[#313244] text-[#89b4fa]" : "text-[#585b70] hover:text-[#a6adc8]",
                ].join(" ")}
              >
                {label}
                {id === "all" && unreadCount > 0 && (
                  <span className="ml-1.5 bg-[#89b4fa] text-[#1e1e2e] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Add panels */}
          {addMode === "paste" && (
            <div className="bg-[#1e1e2e] border border-[#89b4fa]/30 rounded-xl p-4 space-y-3">
              <p className="text-[12px] font-semibold text-[#cdd6f4]">Paste Content</p>
              <select
                value={pastePlatform}
                onChange={(e) => setPastePlatform(e.target.value)}
                className="w-full bg-[#181825] border border-[#313244] text-[12px] text-[#a6adc8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#89b4fa]/50"
              >
                {PLATFORM_OPTIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <textarea
                ref={inputRef}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste any content — LinkedIn post, article excerpt, transcript, email…"
                rows={5}
                className="w-full bg-[#181825] border border-[#313244] text-[13px] text-[#cdd6f4] placeholder-[#585b70] rounded-lg px-3 py-2 focus:outline-none focus:border-[#89b4fa]/50 resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setAddMode(null)} className="text-[12px] text-[#585b70] px-3 py-1.5 rounded-lg hover:text-[#a6adc8] transition-colors">Cancel</button>
                <button onClick={handlePasteSubmit} className="text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-1.5 rounded-lg hover:bg-[#89b4fa]/10 transition-colors">
                  Activate in MAYA
                </button>
              </div>
            </div>
          )}

          {addMode === "url" && (
            <div className="bg-[#1e1e2e] border border-[#89b4fa]/30 rounded-xl p-4 space-y-3">
              <p className="text-[12px] font-semibold text-[#cdd6f4]">Import from URL</p>
              <p className="text-[11px] text-[#585b70]">Paste any public URL — article, LinkedIn post, blog, press release. MAYA fetches and strips to clean text.</p>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#181825] border border-[#313244] text-[13px] text-[#cdd6f4] placeholder-[#585b70] rounded-lg px-3 py-2 focus:outline-none focus:border-[#89b4fa]/50"
              />
              {urlError && <p className="text-[11px] text-[#f38ba8]">{urlError}</p>}
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setAddMode(null); setUrlError(""); }} className="text-[12px] text-[#585b70] px-3 py-1.5 rounded-lg hover:text-[#a6adc8] transition-colors">Cancel</button>
                <button onClick={handleUrlImport} disabled={urlLoading} className="text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-1.5 rounded-lg hover:bg-[#89b4fa]/10 transition-colors disabled:opacity-50">
                  {urlLoading ? "Importing…" : "Import"}
                </button>
              </div>
              {/* Social connect info */}
              <div className="border-t border-[#313244] pt-3 space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70]">Native Social Connect</p>
                {["LinkedIn", "X / Twitter", "Instagram"].map((p) => (
                  <div key={p} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#181825] border border-[#313244]">
                    <span className="text-[12px] text-[#a6adc8]">{p}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-[#585b70] border border-[#45475a] px-1.5 py-0.5 rounded">
                      Phase 2
                    </span>
                  </div>
                ))}
                <p className="text-[10px] text-[#585b70] pt-1">
                  OAuth social import (pull your own post history) coming in Phase 2. Use URL import or paste in the meantime.
                </p>
              </div>
            </div>
          )}

          {addMode === "message" && (
            <div className="bg-[#1e1e2e] border border-[#89b4fa]/30 rounded-xl p-4 space-y-3">
              <p className="text-[12px] font-semibold text-[#cdd6f4]">Send a Message to MAYA</p>
              <textarea
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Drop a note, brief, or idea here…"
                rows={4}
                className="w-full bg-[#181825] border border-[#313244] text-[13px] text-[#cdd6f4] placeholder-[#585b70] rounded-lg px-3 py-2 focus:outline-none focus:border-[#89b4fa]/50 resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setAddMode(null)} className="text-[12px] text-[#585b70] px-3 py-1.5 rounded-lg hover:text-[#a6adc8] transition-colors">Cancel</button>
                <button onClick={handleMessageSubmit} className="text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-1.5 rounded-lg hover:bg-[#89b4fa]/10 transition-colors">
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Item list */}
          {filtered.length === 0 ? (
            <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-10 flex flex-col items-center gap-3">
              <span className="text-3xl">📬</span>
              <p className="text-[13px] text-[#585b70] text-center">Nothing here yet.</p>
              <p className="text-[11px] text-[#585b70] text-center max-w-xs">
                Paste content, import a URL, or send MAYA a message — it all lands here and activates as interactive source material.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveItem(item.id); setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, unread: false } : i)); }}
                  className={[
                    "w-full text-left bg-[#1e1e2e] border rounded-xl p-4 transition-all",
                    activeItem === item.id ? "border-[#89b4fa]/50 bg-[#1e1e2e]" : "border-[#313244] hover:border-[#45475a]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SourceBadge type={item.type} platform={item.platform} />
                      {item.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#89b4fa] flex-shrink-0" />}
                    </div>
                    <span className="text-[10px] text-[#585b70] shrink-0">{timeAgo(item.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-[#cdd6f4] leading-snug line-clamp-2">{item.label}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — active item detail */}
        <div className="flex-1 min-h-[400px]">
          {activeItem ? (() => {
            const item = items.find((i) => i.id === activeItem);
            if (!item) return null;
            return (
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-6 h-full flex flex-col gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <SourceBadge type={item.type} platform={item.platform} />
                  <span className="text-[11px] text-[#585b70]">{timeAgo(item.createdAt)}</span>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#89b4fa] hover:underline truncate max-w-[200px]">
                      {item.url}
                    </a>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  <p className="text-[13px] text-[#a6adc8] leading-relaxed whitespace-pre-wrap">{item.content}</p>
                </div>
                {item.mayaResponse && (
                  <div className="bg-[#181825] border border-[#313244] rounded-xl p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] mb-2">✦ MAYA</p>
                    <p className="text-[13px] text-[#cdd6f4] leading-relaxed whitespace-pre-wrap">{item.mayaResponse}</p>
                  </div>
                )}
                <ActionBar item={item} onAction={handleAction} />
              </div>
            );
          })() : (
            <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl h-full flex flex-col items-center justify-center gap-3 p-10">
              <span className="text-4xl">✦</span>
              <p className="text-[14px] text-[#585b70] text-center">Select an item to activate it</p>
              <p className="text-[12px] text-[#585b70] text-center max-w-xs">
                Every piece of content you bring in becomes interactive — ask MAYA to analyze, repurpose, or route it anywhere in the platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
