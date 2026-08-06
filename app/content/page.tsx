"use client";

import { useState, useEffect, useRef } from "react";
import PageShell from "@/components/PageShell";

type Tool = "blog" | "social" | "email" | "ad" | "repurpose" | "brief";
type Platform = "LinkedIn" | "X / Twitter" | "Instagram" | "Facebook";

interface SourceMaterial {
  id: string;
  label: string;
  content: string;
}

const TOOLS: { id: Tool; label: string; icon: string; desc: string }[] = [
  { id: "blog", label: "Blog Post", icon: "✍️", desc: "Full post draft from topic + angle" },
  { id: "social", label: "Social Copy", icon: "📱", desc: "Platform-native copy with char counts" },
  { id: "email", label: "Email Copy", icon: "✉️", desc: "Subject lines + body draft" },
  { id: "ad", label: "Ad Copy", icon: "🎯", desc: "Headlines, hooks & CTAs" },
  { id: "repurpose", label: "Repurpose", icon: "🔄", desc: "Convert existing content to new format" },
  { id: "brief", label: "Brief Generator", icon: "📋", desc: "Structured creative brief output" },
];

const PLATFORMS: Platform[] = ["LinkedIn", "X / Twitter", "Instagram", "Facebook"];

function CharCount({ text, limit }: { text: string; limit: number }) {
  const over = text.length > limit;
  return (
    <span className={`text-[10px] font-mono ${over ? "text-[#f38ba8]" : "text-[#585b70]"}`}>
      {text.length}/{limit}
    </span>
  );
}

function OutputPanel({
  output,
  loading,
  onCopy,
  onSaveToBlog,
  tool,
}: {
  output: string;
  loading: boolean;
  onCopy: () => void;
  onSaveToBlog?: () => void;
  tool: Tool;
}) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      onCopy();
    });
  }

  return (
    <div className="flex flex-col flex-1 bg-[#1e1e2e] border border-[#313244] rounded-xl overflow-hidden min-h-[400px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#313244]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#585b70]">✦ MAYA Output</p>
        {output && (
          <div className="flex gap-2">
            {tool === "blog" && onSaveToBlog && (
              <button
                onClick={onSaveToBlog}
                className="text-[11px] text-[#a6e3a1] border border-[#a6e3a1]/30 px-3 py-1 rounded-lg hover:bg-[#a6e3a1]/10 transition-colors"
              >
                Save as Draft →Blog
              </button>
            )}
            <button
              onClick={handleCopy}
              className="text-[11px] text-[#a6adc8] border border-[#313244] px-3 py-1 rounded-lg hover:bg-[#313244] transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 p-5 overflow-y-auto">
        {loading ? (
          <div className="flex items-center gap-2 text-[#585b70]">
            <span className="animate-pulse text-[#89b4fa]">✦</span>
            <span className="text-[13px]">MAYA is writing…</span>
          </div>
        ) : output ? (
          <p className="text-[13px] text-[#cdd6f4] leading-relaxed whitespace-pre-wrap">{output}</p>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
            <span className="text-3xl opacity-30">✦</span>
            <p className="text-[13px] text-[#585b70]">Fill in the form and generate — output appears here.</p>
            <p className="text-[11px] text-[#45475a]">MAYA drafts, you decide.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContentPage() {
  const [activeTool, setActiveTool] = useState<Tool>("blog");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<SourceMaterial | null>(null);

  // tool inputs
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("");
  const [platform, setPlatform] = useState<Platform>("LinkedIn");
  const [brief, setBrief] = useState("");
  const [existingContent, setExistingContent] = useState("");
  const [targetFormat, setTargetFormat] = useState("LinkedIn post");
  const [emailGoal, setEmailGoal] = useState("");
  const [adProduct, setAdProduct] = useState("");
  const [adAudience, setAdAudience] = useState("");
  const [briefProject, setBriefProject] = useState("");
  const [briefAudience, setBriefAudience] = useState("");
  const [briefObjective, setBriefObjective] = useState("");

  const abortRef = useRef<AbortController | null>(null);

  // Pick up source material dropped from Inbox
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("maya_content_source");
      if (raw) {
        const s = JSON.parse(raw) as SourceMaterial;
        setSource(s);
        sessionStorage.removeItem("maya_content_source");
      }
    } catch { /* no-op */ }
  }, []);

  function clearSource() { setSource(null); }

  function buildPrompt(): string {
    const sourceBlock = source
      ? `\n\nSOURCE MATERIAL (use this as context/seed):\n${source.content}`
      : "";

    switch (activeTool) {
      case "blog":
        return `Write a compelling, well-structured blog post${topic ? ` about: ${topic}` : ""}${angle ? `. Angle: ${angle}` : ""}. Include an engaging headline, a strong opening hook, 3-4 substantive body sections with subheadings, and a punchy conclusion with a clear takeaway. Tone: executive, authoritative, and readable. Length: ~600-900 words.${sourceBlock}`;
      case "social": {
        const limits: Record<Platform, number> = { "LinkedIn": 3000, "X / Twitter": 280, "Instagram": 2200, "Facebook": 63206 };
        const limit = limits[platform];
        return `Write a ${platform} post${brief ? ` about: ${brief}` : ""}. Platform character limit: ${limit}. Write natively for ${platform} — match the tone, format, and conventions of top-performing ${platform} content. Include relevant hooks and calls to action. Stay under ${limit} characters.${sourceBlock}`;
      }
      case "email":
        return `Write marketing email copy${emailGoal ? ` for: ${emailGoal}` : ""}. Provide: (1) 3 subject line variants with preview text, (2) email body with strong opening, value proposition, and single clear CTA. Tone: professional, human, not salesy. Avoid spam trigger words.${sourceBlock}`;
      case "ad":
        return `Write performance ad copy${adProduct ? ` for: ${adProduct}` : ""}${adAudience ? `. Target audience: ${adAudience}` : ""}. Deliver: (1) 5 headline variants under 30 chars each, (2) 3 hook/opening lines, (3) 3 CTA variants, (4) one full ad script under 150 words. Focus on pain-to-solution framing.${sourceBlock}`;
      case "repurpose":
        return `Repurpose the following content into ${targetFormat}. Rewrite it natively for that format — don't just summarize. Preserve the core message but adapt tone, structure, and length for the new format.\n\nOriginal content:\n${existingContent || (source?.content ?? "")}`;
      case "brief":
        return `Generate a structured creative brief with the following inputs:\nProject: ${briefProject || "not specified"}\nTarget Audience: ${briefAudience || "not specified"}\nObjective: ${briefObjective || "not specified"}\n\nOutput a complete brief covering: project overview, objectives & KPIs, target audience profile, key message and tone, deliverables list, suggested timeline, and budget considerations. Format clearly with section headers.`;
    }
  }

  async function generate() {
    const prompt = buildPrompt();
    if (!prompt.trim()) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setOutput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          lens: { role: "cd", overrides: [] },
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
        setOutput(full);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setOutput("MAYA couldn't generate that right now. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function saveToBlogDraft() {
    if (!output) return;
    try {
      const pin = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "MAYA-ADMIN";
      await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": pin },
        body: JSON.stringify({
          title: topic || "Untitled Draft",
          excerpt: output.slice(0, 160),
          content: output,
          status: "draft",
          author: "MAYA Content Tools",
          tags: ["draft"],
        }),
      });
      alert("Saved as draft in Blog — open Admin to review and publish.");
    } catch {
      alert("Could not save to blog right now.");
    }
  }

  function renderForm() {
    const inputClass = "w-full bg-[#181825] border border-[#313244] text-[13px] text-[#cdd6f4] placeholder-[#585b70] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#89b4fa]/50";
    const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-[#585b70] mb-1.5 block";

    switch (activeTool) {
      case "blog":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Topic</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Why most exec decisions fail before they start" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Angle / Thesis</label>
              <input value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="e.g. Decisions fail at the framing stage, not execution" className={inputClass} />
            </div>
          </div>
        );
      case "social":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Platform</label>
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map((p) => (
                  <button key={p} onClick={() => setPlatform(p)} className={["text-[12px] px-3 py-1.5 rounded-lg border transition-colors", platform === p ? "bg-[#313244] text-[#89b4fa] border-[#89b4fa]/40" : "border-[#313244] text-[#585b70] hover:text-[#a6adc8]"].join(" ")}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass.replace("mb-1.5", "")}>What&apos;s it about?</label>
                <CharCount text={brief} limit={platform === "X / Twitter" ? 140 : 500} />
              </div>
              <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Topic, message, or key point…" rows={3} className={inputClass + " resize-none"} />
            </div>
          </div>
        );
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email Goal / Campaign</label>
              <input value={emailGoal} onChange={(e) => setEmailGoal(e.target.value)} placeholder="e.g. Product launch announcement, re-engagement, demo invite" className={inputClass} />
            </div>
          </div>
        );
      case "ad":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Product / Service</label>
              <input value={adProduct} onChange={(e) => setAdProduct(e.target.value)} placeholder="What are you promoting?" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Target Audience</label>
              <input value={adAudience} onChange={(e) => setAdAudience(e.target.value)} placeholder="e.g. Mid-market CMOs, B2B SaaS founders" className={inputClass} />
            </div>
          </div>
        );
      case "repurpose":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Target Format</label>
              <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)} className={inputClass}>
                {["LinkedIn post", "Twitter/X thread", "Email newsletter", "Blog post", "Instagram caption", "Press release", "Executive summary"].map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            {!source && (
              <div>
                <label className={labelClass}>Original Content</label>
                <textarea value={existingContent} onChange={(e) => setExistingContent(e.target.value)} placeholder="Paste content to repurpose…" rows={6} className={inputClass + " resize-none"} />
              </div>
            )}
          </div>
        );
      case "brief":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Project Name</label>
              <input value={briefProject} onChange={(e) => setBriefProject(e.target.value)} placeholder="e.g. Q3 Brand Campaign" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Target Audience</label>
              <input value={briefAudience} onChange={(e) => setBriefAudience(e.target.value)} placeholder="e.g. Enterprise HR leaders, 500–5000 employees" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Objective</label>
              <textarea value={briefObjective} onChange={(e) => setBriefObjective(e.target.value)} placeholder="What does success look like?" rows={3} className={inputClass + " resize-none"} />
            </div>
          </div>
        );
    }
  }

  return (
    <PageShell
      title="Content Tools"
      subtitle="MAYA drafts, you decide — every format, one workspace"
    >
      <div className="flex flex-col gap-5">
        {/* Tool selector */}
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTool(t.id); setOutput(""); }}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-medium transition-all",
                activeTool === t.id
                  ? "bg-[#313244] border-[#89b4fa]/40 text-[#89b4fa]"
                  : "bg-[#1e1e2e] border-[#313244] text-[#a6adc8] hover:border-[#45475a] hover:text-[#cdd6f4]",
              ].join(" ")}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Active source material banner */}
        {source && (
          <div className="flex items-center justify-between bg-[#89b4fa]/10 border border-[#89b4fa]/30 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[#89b4fa] text-[13px]">✦</span>
              <p className="text-[12px] text-[#89b4fa]">
                Source material active: <span className="font-semibold">{source.label}</span>
              </p>
            </div>
            <button onClick={clearSource} className="text-[11px] text-[#585b70] hover:text-[#f38ba8] transition-colors">
              Remove ×
            </button>
          </div>
        )}

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left — form */}
          <div className="lg:w-[380px] shrink-0 space-y-5">
            <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 space-y-4">
              <div>
                <p className="text-[13px] font-semibold text-[#cdd6f4]">{TOOLS.find((t) => t.id === activeTool)?.label}</p>
                <p className="text-[11px] text-[#585b70] mt-0.5">{TOOLS.find((t) => t.id === activeTool)?.desc}</p>
              </div>
              {renderForm()}
              <button
                onClick={generate}
                disabled={loading}
                className="w-full bg-[#89b4fa] text-[#1e1e2e] font-bold text-[13px] py-2.5 rounded-xl hover:bg-[#b4d0fa] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Generating…" : "Generate with MAYA"}
              </button>
            </div>

            {/* Social connect panel */}
            <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#585b70]">Social Connect</p>
              {[
                { name: "LinkedIn", icon: "🔵", phase: false },
                { name: "X / Twitter", icon: "⚫", phase: false },
                { name: "Instagram", icon: "🟣", phase: false },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <span className="text-[12px] text-[#a6adc8]">{s.name}</span>
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#585b70] border border-[#45475a] px-1.5 py-0.5 rounded">
                    Phase 2
                  </span>
                </div>
              ))}
              <p className="text-[10px] text-[#585b70] leading-relaxed">
                Native publish + post history import coming Phase 2. Use Inbox URL import now to bring content in from any platform.
              </p>
            </div>
          </div>

          {/* Right — output */}
          <OutputPanel
            output={output}
            loading={loading}
            onCopy={() => {}}
            onSaveToBlog={activeTool === "blog" ? saveToBlogDraft : undefined}
            tool={activeTool}
          />
        </div>
      </div>
    </PageShell>
  );
}
