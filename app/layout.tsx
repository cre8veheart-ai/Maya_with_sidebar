import "./globals.css";
import type { Metadata } from "next";
import SidebarLayout from "@/components/SidebarLayout";

export const metadata: Metadata = {
  title: "MAYA — Executive Intelligence OS",
  description: "MAYA — The Executive Intelligence Operating System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}

