import PageShell from "@/components/PageShell";
import RoleChat from "@/components/RoleChat";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
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

function PulseRow({
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

function BetRow({ label, horizon }: { label: string; horizon: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#313244] last:border-0">
      <span className="text-[13px] text-[#cdd6f4]">{label}</span>
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#313244] text-[#89b4fa]">{horizon}</span>
    </div>
  );
}

export default function CeoPage() {
  return (
    <PageShell title="CEO" subtitle="Org-wide altitude — strategy, capital, alignment, and the decisions that determine what's possible next.">
      <div className="flex flex-col xl:flex-row gap-5 h-full">
        {/* Left — Dashboard */}
        <div className="flex flex-col gap-5 xl:w-[420px] shrink-0">
          {/* Org Pulse */}
          <SectionCard title="Org Pulse">
            <PulseRow label="Execution health" detail="Cross-functional delivery signal" status="neutral" />
            <PulseRow label="Team alignment" detail="Strategy clarity across functions" status="neutral" />
            <PulseRow label="Revenue trajectory" detail="Growth vs. plan" status="neutral" />
            <PulseRow label="Culture signal" detail="Retention, morale, engagement" status="neutral" />
          </SectionCard>

          {/* Strategic Bets */}
          <SectionCard title="Active Strategic Bets">
            <BetRow label="Add a bet" horizon="Now" />
            <BetRow label="Add a bet" horizon="Next" />
            <BetRow label="Add a bet" horizon="Later" />
            <p className="mt-3 text-[11px] text-[#585b70] text-center">
              Bets link to Decisions layer — each bet has an owner and a thesis
            </p>
          </SectionCard>

          {/* Capital Allocation */}
          <SectionCard title="Capital Allocation">
            <div className="space-y-3">
              {[
                { label: "Growth investment", detail: "Sales, marketing, product" },
                { label: "Operating costs", detail: "Headcount, infrastructure, G&A" },
                { label: "Runway", detail: "Months at current burn" },
                { label: "Reserves", detail: "Buffer & opportunity fund" },
              ].map(({ label, detail }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-[#cdd6f4]">{label}</p>
                    <p className="text-[11px] text-[#585b70]">{detail}</p>
                  </div>
                  <span className="text-[12px] text-[#585b70]">—</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Board Narrative */}
          <SectionCard title="Board Narrative">
            <div className="space-y-2">
              {[
                "Strategic direction & next bets",
                "Capital allocation rationale",
                "Key risks and mitigations",
                "Org health and leadership bench",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <span className="text-[#89b4fa] mt-0.5 shrink-0">·</span>
                  <span className="text-[12px] text-[#a6adc8]">{point}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-[#585b70] text-center">
              MAYA drafts board narrative from your Decisions layer — you approve before it goes anywhere
            </p>
          </SectionCard>
        </div>

        {/* Right — MAYA CEO Agent */}
        <div className="flex-1 bg-[#1e1e2e] border border-[#313244] rounded-xl overflow-hidden min-h-[520px] xl:min-h-0">
          <RoleChat role="ceo" />
        </div>
      </div>
    </PageShell>
  );
}
