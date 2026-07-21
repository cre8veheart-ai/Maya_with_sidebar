"use client";

import { useState, useEffect, useCallback } from "react";
import PageShell from "@/components/PageShell";
import DecisionList from "@/components/decisions/DecisionList";
import LogDecisionModal from "@/components/decisions/LogDecisionModal";
import { useDecisionStorage } from "@/lib/storage/DecisionStorageContext";
import type { Decision, DecisionStatus } from "@/lib/types/decision";

function generateId(): string {
  return `dec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-[14px] font-medium text-[#6E6E73]">No decisions logged yet</p>
      <p className="text-[13px] text-[#AEAEB2] mt-1">
        Every decision you log becomes institutional memory Maya can reference.
      </p>
    </div>
  );
}

export default function DecisionsPage() {
  const storage = useDecisionStorage();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [showLog, setShowLog] = useState(false);

  const reload = useCallback(async () => {
    const all = await storage.list();
    setDecisions(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, [storage]);

  useEffect(() => { reload(); }, [reload]);

  const handleCreate = async (
    title: string,
    context: string,
    rationale: string,
    outcome: string,
    status: DecisionStatus
  ) => {
    const now = new Date().toISOString();
    const decision: Decision = {
      id: generateId(),
      title,
      context: context || undefined,
      rationale: rationale || undefined,
      outcome: outcome || undefined,
      status,
      createdAt: now,
      updatedAt: now,
    };
    await storage.save(decision);
    setShowLog(false);
    await reload();
  };

  const handleDelete = async (id: string) => {
    await storage.remove(id);
    await reload();
  };

  return (
    <>
      <PageShell
        title="Decisions"
        subtitle="Log and track key business decisions"
        action={
          <button
            onClick={() => setShowLog(true)}
            className="px-4 py-2 bg-[#1D1D1F] hover:bg-[#3D3D3D] text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            + Log Decision
          </button>
        }
      >
        {decisions.length === 0 ? <EmptyState /> : (
          <DecisionList decisions={decisions} onDelete={handleDelete} />
        )}
      </PageShell>

      {showLog && (
        <LogDecisionModal
          onClose={() => setShowLog(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
