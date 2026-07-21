import PageShell from "@/components/PageShell";

function WorkspaceCard({ title }: { title: string }) {
  return (
    <div className="bg-[#F9F9FB] border border-[#E5E5EA] rounded-xl p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#8E8E93] mb-4">
        {title}
      </h2>
      <div className="flex items-center justify-center h-24">
        <p className="text-[13px] text-[#AEAEB2]">No items yet</p>
      </div>
    </div>
  );
}

export default function TitansCouncilPage() {
  return (
    <PageShell title="Titans Council" subtitle="Executive council workspace">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <WorkspaceCard title="Council Agenda" />
        <WorkspaceCard title="Strategic Initiatives" />
        <WorkspaceCard title="Recent Decisions" />
      </div>
    </PageShell>
  );
}
