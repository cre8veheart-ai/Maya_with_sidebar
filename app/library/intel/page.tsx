"use client";

import { useState, useEffect } from "react";
import PageShell from "@/components/PageShell";

// ── Source catalog ────────────────────────────────────────────────────────────

const EXTERNAL_SOURCES = [
  // Legal
  {
    id: "westlaw",
    name: "Westlaw",
    category: "Legal",
    icon: "⚖️",
    desc: "Comprehensive legal research — case law, statutes, regulations, legal analysis",
    industry: "Legal / Law",
    credentialLabel: "Westlaw API Key",
    credentialPlaceholder: "Enter your Westlaw API key",
    credentialHint: "Found in your Westlaw Precision account → API Credentials",
    docsUrl: "https://developer.thomsonreuters.com",
    betaIncluded: false,
  },
  {
    id: "lexisnexis",
    name: "LexisNexis",
    category: "Legal & News",
    icon: "📰",
    desc: "Legal, news, and business information — case law, regulatory, public records",
    industry: "Legal / Compliance",
    credentialLabel: "LexisNexis API Key",
    credentialPlaceholder: "Enter your LexisNexis API key",
    credentialHint: "Available in your LexisNexis developer portal",
    docsUrl: "https://developer.lexisnexis.com",
    betaIncluded: false,
  },
  // Finance
  {
    id: "bloomberg",
    name: "Bloomberg Terminal",
    category: "Finance",
    icon: "📊",
    desc: "Real-time financial data, market intelligence, and economic research",
    industry: "Finance / Investment",
    credentialLabel: "Bloomberg API Key",
    credentialPlaceholder: "Enter your Bloomberg API key",
    credentialHint: "Available via Bloomberg Enterprise Access Point (BEAP)",
    docsUrl: "https://www.bloomberg.com/professional/product/enterprise-data-solutions/",
    betaIncluded: false,
  },
  {
    id: "factset",
    name: "FactSet",
    category: "Finance",
    icon: "📈",
    desc: "Financial data and analytics for investment professionals",
    industry: "Finance / Investment",
    credentialLabel: "FactSet API Key",
    credentialPlaceholder: "Enter your FactSet API key",
    credentialHint: "Available in FactSet Developer Portal → My API Keys",
    docsUrl: "https://developer.factset.com",
    betaIncluded: false,
  },
  // Medical & Science
  {
    id: "pubmed",
    name: "PubMed / NCBI",
    category: "Medical & Life Sciences",
    icon: "🔬",
    desc: "NIH biomedical literature — clinical research, trials, peer-reviewed publications. Free with NCBI API key.",
    industry: "Healthcare / Medical",
    credentialLabel: "NCBI API Key (optional)",
    credentialPlaceholder: "Enter your NCBI API key for higher rate limits",
    credentialHint: "Free — register at NCBI and generate a key for higher request limits",
    docsUrl: "https://www.ncbi.nlm.nih.gov/home/develop/api/",
    betaIncluded: true,
  },
  // Academic & Research
  {
    id: "ieee",
    name: "IEEE Xplore",
    category: "Engineering & Technology",
    icon: "⚡",
    desc: "IEEE technical journals, conference papers, and standards — engineering and applied sciences",
    industry: "Technology / Engineering",
    credentialLabel: "IEEE Xplore API Key",
    credentialPlaceholder: "Enter your IEEE Xplore API key",
    credentialHint: "Register at developer.ieee.org → Create Application",
    docsUrl: "https://developer.ieee.org",
    betaIncluded: false,
  },
  {
    id: "jstor",
    name: "JSTOR",
    category: "Academic / Humanities",
    icon: "📚",
    desc: "Scholarly journals, books, and primary sources across disciplines — humanities, social sciences, sciences",
    industry: "Academia / Research",
    credentialLabel: "JSTOR API Key",
    credentialPlaceholder: "Enter your JSTOR API key",
    credentialHint: "Available via JSTOR for Content Analysis (JFCA) program",
    docsUrl: "https://about.jstor.org/oa-and-free/",
    betaIncluded: false,
  },
  {
    id: "hbr",
    name: "Harvard Business Review",
    category: "Business Strategy",
    icon: "🎓",
    desc: "HBR articles, case studies, and management research — strategy, leadership, and org behavior",
    industry: "Business / Management",
    credentialLabel: "HBR API / RSS Feed URL",
    credentialPlaceholder: "Enter your HBR API key or RSS endpoint",
    credentialHint: "Contact HBR Institutional Access for API credentials",
    docsUrl: "https://hbr.org",
    betaIncluded: false,
  },
  // Industry-specific
  {
    id: "pitchbook",
    name: "PitchBook",
    category: "Venture & M&A",
    icon: "🚀",
    desc: "Private market data — VC, PE, M&A deals, valuations, and company intelligence",
    industry: "Finance / VC / M&A",
    credentialLabel: "PitchBook API Key",
    credentialPlaceholder: "Enter your PitchBook API key",
    credentialHint: "Available in PitchBook platform → Data Exports → API Access",
    docsUrl: "https://pitchbook.com/platform/data-hub",
    betaIncluded: false,
  },
  {
    id: "employment-law",
    name: "Employment Law Guide",
    category: "HR / Compliance",
    icon: "👥",
    desc: "Federal and state employment law database — compliance, standards, regulations for HR and Legal",
    industry: "HR / Legal / Compliance",
    credentialLabel: "Employment Law Guide API Key",
    credentialPlaceholder: "Enter your API key",
    credentialHint: "Available from your employment law data provider",
    docsUrl: "https://www.dol.gov/agencies/whd/compliance-assistance/toolkits",
    betaIncluded: false,
  },
  // Custom
  {
    id: "custom",
    name: "Custom Source",
    category: "User-defined",
    icon: "🔗",
    desc: "Connect any proprietary database, internal API, or domain-specific knowledge source",
    industry: "Any",
    credentialLabel: "API Key or Endpoint",
    credentialPlaceholder: "Enter your API key or endpoint URL",
    credentialHint: "Paste any API key, ****** or endpoint URL",
    docsUrl: "",
    betaIncluded: true,
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type SourceId = (typeof EXTERNAL_SOURCES)[number]["id"];

interface Connection {
  sourceId: SourceId;
  credential: string;
  connectedAt: string;
  label?: string;
}

const STORAGE_KEY = "maya_intel_connections";

function loadConnections(): Record<string, Connection> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Connection>) : {};
  } catch {
    return {};
  }
}

function saveConnections(connections: Record<string, Connection>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
}

// ── Credential Modal ───────────────────────────────────────────────────────────

function CredentialModal({
  source,
  existing,
  onSave,
  onCancel,
}: {
  source: (typeof EXTERNAL_SOURCES)[number];
  existing?: Connection;
  onSave: (credential: string, label: string) => void;
  onCancel: () => void;
}) {
  const [credential, setCredential] = useState(existing?.credential ?? "");
  const [label, setLabel] = useState(existing?.label ?? "");
  const [show, setShow] = useState(false);

  const canSave = credential.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{source.icon}</span>
          <div>
            <h2 className="text-[15px] font-semibold text-[#cdd6f4]">
              {existing ? "Update" : "Connect"} {source.name}
            </h2>
            <p className="text-[11px] text-[#585b70]">{source.category}</p>
          </div>
        </div>

        {/* Beta badge */}
        {source.betaIncluded && (
          <div className="flex items-center gap-2 bg-[#89b4fa]/10 border border-[#89b4fa]/20 rounded-lg px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#89b4fa]">Beta: Included</span>
            <span className="text-[11px] text-[#a6adc8]">— no charge during beta</span>
          </div>
        )}

        {/* Description */}
        <p className="text-[12px] text-[#a6adc8] leading-relaxed">{source.desc}</p>

        {/* Custom label */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-1.5">
            Nickname (optional)
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={`e.g. "Org Westlaw Account"`}
            className="w-full bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa]/50"
          />
        </div>

        {/* Credential input */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-1.5">
            {source.credentialLabel}
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder={source.credentialPlaceholder}
              className="w-full bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 pr-10 text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa]/50"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#585b70] hover:text-[#a6adc8] text-[11px]"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-[#585b70]">{source.credentialHint}</p>
        </div>

        {/* Privacy note */}
        <p className="text-[11px] text-[#585b70] border-t border-[#313244] pt-3">
          🔒 Credentials are stored locally in your browser vault. MAYA never transmits or stores your API keys on external servers.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          {source.docsUrl && (
            <a
              href={source.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#89b4fa] hover:underline"
            >
              Get API key ↗
            </a>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onCancel}
              className="text-[12px] text-[#585b70] border border-[#313244] px-4 py-1.5 rounded-lg hover:bg-[#313244] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => canSave && onSave(credential.trim(), label.trim())}
              disabled={!canSave}
              className={[
                "text-[12px] font-semibold px-4 py-1.5 rounded-lg transition-colors",
                canSave
                  ? "bg-[#89b4fa]/20 text-[#89b4fa] border border-[#89b4fa]/30 hover:bg-[#89b4fa]/30"
                  : "bg-[#313244] text-[#585b70] border border-[#313244] cursor-not-allowed",
              ].join(" ")}
            >
              {existing ? "Update" : "Connect"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Source Card ────────────────────────────────────────────────────────────────

function SourceCard({
  source,
  connection,
  onConnect,
  onDisconnect,
}: {
  source: (typeof EXTERNAL_SOURCES)[number];
  connection?: Connection;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const isConnected = !!connection;
  return (
    <div
      className={[
        "bg-[#1e1e2e] border rounded-xl p-4 flex flex-col gap-3 transition-all",
        isConnected
          ? "border-[#89b4fa]/50"
          : "border-[#313244] hover:border-[#585b70]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{source.icon}</span>
          <div>
            <p className="text-[13px] font-semibold text-[#cdd6f4]">
              {connection?.label || source.name}
            </p>
            <p className="text-[10px] text-[#585b70]">{source.category}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isConnected && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1] inline-block" />
              <span className="text-[10px] text-[#a6e3a1]">Connected</span>
            </span>
          )}
          {source.betaIncluded && (
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#89b4fa] border border-[#89b4fa]/30 px-1.5 py-0.5 rounded">
              Beta: Free
            </span>
          )}
        </div>
      </div>

      <p className="text-[12px] text-[#585b70] leading-relaxed">{source.desc}</p>

      {isConnected && connection?.connectedAt && (
        <p className="text-[10px] text-[#585b70]">
          Connected {new Date(connection.connectedAt).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto gap-2">
        <span className="text-[10px] text-[#585b70] italic">{source.industry}</span>
        <div className="flex gap-2">
          {isConnected && (
            <button
              onClick={onConnect}
              className="text-[11px] text-[#585b70] border border-[#585b70]/30 px-2 py-1 rounded-lg hover:bg-[#585b70]/10 transition-colors"
            >
              Edit
            </button>
          )}
          <button
            onClick={isConnected ? onDisconnect : onConnect}
            className={[
              "text-[11px] font-semibold px-3 py-1 rounded-lg transition-colors",
              isConnected
                ? "text-[#f38ba8] border border-[#f38ba8]/30 hover:bg-[#f38ba8]/10"
                : "text-[#89b4fa] border border-[#89b4fa]/30 hover:bg-[#89b4fa]/10",
            ].join(" ")}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IntelVaultPage() {
  const [connections, setConnections] = useState<Record<string, Connection>>({});
  const [modalSourceId, setModalSourceId] = useState<SourceId | null>(null);

  useEffect(() => {
    setConnections(loadConnections());
  }, []);

  const handleSave = (credential: string, label: string) => {
    if (!modalSourceId) return;
    const updated = {
      ...connections,
      [modalSourceId]: {
        sourceId: modalSourceId,
        credential,
        label: label || undefined,
        connectedAt: connections[modalSourceId]?.connectedAt ?? new Date().toISOString(),
      },
    };
    setConnections(updated);
    saveConnections(updated);
    setModalSourceId(null);
  };

  const handleDisconnect = (id: SourceId) => {
    const updated = { ...connections };
    delete updated[id];
    setConnections(updated);
    saveConnections(updated);
  };

  const connectedCount = Object.keys(connections).length;
  const modalSource = modalSourceId
    ? EXTERNAL_SOURCES.find((s) => s.id === modalSourceId)
    : null;

  return (
    <PageShell
      title="Intel Vault"
      subtitle="Adaptive intelligence + external domain sources — the trained memory that makes Maya yours"
    >
      <div className="space-y-6">
        {/* Internal intel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              Stored Intel — Internal
            </h2>
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <span className="text-3xl">🧠</span>
              <p className="text-[13px] text-[#585b70] text-center max-w-xs">
                Intel accumulates through your sessions — each correction, scope redirect, and context note trains your exec lens
              </p>
              <p className="text-[12px] text-[#585b70] text-center max-w-xs mt-1">
                Stored here, recalled on demand. Owned by your org.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
                By Role
              </h2>
              <div className="space-y-2">
                {["CEO", "COO", "CFO", "CMO", "CTO", "CIO", "CRO", "CD"].map((role) => (
                  <div
                    key={role}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-[#313244]"
                  >
                    <span className="text-[13px] text-[#cdd6f4]">{role}</span>
                    <span className="text-[11px] text-[#585b70]">0 entries</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-3">
                Access Control
              </h2>
              <p className="text-[12px] text-[#585b70]">
                Vault access is org-controlled. VPN integration available in Phase 2.
              </p>
            </div>
          </div>
        </div>

        {/* External source connectors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[#cdd6f4]">Professional Sources</h2>
              <p className="text-[13px] text-[#a6adc8] mt-0.5">
                Connect journals, databases, and knowledge bases — your industry, your sources
              </p>
            </div>
            {connectedCount > 0 && (
              <span className="text-[12px] text-[#a6e3a1] border border-[#a6e3a1]/30 px-3 py-1 rounded-full">
                {connectedCount} connected
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXTERNAL_SOURCES.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                connection={connections[source.id]}
                onConnect={() => setModalSourceId(source.id as SourceId)}
                onDisconnect={() => handleDisconnect(source.id as SourceId)}
              />
            ))}
          </div>

          <p className="mt-4 text-[12px] text-[#585b70]">
            Professional sources augment MAYA with domain expertise specific to your industry. Credentials are stored locally in your browser vault and never transmitted to MAYA servers. Org authentication is managed by your team.
          </p>
        </div>
      </div>

      {/* Credential modal */}
      {modalSource && (
        <CredentialModal
          source={modalSource}
          existing={connections[modalSource.id]}
          onSave={handleSave}
          onCancel={() => setModalSourceId(null)}
        />
      )}
    </PageShell>
  );
}
