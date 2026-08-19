"use client";

import { useEffect, useState } from "react";
import GitHubControls from "@/components/GitHubControls";
import ProviderControls from "@/components/ProviderControls";
import {
  loadProviderSettings,
  saveProviderSettings,
} from "@/lib/maya/providerStorage";
import type { ProviderSettings } from "@/lib/maya/types";

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

  return (
    <div className="max-w-6xl p-8">
      <h1 className="text-2xl font-bold text-[#89b4fa]">Settings</h1>
      <p className="mt-2 text-[#cdd6f4]">
        Choose Maya&apos;s model provider, then connect GitHub for repo read/write
        and workflow access.
      </p>

      <div className="mt-6">
        <ProviderControls
          settings={providerSettings}
          onChange={updateProviderSettings}
        />
      </div>

      <div className="mt-4 rounded-xl border border-[#313244] bg-[#1e1e2e] p-4 text-[13px] text-[#a6adc8] leading-relaxed">
        <p>
          Claude is the simplest managed path. ChatGPT adds OpenAI models inside
          Maya. OpenClaw is best when you want custom routes, tools, memory, or
          a self-hosted operator layer.
        </p>
        <p className="mt-3">
          Oracle Mode is Maya&apos;s deep mode for OpenClaw: higher-output,
          more aggressive executive synthesis when you want maximum leverage.
        </p>
      </div>

      <div className="mt-8">
        <GitHubControls />
      </div>
    </div>
  );
}
