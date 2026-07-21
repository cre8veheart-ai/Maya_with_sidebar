import "./globals.css";
import type { Metadata } from "next";
import SidebarLayout from "@/components/SidebarLayout";
import { WorkflowStorageProvider } from "@/lib/storage/WorkflowStorageContext";

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
        <WorkflowStorageProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </WorkflowStorageProvider>
      </body>
    </html>
  );
}

