"use client";

import Link from "next/link";
import SidebarToggle from "./SidebarToggle";

const navItems = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Chat", href: "/chat", icon: "💬" },
  { label: "Tasks", href: "/tasks", icon: "📋" },
  { label: "Search", href: "/search", icon: "🔍" },
  { label: "CEO", href: "/ceo", icon: "🏛️" },
  { label: "COO", href: "/coo", icon: "⚙️" },
  { label: "CMO", href: "/cmo", icon: "📣" },
  { label: "CFO", href: "/cfo", icon: "💰" },
  { label: "CTO", href: "/cto", icon: "🖥️" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed md:relative z-30 flex flex-col h-screen",
          "bg-[#1e1e2e] border-r border-[#313244]",
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "w-64" : "w-0 md:w-16",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#313244] min-w-[4rem]">
          {isOpen && (
            <span className="text-[#89b4fa] font-bold text-xl tracking-wide whitespace-nowrap">
              Maya
            </span>
          )}
          <SidebarToggle isOpen={isOpen} onToggle={onToggle} />
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-2 mt-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5",
                "text-[#cdd6f4] hover:bg-[#313244] hover:text-[#89b4fa]",
                "transition-colors duration-150 whitespace-nowrap",
                isOpen ? "" : "justify-center",
              ].join(" ")}
              title={!isOpen ? item.label : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="px-4 py-4 border-t border-[#313244] text-xs text-[#585b70] whitespace-nowrap">
            Maya v1.0
          </div>
        )}
      </aside>
    </>
  );
}
