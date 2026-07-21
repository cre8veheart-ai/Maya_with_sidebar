import Link from "next/link";
import PageShell from "@/components/PageShell";

const execLinks = [
  { label: "CEO", href: "/ceo", desc: "Chief Executive" },
  { label: "CFO", href: "/cfo", desc: "Chief Financial" },
  { label: "COO", href: "/coo", desc: "Chief Operating" },
  { label: "CRO", href: "/cro", desc: "Chief Revenue" },
  { label: "CMO", href: "/cmo", desc: "Chief Marketing" },
  {
    label: "Creative Director",
    href: "/creative-director",
    desc: "Creative & Brand",
  },
  { label: "Titans Council", href: "/titans-council", desc: "Executive Council" },
];

const workspaceLinks = [
  { label: "Workflows", href: "/workflows" },
  { label: "Decisions", href: "/decisions" },
  { label: "Projects", href: "/projects" },
];

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard" subtitle="MAYA Executive Intelligence OS">
      {/* Ari feature card */}
      <div className="bg-[#1D1D1F] rounded-2xl p-6 mb-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-base select-none">✦</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-[15px] font-medium">Maya is ready</div>
          <div className="text-white/50 text-[13px]">
            Your executive intelligence
          </div>
        </div>
        <Link
          href="/ari"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[13px] rounded-lg transition-colors flex-shrink-0"
        >
          Open
        </Link>
      </div>

      {/* Executive Suite */}
      <section className="mb-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8E8E93] mb-3">
          Executive Suite
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {execLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-[#F9F9FB] hover:bg-[#F0F0F2] border border-[#E5E5EA] rounded-xl p-4 transition-colors"
            >
              <div className="text-[14px] font-medium text-[#1D1D1F] group-hover:text-[#0066CC] transition-colors">
                {link.label}
              </div>
              <div className="text-[12px] text-[#8E8E93] mt-0.5">{link.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Workspace */}
      <section className="mb-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8E8E93] mb-3">
          Workspace
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {workspaceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-[#F9F9FB] hover:bg-[#F0F0F2] border border-[#E5E5EA] rounded-xl p-4 transition-colors"
            >
              <div className="text-[14px] font-medium text-[#1D1D1F] group-hover:text-[#0066CC] transition-colors">
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
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Sessions", href: "/sessions" },
            { label: "Documents", href: "/documents" },
            { label: "Knowledge Vault", href: "/knowledge-vault" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-[#F9F9FB] hover:bg-[#F0F0F2] border border-[#E5E5EA] rounded-xl p-4 transition-colors"
            >
              <div className="text-[14px] font-medium text-[#1D1D1F] group-hover:text-[#0066CC] transition-colors">
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

