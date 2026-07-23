import PageShell from "@/components/PageShell";

function IntelRow({ title, source, role }: { title: string; source: string; role: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#313244] last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-base">🧠</span>
        <div>
          <p className="text-[13px] text-[#cdd6f4] font-medium">{title}</p>
          <p className="text-[11px] text-[#585b70]">{source}</p>
        </div>
      </div>
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#313244] text-[#89b4fa]">{role}</span>
    </div>
  );
}

export default function IntelVaultPage() {
  return (
    <PageShell
      title="Intel Vault"
      subtitle="Adaptive intelligence — the trained memory that makes Maya yours"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Intel entries */}
        <div className="md:col-span-2 bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
            Stored Intel
          </h2>
          <IntelRow
            title="Intel accumulates through your sessions"
            source="Maya adaptive engine"
            role="all"
          />
          <div className="mt-6 flex items-center justify-center">
            <p className="text-[12px] text-[#585b70] text-center max-w-xs">
              Each session, correction, and scope redirect trains your exec lens — stored here, recalled on demand
            </p>
          </div>
        </div>

        {/* Intel breakdown by role */}
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
      </div>
    </PageShell>
  );
}
