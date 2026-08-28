export type ConnectorCategory =
  | "presentations"
  | "creative"
  | "documents"
  | "meetings"
  | "storage";

export type ConnectorCapability =
  | "open"
  | "import"
  | "export"
  | "present"
  | "edit"
  | "create"
  | "share"
  | "sync"
  | "legacy-import";

export type ConnectorStatus = "available" | "requires-auth" | "legacy" | "planned";

export interface MayaConnectorDefinition {
  id: string;
  provider: string;
  label: string;
  category: ConnectorCategory;
  capabilities: ConnectorCapability[];
  status: ConnectorStatus;
  authProvider?: string;
  notes?: string;
}
