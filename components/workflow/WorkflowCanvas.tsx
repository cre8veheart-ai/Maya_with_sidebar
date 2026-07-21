"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Workflow, WorkflowStatus, WorkflowPhase, PhaseStatus } from "@/lib/types/workflow";
import { DEFAULT_PHASES } from "@/lib/types/workflow";

const STATUS_STYLES: Record<WorkflowStatus, string> = {
  active: "bg-[#E8F5E9] text-[#1B5E20]",
  paused: "bg-[#FFF9C4] text-[#7B6B00]",
  completed: "bg-[#E3F2FD] text-[#0D47A1]",
  archived: "bg-[#F5F5F7] text-[#6E6E73]",
};

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 3L5 8l5 5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 7l3.5 3.5L12 3" />
  </svg>
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface WorkflowCanvasProps {
  workflow: Workflow;
  onSave: (updated: Workflow) => Promise<void>;
  onDelete: () => void;
}

const PHASE_STATUS_STYLES: Record<PhaseStatus, string> = {
  pending: "bg-[#F5F5F7] text-[#6E6E73]",
  "in-progress": "bg-[#FFF9C4] text-[#7B6B00]",
  complete: "bg-[#E8F5E9] text-[#1B5E20]",
};

const PHASE_STATUS_LABELS: Record<PhaseStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  complete: "Complete",
};

interface PhaseTrackProps {
  phases: WorkflowPhase[];
  onUpdate: (id: string, patch: Partial<WorkflowPhase>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

function PhaseTrack({ phases, onUpdate, onAdd, onRemove }: PhaseTrackProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#AEAEB2]">
          Campaign Phases
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="text-[12px] text-[#0066CC] hover:text-[#0051A2] font-medium transition-colors"
        >
          + Add Phase
        </button>
      </div>

      <div className="space-y-2">
        {phases.map((phase, index) => (
          <div
            key={phase.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-[#F0F0F5] hover:border-[#E5E5EA] bg-[#FAFAFA] group transition-colors"
          >
            {/* Phase number */}
            <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-[11px] font-semibold text-[#AEAEB2] bg-white border border-[#E5E5EA] rounded-full">
              {index + 1}
            </span>

            {/* Phase name */}
            <input
              type="text"
              value={phase.name}
              onChange={(e) => onUpdate(phase.id, { name: e.target.value })}
              className="flex-1 text-[14px] font-medium text-[#1D1D1F] bg-transparent border-none outline-none placeholder-[#C7C7CC] min-w-0"
              placeholder="Phase name"
            />

            {/* Due date */}
            <input
              type="date"
              value={phase.dueDate ?? ""}
              onChange={(e) => onUpdate(phase.id, { dueDate: e.target.value || undefined })}
              className="text-[12px] text-[#6E6E73] bg-transparent border-none outline-none cursor-pointer focus:ring-0 w-[130px] flex-shrink-0"
              title="Due date"
            />

            {/* Status pill */}
            <select
              value={phase.status}
              onChange={(e) => onUpdate(phase.id, { status: e.target.value as PhaseStatus })}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 transition flex-shrink-0 ${PHASE_STATUS_STYLES[phase.status]}`}
            >
              {(Object.keys(PHASE_STATUS_LABELS) as PhaseStatus[]).map((s) => (
                <option key={s} value={s}>{PHASE_STATUS_LABELS[s]}</option>
              ))}
            </select>

            {/* Remove */}
            <button
              type="button"
              onClick={() => onRemove(phase.id)}
              className="opacity-0 group-hover:opacity-100 text-[#AEAEB2] hover:text-[#FF3B30] transition-all flex-shrink-0 text-[16px] leading-none"
              title="Remove phase"
              aria-label="Remove phase"
            >
              ×
            </button>
          </div>
        ))}

        {phases.length === 0 && (
          <p className="text-[13px] text-[#AEAEB2] py-4 text-center">
            No phases yet — add one above.
          </p>
        )}
      </div>
    </div>
  );
}

export default function WorkflowCanvas({
  workflow,
  onSave,
  onDelete,
}: WorkflowCanvasProps) {
  const [title, setTitle] = useState(workflow.title);
  const [description, setDescription] = useState(workflow.description ?? "");
  const [status, setStatus] = useState<WorkflowStatus>(workflow.status);
  const [phases, setPhases] = useState<WorkflowPhase[]>(
    workflow.phases && workflow.phases.length > 0
      ? workflow.phases
      : DEFAULT_PHASES.map((p, i) => ({ ...p, id: `phase_${i}` }))
  );
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Reset local state if the incoming workflow changes (e.g. after save)
  useEffect(() => {
    setTitle(workflow.title);
    setDescription(workflow.description ?? "");
    setStatus(workflow.status);
    setPhases(
      workflow.phases && workflow.phases.length > 0
        ? workflow.phases
        : DEFAULT_PHASES.map((p, i) => ({ ...p, id: `phase_${i}` }))
    );
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow.id]); // intentionally reset only when switching to a different workflow

  const markDirty = () => { setDirty(true); setSaved(false); };

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;
    await onSave({
      ...workflow,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      phases,
      updatedAt: new Date().toISOString(),
    });
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [workflow, title, description, status, phases, onSave]);

  // Save on Ctrl/Cmd+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  const updatePhase = (id: string, patch: Partial<WorkflowPhase>) => {
    setPhases((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    markDirty();
  };

  const addPhase = () => {
    const newPhase: WorkflowPhase = {
      id: `phase_${Date.now()}`,
      name: "New Phase",
      status: "pending",
    };
    setPhases((prev) => [...prev, newPhase]);
    markDirty();
  };

  const removePhase = (id: string) => {
    setPhases((prev) => prev.filter((p) => p.id !== id));
    markDirty();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Canvas header */}
      <div className="flex items-center gap-3 px-6 h-14 border-b border-[#E5E5EA] flex-shrink-0">
        <Link
          href="/workflows"
          className="flex items-center gap-1 text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
        >
          <BackIcon />
          <span>Workflows</span>
        </Link>

        <span className="text-[#E5E5EA]">/</span>

        <span className="text-[13px] text-[#1D1D1F] font-medium truncate max-w-[240px]">
          {workflow.title}
        </span>

        <div className="flex items-center gap-2 ml-auto">
          {/* Status selector */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as WorkflowStatus); markDirty(); }}
            className={`text-[12px] font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 transition ${STATUS_STYLES[status]}`}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!dirty && !saved}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
              saved
                ? "bg-[#E8F5E9] text-[#1B5E20]"
                : dirty
                ? "bg-[#1D1D1F] text-white hover:bg-[#3D3D3D]"
                : "bg-[#F5F5F7] text-[#AEAEB2] cursor-default",
            ].join(" ")}
          >
            {saved && <CheckIcon />}
            {saved ? "Saved" : "Save"}
          </button>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#FF3B30] hover:bg-[#FFF1F0] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Canvas body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); markDirty(); }}
            onBlur={handleSave}
            placeholder="Workflow title"
            className="w-full text-[28px] font-semibold text-[#1D1D1F] tracking-tight bg-transparent border-none outline-none placeholder-[#C7C7CC] mb-2"
          />

          {/* Metadata */}
          <div className="flex items-center gap-4 text-[12px] text-[#AEAEB2] mb-8">
            <span>Created {formatDate(workflow.createdAt)}</span>
            <span>·</span>
            <span>Updated {formatDate(workflow.updatedAt)}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F5F5F7] mb-8" />

          {/* Description */}
          <div className="mb-10">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.09em] text-[#AEAEB2] mb-3">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); markDirty(); }}
              onBlur={handleSave}
              placeholder="Describe this workflow's purpose, scope, and goals…"
              rows={4}
              className="w-full text-[15px] text-[#1D1D1F] bg-transparent border-none outline-none placeholder-[#C7C7CC] leading-relaxed resize-none"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-[#F5F5F7] mb-8" />

          {/* Phase Track */}
          <PhaseTrack
            phases={phases}
            onUpdate={updatePhase}
            onAdd={addPhase}
            onRemove={removePhase}
          />

          {/* Keyboard hint */}
          <p className="mt-10 text-[11px] text-[#C7C7CC]">
            Changes auto-save on blur · ⌘S to save manually
          </p>
        </div>
      </div>
    </div>
  );
}
