import PageShell from "@/components/PageShell";

function DecisionRow({
  title,
  owner,
  date,
  status,
}: {
  title: string;
  owner: string;
  date: string;
  status: "open" | "closed" | "pending";
}) {
  const badge: Record<typeof status, string> = {
    open: "text-[#a6e3a1] bg-[#a6e3a1]/10",
    closed: "text-[#585b70] bg-[#313244]",
    pending: "text-[#f9e2af] bg-[#f9e2af]/10",
  };
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#313244] last:border-0">
      <div>
        <p className="text-[13px] text-[#cdd6f4] font-medium">{title}</p>
        <p className="text-[11px] text-[#585b70]">{owner} · {date}</p>
      </div>
      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${badge[status]}`}>
        {status}
      </span>
    </div>
  );
}

export default function DecisionsPage() {
  return (
    <PageShell
      title="Decisions"
      subtitle="The decisions layer — vendor lists, subcontractors, and production rosters live here"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Decision log */}
        <div className="md:col-span-2 bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
            Decision Log
          </h2>
          <DecisionRow
            title="Decisions you log here drive Campaigns and vendor lists"
            owner="All roles"
            date="—"
            status="open"
          />
          <div className="mt-6 flex items-center justify-center">
            <p className="text-[12px] text-[#585b70] text-center max-w-xs">
              Log a decision to start building your org&apos;s institutional record
            </p>
          </div>
        </div>

        {/* Decision categories */}
        <div className="space-y-4">
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              By Category
            </h2>
            <div className="space-y-1.5">
              {["Vendors", "Subcontractors", "Production roster", "Strategy", "Finance", "Other"].map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-[#313244] cursor-pointer"
                >
                  <span className="text-[13px] text-[#cdd6f4]">{cat}</span>
                  <span className="text-[11px] text-[#585b70]">0</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-3">
              Way Back Machine
            </h2>
            <p className="text-[12px] text-[#585b70]">
              Compressed org history — decisions, priority shifts, outcomes — queryable on demand.
            </p>
            <p className="text-[11px] text-[#585b70] mt-2">Available as decisions accumulate.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
