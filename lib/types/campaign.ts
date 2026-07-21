// ── Campaign types ─────────────────────────────────────────────────────────────
// Campaign is a collaborative object — each exec function contributes their
// piece at the appropriate phase. CD owns the production track; CFO, CRO, CMO,
// COO each have defined inputs. Not a handoff chain — parallel contributions
// to a shared campaign object.

export type CampaignStatus = "brief" | "pre-production" | "production" | "post-production" | "delivery" | "complete" | "archived";

export type CampaignPhaseStatus = "pending" | "in-progress" | "review" | "approved";

export type ExecFunction = "CEO" | "CFO" | "COO" | "CRO" | "CMO" | "CD";

export interface CampaignContribution {
  id: string;
  role: ExecFunction;
  content: string; // what this function is contributing
  phase: string;   // which phase this input applies to
  author?: string;
  updatedAt: string;
}

export interface CampaignPhase {
  id: string;
  name: string;
  status: CampaignPhaseStatus;
  owner?: ExecFunction;
  dueDate?: string;
  notes?: string;
  contributions: CampaignContribution[];
}

export const CAMPAIGN_PHASES: Omit<CampaignPhase, "id" | "contributions">[] = [
  { name: "Strategy & Brief",    status: "pending", owner: "CEO" },
  { name: "Budget & Plan",       status: "pending", owner: "CFO" },
  { name: "Revenue Alignment",   status: "pending", owner: "CRO" },
  { name: "Go-To-Market",        status: "pending", owner: "CMO" },
  { name: "Ops & Vendor",        status: "pending", owner: "COO" },
  { name: "Creative Production", status: "pending", owner: "CD" },
  { name: "Delivery & Review",   status: "pending" },
];

export interface Campaign {
  id: string;
  title: string;
  client?: string;
  objective?: string;
  brief?: string;          // Maya-generated or manually written brief
  briefGeneratedAt?: string;
  status: CampaignStatus;
  phases: CampaignPhase[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
