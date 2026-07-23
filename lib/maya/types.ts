export type ExecRole = "ceo" | "coo" | "cmo" | "cfo" | "cto" | "cio" | "cro" | "cd" | "admin" | "hr" | "legal";

export interface RoleOverride {
  key: string;
  value: string;
}

export interface RoleLens {
  role: ExecRole;
  overrides: RoleOverride[];
}

export interface MayaMessage {
  role: "user" | "assistant";
  content: string;
}
