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
  const first = title.slice(0, 1);
  const rest = title.slice(1);
  return (
    <div className="min-h-full w-full min-w-0 max-w-5xl overflow-x-hidden px-1 py-3 pb-[max(6rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-6 sm:pb-6 lg:px-8 lg:py-10 lg:pb-10">
      <div className="flex min-w-0 items-start justify-between gap-3 mb-4 sm:mb-8">
        <div className="min-w-0">
          <h1
            className="text-[28px] font-black text-[#16223b] tracking-tight leading-tight"
            style={{ textShadow: "0 1px 0 #ffffff, 0 2px 0 rgba(15, 23, 42, 0.14)" }}
          >
            <span className="font-serif float-left mr-1.5 mt-0.5 text-[42px] leading-[0.85]">{first}</span>
            <span className="font-serif">{rest}</span>
          </h1>
          {subtitle && (
            <p className="mt-1 max-w-full break-words text-[14px] text-[#475569]">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}
