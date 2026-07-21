"use client";

import { useState } from "react";
import type { WorkflowStatus } from "@/lib/types/workflow";

interface CreateWorkflowModalProps {
  onClose: () => void;
  onCreate: (title: string, description: string, status: WorkflowStatus) => void;
}

export default function CreateWorkflowModal({
  onClose,
  onCreate,
}: CreateWorkflowModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<WorkflowStatus>("active");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    onCreate(title.trim(), description.trim(), status);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-[17px] font-semibold text-[#1D1D1F] mb-5">
          New Workflow
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. Q3 Revenue Review"
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] placeholder-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition"
            />
            {error && (
              <p className="mt-1 text-[12px] text-red-500">{error}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional — describe this workflow's purpose"
              rows={3}
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] placeholder-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as WorkflowStatus)}
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition appearance-none"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-[14px] font-medium text-[#6E6E73] bg-[#F5F5F7] hover:bg-[#EBEBED] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-[14px] font-medium text-white bg-[#1D1D1F] hover:bg-[#3D3D3D] rounded-lg transition-colors"
            >
              Create Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
