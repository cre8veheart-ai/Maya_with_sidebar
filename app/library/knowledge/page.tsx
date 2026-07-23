import PageShell from "@/components/PageShell";

function VaultEntry({ title, role, type }: { title: string; role: string; type: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#313244] last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-base">🔒</span>
        <div>
          <p className="text-[13px] text-[#cdd6f4] font-medium">{title}</p>
          <p className="text-[11px] text-[#585b70]">{role}</p>
        </div>
      </div>
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#313244] text-[#a6adc8]">{type}</span>
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <PageShell
      title="Knowledge Vault"
      subtitle="Protected org knowledge — decisions, context, and institutional memory"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Vault entries */}
        <div className="md:col-span-2 bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
            Stored Knowledge
          </h2>
          <VaultEntry title="Knowledge builds as you use Maya" role="All roles" type="org" />
          <div className="mt-6 flex items-center justify-center">
            <p className="text-[12px] text-[#585b70] text-center max-w-xs">
              Every correction, override, and context note is stored here — owned by your org, not by Maya
            </p>
          </div>
        </div>

        {/* Vault stats */}
        <div className="space-y-4">
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              Vault Stats
            </h2>
            <div className="space-y-3">
              {[
                { label: "Entries", value: "0" },
                { label: "Roles covered", value: "0" },
                { label: "Overrides stored", value: "0" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-[#313244] pb-2 last:border-0">
                  <span className="text-[13px] text-[#cdd6f4]">{label}</span>
                  <span className="text-[13px] text-[#585b70]">{value}</span>
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
    </PageShell>
  );
}
