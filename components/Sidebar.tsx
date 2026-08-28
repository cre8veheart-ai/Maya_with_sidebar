"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarToggle from "./SidebarToggle";

type NavItem = { label: string; href: string; icon: string; disabled?: boolean; phase?: string };
type NavGroup = { id: string; label: string; icon: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { id: "core", label: "Core", icon: "✦", items: [
    { label: "Home", href: "/", icon: "🏠" }, { label: "Community", href: "/community", icon: "💬" }, { label: "Tasks", href: "/tasks", icon: "📋" }, { label: "Search", href: "/search", icon: "🔍" },
  ]},
  { id: "executive", label: "Executive Team", icon: "🏛️", items: [
    { label: "Max · CEO", href: "/ceo", icon: "🏛️" }, { label: "Sam · COO", href: "/coo", icon: "⚙️" }, { label: "CMO", href: "/cmo", icon: "📣" }, { label: "Dana · CFO", href: "/cfo", icon: "💰" }, { label: "Ari · CTO", href: "/cto", icon: "🖥️" }, { label: "CIO", href: "/cio", icon: "🔷" }, { label: "CRO", href: "/cro", icon: "📈" }, { label: "CD", href: "/cd", icon: "🎨" }, { label: "HR", href: "/hr", icon: "👥" }, { label: "Legal", href: "/legal", icon: "⚖️" }, { label: "Admin Secretary", href: "/office-admin", icon: "🗂️" }, { label: "Strategy Room", href: "/strategy-room", icon: "🧩" }, { label: "Titans Council", href: "/titans-council", icon: "👑", disabled: true, phase: "Phase 2" },
  ]},
  { id: "specialists", label: "Specialist Staff", icon: "✦", items: [
    { label: "Mimi · Gallery Sales", href: "/art-gallery", icon: "🖼️" }, { label: "Custom Agent", href: "/custom-agent", icon: "➕" },
  ]},
  { id: "library", label: "Library", icon: "📚", items: [
    { label: "Sessions", href: "/library/sessions", icon: "🗂️" }, { label: "Saved Files", href: "/library/documents", icon: "📄" }, { label: "Knowledge Vault", href: "/library/knowledge", icon: "🔒" }, { label: "Intel Vault", href: "/library/intel", icon: "🧠" },
  ]},
  { id: "operations", label: "Operations", icon: "🎯", items: [
    { label: "Decisions", href: "/decisions", icon: "⚖️" }, { label: "Campaigns", href: "/campaigns", icon: "🚀" }, { label: "Adobe Studio", href: "/adobe", icon: "🎨" }, { label: "Tool Sandbox", href: "/tool-sandbox", icon: "🧪" },
  ]},
];

const settingsItem: NavItem = { label: "Settings", href: "/settings", icon: "⚙️" };
interface SidebarProps { isOpen: boolean; onToggle: () => void; }

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleGroup = (id: string) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return <>
    {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onToggle} />}
    <aside className={["fixed md:relative z-30 flex flex-col h-screen","bg-[#1e1e2e] border-r border-[#313244]","transition-all duration-300 ease-in-out overflow-hidden",isOpen ? "w-64" : "w-0 md:w-16"].join(" ")}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#313244] min-w-[4rem]">{isOpen && <span className="text-[#89b4fa] font-bold text-xl tracking-wide whitespace-nowrap">Maya</span>}<SidebarToggle isOpen={isOpen} onToggle={onToggle} /></div>
      <nav className="flex flex-col p-2 mt-2 flex-1 overflow-y-auto">{isOpen ? navGroups.map((group) => { const shut=!!collapsed[group.id]; return <div key={group.id} className="mb-2"><button onClick={()=>toggleGroup(group.id)} className="flex items-center justify-between w-full px-3 py-1.5 rounded-md text-[#585b70] hover:text-[#a6adc8]"><span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider"><span>{group.icon}</span><span>{group.label}</span></span><span>{shut ? "›" : "⌄"}</span></button>{!shut && <div className="mt-0.5 flex flex-col gap-0.5">{group.items.map((item)=> item.disabled ? <div key={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 opacity-35 cursor-not-allowed whitespace-nowrap text-sm font-medium"><span>{item.icon}</span><span className="flex-1">{item.label}</span>{item.phase && <span className="text-[9px]">{item.phase}</span>}</div> : <Link key={item.href} href={item.href} className={["flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",isActive(item.href)?"bg-[#313244] text-[#89b4fa]":"text-[#cdd6f4] hover:bg-[#313244]"].join(" ")}><span>{item.icon}</span><span>{item.label}</span></Link>)}</div>}</div>}) : navGroups.flatMap((group)=>group.items.filter((item)=>!item.disabled).map((item)=><Link key={item.href} href={item.href} title={item.label} className={["flex items-center justify-center rounded-lg px-3 py-2.5 mb-0.5",isActive(item.href)?"bg-[#313244] text-[#89b4fa]":"text-[#cdd6f4] hover:bg-[#313244]"].join(" ")}><span className="text-lg">{item.icon}</span></Link>))}</nav>
      <div className="border-t border-[#313244] p-2"><Link href={settingsItem.href} className={["flex items-center gap-3 rounded-lg px-3 py-2.5",isActive(settingsItem.href)?"bg-[#313244] text-[#89b4fa]":"text-[#cdd6f4] hover:bg-[#313244]",isOpen?"":"justify-center"].join(" ")} title={!isOpen?settingsItem.label:undefined}><span className="text-lg">{settingsItem.icon}</span>{isOpen&&<span className="text-sm font-medium">{settingsItem.label}</span>}</Link>{isOpen&&<p className="px-3 pt-2 pb-1 text-[11px] text-[#585b70]">Maya v1.0</p>}</div>
    </aside>
  </>;
}
