export default function StatCard({ label, value, unit, hint, icon: Icon, tone = "default", footer }) {
  const toneClass =
    tone === "warn" ? "text-brand-warn" : tone === "crit" ? "text-brand-crit" : "text-brand-ink";
  return (
    <div className="orva-card flex flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="orva-label">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-brand-subtle" strokeWidth={1.7} />}
      </div>
      <p className={`mt-3 font-heading text-[26px] font-bold leading-none tracking-[-0.03em] tnum ${toneClass}`}>
        {value}
        {unit && <span className="ml-1 text-[12px] font-medium tracking-normal text-brand-subtle">{unit}</span>}
      </p>
      {hint && <p className="mt-2 text-[11.5px] leading-snug text-brand-subtle">{hint}</p>}
      {footer}
    </div>
  );
}