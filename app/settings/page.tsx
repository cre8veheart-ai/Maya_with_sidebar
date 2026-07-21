import PageShell from "@/components/PageShell";

export default function SettingsPage() {
  return (
    <PageShell title="Settings" subtitle="Configure your MAYA workspace">
      <div className="max-w-xl space-y-4">
        {[
          { label: "Account", desc: "Manage your profile and preferences" },
          { label: "Appearance", desc: "Theme, layout, and display options" },
          { label: "Notifications", desc: "Alerts and communication settings" },
          { label: "Integrations", desc: "Connect tools and external services" },
          { label: "Security", desc: "Access control and authentication" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between bg-[#F9F9FB] border border-[#E5E5EA] rounded-xl px-5 py-4 cursor-pointer hover:bg-[#F0F0F2] transition-colors"
          >
            <div>
              <div className="text-[14px] font-medium text-[#1D1D1F]">
                {item.label}
              </div>
              <div className="text-[12px] text-[#8E8E93] mt-0.5">{item.desc}</div>
            </div>
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              stroke="#AEAEB2"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 1l5 5-5 5" />
            </svg>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

