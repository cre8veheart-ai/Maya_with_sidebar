export type VendorStatus = "active" | "prospect" | "on-hold" | "inactive";

export interface Vendor {
  id: string;
  name: string;
  company: string;
  category: string;       // e.g. "Production", "Legal", "Media"
  type: string;           // e.g. "Freelancer", "Agency", "SaaS", "Supplier"
  contact: string;        // email or phone
  website?: string;
  notes: string;
  status: VendorStatus;
  tags: string[];
  rate?: string;          // e.g. "$150/hr", "Project-based"
  createdAt: string;
  updatedAt: string;
}

export interface VendorList {
  id: string;
  name: string;
  description: string;
  category: string;
  vendors: Vendor[];
  activated: boolean;     // when true, injected as context in exec lenses
  createdAt: string;
  updatedAt: string;
}
