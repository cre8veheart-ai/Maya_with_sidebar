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
      <div className="rounded-[1.4rem] border border-black/10 bg-gradient-to-b from-white to-[#f8fafc] shadow-[0_20px_52px_rgba(15,23,42,0.1)] overflow-hidden min-h-[72vh]">
        <RoleChat role={role} />
      </div>
    </PageShell>
  );
}
