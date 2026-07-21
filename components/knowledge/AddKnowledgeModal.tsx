"use client";

import { useState } from "react";
import type { KnowledgeCategory } from "@/lib/types/knowledge";

const CATEGORIES: { value: KnowledgeCategory; label: string }[] = [
  { value: "strategy", label: "Strategy" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "people", label: "People" },
  { value: "market", label: "Market" },
  { value: "product", label: "Product" },
  { value: "other", label: "Other" },
];

interface AddKnowledgeModalProps {
  onClose: () => void;
  onCreate: (title: string, content: string, category: KnowledgeCategory) => void;
}

export default function AddKnowledgeModal({
  onClose,
  onCreate,
}: AddKnowledgeModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("strategy");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }
    onCreate(title.trim(), content.trim(), category);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-[17px] font-semibold text-[#1D1D1F] mb-5">
          Add to Knowledge Vault
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. Our ideal customer profile"
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] placeholder-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition appearance-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6E6E73] mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(""); }}
              placeholder="What does Maya need to know about this?"
              rows={5}
              className="w-full px-3 py-2 text-[14px] bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg text-[#1D1D1F] placeholder-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition resize-none"
            />
            {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
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
              Save to Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
