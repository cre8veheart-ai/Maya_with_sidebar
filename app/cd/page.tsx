import PageShell from "@/components/PageShell";

function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 ${className ?? ""}`}>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
        {title}
      </h2>
      {children ?? (
        <div className="flex items-center justify-center h-20">
          <p className="text-[13px] text-[#585b70]">No items yet</p>
        </div>
      )}
    </div>
  );
}

function PhaseRow({ phase, owner, status }: { phase: string; owner: string; status: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#313244] last:border-0">
      <div>
        <p className="text-[13px] text-[#cdd6f4] font-medium">{phase}</p>
        <p className="text-[11px] text-[#585b70]">{owner}</p>
      </div>
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#313244] text-[#a6adc8]">{status}</span>
    </div>
  );
}

export default function CdPage() {
  return (
    <PageShell title="CD" subtitle="Creative Director workspace">
      {/* Row 1 — Active Campaigns + Production Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <SectionCard title="Active Campaigns">
          <div className="flex items-center justify-center h-20">
            <p className="text-[12px] text-[#585b70]">Campaigns link from the Campaigns layer</p>
          </div>
        </SectionCard>

        <SectionCard title="Production Phases">
          <PhaseRow phase="Brief & Strategy" owner="CMO / Account" status="not started" />
          <PhaseRow phase="Concepting" owner="Creative team" status="not started" />
          <PhaseRow phase="Pre-production" owner="CD / Traffic" status="not started" />
          <PhaseRow phase="Production" owner="Vendors" status="not started" />
          <PhaseRow phase="Review & Delivery" owner="Account / Client" status="not started" />
        </SectionCard>
      </div>

      {/* Row 2 — Vendor Roster + Traffic + Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SectionCard title="Vendor Roster" className="md:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-[#585b70] text-left border-b border-[#313244]">
                  <th className="pb-2 font-medium">Vendor</th>
                  <th className="pb-2 font-medium">Specialty</th>
                  <th className="pb-2 font-medium">Availability</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="pt-4 text-center text-[#585b70]">
                    Vendors load from your Decisions vault
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Traffic & Deadlines">
          <ol className="space-y-2">
            {["Asset 1", "Asset 2", "Asset 3"].map((a, i) => (
              <li key={a} className="flex items-start gap-2">
                <span className="text-[11px] text-[#89b4fa] font-bold mt-0.5">{i + 1}</span>
                <span className="text-[13px] text-[#585b70]">No deadline set</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-[#585b70] mt-3 text-center">Traffic surfaces from campaign phases</p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
