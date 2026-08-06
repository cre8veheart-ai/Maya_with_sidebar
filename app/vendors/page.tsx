"use client";

import { useState, useEffect } from "react";
import PageShell from "@/components/PageShell";
import {
  loadVendorLists,
  saveVendorLists,
  createVendorList,
  createVendor,
} from "@/lib/vendors/store";
import type { VendorList, Vendor, VendorStatus } from "@/lib/vendors/types";

const CATEGORIES = ["Production", "Legal", "Finance", "Technology", "Media", "Marketing", "Design", "Logistics", "Consulting", "Other"];
const VENDOR_TYPES = ["Freelancer", "Agency", "SaaS", "Supplier", "Contractor", "Studio", "Law Firm", "Firm", "Other"];
const STATUS_COLORS: Record<VendorStatus, string> = {
  active: "text-[#a6e3a1] border-[#a6e3a1]/30",
  prospect: "text-[#89b4fa] border-[#89b4fa]/30",
  "on-hold": "text-[#f9e2af] border-[#f9e2af]/30",
  inactive: "text-[#585b70] border-[#313244]",
};

function Badge({ status }: { status: VendorStatus }) {
  return (
    <span className={`text-[9px] font-semibold uppercase tracking-wider border px-1.5 py-0.5 rounded ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}

export default function VendorsPage() {
  const [lists, setLists] = useState<VendorList[]>([]);
  const [activeList, setActiveList] = useState<string | null>(null);
  const [showNewList, setShowNewList] = useState(false);
  const [showNewVendor, setShowNewVendor] = useState(false);
  const [activeVendor, setActiveVendor] = useState<string | null>(null);

  // New list form
  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [newListCat, setNewListCat] = useState("Production");

  // New vendor form
  const [vName, setVName] = useState("");
  const [vCompany, setVCompany] = useState("");
  const [vCategory, setVCategory] = useState("Production");
  const [vType, setVType] = useState("Agency");
  const [vContact, setVContact] = useState("");
  const [vWebsite, setVWebsite] = useState("");
  const [vRate, setVRate] = useState("");
  const [vNotes, setVNotes] = useState("");
  const [vStatus, setVStatus] = useState<VendorStatus>("active");
  const [vTags, setVTags] = useState("");

  useEffect(() => {
    const loaded = loadVendorLists();
    setLists(loaded);
    if (loaded.length > 0) setActiveList(loaded[0].id);
  }, []);

  function persist(updated: VendorList[]) {
    setLists(updated);
    saveVendorLists(updated);
  }

  function handleCreateList() {
    if (!newListName.trim()) return;
    const list = createVendorList(newListName.trim(), newListDesc.trim(), newListCat);
    const updated = [...lists, list];
    persist(updated);
    setActiveList(list.id);
    setShowNewList(false);
    setNewListName(""); setNewListDesc(""); setNewListCat("Production");
  }

  function handleDeleteList(id: string) {
    const updated = lists.filter((l) => l.id !== id);
    persist(updated);
    setActiveList(updated[0]?.id ?? null);
  }

  function toggleActivate(id: string) {
    const updated = lists.map((l) => l.id === id ? { ...l, activated: !l.activated, updatedAt: new Date().toISOString() } : l);
    persist(updated);
  }

  function handleAddVendor() {
    if (!vName.trim() || !activeList) return;
    const vendor = createVendor({
      name: vName.trim(),
      company: vCompany.trim(),
      category: vCategory,
      type: vType,
      contact: vContact.trim(),
      website: vWebsite.trim() || undefined,
      rate: vRate.trim() || undefined,
      notes: vNotes.trim(),
      status: vStatus,
      tags: vTags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    const updated = lists.map((l) =>
      l.id === activeList
        ? { ...l, vendors: [...l.vendors, vendor], updatedAt: new Date().toISOString() }
        : l
    );
    persist(updated);
    setShowNewVendor(false);
    setVName(""); setVCompany(""); setVContact(""); setVWebsite(""); setVRate(""); setVNotes(""); setVTags(""); setVStatus("active");
  }

  function handleDeleteVendor(vendorId: string) {
    const updated = lists.map((l) =>
      l.id === activeList
        ? { ...l, vendors: l.vendors.filter((v) => v.id !== vendorId), updatedAt: new Date().toISOString() }
        : l
    );
    persist(updated);
    setActiveVendor(null);
  }

  function updateVendorStatus(vendorId: string, status: VendorStatus) {
    const updated = lists.map((l) =>
      l.id === activeList
        ? { ...l, vendors: l.vendors.map((v) => v.id === vendorId ? { ...v, status, updatedAt: new Date().toISOString() } : v), updatedAt: new Date().toISOString() }
        : l
    );
    persist(updated);
  }

  const currentList = lists.find((l) => l.id === activeList) ?? null;
  const activatedCount = lists.filter((l) => l.activated).length;

  const inputClass = "w-full bg-[#181825] border border-[#313244] text-[13px] text-[#cdd6f4] placeholder-[#585b70] rounded-lg px-3 py-2 focus:outline-none focus:border-[#89b4fa]/50";

  return (
    <PageShell
      title="Vendor Lists"
      subtitle="Build your own vendor lists — activate any list to inject it as live context in your exec lenses"
      action={
        <div className="flex items-center gap-3">
          {activatedCount > 0 && (
            <span className="text-[11px] text-[#a6e3a1] border border-[#a6e3a1]/30 px-2.5 py-1 rounded-lg">
              {activatedCount} list{activatedCount !== 1 ? "s" : ""} active in MAYA
            </span>
          )}
          <button
            onClick={() => setShowNewList(true)}
            className="text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-1.5 rounded-lg hover:bg-[#89b4fa]/10 transition-colors"
          >
            + New List
          </button>
        </div>
      }
    >
      <div className="flex flex-col xl:flex-row gap-5">
        {/* Left — list sidebar */}
        <div className="xl:w-[260px] shrink-0 space-y-2">
          {/* Activation explainer */}
          <div className="bg-[#181825] border border-[#313244] rounded-xl p-3">
            <p className="text-[11px] text-[#585b70] leading-relaxed">
              <span className="text-[#89b4fa] font-semibold">Activate</span> a list to inject your vendors as context — MAYA knows who you work with when you need recommendations, briefings, or routing.
            </p>
          </div>

          {/* New list form */}
          {showNewList && (
            <div className="bg-[#1e1e2e] border border-[#89b4fa]/30 rounded-xl p-4 space-y-3">
              <p className="text-[12px] font-semibold text-[#cdd6f4]">New Vendor List</p>
              <input value={newListName} onChange={(e) => setNewListName(e.target.value)} placeholder="List name (e.g. Production Vendors)" className={inputClass} />
              <input value={newListDesc} onChange={(e) => setNewListDesc(e.target.value)} placeholder="Description (optional)" className={inputClass} />
              <select value={newListCat} onChange={(e) => setNewListCat(e.target.value)} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowNewList(false)} className="text-[12px] text-[#585b70] px-3 py-1.5 rounded-lg hover:text-[#a6adc8] transition-colors">Cancel</button>
                <button onClick={handleCreateList} className="text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-1.5 rounded-lg hover:bg-[#89b4fa]/10 transition-colors">Create</button>
              </div>
            </div>
          )}

          {lists.length === 0 ? (
            <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-6 flex flex-col items-center gap-2">
              <span className="text-2xl">📋</span>
              <p className="text-[12px] text-[#585b70] text-center">No vendor lists yet. Create one to get started.</p>
            </div>
          ) : (
            lists.map((list) => (
              <div
                key={list.id}
                onClick={() => setActiveList(list.id)}
                className={["bg-[#1e1e2e] border rounded-xl p-3 cursor-pointer transition-all", activeList === list.id ? "border-[#89b4fa]/40" : "border-[#313244] hover:border-[#45475a]"].join(" ")}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#cdd6f4] truncate">{list.name}</p>
                    <p className="text-[10px] text-[#585b70]">{list.category} · {list.vendors.length} vendor{list.vendors.length !== 1 ? "s" : ""}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleActivate(list.id); }}
                    title={list.activated ? "Deactivate" : "Activate in MAYA"}
                    className={["w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-all shrink-0", list.activated ? "bg-[#a6e3a1]/20 border-[#a6e3a1]/50 text-[#a6e3a1]" : "border-[#313244] text-[#585b70] hover:border-[#a6e3a1]/50"].join(" ")}
                  >
                    {list.activated ? "✓" : "○"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right — vendor detail */}
        <div className="flex-1 space-y-4">
          {currentList ? (
            <>
              {/* List header */}
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[16px] font-semibold text-[#cdd6f4]">{currentList.name}</h2>
                      {currentList.activated && (
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-[#a6e3a1] border border-[#a6e3a1]/30 px-1.5 py-0.5 rounded">
                          Active in MAYA
                        </span>
                      )}
                    </div>
                    {currentList.description && <p className="text-[12px] text-[#585b70] mt-0.5">{currentList.description}</p>}
                    <p className="text-[11px] text-[#585b70] mt-1">{currentList.category} · {currentList.vendors.length} vendor{currentList.vendors.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => toggleActivate(currentList.id)}
                      className={["text-[12px] border px-3 py-1.5 rounded-lg transition-colors", currentList.activated ? "text-[#f38ba8] border-[#f38ba8]/30 hover:bg-[#f38ba8]/10" : "text-[#a6e3a1] border-[#a6e3a1]/30 hover:bg-[#a6e3a1]/10"].join(" ")}
                    >
                      {currentList.activated ? "Deactivate" : "Activate in MAYA"}
                    </button>
                    <button
                      onClick={() => setShowNewVendor(true)}
                      className="text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-3 py-1.5 rounded-lg hover:bg-[#89b4fa]/10 transition-colors"
                    >
                      + Add Vendor
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this list?")) handleDeleteList(currentList.id); }}
                      className="text-[12px] text-[#585b70] border border-[#313244] px-3 py-1.5 rounded-lg hover:text-[#f38ba8] hover:border-[#f38ba8]/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Add vendor form */}
              {showNewVendor && (
                <div className="bg-[#1e1e2e] border border-[#89b4fa]/30 rounded-xl p-5 space-y-4">
                  <p className="text-[13px] font-semibold text-[#cdd6f4]">Add Vendor</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Name *</label><input value={vName} onChange={(e) => setVName(e.target.value)} placeholder="Contact / vendor name" className={inputClass} /></div>
                    <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Company</label><input value={vCompany} onChange={(e) => setVCompany(e.target.value)} placeholder="Company or studio name" className={inputClass} /></div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Category</label>
                      <select value={vCategory} onChange={(e) => setVCategory(e.target.value)} className={inputClass}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Type</label>
                      <select value={vType} onChange={(e) => setVType(e.target.value)} className={inputClass}>
                        {VENDOR_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Contact (email/phone)</label><input value={vContact} onChange={(e) => setVContact(e.target.value)} placeholder="email@example.com" className={inputClass} /></div>
                    <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Website</label><input value={vWebsite} onChange={(e) => setVWebsite(e.target.value)} placeholder="https://..." className={inputClass} /></div>
                    <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Rate / Pricing</label><input value={vRate} onChange={(e) => setVRate(e.target.value)} placeholder="e.g. $150/hr, Project-based" className={inputClass} /></div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Status</label>
                      <select value={vStatus} onChange={(e) => setVStatus(e.target.value as VendorStatus)} className={inputClass}>
                        {(["active", "prospect", "on-hold", "inactive"] as VendorStatus[]).map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2"><label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Tags (comma-separated)</label><input value={vTags} onChange={(e) => setVTags(e.target.value)} placeholder="video, motion, post-production" className={inputClass} /></div>
                    <div className="sm:col-span-2"><label className="text-[10px] font-semibold uppercase tracking-wider text-[#585b70] block mb-1">Notes</label><textarea value={vNotes} onChange={(e) => setVNotes(e.target.value)} placeholder="Strengths, relationship notes, past work…" rows={3} className={inputClass + " resize-none"} /></div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowNewVendor(false)} className="text-[12px] text-[#585b70] px-3 py-1.5 rounded-lg hover:text-[#a6adc8]">Cancel</button>
                    <button onClick={handleAddVendor} className="text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-1.5 rounded-lg hover:bg-[#89b4fa]/10 transition-colors">Add Vendor</button>
                  </div>
                </div>
              )}

              {/* Vendor list */}
              {currentList.vendors.length === 0 ? (
                <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-10 flex flex-col items-center gap-3">
                  <span className="text-3xl">🏢</span>
                  <p className="text-[13px] text-[#585b70]">No vendors yet — add your first one.</p>
                  <p className="text-[11px] text-[#585b70] text-center max-w-xs">Once added and the list is activated, MAYA knows your vendor roster and can reference them in any exec lens.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentList.vendors.map((v: Vendor) => (
                    <div
                      key={v.id}
                      className={["bg-[#1e1e2e] border rounded-xl p-4 cursor-pointer transition-all", activeVendor === v.id ? "border-[#89b4fa]/40" : "border-[#313244] hover:border-[#45475a]"].join(" ")}
                      onClick={() => setActiveVendor(activeVendor === v.id ? null : v.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[13px] font-semibold text-[#cdd6f4]">{v.name}</p>
                            {v.company && <p className="text-[12px] text-[#585b70]">· {v.company}</p>}
                            <Badge status={v.status} />
                          </div>
                          <p className="text-[11px] text-[#585b70] mt-0.5">{v.type} · {v.category}{v.rate ? ` · ${v.rate}` : ""}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteVendor(v.id); }}
                          className="text-[11px] text-[#45475a] hover:text-[#f38ba8] transition-colors shrink-0"
                        >
                          ✕
                        </button>
                      </div>

                      {activeVendor === v.id && (
                        <div className="mt-3 pt-3 border-t border-[#313244] space-y-2">
                          {v.contact && <p className="text-[12px] text-[#a6adc8]">📧 {v.contact}</p>}
                          {v.website && <a href={v.website} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#89b4fa] hover:underline block">🌐 {v.website}</a>}
                          {v.notes && <p className="text-[12px] text-[#585b70] leading-relaxed">{v.notes}</p>}
                          {v.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {v.tags.map((tag) => (
                                <span key={tag} className="text-[9px] font-semibold uppercase tracking-wider text-[#585b70] border border-[#313244] px-1.5 py-0.5 rounded">{tag}</span>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {(["active", "prospect", "on-hold", "inactive"] as VendorStatus[]).map((s) => (
                              <button
                                key={s}
                                onClick={(e) => { e.stopPropagation(); updateVendorStatus(v.id, s); }}
                                className={["text-[10px] px-2 py-1 rounded-lg border transition-colors", v.status === s ? "bg-[#313244] text-[#cdd6f4] border-[#45475a]" : "border-[#313244] text-[#585b70] hover:text-[#a6adc8]"].join(" ")}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl h-64 flex flex-col items-center justify-center gap-3">
              <span className="text-3xl">📋</span>
              <p className="text-[13px] text-[#585b70]">Create a vendor list to get started.</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
