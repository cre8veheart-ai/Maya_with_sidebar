import PageShell from "@/components/PageShell";

export default function AriPage() {
  return (
    <PageShell title="Ari" subtitle="Your executive intelligence assistant">
      <div className="max-w-2xl">
        <div className="bg-[#F9F9FB] border border-[#E5E5EA] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1D1D1F] flex items-center justify-center mx-auto mb-5">
            <span className="text-white text-xl select-none">✦</span>
          </div>
          <h2 className="text-[17px] font-semibold text-[#1D1D1F] mb-2">
            Ask Ari anything
          </h2>
          <p className="text-[14px] text-[#6E6E73] mb-8 leading-relaxed">
            Ari is your executive AI — built for decisions, strategic thinking,
            and operational clarity across every function.
          </p>
          <div className="bg-white border border-[#E5E5EA] rounded-xl px-4 py-3.5 flex items-center gap-3 text-left shadow-sm">
            <span className="text-[#AEAEB2] text-[14px] flex-1 select-none">
              Ask anything…
            </span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
