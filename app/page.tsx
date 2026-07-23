import Link from "next/link";

const EXEC_SUITE = [
  { label: "CEO", href: "/ceo", icon: "🏛️", desc: "Vision & direction" },
  { label: "COO", href: "/coo", icon: "⚙️", desc: "Operations & execution" },
  { label: "CMO", href: "/cmo", icon: "📣", desc: "Brand & market" },
  { label: "CFO", href: "/cfo", icon: "💰", desc: "Finance & risk" },
  { label: "CTO", href: "/cto", icon: "🖥️", desc: "Technology & systems" },
  { label: "CIO", href: "/cio", icon: "🔷", desc: "Information & data" },
  { label: "CRO", href: "/cro", icon: "📈", desc: "Revenue & growth" },
  { label: "CD", href: "/cd", icon: "🎨", desc: "Creative & production" },
  { label: "HR", href: "/hr", icon: "👥", desc: "People & org" },
  { label: "Legal", href: "/legal", icon: "⚖️", desc: "Risk & compliance" },
  { label: "Office Admin", href: "/office-admin", icon: "🗂️", desc: "Operations backbone" },
];

const OPERATIONS = [
  { label: "Strategy Room", href: "/strategy-room", icon: "🧩", desc: "Multi-lens synthesis — assemble the room, run the decision" },
  { label: "Decisions", href: "/decisions", icon: "⚖️", desc: "The decision layer — every call logged, attributed, queryable" },
  { label: "Campaigns", href: "/campaigns", icon: "🚀", desc: "Cross-functional execution — each role contributes their piece" },
];

const LIBRARY = [
  { label: "Sessions", href: "/library/sessions", icon: "🗂️", desc: "Full conversation history — never re-onboard" },
  { label: "Documents", href: "/library/documents", icon: "📄", desc: "Org docs and briefs — queryable by MAYA" },
  { label: "Knowledge Vault", href: "/library/knowledge", icon: "🔒", desc: "Protected org knowledge — decisions and context" },
  { label: "Intel Vault", href: "/library/intel", icon: "🧠", desc: "Adaptive intelligence + external domain sources" },
];

export default function Home() {
  return (
    <div className="px-8 py-10 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-[#cdd6f4] tracking-tight leading-tight">
          Your executive workspace.
        </h1>
        <p className="mt-2 text-[15px] text-[#a6adc8] max-w-xl">
          A thought partner with no agenda. You build the operating conditions — MAYA surfaces what matters and waits for your call.
        </p>
        <p className="mt-3 text-[12px] text-[#585b70] font-medium tracking-wide uppercase">
          Doesn&apos;t act without you.
        </p>
      </div>

      {/* Executive Suite */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#585b70]">Executive Suite</span>
          <div className="flex-1 h-px bg-[#313244]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {EXEC_SUITE.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-[#1e1e2e] border border-[#313244] rounded-xl p-4 hover:border-[#89b4fa]/60 hover:bg-[#1e1e2e] transition-all"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-lg">{item.icon}</span>
                <span className="text-[13px] font-semibold text-[#cdd6f4] group-hover:text-[#89b4fa] transition-colors">
                  {item.label}
                </span>
              </div>
              <p className="text-[11px] text-[#585b70]">{item.desc}</p>
            </Link>
          ))}
          {/* Titans Council — Phase 2 */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4 opacity-40 cursor-not-allowed">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-lg">👑</span>
              <span className="text-[13px] font-semibold text-[#cdd6f4]">Titans Council</span>
            </div>
            <p className="text-[11px] text-[#585b70]">On-demand board of directors</p>
            <span className="mt-2 inline-block text-[9px] font-semibold uppercase tracking-wider text-[#585b70] border border-[#313244] px-1.5 py-0.5 rounded">
              Phase 2
            </span>
          </div>
        </div>
      </section>

      {/* Operations */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#585b70]">Operations</span>
          <div className="flex-1 h-px bg-[#313244]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {OPERATIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-[#1e1e2e] border border-[#313244] rounded-xl p-4 hover:border-[#89b4fa]/60 transition-all"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-lg">{item.icon}</span>
                <span className="text-[13px] font-semibold text-[#cdd6f4] group-hover:text-[#89b4fa] transition-colors">
                  {item.label}
                </span>
              </div>
              <p className="text-[11px] text-[#585b70] leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Library */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#585b70]">Library</span>
          <div className="flex-1 h-px bg-[#313244]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LIBRARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-[#1e1e2e] border border-[#313244] rounded-xl p-4 hover:border-[#89b4fa]/60 transition-all"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-lg">{item.icon}</span>
                <span className="text-[13px] font-semibold text-[#cdd6f4] group-hover:text-[#89b4fa] transition-colors">
                  {item.label}
                </span>
              </div>
              <p className="text-[11px] text-[#585b70] leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-[#313244] pt-6 flex items-center justify-between">
        <p className="text-[12px] text-[#585b70]">
          MAYA synthesizes across all your lenses — and waits for you to decide.
        </p>
        <Link
          href="/strategy-room"
          className="text-[12px] text-[#89b4fa] hover:underline"
        >
          Open Strategy Room →
        </Link>
      </div>
    </div>
  );
}
