import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-8">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#1D1D1F] flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-xl select-none">✦</span>
        </div>
        <h1 className="text-[22px] font-semibold text-[#1D1D1F] tracking-tight mb-2">
          Page not found
        </h1>
        <p className="text-[14px] text-[#6E6E73] mb-8 leading-relaxed">
          This page doesn&apos;t exist in MAYA. It may have been moved or the
          URL may be incorrect.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D1D1F] text-white text-[14px] font-medium rounded-xl hover:bg-[#3D3D3D] transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
