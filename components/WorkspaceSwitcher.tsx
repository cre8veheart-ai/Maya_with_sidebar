"use client";

import Link from "next/link";

export default function WorkspaceSwitcher({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Link
        href="/clients"
        title="Workspace: General"
        className="mx-2 mb-2 flex items-center justify-center rounded-lg border border-[#45475a] bg-[#181825] px-2 py-2 text-sm text-[#a6e3a1]"
      >
        G
      </Link>
    );
  }

  return (
    <section className="mx-2 mt-2 rounded-lg border border-[#45475a] bg-[#181825] p-2" aria-label="Pocket Desk workspace">
      <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-[#6c7086]">Pocket Desk</p>
      <div className="mt-1 flex items-center gap-2 rounded-md bg-[#313244] px-2 py-2 text-sm text-[#cdd6f4]">
        <span className="h-2 w-2 rounded-full bg-[#a6e3a1]" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">Workspace: General</span>
      </div>
      <p className="px-1 pt-2 text-[11px] leading-4 text-[#6c7086]">No client context is attached.</p>
      <Link href="/clients" className="mt-2 block rounded-md border border-[#45475a] px-2 py-1.5 text-center text-xs font-medium text-[#89b4fa] hover:bg-[#313244]">
        Manage Clients
      </Link>
    </section>
  );
}
