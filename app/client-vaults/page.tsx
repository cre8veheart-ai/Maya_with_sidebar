import Link from "next/link";

const seededClients = [
  { id: "founder", name: "Founder Workspace", status: "Active" },
];

export default function ClientVaultsPage() {
  return (
    <main className="h-full overflow-y-auto p-6 md:p-8 bg-[#11111b] text-[#cdd6f4]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#6c7086]">MAYA · Client Workspaces</p>
          <h1 className="text-2xl font-semibold mt-1">Client Vaults</h1>
          <p className="text-sm text-[#a6adc8] mt-2 max-w-3xl">Open a client inside Maya. Each vault is an isolated working space for that client’s sessions, files, projects, campaigns, email, website, decisions, tasks, meetings, notes and approved executive context.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {seededClients.map((client) => (
            <Link key={client.id} href={`/client-vaults/${client.id}`} className="rounded-xl border border-[#313244] bg-[#1e1e2e] p-5 hover:border-[#89b4fa] transition-colors">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">{client.name}</h2>
                <span className="text-[11px] text-[#a6e3a1]">{client.status}</span>
              </div>
              <p className="text-xs text-[#6c7086] mt-3">Persistent client memory · isolated context · linked work</p>
            </Link>
          ))}

          <div className="rounded-xl border border-dashed border-[#45475a] p-5 text-[#6c7086]">
            <div className="font-medium text-[#a6adc8]">+ Add client</div>
            <p className="text-xs mt-3">Client creation and identity provisioning will connect here without changing the vault model.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
