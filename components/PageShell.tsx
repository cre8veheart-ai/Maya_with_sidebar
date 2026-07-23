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
    <div className="min-h-full px-8 py-10 max-w-5xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1D1D1F] tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[14px] text-[#6E6E73]">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
