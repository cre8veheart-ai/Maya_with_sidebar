"use client";

const MenuIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M2 4.5h14M2 9h14M2 13.5h14" />
  </svg>
);

interface MainContentProps {
  onMobileMenuOpen: () => void;
  children: React.ReactNode;
}

export default function MainContent({
  onMobileMenuOpen,
  children,
}: MainContentProps) {
  return (
    <main className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto bg-white">
      {/* Mobile top bar */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-[#E5E5EA] bg-white sticky top-0 z-10 md:hidden">
        <button
          onClick={onMobileMenuOpen}
          aria-label="Open navigation menu"
          className="p-1.5 rounded-md text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-colors"
        >
          <MenuIcon />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#1D1D1F] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">M</span>
          </div>
          <span className="text-[#1D1D1F] text-sm font-semibold tracking-tight">
            MAYA
          </span>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1">{children}</div>
    </main>
  );
}

