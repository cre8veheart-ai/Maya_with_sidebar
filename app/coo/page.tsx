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

function PulseRow({ label, value, status }: { label: string; value: string; status: "green" | "yellow" | "red" }) {
  const dot: Record<typeof status, string> = {
    green: "bg-[#a6e3a1]",
    yellow: "bg-[#f9e2af]",
    red: "bg-[#f38ba8]",
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#313244] last:border-0">
      <span className="text-[13px] text-[#cdd6f4]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-[#a6adc8]">{value}</span>
        <span className={`w-2 h-2 rounded-full ${dot[status]}`} />
      </div>
    </div>
  );
}

function ProjectRow({ name, phase, owner }: { name: string; phase: string; owner: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#313244] last:border-0">
      <div>
        <p className="text-[13px] text-[#cdd6f4] font-medium">{name}</p>
        <p className="text-[11px] text-[#585b70]">{owner}</p>
      </div>
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#313244] text-[#89b4fa]">{phase}</span>
    </div>
  );
}

export default function CooPage() {
  return (
    <PageShell title="COO" subtitle="Chief Operating Officer workspace">
      {/* Row 1 — Ops Pulse + Active Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <SectionCard title="Ops Pulse">
          <PulseRow label="Delivery on-time rate" value="—" status="green" />
          <PulseRow label="Escalations open" value="—" status="yellow" />
          <PulseRow label="Resource utilization" value="—" status="green" />
          <PulseRow label="Process blockers" value="—" status="red" />
        </SectionCard>

        <SectionCard title="Active Projects">
          <ProjectRow name="Add a project" phase="Planning" owner="Unassigned" />
          <div className="mt-3 flex items-center justify-center">
            <p className="text-[12px] text-[#585b70]">Projects populate from Decisions layer</p>
          </div>
        </SectionCard>
      </div>

      {/* Row 2 — Resources + Process Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <SectionCard title="Resource Allocation">
          <div className="space-y-3">
            {["Team capacity", "Vendor bandwidth", "Budget runway", "Headcount gaps"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-[13px] text-[#cdd6f4]">{item}</span>
                <div className="w-32 h-1.5 bg-[#313244] rounded-full overflow-hidden">
                  <div className="h-full bg-[#89b4fa] rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Process Flags">
          <div className="flex flex-col gap-2">
            {["Bottleneck identified", "SLA at risk", "Cross-team dependency"].map((flag) => (
              <div
                key={flag}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#313244] text-[13px] text-[#cdd6f4]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#f9e2af] flex-shrink-0" />
                {flag}
              </div>
            ))}
            <p className="text-[11px] text-[#585b70] mt-1 text-center">Flags surface as you train Maya on your ops</p>
          </div>
        </SectionCard>
      </div>

      {/* Row 3 — Vendor Pipeline + Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SectionCard title="Vendor Pipeline" className="md:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-[#585b70] text-left border-b border-[#313244]">
                  <th className="pb-2 font-medium">Vendor</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Status</th>
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

        <SectionCard title="Current Priorities">
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
