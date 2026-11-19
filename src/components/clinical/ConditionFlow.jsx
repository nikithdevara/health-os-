import { ChevronRight, FileText } from "lucide-react";
import { Image } from "@/components/ui/image";
import { MRI_IMAGE } from "@/lib/data/clinical";

function Bars({ series }) {
  const max = Math.max(...series);
  return (
    <div className="mt-2 flex h-8 items-end gap-[3px]">
      {series.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-sm bg-brand-lime/80"
          style={{ height: `${Math.max(14, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

function FlowCard({ card }) {
  if (card.type === "visit") {
    return (
      <article className="w-[146px] shrink-0 rounded-2xl bg-brand-carbon p-2.5 text-white">
        <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-white/45">Office visit</p>
        <p className="mt-0.5 text-[10.5px] font-semibold">{card.title}</p>
        <p className="tnum mt-0.5 text-[16px] font-extrabold leading-none">
          {card.value} <span className="text-[8.5px] font-medium text-white/50">{card.unit}</span>
        </p>
        <Bars series={card.series || [4, 7, 5, 9, 6, 8]} />
        <p className="mt-2 text-[8px] text-white/40">{card.period}</p>
      </article>
    );
  }

  if (card.type === "imaging") {
    return (
      <article className="w-[146px] shrink-0 rounded-2xl border border-brand-ink/8 bg-card p-2.5">
        <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-brand-subtle">Office visit</p>
        <p className="mt-0.5 text-[10.5px] font-semibold text-brand-ink">{card.title}</p>
        <div className="mt-1.5 grid grid-cols-2 gap-1">
          {[0.32, 0.48, 0.66, 0.85].map((focus) => (
            <Image
              key={focus}
              src={MRI_IMAGE}
              alt="Simulated imaging slice"
              focalPointY={focus}
              className="h-8 w-full rounded bg-brand-carbon/90"
            />
          ))}
        </div>
        <p className="mt-1.5 text-[8px] text-brand-subtle">{card.period}</p>
      </article>
    );
  }

  if (card.type === "lab") {
    return (
      <article className="w-[146px] shrink-0 rounded-2xl border border-brand-ink/8 bg-card p-2.5">
        <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-brand-subtle">Office visit</p>
        <p className="mt-0.5 text-[10.5px] font-semibold text-brand-ink">{card.title}</p>
        <dl className="mt-1.5 space-y-1">
          {card.rows.map((r) => (
            <div key={r.name} className="flex items-center justify-between gap-1">
              <dt className="text-[8.5px] text-brand-subtle">{r.name}</dt>
              <dd className="tnum text-[9px] font-semibold text-brand-ink">{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[8px] text-brand-subtle">{card.period}</p>
      </article>
    );
  }

  return (
    <article className="w-[146px] shrink-0 rounded-2xl border border-brand-ink/8 bg-card p-2.5">
      <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-brand-subtle">
        <FileText className="h-2.5 w-2.5" /> Office visit
      </p>
      <p className="mt-0.5 text-[10.5px] font-semibold text-brand-ink">{card.title}</p>
      <p className="mt-1.5 line-clamp-4 text-[8.5px] leading-relaxed text-brand-subtle">{card.text}</p>
    </article>
  );
}

export default function ConditionFlow({ conditions, activeId, onSelect, query }) {
  const visible = conditions.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const active = visible.find((c) => c.id === activeId) || visible[0] || conditions[0];

  return (
    <div className="flex min-w-0 gap-2">
      <div className="orva-scroll max-h-[292px] w-[142px] shrink-0 space-y-1.5 overflow-y-auto pr-1">
        {visible.length === 0 && (
          <p className="rounded-xl bg-card px-2 py-3 text-[9.5px] leading-relaxed text-brand-subtle">
            No condition matches that search.
          </p>
        )}
        {visible.map((c) => {
          const isActive = active.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              aria-pressed={isActive}
              className={`flex w-full items-center justify-between gap-1 rounded-xl px-2 py-1.5 text-left text-[9.5px] font-semibold leading-tight transition-colors ${
                isActive
                  ? "bg-brand-lime text-brand-carbon"
                  : "bg-card text-brand-ink/70 hover:bg-card hover:text-brand-ink"
              }`}
            >
              <span className="line-clamp-2">{c.name}</span>
              {isActive && <ChevronRight className="h-3 w-3 shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="relative flex min-w-0 flex-1 items-start">
        <svg viewBox="0 0 22 100" preserveAspectRatio="none" className="mt-6 h-16 w-4 shrink-0" aria-hidden="true">
          <path
            d="M0 6 C 16 6, 8 50, 22 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
            className="text-brand-ink/25"
          />
        </svg>

        <div className="orva-scroll flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          {(active?.artifacts || []).map((card) => (
            <FlowCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}