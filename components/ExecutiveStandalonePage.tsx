import PageShell from "@/components/PageShell";
import RoleChat from "@/components/RoleChat";
import type { ExecRole } from "@/lib/maya/types";

interface ExecutiveStandalonePageProps {
  role: ExecRole;
  title: string;
  subtitle: string;
}

export default function ExecutiveStandalonePage({
  role,
  title,
  subtitle,
}: ExecutiveStandalonePageProps) {
  return (
    <PageShell title={title} subtitle={subtitle}>
      <div className="rounded-2xl border border-black/10 bg-white shadow-[0_14px_42px_rgba(15,23,42,0.08)] overflow-hidden min-h-[72vh]">
        <RoleChat role={role} />
      </div>
    </PageShell>
  );
}
