"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage<boolean>(
    "maya-sidebar-open",
    true
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <MainContent onMobileMenuOpen={() => setMobileSidebarOpen(true)}>
        {children}
      </MainContent>
    </div>
  );
}

