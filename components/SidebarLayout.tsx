"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

<<<<<<< HEAD
  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      />
      <MainContent
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      >
=======
  const toggle = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggle} />
      <MainContent isOpen={sidebarOpen} onToggle={toggle}>
>>>>>>> origin/copilot/audit-maya-repo-readiness
        {children}
      </MainContent>
    </>
  );
}
