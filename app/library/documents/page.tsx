import PageShell from "@/components/PageShell";

function DocRow({ name, type, updated }: { name: string; type: string; updated: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#313244] last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-base">📄</span>
        <div>
          <p className="text-[13px] text-[#cdd6f4] font-medium">{name}</p>
          <p className="text-[11px] text-[#585b70]">{type}</p>
        </div>
      </div>
      <span className="text-[11px] text-[#585b70]">{updated}</span>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <PageShell
      title="Documents"
      subtitle="Org documents, briefs, and reference materials stored in Maya"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Document list */}
        <div className="md:col-span-2 bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
            All Documents
          </h2>
          <DocRow name="Upload your first document" type="—" updated="—" />
          <div className="mt-6 flex items-center justify-center">
            <p className="text-[12px] text-[#585b70]">
              Documents you upload become part of your org knowledge base
            </p>
          </div>
        </div>

        {/* Filters / categories */}
        <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
            Categories
          </h2>
          <div className="space-y-1.5">
            {["Briefs", "Contracts", "Reports", "Decks", "SOPs", "Other"].map((cat) => (
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
      </div>
    </PageShell>
  );
}
