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

  const toggle = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggle} />
      <MainContent isOpen={sidebarOpen} onToggle={toggle}>
        {children}
      </MainContent>
    </>
  );
}
