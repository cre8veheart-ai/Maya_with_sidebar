"use client";

interface AgentWorkspaceProps {
  name: string;
  title: string;
  mission: string;
  placeholder: string;
}

export default function AgentWorkspace({ name, title, mission, placeholder }: AgentWorkspaceProps) {
  return (
    <main className="min-h-screen flex flex-col bg-white text-[#1f2937]">
      <header className="border-b border-black/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" aria-label="active" />
          <div>
            <h1 className="text-2xl font-black font-serif text-[#16223b]">{name}</h1>
            <p className="text-sm text-[#475569]">{title}</p>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-[#475569]">{mission}</p>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl rounded-2xl border border-black/10 bg-[#f8fafc] p-5 shadow-sm">
          <div className="min-h-[280px] text-sm text-[#64748b] flex items-center justify-center text-center">
            {name} workspace is ready for conversation, tools, and role-specific workflows.
          </div>
          <div className="border-t border-black/10 pt-4">
            <textarea
              aria-label={`Message ${name}`}
              placeholder={placeholder}
              className="min-h-[96px] w-full resize-none rounded-xl border border-black/15 bg-white p-4 text-sm text-[#1f2937] outline-none placeholder:text-[#94a3b8] focus:border-[#1d4ed8]"
            />
            <p className="mt-2 text-xs text-[#64748b]">
              Action trails remain visible for every action path.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
