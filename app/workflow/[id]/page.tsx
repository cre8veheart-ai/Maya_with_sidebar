"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWorkflowStorage } from "@/lib/storage/WorkflowStorageContext";
import WorkflowCanvas from "@/components/workflow/WorkflowCanvas";
import type { Workflow } from "@/lib/types/workflow";

interface WorkflowPageProps {
  params: { id: string };
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-24">
      <p className="text-[14px] font-medium text-[#6E6E73]">
        Workflow not found
      </p>
      <a
        href="/workflows"
        className="mt-3 text-[13px] text-[#0066CC] hover:underline"
      >
        ← Back to Workflows
      </a>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full py-24">
      <div className="w-5 h-5 rounded-full border-2 border-[#E5E5EA] border-t-[#1D1D1F] animate-spin" />
    </div>
  );
}

export default function WorkflowPage({ params }: WorkflowPageProps) {
  const { id } = params;
  const storage = useWorkflowStorage();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<Workflow | null | undefined>(
    undefined
  );

  const load = useCallback(async () => {
    const wf = await storage.get(id);
    setWorkflow(wf);
  }, [storage, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (updated: Workflow) => {
    const saved = await storage.save(updated);
    setWorkflow(saved);
  };

  const handleDelete = async () => {
    await storage.remove(id);
    router.push("/workflows");
  };

  if (workflow === undefined) return <LoadingState />;
  if (workflow === null) return <NotFound />;

  return (
    <WorkflowCanvas
      workflow={workflow}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
