import PageShell from "@/components/PageShell";

function EmptyState({ hint }: { hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-[14px] font-medium text-[#6E6E73]">No sessions yet</p>
      <p className="text-[13px] text-[#AEAEB2] mt-1">{hint}</p>
    </div>
  );
}

export default function SessionsPage() {
  return (
    <PageShell title="Sessions" subtitle="Review past working sessions">
      <EmptyState hint="Sessions with Maya and your team will be archived here." />
    </PageShell>
  );
}
