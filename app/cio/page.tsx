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

function StatusRow({
  label,
  detail,
  status,
}: {
  label: string;
  detail: string;
  status: "green" | "yellow" | "red" | "neutral";
}) {
  const dot: Record<typeof status, string> = {
    green: "bg-[#a6e3a1]",
    yellow: "bg-[#f9e2af]",
    red: "bg-[#f38ba8]",
    neutral: "bg-[#585b70]",
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#313244] last:border-0">
      <div>
        <p className="text-[13px] text-[#cdd6f4]">{label}</p>
        <p className="text-[11px] text-[#585b70]">{detail}</p>
      </div>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot[status]}`} />
    </div>
  );
}

function InitiativeRow({ name, phase, risk }: { name: string; phase: string; risk: "low" | "medium" | "high" }) {
  const riskColor: Record<typeof risk, string> = {
    low: "text-[#a6e3a1]",
    medium: "text-[#f9e2af]",
    high: "text-[#f38ba8]",
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#313244] last:border-0">
      <div>
        <p className="text-[13px] text-[#cdd6f4] font-medium">{name}</p>
        <p className="text-[11px] text-[#585b70]">{phase}</p>
      </div>
      <span className={`text-[11px] font-medium ${riskColor[risk]}`}>{risk}</span>
    </div>
  );
}

export default function CioPage() {
  return (
    <PageShell title="CIO" subtitle="Chief Information Officer workspace">
      {/* Row 1 — Systems Health + Security Posture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <SectionCard title="Systems Health">
          <StatusRow label="Core infrastructure" detail="Servers, cloud, network" status="green" />
          <StatusRow label="Integrations" detail="Third-party connections" status="neutral" />
          <StatusRow label="Data pipelines" detail="ETL / sync jobs" status="neutral" />
          <StatusRow label="Uptime SLA" detail="Last 30 days" status="neutral" />
        </SectionCard>

        <SectionCard title="Security Posture">
          <StatusRow label="Access control review" detail="IAM / permissions" status="neutral" />
          <StatusRow label="Open vulnerabilities" detail="CVE / patch backlog" status="neutral" />
          <StatusRow label="Incident alerts" detail="Last 7 days" status="green" />
          <StatusRow label="Compliance status" detail="Frameworks active" status="neutral" />
        </SectionCard>
      </div>

      {/* Row 2 — Digital Initiatives + Data Infrastructure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <SectionCard title="Digital Initiatives">
          <InitiativeRow name="Add initiative" phase="Planning" risk="low" />
          <div className="mt-3 flex items-center justify-center">
            <p className="text-[12px] text-[#585b70]">Initiatives link to Decisions layer</p>
          </div>
        </SectionCard>

        <SectionCard title="Data Infrastructure">
          <div className="space-y-3">
            {[
              { label: "Storage utilization", value: "—" },
              { label: "Query performance", value: "—" },
              { label: "Backup cadence", value: "—" },
              { label: "Data classification", value: "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-[#313244] pb-2 last:border-0">
                <span className="text-[13px] text-[#cdd6f4]">{label}</span>
                <span className="text-[13px] text-[#585b70]">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 3 — Budget + Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SectionCard title="Tech Budget" className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {["Licenses & SaaS", "Infrastructure", "Security", "Headcount"].map((line) => (
              <div key={line} className="flex flex-col gap-1">
                <span className="text-[11px] text-[#585b70]">{line}</span>
                <div className="h-1.5 bg-[#313244] rounded-full">
                  <div className="h-full bg-[#89b4fa] rounded-full" style={{ width: "0%" }} />
                </div>
                <span className="text-[12px] text-[#a6adc8]">Not set</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Compliance Flags">
          <ol className="space-y-2">
            {["SOC 2", "GDPR / Privacy", "Internal audits"].map((framework) => (
              <li key={framework} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#585b70] flex-shrink-0" />
                <span className="text-[13px] text-[#585b70]">{framework} — not configured</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </PageShell>
  );
}
