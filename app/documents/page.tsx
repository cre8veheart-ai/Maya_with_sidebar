import PageShell from "@/components/PageShell";

function EmptyState({ hint }: { hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-[14px] font-medium text-[#6E6E73]">No documents yet</p>
      <p className="text-[13px] text-[#AEAEB2] mt-1">{hint}</p>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <PageShell title="Documents" subtitle="Your business document library">
      <EmptyState hint="Uploaded and generated documents will appear here." />
    </PageShell>
  );
}
