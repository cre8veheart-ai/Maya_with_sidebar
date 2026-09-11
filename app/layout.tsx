import "./globals.css";
import type { Metadata } from "next";
import SidebarLayout from "@/components/SidebarLayout";

export const metadata: Metadata = {
  title: "Maya",
  description: "Maya — your AI assistant with sidebar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-[#ffffff] text-[#1f2937] font-[var(--font-inter)]">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
