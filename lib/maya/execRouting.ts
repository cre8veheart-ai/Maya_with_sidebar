import type { ExecRole } from "./types";

export type RoutedRole = ExecRole | "strategy-room";

export const EXEC_ROLE_META: Record<RoutedRole, { label: string; href: string }> = {
  ceo: { label: "CEO", href: "/ceo" },
  coo: { label: "COO", href: "/coo" },
  cmo: { label: "CMO", href: "/cmo" },
  cfo: { label: "CFO", href: "/cfo" },
  cto: { label: "CTO", href: "/cto" },
  cio: { label: "CIO", href: "/cio" },
  cro: { label: "CRO", href: "/cro" },
  cd: { label: "CD", href: "/cd" },
  admin: { label: "Office Admin", href: "/office-admin" },
  hr: { label: "HR", href: "/hr" },
  legal: { label: "Legal", href: "/legal" },
  "strategy-room": { label: "Strategy Room", href: "/strategy-room" },
};

export const EXEC_ROLE_OPTIONS = Object.keys(EXEC_ROLE_META).filter(
  (role) => role !== "strategy-room"
) as ExecRole[];

export function getRoleLabel(role: RoutedRole): string {
  return EXEC_ROLE_META[role].label;
}

export function getRoleHref(role: RoutedRole): string {
  return EXEC_ROLE_META[role].href;
}
