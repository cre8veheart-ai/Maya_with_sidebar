interface PageShellProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageShell({
  title,
  subtitle,
  action,
  children,
}: PageShellProps) {
  return (
    <div className="min-h-full px-1 py-3 sm:px-4 sm:py-6 lg:px-8 lg:py-10 max-w-5xl pb-[max(6rem,env(safe-area-inset-bottom))]">
      <div className="flex items-start justify-between mb-4 sm:mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-[#cdd6f4] tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[14px] text-[#a6adc8]">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
