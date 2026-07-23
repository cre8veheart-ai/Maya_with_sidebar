"use client";

import { useState, useEffect, useCallback } from "react";
import PageShell from "@/components/PageShell";
import KnowledgeList from "@/components/knowledge/KnowledgeList";
import AddKnowledgeModal from "@/components/knowledge/AddKnowledgeModal";
import { useKnowledgeStorage } from "@/lib/storage/KnowledgeStorageContext";
import type { KnowledgeEntry, KnowledgeCategory } from "@/lib/types/knowledge";

function generateId(): string {
  return `kv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-[14px] font-medium text-[#6E6E73]">Knowledge Vault is empty</p>
      <p className="text-[13px] text-[#AEAEB2] mt-1">
        Everything you add here becomes context Maya uses in every conversation.
      </p>
    </div>
  );
}

export default function KnowledgeVaultPage() {
  const storage = useKnowledgeStorage();
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const reload = useCallback(async () => {
    const all = await storage.list();
    setEntries(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, [storage]);

  useEffect(() => { reload(); }, [reload]);

  const handleCreate = async (
    title: string,
    content: string,
    category: KnowledgeCategory
  ) => {
    const now = new Date().toISOString();
    const entry: KnowledgeEntry = {
      id: generateId(),
      title,
      content,
      category,
      createdAt: now,
      updatedAt: now,
    };
    await storage.save(entry);
    setShowAdd(false);
    await reload();
  };

  const handleDelete = async (id: string) => {
    await storage.remove(id);
    await reload();
  };

  return (
    <>
      <PageShell
        title="Knowledge Vault"
        subtitle="Your organizational intelligence — Maya reads this in every session"
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-[#1D1D1F] hover:bg-[#3D3D3D] text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            + Add Entry
          </button>
        }
      >
        {entries.length === 0 ? <EmptyState /> : (
          <KnowledgeList entries={entries} onDelete={handleDelete} />
        )}
      </PageShell>

      {showAdd && (
        <AddKnowledgeModal
          onClose={() => setShowAdd(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
