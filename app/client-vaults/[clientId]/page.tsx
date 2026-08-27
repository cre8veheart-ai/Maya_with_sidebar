import Link from "next/link";

const sections = [
  ["Sessions", "Full client-linked conversations and resume state", "🗂️"],
  ["Files", "Large files and outside-hosted storage references", "📄"],
  ["Projects", "Milestones, owners, dependencies and artifacts", "📌"],
  ["Campaigns", "Briefs, assets, approvals, channels and results", "🚀"],
  ["Email", "Client-linked threads, attachments and follow-up", "✉️"],
  ["Website", "Pages, drafts, analytics and controlled publishing", "🌐"],
  ["Decisions", "Approved decisions and superseded history", "⚖️"],
  ["Tasks", "Open work, owners, waiting items and completion", "✅"],
  ["Meetings", "Meeting records, participants and follow-through", "🎙️"],
  ["Notes", "Persistent client-vault memory and working context", "📝"],
  ["Executives", "Permissioned contributions from Maya’s executive team", "🏛️"],
  ["Whiteboard", "Externally hosted canvases linked back into this vault", "⬜"],
] as const;

export default async function ClientVaultPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const label = clientId === "founder" ? "Founder Workspace" : clientId.replace(/[-_]/g, " ");

  return (
    <main className="h-full overflow-y-auto p-5 md:p-8 bg-[#11111b] text-[#cdd6f4]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <Link href="/client-vaults" className="text-xs text-[#89b4fa] hover:underline">← Client Vaults</Link>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#6c7086] mt-3">MAYA · Isolated Client Vault</p>
            <h1 className="text-2xl font-semibold mt-1 capitalize">{label}</h1>
            <p className="text-sm text-[#a6adc8] mt-2">Everything below remains inside this client boundary unless an approved shared object explicitly links it elsewhere.</p>
          </div>
          <div className="rounded-lg border border-[#313244] bg-[#1e1e2e] px-4 py-3 text-xs">
            <div className="text-[#a6e3a1] font-medium">● Vault memory active</div>
            <div className="text-[#6c7086] mt-1">Client ID: {clientId}</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sections.map(([name, description, icon]) => (
            <section key={name} className="rounded-xl border border-[#313244] bg-[#1e1e2e] p-4 min-h-36">
              <div className="text-xl">{icon}</div>
              <h2 className="font-semibold mt-3">{name}</h2>
              <p className="text-xs leading-relaxed text-[#6c7086] mt-2">{description}</p>
              <div className="mt-4 text-[11px] uppercase tracking-wide text-[#89b4fa]">Linked to vault</div>
            </section>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-[#313244] bg-[#1e1e2e] p-5">
          <h2 className="font-semibold">Vault architecture</h2>
          <p className="text-sm text-[#a6adc8] mt-2 leading-relaxed">Maya presents one seamless client workspace while source systems can remain outside hosts. Original files, email, website/CMS data and whiteboards can stay with their authoritative providers; Maya keeps governed references, relationships, searchable context and approved durable memory tied to this client.</p>
        </div>
      </div>
    </main>
  );
}
