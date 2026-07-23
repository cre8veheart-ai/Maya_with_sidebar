import PageShell from "@/components/PageShell";

function SessionRow({ title, role, date }: { title: string; role: string; date: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#313244] last:border-0">
      <div>
        <p className="text-[13px] text-[#cdd6f4] font-medium">{title}</p>
        <p className="text-[11px] text-[#585b70]">{role}</p>
      </div>
      <span className="text-[11px] text-[#585b70]">{date}</span>
    </div>
  );
}

export default function SessionsPage() {
  return (
    <PageShell
      title="Sessions"
      subtitle="Your conversation history with Maya — never re-onboard"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Session list */}
        <div className="md:col-span-2 bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
            Recent Sessions
          </h2>
          <SessionRow title="Session history starts here" role="All roles" date="—" />
          <div className="mt-6 flex items-center justify-center">
            <p className="text-[12px] text-[#585b70]">
              Sessions are stored as you work — no manual saving required
            </p>
          </div>
        </div>

        {/* Session stats */}
        <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
            Summary
          </h2>
          <div className="space-y-3">
            {[
              { label: "Total sessions", value: "0" },
              { label: "Roles active", value: "0" },
              { label: "Last session", value: "—" },
              { label: "Insights captured", value: "0" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-[#313244] pb-2 last:border-0">
                <span className="text-[13px] text-[#cdd6f4]">{label}</span>
                <span className="text-[13px] text-[#585b70]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
