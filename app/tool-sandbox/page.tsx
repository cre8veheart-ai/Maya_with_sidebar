import PageShell from "@/components/PageShell";
import { executiveRegistry } from "@/lib/maya/executives/registry";
import { validateExecutiveModule } from "@/lib/maya/executives/moduleContract";

const SANDBOX_STEPS = [
  "Pick one executive module and one bounded behavior to test.",
  "Run deliberate pressure cases against evidence, role fidelity, permissions, memory boundaries, and provider failure.",
  "Patch on the same temporary workbench branch, retest, and promote only after observed behavior matches the contract.",
];

const lifecycleLabel: Record<string, string> = {
  draft: "Draft",
  sandbox: "Sandbox",
  preview: "Preview",
  approved: "Approved",
  embedded: "Embedded",
  retired: "Retired",
};

export default function ToolSandboxPage() {
  return (
    <PageShell
      title="Executive + Tool Sandbox"
      subtitle="Pressure-test plug-and-play executives and tools in a contained MAYA workspace before they are trusted in live operating flows."
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-[1.4fr,0.9fr]">
          <section className="rounded-2xl border border-[#313244] bg-[#1e1e2e] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
              Workbench loop
            </p>
            <div className="mt-4 space-y-3">
              {SANDBOX_STEPS.map((step, index) => (
                <div
                  key={step}
                  className="rounded-xl border border-[#313244] bg-[#181825] px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#89b4fa] text-[11px] font-semibold text-[#1e1e2e]">
                      {index + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-[#cdd6f4]">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-[#313244] bg-[#1e1e2e] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
              MAYA invariants
            </p>
            <ul className="mt-4 space-y-3 text-[13px] leading-relaxed text-[#a6adc8]">
              <li>• Sandbox failures do not mutate production state.</li>
              <li>• Executives cannot self-expand permissions or self-certify health.</li>
              <li>• External writes remain behind explicit human approval.</li>
              <li>• Evidence, inference, recommendation, and unknowns stay distinguishable.</li>
              <li>• A remote executive must be disconnectable without corrupting MAYA core state.</li>
            </ul>
          </aside>
        </div>

        <section className="rounded-2xl border border-[#313244] bg-[#1e1e2e] p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
                Executive module registry
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[#cdd6f4]">
                Plug-and-play modules currently on the workbench
              </h2>
            </div>
            <p className="text-xs text-[#6c7086]">Registry is descriptive, not permission-granting.</p>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {executiveRegistry.map((module) => {
              const problems = validateExecutiveModule(module);
              return (
                <article
                  key={module.id}
                  className="rounded-2xl border border-[#313244] bg-[#181825] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{module.displayName}</h3>
                      <p className="mt-1 text-xs text-[#6c7086]">{module.id} · {module.version}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-wide">
                      <span className="rounded-md border border-[#89b4fa]/30 bg-[#89b4fa]/10 px-2 py-1 text-[#89b4fa]">
                        {lifecycleLabel[module.lifecycle] ?? module.lifecycle}
                      </span>
                      <span className="rounded-md border border-[#45475a] px-2 py-1 text-[#a6adc8]">
                        {module.hosting}
                      </span>
                    </div>
                  </div>

                  <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                    <div className="rounded-lg bg-[#11111b] p-3">
                      <dt className="text-[#6c7086]">Tool access</dt>
                      <dd className="mt-1 text-[#cdd6f4]">{module.toolAccess}</dd>
                    </div>
                    <div className="rounded-lg bg-[#11111b] p-3">
                      <dt className="text-[#6c7086]">Memory namespace</dt>
                      <dd className="mt-1 text-[#cdd6f4]">{module.memoryNamespace}</dd>
                    </div>
                    <div className="rounded-lg bg-[#11111b] p-3 sm:col-span-2">
                      <dt className="text-[#6c7086]">Manifest validation</dt>
                      <dd className={problems.length ? "mt-1 text-[#f38ba8]" : "mt-1 text-[#a6e3a1]"}>
                        {problems.length ? problems.join(" · ") : "PASS · structural contract valid"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
                      Stress cases
                    </p>
                    <div className="mt-2 space-y-2">
                      {module.stressTests.map((test) => (
                        <details key={test.id} className="rounded-xl border border-[#313244] bg-[#11111b] px-4 py-3">
                          <summary className="cursor-pointer text-sm font-medium text-[#cdd6f4]">
                            {test.name}
                          </summary>
                          <p className="mt-2 text-xs leading-relaxed text-[#a6adc8]">{test.purpose}</p>
                          <div className="mt-3 grid gap-3 text-xs md:grid-cols-2">
                            <div>
                              <p className="font-semibold text-[#a6e3a1]">Expected</p>
                              <ul className="mt-1 space-y-1 text-[#a6adc8]">
                                {test.expectedBehaviors.map((behavior) => <li key={behavior}>• {behavior}</li>)}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-[#f38ba8]">Prohibited</p>
                              <ul className="mt-1 space-y-1 text-[#a6adc8]">
                                {test.prohibitedBehaviors.map((behavior) => <li key={behavior}>• {behavior}</li>)}
                              </ul>
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
