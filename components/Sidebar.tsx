"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

// ── Icons ─────────────────────────────────────────────────────────────────────

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1.5" y="1.5" width="5" height="5" rx="0.5"/>
    <rect x="9.5" y="1.5" width="5" height="5" rx="0.5"/>
    <rect x="1.5" y="9.5" width="5" height="5" rx="0.5"/>
    <rect x="9.5" y="9.5" width="5" height="5" rx="0.5"/>
  </svg>
);

const AriIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 1.5L9.3 5L12.5 6L9.3 7.3L8 10.5L6.7 7.3L3.5 6L6.7 5z"/>
    <path d="M12.5 10.5L13.3 12.2L14.5 12.5L13.3 13.2L12.5 14.5L11.7 13.2L10.5 12.5L11.7 12.2z"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="5" r="3"/>
    <path d="M2.5 14a5.5 5.5 0 0111 0"/>
  </svg>
);

const CfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 1.5v13"/>
    <path d="M5 4.5a3 3 0 016 0c0 1.5-1.5 2.5-3 3s-3 1.5-3 3a3 3 0 006 0"/>
  </svg>
);

const CooIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="8" r="2"/>
    <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/>
  </svg>
);

const CroIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1.5 12L5.5 7.5L8.5 9.5L14.5 3.5"/>
    <path d="M10.5 3.5h4v4"/>
  </svg>
);

const CmoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1.5 5.5H4L11 2.5v11L4 10.5H1.5v-5z"/>
    <path d="M13 5.5a3 3 0 010 5"/>
  </svg>
);

const BrushIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.5 1.5L14.5 5.5L7 13A3 3 0 113 9z"/>
    <path d="M9 3L13 7"/>
  </svg>
);

const GroupIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="5.5" cy="5" r="2.5"/>
    <circle cx="10.5" cy="5" r="2.5"/>
    <path d="M0.5 13.5a5 5 0 0110 0"/>
    <path d="M10 11.5a5 5 0 015 0"/>
  </svg>
);

const WorkflowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1.5" y="5.5" width="4" height="5" rx="0.5"/>
    <rect x="10.5" y="5.5" width="4" height="5" rx="0.5"/>
    <path d="M5.5 8h5"/>
    <path d="M8 8V3.5"/>
    <circle cx="8" cy="3" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const DecisionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="2.5" r="1.5"/>
    <path d="M8 4v3.5"/>
    <path d="M8 7.5L5 11M8 7.5L11 11"/>
    <circle cx="5" cy="12.5" r="1.5"/>
    <circle cx="11" cy="12.5" r="1.5"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1.5 4.5v8a1 1 0 001 1h11a1 1 0 001-1V6.5a1 1 0 00-1-1H7.5l-1.5-2H2.5a1 1 0 00-1 1z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5"/>
    <path d="M8 4.5V8l2.5 2.5"/>
  </svg>
);

const DocIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.5 1.5H3.5a1 1 0 00-1 1v11a1 1 0 001 1h9a1 1 0 001-1V5.5z"/>
    <path d="M9.5 1.5v4h4"/>
    <path d="M5.5 8.5h5M5.5 11h5"/>
  </svg>
);

const VaultIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1.5" y="3.5" width="13" height="9" rx="1"/>
    <circle cx="8" cy="8" r="2"/>
    <path d="M10 8h2M4 8h2"/>
    <path d="M5 12.5l-.5 2M11 12.5l.5 2"/>
  </svg>
);

const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="8" r="2.5"/>
    <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3.5l3.5 3.5 3.5-3.5"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.5 2l3.5 3.5-3.5 3.5"/>
  </svg>
);

const CollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1.5" y="1.5" width="13" height="13" rx="1.5"/>
    <path d="M5.5 1.5v13"/>
    <path d="M8.5 6L6.5 8l2 2"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1.5" y="1.5" width="13" height="13" rx="1.5"/>
    <path d="M5.5 1.5v13"/>
    <path d="M7.5 6l2 2-2 2"/>
  </svg>
);

// ── Nav data ──────────────────────────────────────────────────────────────────

type NavItem = {
  label: string;
  href: string;
  Icon: React.FC;
};

type NavSection = {
  id: string;
  heading: string | null;
  collapsible: boolean;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    id: "main",
    heading: null,
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/", Icon: DashboardIcon },
      { label: "Maya", href: "/ari", Icon: AriIcon },
    ],
  },
  {
    id: "executive",
    heading: "Executive Suite",
    collapsible: true,
    items: [
      { label: "CEO", href: "/ceo", Icon: PersonIcon },
      { label: "CFO", href: "/cfo", Icon: CfoIcon },
      { label: "COO", href: "/coo", Icon: CooIcon },
      { label: "CRO", href: "/cro", Icon: CroIcon },
      { label: "CMO", href: "/cmo", Icon: CmoIcon },
      { label: "Creative Director", href: "/creative-director", Icon: BrushIcon },
      { label: "Titans Council", href: "/titans-council", Icon: GroupIcon },
    ],
  },
  {
    id: "workspace",
    heading: "Workspace",
    collapsible: true,
    items: [
      { label: "Workflows", href: "/workflows", Icon: WorkflowIcon },
      { label: "Decisions", href: "/decisions", Icon: DecisionIcon },
      { label: "Projects", href: "/projects", Icon: FolderIcon },
    ],
  },
  {
    id: "library",
    heading: "Library",
    collapsible: true,
    items: [
      { label: "Sessions", href: "/sessions", Icon: ClockIcon },
      { label: "Documents", href: "/documents", Icon: DocIcon },
      { label: "Knowledge Vault", href: "/knowledge-vault", Icon: VaultIcon },
    ],
  },
  {
    id: "system",
    heading: null,
    collapsible: false,
    items: [
      { label: "Settings", href: "/settings", Icon: GearIcon },
    ],
  },
];

// ── Sidebar component ─────────────────────────────────────────────────────────

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  isOpen,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] = useLocalStorage<
    Record<string, boolean>
  >("maya-collapsed-sections", {});

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed md:relative z-50 md:z-auto",
          "flex flex-col h-screen flex-shrink-0",
          "bg-[#F5F5F7] border-r border-[#E5E5EA]",
          "transition-all duration-250 ease-in-out",
          // Desktop width
          isOpen ? "w-60" : "md:w-14",
          // Mobile slide
          mobileOpen ? "translate-x-0 w-60" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* Header */}
        <div
          className={[
            "flex items-center h-14 border-b border-[#E5E5EA] flex-shrink-0 px-3",
            isOpen ? "justify-between" : "justify-center",
          ].join(" ")}
        >
          {isOpen ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#1D1D1F] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[11px] font-bold tracking-tight">
                    M
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-[#1D1D1F] text-[13px] font-semibold leading-tight truncate">
                    MAYA
                  </div>
                  <div className="text-[#8E8E93] text-[10px] leading-tight truncate">
                    Executive OS
                  </div>
                </div>
              </div>
              <button
                onClick={onToggle}
                aria-label="Collapse sidebar"
                className="p-1.5 rounded-md text-[#8E8E93] hover:bg-[#E5E5EA] hover:text-[#1D1D1F] transition-colors flex-shrink-0"
              >
                <CollapseIcon />
              </button>
            </>
          ) : (
            <button
              onClick={onToggle}
              aria-label="Expand sidebar"
              className="p-1.5 rounded-md text-[#8E8E93] hover:bg-[#E5E5EA] hover:text-[#1D1D1F] transition-colors"
            >
              <ExpandIcon />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-px">
          {NAV_SECTIONS.map((section, idx) => {
            const sectionCollapsed =
              isOpen && section.collapsible && !!collapsedSections[section.id];

            return (
              <div key={section.id}>
                {/* Divider */}
                {idx > 0 && (
                  <div className="my-2 border-t border-[#E5E5EA]" />
                )}

                {/* Section heading */}
                {section.heading && isOpen && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={!sectionCollapsed}
                    className="w-full flex items-center justify-between px-2 py-1.5 mb-0.5 group rounded-md hover:bg-[#EBEBED] transition-colors"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#8E8E93] group-hover:text-[#6E6E73]">
                      {section.heading}
                    </span>
                    <span className="text-[#AEAEB2] group-hover:text-[#8E8E93]">
                      {sectionCollapsed ? (
                        <ChevronRightIcon />
                      ) : (
                        <ChevronDownIcon />
                      )}
                    </span>
                  </button>
                )}

                {/* Items */}
                {!sectionCollapsed &&
                  section.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { onMobileClose(); if (!isOpen) onToggle(); }}
                        title={!isOpen ? item.label : undefined}
                        className={[
                          "flex items-center gap-2.5 px-2 py-[7px] rounded-md text-[13.5px] transition-colors duration-100",
                          isOpen ? "" : "justify-center",
                          active
                            ? "bg-[#E5F0FF] text-[#0066CC] font-medium"
                            : "text-[#3D3D3D] hover:bg-[#EBEBED] hover:text-[#1D1D1F]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex-shrink-0",
                            active ? "text-[#0066CC]" : "text-[#6E6E73]",
                          ].join(" ")}
                        >
                          <item.Icon />
                        </span>
                        {isOpen && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="px-4 py-3 border-t border-[#E5E5EA] text-[11px] text-[#AEAEB2]">
            MAYA v1.0
          </div>
        )}
      </aside>
    </>
  );
}

