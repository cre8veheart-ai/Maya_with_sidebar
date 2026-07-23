"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarToggle from "./SidebarToggle";

type NavItem = { label: string; href: string; icon: string };
type NavGroup = { id: string; label: string; icon: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    id: "core",
    label: "Core",
    icon: "✦",
    items: [
      { label: "Home", href: "/", icon: "🏠" },
      { label: "Chat", href: "/chat", icon: "💬" },
      { label: "Tasks", href: "/tasks", icon: "📋" },
      { label: "Search", href: "/search", icon: "🔍" },
    ],
  },
  {
    id: "executive",
    label: "Executive Suite",
    icon: "🏛️",
    items: [
      { label: "CEO", href: "/ceo", icon: "🏛️" },
      { label: "COO", href: "/coo", icon: "⚙️" },
      { label: "CMO", href: "/cmo", icon: "📣" },
      { label: "CFO", href: "/cfo", icon: "💰" },
      { label: "CTO", href: "/cto", icon: "🖥️" },
      { label: "CIO", href: "/cio", icon: "🔷" },
      { label: "CRO", href: "/cro", icon: "📈" },
      { label: "CD", href: "/cd", icon: "🎨" },
      { label: "Strategy Room", href: "/strategy-room", icon: "🧩" },
    ],
  },
  {
    id: "library",
    label: "Library",
    icon: "📚",
    items: [
      { label: "Sessions", href: "/library/sessions", icon: "🗂️" },
      { label: "Documents", href: "/library/documents", icon: "📄" },
      { label: "Knowledge Vault", href: "/library/knowledge", icon: "🔒" },
      { label: "Intel Vault", href: "/library/intel", icon: "🧠" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: "🎯",
    items: [
      { label: "Decisions", href: "/decisions", icon: "⚖️" },
      { label: "Campaigns", href: "/campaigns", icon: "🚀" },
    ],
  },
];

const settingsItem: NavItem = { label: "Settings", href: "/settings", icon: "⚙️" };

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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

        {/* Nav */}
        <nav className="flex flex-col p-2 mt-2 flex-1 overflow-y-auto">
          {isOpen ? (
            navGroups.map((group) => {
              const isGroupCollapsed = !!collapsed[group.id];
              return (
                <div key={group.id} className="mb-2">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center justify-between w-full px-3 py-1.5 rounded-md
                               text-[#585b70] hover:text-[#a6adc8] transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
                      <span>{group.icon}</span>
                      <span>{group.label}</span>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${isGroupCollapsed ? "-rotate-90" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {!isGroupCollapsed && (
                    <div className="mt-0.5 flex flex-col gap-0.5">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={[
                            "flex items-center gap-3 rounded-lg px-3 py-2",
                            "transition-colors duration-150 whitespace-nowrap text-sm font-medium",
                            isActive(item.href)
                              ? "bg-[#313244] text-[#89b4fa]"
                              : "text-[#cdd6f4] hover:bg-[#313244] hover:text-[#89b4fa]",
                          ].join(" ")}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            navGroups.flatMap((group) =>
              group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={[
                    "flex items-center justify-center rounded-lg px-3 py-2.5 mb-0.5",
                    "transition-colors duration-150",
                    isActive(item.href)
                      ? "bg-[#313244] text-[#89b4fa]"
                      : "text-[#cdd6f4] hover:bg-[#313244] hover:text-[#89b4fa]",
                  ].join(" ")}
                >
                  <span className="text-lg">{item.icon}</span>
                </Link>
              ))
            )
          )}
        </nav>

        {/* Settings + footer */}
        <div className="border-t border-[#313244] p-2">
          <Link
            href={settingsItem.href}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2.5",
              "transition-colors duration-150 whitespace-nowrap",
              isActive(settingsItem.href)
                ? "bg-[#313244] text-[#89b4fa]"
                : "text-[#cdd6f4] hover:bg-[#313244] hover:text-[#89b4fa]",
              isOpen ? "" : "justify-center",
            ].join(" ")}
            title={!isOpen ? settingsItem.label : undefined}
          >
            <span className="text-lg">{settingsItem.icon}</span>
            {isOpen && (
              <span className="text-sm font-medium">{settingsItem.label}</span>
            )}
          </Link>
          {isOpen && (
            <p className="px-3 pt-2 pb-1 text-[11px] text-[#585b70] whitespace-nowrap">
              Maya v1.0
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
