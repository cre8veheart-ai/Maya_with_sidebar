import Link from "next/link";
import PageShell from "@/components/PageShell";

// ── Feature status data ────────────────────────────────────────────────────────

type FeatureStatus = "live" | "building" | "planned";

interface Feature {
  name: string;
  desc: string;
  status: FeatureStatus;
}

const FEATURES: Feature[] = [
  { name: "Maya (AI)",         desc: "GPT-4o executive intelligence, streaming",      status: "live" },
  { name: "Knowledge Vault",   desc: "Org context Maya reads every session",          status: "live" },
  { name: "Decisions",         desc: "Log and query strategic decisions",             status: "live" },
  { name: "Workflows",         desc: "Build and track exec workflows",                status: "live" },
  { name: "Campaigns",         desc: "Full campaign lifecycle, multi-exec phases",    status: "live" },
  { name: "Intel Vault",       desc: "Access control, audit trail, export approvals", status: "live" },
  { name: "Suggestion Cloud",  desc: "Multi-user shared suggestion pool",             status: "building" },
  { name: "Outlook",           desc: "Calendar, inbox triage, draft + send",         status: "building" },
  { name: "Teams",             desc: "Meeting transcripts → vault auto-feed",        status: "planned" },
  { name: "Slack",             desc: "Key channels + DMs → exec signal extraction",  status: "planned" },
  { name: "Salesforce",        desc: "Pipeline health for CRO / CEO lens",           status: "planned" },
  { name: "Adaptive Learning", desc: "Per-role trainable lens, persistent memory",   status: "planned" },
  { name: "Way Back Machine",  desc: "Queryable org state history over time",        status: "planned" },
  { name: "Altitude",          desc: "Enterprise / network layer above MAYA",        status: "planned" },
];

const STATUS_CONFIG: Record<FeatureStatus, { label: string; dot: string; text: string }> = {
  live:     { label: "Live",     dot: "bg-[#2D7D46]", text: "text-[#2D7D46]" },
  building: { label: "Building", dot: "bg-[#996600]", text: "text-[#996600]" },
  planned:  { label: "Planned",  dot: "bg-[#AEAEB2]", text: "text-[#8E8E93]" },
};

// ── Nav link data ──────────────────────────────────────────────────────────────

const execLinks = [
  { label: "CEO", href: "/ceo", desc: "Chief Executive" },
  { label: "CFO", href: "/cfo", desc: "Chief Financial" },
  { label: "COO", href: "/coo", desc: "Chief Operating" },
  { label: "CRO", href: "/cro", desc: "Chief Revenue" },
  { label: "CMO", href: "/cmo", desc: "Chief Marketing" },
  { label: "Creative Director", href: "/creative-director", desc: "Creative & Brand" },
  { label: "Titans Council", href: "/titans-council", desc: "Executive Council" },
];

const workspaceLinks = [
  { label: "Campaigns",   href: "/campaigns" },
  { label: "Workflows",   href: "/workflows" },
  { label: "Decisions",   href: "/decisions" },
  { label: "Projects",    href: "/projects" },
  { label: "Suggestions", href: "/suggestions" },
];

const libraryLinks = [
  { label: "Sessions",       href: "/sessions" },
  { label: "Documents",      href: "/documents" },
  { label: "Knowledge Vault", href: "/knowledge-vault" },
  { label: "Intel Vault",    href: "/vault" },
];

// ── Feature Status panel ───────────────────────────────────────────────────────

function FeatureStatusPanel() {
  const groups: FeatureStatus[] = ["live", "building", "planned"];
  return (
    <div className="border border-[#EBEBED] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0F2]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#8E8E93]">
          Feature Status
        </p>
      </div>
      <div className="divide-y divide-[#F0F0F2]">
        {groups.map((status) => {
          const cfg = STATUS_CONFIG[status];
          const items = FEATURES.filter((f) => f.status === status);
          return (
            <div key={status} className="px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${cfg.text}`}>
                  {cfg.label}
                </span>
                <span className="text-[11px] text-[#AEAEB2]">({items.length})</span>
              </div>
              <ul className="space-y-2.5">
                {items.map((f) => (
                  <li key={f.name}>
                    <p className="text-[13px] font-medium text-[#1D1D1F] leading-none">{f.name}</p>
                    <p className="text-[11.5px] text-[#8E8E93] mt-0.5 leading-snug">{f.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard" subtitle="MAYA Executive Intelligence OS">
      <div className="flex gap-8 items-start">

        {/* ── Left column ── */}
        <div className="flex-1 min-w-0">

          {/* Maya card — gallery white */}
          <div className="border border-[#EBEBED] rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-[#1D1D1F] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-base select-none">✦</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-[#1D1D1F]">Maya is ready</div>
              <div className="text-[13px] text-[#8E8E93]">Your executive intelligence</div>
            </div>
            <Link
              href="/ari"
              className="px-4 py-2 bg-[#1D1D1F] hover:bg-[#3D3D3D] text-white text-[13px] font-medium rounded-lg transition-colors flex-shrink-0"
            >
              Open
            </Link>
          </div>

          {/* Executive Suite */}
          <section className="mb-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8E8E93] mb-3">
              Executive Suite
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {execLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group border border-[#EBEBED] rounded-xl p-4 hover:border-[#C7C7CC] transition-colors"
                >
                  <div className="text-[13.5px] font-medium text-[#1D1D1F] group-hover:text-[#0066CC] transition-colors">
                    {link.label}
                  </div>
                  <div className="text-[11.5px] text-[#AEAEB2] mt-0.5">{link.desc}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Workspace */}
          <section className="mb-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8E8E93] mb-3">
              Workspace
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {workspaceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group border border-[#EBEBED] rounded-xl p-4 hover:border-[#C7C7CC] transition-colors"
                >
                  <div className="text-[13.5px] font-medium text-[#1D1D1F] group-hover:text-[#0066CC] transition-colors">
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Library */}
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8E8E93] mb-3">
              Library
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {libraryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group border border-[#EBEBED] rounded-xl p-4 hover:border-[#C7C7CC] transition-colors"
                >
                  <div className="text-[13.5px] font-medium text-[#1D1D1F] group-hover:text-[#0066CC] transition-colors">
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right column — Feature Status ── */}
        <div className="w-72 flex-shrink-0 hidden lg:block">
          <FeatureStatusPanel />
        </div>

      </div>
    </PageShell>
  );
}

