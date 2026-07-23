export type ExecRole = "ceo" | "coo" | "cmo" | "cfo" | "cto" | "cio" | "cro" | "cd";

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
