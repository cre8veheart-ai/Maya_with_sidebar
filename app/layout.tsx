import "./globals.css";
import type { Metadata } from "next";
import SidebarLayout from "@/components/SidebarLayout";
import { WorkflowStorageProvider } from "@/lib/storage/WorkflowStorageContext";
import { DecisionStorageProvider } from "@/lib/storage/DecisionStorageContext";
import { KnowledgeStorageProvider } from "@/lib/storage/KnowledgeStorageContext";
import { MemoryStorageProvider } from "@/lib/storage/MemoryStorageContext";
import { VaultStorageProvider } from "@/lib/storage/VaultStorageContext";
import { CampaignStorageProvider } from "@/lib/storage/CampaignStorageContext";
import { AuthProvider } from "@/lib/auth/AuthProvider";

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
        <AuthProvider>
          <WorkflowStorageProvider>
            <DecisionStorageProvider>
              <KnowledgeStorageProvider>
                <MemoryStorageProvider>
                  <VaultStorageProvider>
                    <CampaignStorageProvider>
                      <SidebarLayout>{children}</SidebarLayout>
                    </CampaignStorageProvider>
                  </VaultStorageProvider>
                </MemoryStorageProvider>
              </KnowledgeStorageProvider>
            </DecisionStorageProvider>
          </WorkflowStorageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

