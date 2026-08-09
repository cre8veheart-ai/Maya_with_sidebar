export type ExecRole = "ceo" | "coo" | "cmo" | "cfo" | "cto" | "cio" | "cro" | "cd" | "admin" | "hr" | "legal";
export type MayaProvider = "anthropic" | "openclaw";

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

export interface ProviderSettings {
  provider: MayaProvider;
  anthropicModel: string;
  openClawModel: string;
  ludicrousMode: boolean;
}
