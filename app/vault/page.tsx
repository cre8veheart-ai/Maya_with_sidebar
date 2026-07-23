"use client";

import { useCallback, useEffect, useState } from "react";
import { useVaultStorage } from "@/lib/storage/VaultStorageContext";
import type { VaultAccessRecord, VaultAuditEntry, VaultExportRequest, VaultAccessLevel } from "@/lib/types/vault";

// ── Icons ─────────────────────────────────────────────────────────────────────

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 1.5L2.5 4v4c0 3 2.5 5.5 5.5 6 3-0.5 5.5-3 5.5-6V4z"/>
    <path d="M5.5 8l1.5 1.5L10.5 6"/>
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId() {
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const ACCESS_LEVEL_COLORS: Record<VaultAccessLevel, string> = {
  owner:    "bg-[#E8F4FD] text-[#0066CC]",
  admin:    "bg-[#F0F0F2] text-[#3D3D3D]",
  exec:     "bg-[#F0FAF0] text-[#2D7D46]",
  client:   "bg-[#FFF8E6] text-[#996600]",
  readonly: "bg-[#F5F5F7] text-[#6E6E73]",
  revoked:  "bg-[#FFF0F0] text-[#C0392B]",
};

const AUDIT_ACTION_LABELS: Record<string, string> = {
  "read":             "Read",
  "write":            "Write",
  "export-requested": "Export Requested",
  "export-approved":  "Export Approved",
  "export-denied":    "Export Denied",
  "access-granted":   "Access Granted",
  "access-revoked":   "Access Revoked",
};

// ── Tab type ──────────────────────────────────────────────────────────────────

type Tab = "audit" | "access" | "exports";

// ── Main page ─────────────────────────────────────────────────────────────────

export default function VaultPage() {
  const vault = useVaultStorage();

  const [tab, setTab] = useState<Tab>("audit");
  const [auditLog, setAuditLog]       = useState<VaultAuditEntry[]>([]);
  const [accessList, setAccessList]   = useState<VaultAccessRecord[]>([]);
  const [exportList, setExportList]   = useState<VaultExportRequest[]>([]);

  // Grant access form
  const [newName, setNewName]   = useState("");
  const [newLevel, setNewLevel] = useState<VaultAccessLevel>("readonly");

  const refresh = useCallback(async () => {
    const [audit, access, exports] = await Promise.all([
      vault.getAuditLog(100),
      vault.listAccess(),
      vault.listExportRequests(),
    ]);
    setAuditLog(audit);
    setAccessList(access);
    setExportList(exports);
  }, [vault]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleGrantAccess = async () => {
    if (!newName.trim()) return;
    const userId = `user_${Date.now()}`;
    await vault.grantAccess({
      id: generateId(),
      userId,
      displayName: newName.trim(),
      accessLevel: newLevel,
      grantedAt: new Date().toISOString(),
      grantedBy: "owner",
    });
    await vault.logAccess({
      id: generateId(),
      action: "access-granted",
      category: "access",
      performedBy: "owner",
      performedAt: new Date().toISOString(),
      note: `Granted ${newLevel} to ${newName.trim()}`,
    });
    setNewName("");
    setNewLevel("readonly");
    refresh();
  };

  const handleRevoke = async (record: VaultAccessRecord) => {
    await vault.revokeAccess(record.userId, "owner");
    await vault.logAccess({
      id: generateId(),
      action: "access-revoked",
      category: "access",
      performedBy: "owner",
      performedAt: new Date().toISOString(),
      note: `Revoked access for ${record.displayName}`,
    });
    refresh();
  };

  const handleApproveExport = async (req: VaultExportRequest) => {
    await vault.approveExport(req.id, "owner");
    await vault.logAccess({
      id: generateId(),
      action: "export-approved",
      category: req.categories.join(", "),
      performedBy: "owner",
      performedAt: new Date().toISOString(),
    });
    refresh();
  };

  const handleDenyExport = async (req: VaultExportRequest) => {
    await vault.denyExport(req.id, "owner", "Denied by vault owner");
    await vault.logAccess({
      id: generateId(),
      action: "export-denied",
      category: req.categories.join(", "),
      performedBy: "owner",
      performedAt: new Date().toISOString(),
    });
    refresh();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "audit",   label: "Audit Trail" },
    { id: "access",  label: "Access Control" },
    { id: "exports", label: "Export Requests" },
  ];

  const pendingExports = exportList.filter((r) => r.status === "pending");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-5 flex-shrink-0 border-b border-[#E5E5EA]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#1D1D1F] flex items-center justify-center flex-shrink-0">
            <span className="text-white"><ShieldIcon /></span>
          </div>
          <h1 className="text-[22px] font-semibold text-[#1D1D1F] tracking-tight">Intel Vault</h1>
          {pendingExports.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-[#FF3B30] text-white text-[11px] font-semibold rounded-full">
              {pendingExports.length}
            </span>
          )}
        </div>
        <p className="text-[14px] text-[#6E6E73] ml-11">
          Protected company intel — access control, audit trail, and export approvals
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mt-5 ml-11">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "px-3 py-1.5 rounded-lg text-[13px] transition-colors",
                tab === t.id
                  ? "bg-[#1D1D1F] text-white font-medium"
                  : "text-[#6E6E73] hover:bg-[#F0F0F2] hover:text-[#1D1D1F]",
              ].join(" ")}
            >
              {t.label}
              {t.id === "exports" && pendingExports.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-[#FF3B30] text-white text-[10px] font-semibold rounded-full">
                  {pendingExports.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* ── Audit Trail ── */}
        {tab === "audit" && (
          <div className="max-w-3xl">
            <p className="text-[13px] text-[#6E6E73] mb-4">
              Every vault access, write, and access change — most recent first.
            </p>
            {auditLog.length === 0 ? (
              <div className="text-center py-16 text-[#AEAEB2] text-[14px]">
                No audit entries yet. Activity will appear here as the vault is used.
              </div>
            ) : (
              <div className="space-y-1">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-4 py-3 border-b border-[#F0F0F2]">
                    <span className="text-[12px] text-[#AEAEB2] flex-shrink-0 w-28 mt-0.5">
                      {formatDate(entry.performedAt)}
                    </span>
                    <span className="text-[12px] font-medium text-[#3D3D3D] flex-shrink-0 w-36">
                      {AUDIT_ACTION_LABELS[entry.action] ?? entry.action}
                    </span>
                    <span className="text-[12px] text-[#6E6E73] flex-shrink-0 w-24">{entry.category}</span>
                    <span className="text-[12px] text-[#8E8E93] flex-1">{entry.note ?? entry.performedBy}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Access Control ── */}
        {tab === "access" && (
          <div className="max-w-3xl">
            <p className="text-[13px] text-[#6E6E73] mb-6">
              Who has access to the vault. Revoke immediately when someone leaves.
            </p>

            {/* Grant access form */}
            <div className="bg-[#F9F9FB] border border-[#E5E5EA] rounded-xl p-4 mb-6">
              <p className="text-[13px] font-medium text-[#1D1D1F] mb-3">Grant Access</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name or identifier"
                  className="flex-1 px-3 py-2 text-[13px] border border-[#E5E5EA] rounded-lg bg-white outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/20"
                />
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as VaultAccessLevel)}
                  className="px-3 py-2 text-[13px] border border-[#E5E5EA] rounded-lg bg-white outline-none focus:border-[#0066CC] cursor-pointer"
                >
                  <option value="exec">Exec</option>
                  <option value="client">Client</option>
                  <option value="readonly">Read Only</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={handleGrantAccess}
                  disabled={!newName.trim()}
                  className="px-4 py-2 text-[13px] font-medium bg-[#1D1D1F] text-white rounded-lg hover:bg-[#3D3D3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Grant
                </button>
              </div>
            </div>

            {/* Access list */}
            {accessList.length === 0 ? (
              <div className="text-center py-12 text-[#AEAEB2] text-[14px]">
                No access records. Grant access above.
              </div>
            ) : (
              <div className="space-y-2">
                {accessList.map((record) => (
                  <div key={record.id} className="flex items-center gap-4 py-3 border-b border-[#F0F0F2]">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium text-[#1D1D1F] truncate">{record.displayName}</p>
                      <p className="text-[11px] text-[#AEAEB2]">Granted {formatDate(record.grantedAt)}{record.revokedAt ? ` · Revoked ${formatDate(record.revokedAt)}` : ""}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${ACCESS_LEVEL_COLORS[record.accessLevel]}`}>
                      {record.accessLevel}
                    </span>
                    {record.accessLevel !== "revoked" && record.accessLevel !== "owner" && (
                      <button
                        onClick={() => handleRevoke(record)}
                        className="text-[12px] text-[#C0392B] hover:text-[#96281B] transition-colors px-2 py-1 rounded-md hover:bg-[#FFF0F0]"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Export Requests ── */}
        {tab === "exports" && (
          <div className="max-w-3xl">
            <p className="text-[13px] text-[#6E6E73] mb-6">
              Bulk export requests require explicit approval. No one self-serves a vault export.
            </p>
            {exportList.length === 0 ? (
              <div className="text-center py-12 text-[#AEAEB2] text-[14px]">
                No export requests.
              </div>
            ) : (
              <div className="space-y-3">
                {exportList.map((req) => (
                  <div key={req.id} className="border border-[#E5E5EA] rounded-xl p-4 bg-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[13.5px] font-medium text-[#1D1D1F]">
                          Requested by {req.requestedBy}
                        </p>
                        <p className="text-[12px] text-[#8E8E93] mt-0.5">
                          {formatDate(req.requestedAt)} · Categories: {req.categories.join(", ")}
                        </p>
                        {req.reason && (
                          <p className="text-[12px] text-[#C0392B] mt-1">Denied: {req.reason}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {req.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleApproveExport(req)}
                              className="px-3 py-1.5 text-[12px] font-medium bg-[#2D7D46] text-white rounded-lg hover:bg-[#236038] transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDenyExport(req)}
                              className="px-3 py-1.5 text-[12px] font-medium bg-[#FFF0F0] text-[#C0392B] rounded-lg hover:bg-[#FFE0E0] transition-colors"
                            >
                              Deny
                            </button>
                          </>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                            req.status === "approved"
                              ? "bg-[#F0FAF0] text-[#2D7D46]"
                              : "bg-[#FFF0F0] text-[#C0392B]"
                          }`}>
                            {req.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
