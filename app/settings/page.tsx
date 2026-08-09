"use client";

import { useEffect, useState } from "react";
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
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#89b4fa]">Settings</h1>
      <p className="mt-2 text-[#cdd6f4]">
        Choose whether Maya uses Claude directly or your OpenClaw gateway.
      </p>

      <div className="mt-6">
        <ProviderControls
          settings={providerSettings}
          onChange={updateProviderSettings}
        />
      </div>

      <div className="mt-4 rounded-xl border border-[#313244] bg-[#1e1e2e] p-4 text-[13px] text-[#a6adc8] leading-relaxed">
        <p>
          Claude is the simplest managed path. OpenClaw is best when you want
          custom routes, tools, memory, or a self-hosted operator layer.
        </p>
        <p className="mt-3">
          Oracle Mode is Maya&apos;s deep mode for OpenClaw: higher-output,
          more aggressive executive synthesis when you want maximum leverage.
        </p>
      </div>
    </div>
  );
}
