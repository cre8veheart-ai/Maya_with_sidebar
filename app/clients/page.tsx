import Link from "next/link";

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-[#11111b] px-4 py-8 text-[#cdd6f4] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#89b4fa]">Pocket Desk</p>
        <h1 className="mt-2 text-3xl font-semibold">Client workspaces</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#a6adc8]">
          MAYA is currently in General mode. Every executive and menu tool remains available without a client.
        </p>

        <section className="mt-8 rounded-xl border border-[#313244] bg-[#181825] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Workspace: General</h2>
              <p className="mt-1 text-sm text-[#a6adc8]">User memory only. No client vault, files, projects or client memory are attached.</p>
            </div>
            <span className="rounded-full bg-[#1e3a2f] px-3 py-1 text-xs font-semibold text-[#a6e3a1]">Active</span>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-dashed border-[#45475a] bg-[#181825] p-5">
          <h2 className="font-semibold">Add / Register Client</h2>
          <p className="mt-2 text-sm leading-6 text-[#a6adc8]">
            Client registration will be enabled only after client-side encryption, local password-derived keys,
            ciphertext-only storage, recovery material and export/erase verification pass the blueprint gates.
          </p>
          <button disabled className="mt-4 cursor-not-allowed rounded-lg bg-[#313244] px-4 py-2 text-sm text-[#6c7086]">
            Registration not yet enabled
          </button>
        </section>

        <section className="mt-4 rounded-xl border border-[#313244] bg-[#181825] p-5">
          <h2 className="font-semibold">Clients</h2>
          <p className="mt-2 text-sm text-[#6c7086]">No registered client display names.</p>
        </section>

        <Link href="/" className="mt-6 inline-block text-sm text-[#89b4fa] hover:underline">Return to MAYA</Link>
      </div>
    </main>
  );
}
