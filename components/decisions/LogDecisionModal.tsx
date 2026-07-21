"use client";

import { useState } from "react";
import type { DecisionStatus } from "@/lib/types/decision";

interface LogDecisionModalProps {
  onClose: () => void;
  onCreate: (
    title: string,
    context: string,
    rationale: string,
    outcome: string,
    status: DecisionStatus
  ) => void;
}

export default function LogDecisionModal({
  onClose,
  onCreate,
}: LogDecisionModalProps) {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [rationale, setRationale] = useState("");
  const [outcome, setOutcome] = useState("");
  const [status, setStatus] = useState<DecisionStatus>("decided");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Decision title is required.");
      return;
    }
    onCreate(title.trim(), context.trim(), rationale.trim(), outcome.trim(), status);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-[17px] font-semibold text-[#1D1D1F] mb-5">
          Log a Decision
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Decision <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. Move to self-serve onboarding"
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] placeholder-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition"
            />
            {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Context
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="What situation forced this decision?"
              rows={2}
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] placeholder-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition resize-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Rationale
            </label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Why this choice over the alternatives?"
              rows={2}
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] placeholder-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition resize-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Outcome
            </label>
            <textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="What happened as a result? (fill in later if unknown)"
              rows={2}
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] placeholder-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition resize-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DecisionStatus)}
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition appearance-none"
            >
              <option value="open">Open — still deciding</option>
              <option value="decided">Decided</option>
              <option value="archived">Archived</option>
            </select>
          </div>

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
              Log Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
