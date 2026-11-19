export default function PageHeader({ eyebrow, title, description, actions, demo = true }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="orva-label mb-1.5">{eyebrow}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-heading text-[24px] font-bold leading-tight tracking-[-0.03em] text-brand-ink sm:text-[27px]">
            {title}
          </h1>
          {demo && (
            <span className="rounded-full border border-brand-warn/25 bg-brand-warn/10 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-brand-warn">
              Synthetic data
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1.5 max-w-[70ch] text-[13px] leading-relaxed text-brand-subtle">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}