export type ExecRole = "ceo" | "coo" | "cmo" | "cfo" | "cto";

export interface RoleOverride {
  key: string;
  value: string;
}

export interface RoleLens {
  role: ExecRole;
  overrides: RoleOverride[];
}

export interface AriMessage {
  role: "user" | "assistant";
  content: string;
}
