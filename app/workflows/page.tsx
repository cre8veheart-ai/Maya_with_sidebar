import PageShell from "@/components/PageShell";

function EmptyState({ hint }: { hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-[14px] font-medium text-[#6E6E73]">No workflows yet</p>
      <p className="text-[13px] text-[#AEAEB2] mt-1">{hint}</p>
    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <PageShell
      title="Workflows"
      subtitle="Manage and track active business workflows"
    >
      <EmptyState hint="Workflows will appear here once created." />
    </PageShell>
  );
}
