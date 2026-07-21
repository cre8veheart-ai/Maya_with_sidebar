import PageShell from "@/components/PageShell";

function EmptyState({ hint }: { hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-[14px] font-medium text-[#6E6E73]">No decisions yet</p>
      <p className="text-[13px] text-[#AEAEB2] mt-1">{hint}</p>
    </div>
  );
}

export default function DecisionsPage() {
  return (
    <PageShell
      title="Decisions"
      subtitle="Log and track key business decisions"
    >
      <EmptyState hint="Decisions logged here will build your institutional knowledge." />
    </PageShell>
  );
}
