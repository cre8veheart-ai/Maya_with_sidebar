import PageShell from "@/components/PageShell";
import CeoIntelConsole from "@/components/CeoIntelConsole";

export default function CeoPage() {
  return (
    <PageShell
      title="CEO"
      subtitle="CEO-only landing page with one chat surface, autonomous exec tiles, multi-lens deep think, and full session review."
    >
      <CeoIntelConsole />
    </PageShell>
  );
}
