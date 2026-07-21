import PageShell from "@/components/PageShell";

function EmptyState({ hint }: { hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-[14px] font-medium text-[#6E6E73]">
        Knowledge Vault is empty
      </p>
      <p className="text-[13px] text-[#AEAEB2] mt-1">{hint}</p>
    </div>
  );
}

export default function KnowledgeVaultPage() {
  return (
    <PageShell
      title="Knowledge Vault"
      subtitle="Your organizational intelligence repository"
    >
      <EmptyState hint="Curated knowledge, frameworks, and insights will be stored here." />
    </PageShell>
  );
}
