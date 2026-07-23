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

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#313244] last:border-0">
      <span className="text-[13px] text-[#cdd6f4]">{label}</span>
      <span className="text-[13px] text-[#585b70]">{value}</span>
    </div>
  );
}

export default function CroPage() {
  return (
    <PageShell title="CRO" subtitle="Chief Revenue Officer workspace">
      {/* Row 1 — Revenue Pulse + Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <SectionCard title="Revenue Pulse">
          <MetricRow label="ARR / MRR" value="—" />
          <MetricRow label="Pipeline value" value="—" />
          <MetricRow label="Win rate" value="—" />
          <MetricRow label="Churn rate" value="—" />
        </SectionCard>

        <SectionCard title="Pipeline by Stage">
          <div className="space-y-2.5">
            {["Prospecting", "Qualified", "Proposal", "Negotiation", "Closed Won"].map((stage) => (
              <div key={stage} className="flex items-center gap-3">
                <span className="text-[12px] text-[#a6adc8] w-24 flex-shrink-0">{stage}</span>
                <div className="flex-1 h-1.5 bg-[#313244] rounded-full">
                  <div className="h-full bg-[#89b4fa] rounded-full" style={{ width: "0%" }} />
                </div>
                <span className="text-[12px] text-[#585b70] w-6 text-right">0</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 2 — Active Deals + Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SectionCard title="Active Deals" className="md:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-[#585b70] text-left border-b border-[#313244]">
                  <th className="pb-2 font-medium">Account</th>
                  <th className="pb-2 font-medium">Stage</th>
                  <th className="pb-2 font-medium">Value</th>
                  <th className="pb-2 font-medium">Close date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="pt-4 text-center text-[#585b70]">
                    Deals surface as you train Maya on your pipeline
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Revenue Priorities">
          <ol className="space-y-2">
            {["Priority 1", "Priority 2", "Priority 3"].map((p, i) => (
              <li key={p} className="flex items-start gap-2">
                <span className="text-[11px] text-[#89b4fa] font-bold mt-0.5">{i + 1}</span>
                <span className="text-[13px] text-[#585b70]">Not set</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </PageShell>
  );
}
