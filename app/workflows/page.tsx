"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import WorkflowList from "@/components/workflow/WorkflowList";
import CreateWorkflowModal from "@/components/workflow/CreateWorkflowModal";
import { useWorkflowStorage } from "@/lib/storage/WorkflowStorageContext";
import type { Workflow, WorkflowStatus } from "@/lib/types/workflow";

function generateId(): string {
  return `wf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-[14px] font-medium text-[#6E6E73]">No workflows yet</p>
      <p className="text-[13px] text-[#AEAEB2] mt-1">
        Create your first workflow to get started.
      </p>
    </div>
  );
}

export default function WorkflowsPage() {
  const storage = useWorkflowStorage();
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const reload = useCallback(async () => {
    const all = await storage.list();
    // Sort newest first
    setWorkflows(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, [storage]);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleCreate = async (
    title: string,
    description: string,
    status: WorkflowStatus
  ) => {
    const now = new Date().toISOString();
    const wf: Workflow = {
      id: generateId(),
      title,
      description: description || undefined,
      status,
      createdAt: now,
      updatedAt: now,
    };
    await storage.save(wf);
    setShowCreate(false);
    router.push(`/workflow/${wf.id}`);
  };

  const handleDelete = async (id: string) => {
    await storage.remove(id);
    await reload();
  };

  return (
    <>
      <PageShell
        title="Workflows"
        subtitle="Manage and track active business workflows"
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-[#1D1D1F] hover:bg-[#3D3D3D] text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            + New Workflow
          </button>
        }
      >
        {workflows.length === 0 ? (
          <EmptyState />
        ) : (
          <WorkflowList workflows={workflows} onDelete={handleDelete} />
        )}
      </PageShell>

      {showCreate && (
        <CreateWorkflowModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}

