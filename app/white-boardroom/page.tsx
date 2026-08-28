import { whiteBoardroomConnectors } from "@/lib/connectors/registry";

const colorFeatures = [
  "Pantone / PMS spot colors",
  "CMYK process color",
  "RGB screen color",
  "ICC profile awareness",
  "Spot-channel preservation",
  "Print preflight",
];

export default function WhiteBoardroomPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10">
        <header className="border-b border-neutral-300/70 pb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-700">The</p>
          <h1 className="mt-1 text-3xl font-light tracking-[0.2em] text-neutral-700 md:text-5xl">
            Situation Room
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.35em] text-amber-700">Experience</p>
        </header>

        <section className="grid flex-1 gap-8 py-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-neutral-300/70 bg-white/60 p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">Working Tools</h2>
                <p className="text-sm text-neutral-500">Real connector surfaces; authentication activates provider access.</p>
              </div>
              <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-500">Private workspace</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {whiteBoardroomConnectors.map((connector) => (
                <article key={connector.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{connector.label}</h3>
                      <p className="mt-1 text-xs text-neutral-500">{connector.provider}</p>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] uppercase tracking-wide text-neutral-600">
                      {connector.status}
                    </span>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-neutral-600">
                    {connector.capabilities.join(" · ")}
                  </p>
                  {connector.notes ? <p className="mt-3 text-xs text-neutral-500">{connector.notes}</p> : null}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-neutral-300/70 bg-white/60 p-6 shadow-sm">
            <h2 className="text-lg font-medium">Production Color</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Client and project color specifications stay with the working project context, not the general Library.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {colorFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-amber-700" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-500">
              Adobe and Microsoft credentials are not required until a user chooses Connect. Tokens remain server-side and provider permissions are requested only when needed.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
