import "./globals.css";
import type { Metadata } from "next";
import SidebarLayout from "@/components/SidebarLayout";
import { WorkflowStorageProvider } from "@/lib/storage/WorkflowStorageContext";
import { DecisionStorageProvider } from "@/lib/storage/DecisionStorageContext";
import { KnowledgeStorageProvider } from "@/lib/storage/KnowledgeStorageContext";

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
          <DecisionStorageProvider>
            <KnowledgeStorageProvider>
              <SidebarLayout>{children}</SidebarLayout>
            </KnowledgeStorageProvider>
          </DecisionStorageProvider>
        </WorkflowStorageProvider>
      </body>
    </html>
  );
}

