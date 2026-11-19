function Cardiogram({ className = "" }) {
  return (
    <svg
      viewBox="0 0 130 30"
      className={`text-brand-carbon ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path d="M0 19h16l4-8 5 16 5-22 5 30 5-25 4 9h11l4-6 4 6h20l4-7 5 12 4-5h19" />
    </svg>
  );
}

export default function ConditionStack({ group, selectedId, onSelect }) {
  const selected = group.items.find((i) => i.id === selectedId) || group.items[0];

  return (
    <section className="flex flex-col rounded-3xl border border-brand-line2 bg-card p-3">
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-subtle">Conditions</p>
          <p className="mt-0.5 text-[11px] font-semibold text-brand-ink">{group.meta}</p>
        </div>
        <span className="tnum text-[10px] font-semibold text-brand-subtle">{group.items.length}</span>
      </div>

      <div className="space-y-1.5">
        {group.items.map((item, index) => {
          const active = item.id === selected.id;
          return (
            <div key={item.id} className="relative">
              {active && (
                <span
                  className="absolute -left-2.5 top-1/2 h-px w-2.5 -translate-y-1/2 bg-brand-carbon/30"
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-pressed={active}
                className={`w-full rounded-2xl px-2.5 py-2 text-left transition-all ${
                  active
                    ? "bg-brand-lime text-brand-carbon"
                    : "bg-brand-carbon text-white/90 hover:bg-brand-carbon/90"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`tnum mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full text-[8px] font-bold ${
                      active ? "bg-brand-carbon/12 text-brand-carbon" : "bg-white/10 text-white/55"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11.5px] font-semibold leading-snug">{item.name}</span>
                      <span className={`tnum shrink-0 text-[9.5px] ${active ? "text-brand-carbon/60" : "text-white/45"}`}>
                        {item.year}
                      </span>
                    </div>
                    {active && item.waveform && <Cardiogram className="mt-1.5 h-6 w-full" />}
                    {active && !item.waveform && (
                      <p className="mt-1 text-[9.5px] font-medium text-brand-carbon/60">
                        {item.events} recorded events
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 space-y-1.5 border-t border-border pt-2.5">
        {selected.detail.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-2">
            <span className="shrink-0 text-[9.5px] uppercase tracking-[0.06em] text-brand-subtle">{row.label}</span>
            <span className="text-right text-[10.5px] font-medium leading-snug text-brand-ink">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}