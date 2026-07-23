"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCampaignStorage } from "@/lib/storage/CampaignStorageContext";
import type { Campaign, CampaignStatus } from "@/lib/types/campaign";
import { CAMPAIGN_PHASES } from "@/lib/types/campaign";
import PageShell from "@/components/PageShell";

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId() {
  return `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generatePhaseId() {
  return `ph_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const STATUS_STYLES: Record<CampaignStatus, string> = {
  brief:            "bg-[#F0F0F2] text-[#6E6E73]",
  "pre-production": "bg-[#FFF8E6] text-[#996600]",
  production:       "bg-[#E8F5E9] text-[#1B5E20]",
  "post-production":"bg-[#E3F2FD] text-[#0D47A1]",
  delivery:         "bg-[#F3E8FF] text-[#6B21A8]",
  complete:         "bg-[#F0F0F2] text-[#3D3D3D]",
  archived:         "bg-[#F5F5F7] text-[#AEAEB2]",
};

const STATUS_LABELS: Record<CampaignStatus, string> = {
  brief:            "Brief",
  "pre-production": "Pre-Production",
  production:       "Production",
  "post-production":"Post-Production",
  delivery:         "Delivery",
  complete:         "Complete",
  archived:         "Archived",
};

// ── Icons ─────────────────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M7 2v10M2 7h10" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="#AEAEB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 1l5 5-5 5" />
  </svg>
);

// ── Create campaign modal ─────────────────────────────────────────────────────

interface CreateCampaignModalProps {
  onClose: () => void;
  onCreate: (title: string, client: string, objective: string) => Promise<void>;
}

function CreateCampaignModal({ onClose, onCreate }: CreateCampaignModalProps) {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [objective, setObjective] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onCreate(title.trim(), client.trim(), objective.trim());
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-[17px] font-semibold text-[#1D1D1F] mb-5">New Campaign</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5 uppercase tracking-wide">Campaign Name *</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Q3 Brand Launch"
              className="w-full px-3 py-2.5 text-[14px] border border-[#E5E5EA] rounded-xl bg-[#F9F9FB] outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/20"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5 uppercase tracking-wide">Client / Brand</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Acme Corp"
              className="w-full px-3 py-2.5 text-[14px] border border-[#E5E5EA] rounded-xl bg-[#F9F9FB] outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/20"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5 uppercase tracking-wide">Objective</label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What does this campaign need to achieve?"
              rows={3}
              className="w-full px-3 py-2.5 text-[14px] border border-[#E5E5EA] rounded-xl bg-[#F9F9FB] outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/20 resize-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-[13px] font-medium border border-[#E5E5EA] rounded-xl text-[#3D3D3D] hover:bg-[#F0F0F2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || saving}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold bg-[#1D1D1F] text-white rounded-xl hover:bg-[#3D3D3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Creating…" : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Campaign card ─────────────────────────────────────────────────────────────

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const completedPhases = campaign.phases.filter((p) => p.status === "approved").length;
  const totalPhases = campaign.phases.length;
  const progress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="group block bg-white border border-[#E5E5EA] rounded-2xl p-5 hover:border-[#C7C7CC] hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-[#1D1D1F] group-hover:text-[#0066CC] transition-colors truncate">
            {campaign.title}
          </h3>
          {campaign.client && (
            <p className="text-[12px] text-[#8E8E93] mt-0.5">{campaign.client}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${STATUS_STYLES[campaign.status]}`}>
            {STATUS_LABELS[campaign.status]}
          </span>
          <ChevronIcon />
        </div>
      </div>

      {campaign.objective && (
        <p className="text-[13px] text-[#6E6E73] mb-4 line-clamp-2 leading-relaxed">
          {campaign.objective}
        </p>
      )}

      {/* Phase progress bar */}
      <div className="mb-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-[#AEAEB2]">Phase progress</span>
          <span className="text-[11px] text-[#AEAEB2]">{completedPhases}/{totalPhases}</span>
        </div>
        <div className="h-1 bg-[#F0F0F2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0066CC] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-[11px] text-[#AEAEB2] mt-3">Created {formatDate(campaign.createdAt)}</p>
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const storage = useCampaignStorage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");

  const reload = useCallback(async () => {
    const all = await storage.list();
    setCampaigns(all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }, [storage]);

  useEffect(() => { reload(); }, [reload]);

  const handleCreate = async (title: string, client: string, objective: string) => {
    const now = new Date().toISOString();
    const campaign: Campaign = {
      id: generateId(),
      title,
      client: client || undefined,
      objective: objective || undefined,
      status: "brief",
      phases: CAMPAIGN_PHASES.map((p) => ({
        ...p,
        id: generatePhaseId(),
        contributions: [],
      })),
      createdAt: now,
      updatedAt: now,
    };
    await storage.save(campaign);
    setShowCreate(false);
    reload();
  };

  const filtered = filter === "all"
    ? campaigns
    : campaigns.filter((c) => c.status === filter);

  const active = campaigns.filter((c) => !["complete", "archived"].includes(c.status));
  const statusFilters: { id: CampaignStatus | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "brief", label: "Brief" },
    { id: "pre-production", label: "Pre-Production" },
    { id: "production", label: "Production" },
    { id: "post-production", label: "Post-Production" },
    { id: "delivery", label: "Delivery" },
    { id: "complete", label: "Complete" },
  ];

  return (
    <PageShell
      title="Campaigns"
      subtitle={`${active.length} active campaign${active.length !== 1 ? "s" : ""}`}
      action={
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium bg-[#1D1D1F] text-white rounded-xl hover:bg-[#3D3D3D] transition-colors"
        >
          <PlusIcon />
          New Campaign
        </button>
      }
    >
      {/* Filter tabs */}
      {campaigns.length > 0 && (
        <div className="flex gap-1 mb-6 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={[
                "px-3 py-1.5 rounded-lg text-[12px] transition-colors",
                filter === f.id
                  ? "bg-[#1D1D1F] text-white font-medium"
                  : "text-[#6E6E73] hover:bg-[#F0F0F2]",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Campaign grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          {campaigns.length === 0 ? (
            <>
              <p className="text-[14px] font-medium text-[#6E6E73]">No campaigns yet</p>
              <p className="text-[13px] text-[#AEAEB2] mt-1 max-w-xs">
                Create your first campaign. Maya will help generate the brief and coordinate across every exec function.
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-5 flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-[#1D1D1F] text-white rounded-xl hover:bg-[#3D3D3D] transition-colors"
              >
                <PlusIcon />
                New Campaign
              </button>
            </>
          ) : (
            <p className="text-[14px] text-[#AEAEB2]">No campaigns in this stage</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateCampaignModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </PageShell>
  );
}
