"use client";

import { useEffect, useState } from "react";
import ProviderControls from "@/components/ProviderControls";
import { loadProviderSettings, saveProviderSettings } from "@/lib/maya/providerStorage";
import type { ProviderSettings } from "@/lib/maya/types";

type ConnectorCard = {
  name: string;
  purpose: string;
  tokenRule: string;
  setup: string;
};

const CONNECTORS: ConnectorCard[] = [
  {
    name: "Claude Code Work AI",
    purpose: "Internal build/reasoning lane",
    tokenRule: "No runtime token needed when operating internally.",
    setup: "Uses internal workspace authority and standard repo permissions.",
  },
  {
    name: "ChatGPT Work",
    purpose: "Optional model-provider lane",
    tokenRule: "Requires OPENAI_API_KEY when selected as provider.",
    setup: "Set OPENAI_API_KEY and optional OPENAI_MODEL in server environment.",
  },
  {
    name: "Adobe Cloud Suite",
    purpose: "Creative production and typography workflows",
    tokenRule: "No MAYA user token; Adobe sign-in happens in Adobe surfaces.",
    setup: "Optional NEXT_PUBLIC_ADOBE_FONTS_PROJECT_ID enables licensed font previews.",
  },
  {
    name: "Notion",
    purpose: "Client vault document/workspace linking",
    tokenRule: "Requires Notion OAuth token only when connector is activated.",
    setup: "Keep OAuth/token server-side; never expose plaintext vault data.",
  },
  {
    name: "WordPress",
    purpose: "Publishing lane for approved content",
    tokenRule: "Requires WordPress API credentials only when publishing is enabled.",
    setup: "Keep write credentials server-side and approval-gated.",
  },
  {
    name: "PowerPoint",
    purpose: "Presentation drafting/export lane",
    tokenRule: "No token for local file export; provider token only for cloud APIs.",
    setup: "Use local export path by default; connect cloud APIs only if approved.",
  },
  {
    name: "QuarkXPress Page Layout",
    purpose: "Advanced print/page-layout production",
    tokenRule: "No MAYA token for local desktop workflow.",
    setup: "Treat as external creative tool lane; keep MAYA data boundaries intact.",
  },
];

export default function SettingsPage() {
  const [providerSettings, setProviderSettings] = useState<ProviderSettings>({
    provider: "anthropic",
    anthropicModel: "",
    openClawModel: "",
    openAiModel: "",
    ludicrousMode: false,
  });

  useEffect(() => {
    setProviderSettings(loadProviderSettings());
  }, []);

  function updateProviderSettings(next: ProviderSettings) {
    setProviderSettings(next);
    saveProviderSettings(next);
  }

  const adobeFontsConnected = Boolean(process.env.NEXT_PUBLIC_ADOBE_FONTS_PROJECT_ID);

  return (
    <div className="max-w-6xl p-8 text-[#1f2937]">
      <h1
        className="text-3xl font-black text-[#16223b] font-serif"
        style={{ textShadow: "0 1px 0 #ffffff, 0 2px 0 rgba(15, 23, 42, 0.14)" }}
      >
        <span className="mr-1 align-top text-4xl leading-none">S</span>ettings
      </h1>
      <p className="mt-2 text-[#475569]">Choose MAYA&apos;s model provider, then connect approved work lanes.</p>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
        <ProviderControls settings={providerSettings} onChange={updateProviderSettings} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CONNECTORS.map((connector) => (
          <div key={connector.name} className="rounded-xl border border-black/10 bg-[#f8fafc] p-4">
            <p className="text-sm font-bold text-[#0f172a]">{connector.name}</p>
            <p className="mt-1 text-xs text-[#334155]">{connector.purpose}</p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#64748b]">Token rule</p>
            <p className="mt-1 text-xs text-[#334155]">{connector.tokenRule}</p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#64748b]">Setup</p>
            <p className="mt-1 text-xs text-[#334155]">{connector.setup}</p>
            {connector.name === "Adobe Cloud Suite" && (
              <p className="mt-3 text-xs text-[#1d4ed8]">
                Adobe fonts project: {adobeFontsConnected ? "Connected" : "Not configured"}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] p-4 text-[13px] text-[#1e3a8a] leading-relaxed">
        <p className="font-semibold">Internal mode</p>
        <p className="mt-1">
          Internal build/chat operations do not require MCP wiring in-product. External connector credentials stay server-only and activate only when their connector lane is intentionally enabled.
        </p>
      </div>
    </div>
  );
}
