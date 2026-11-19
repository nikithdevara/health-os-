import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { conditionTimelines, diagnosisEvents, timelineKinds, timelineYears } from "@/lib/data/clinical";

const NODE_TONE = {
  visit: "bg-brand-carbon",
  ecg: "bg-brand-carbon",
  med: "bg-brand-lime",
  lab: "bg-brand-carbon",
  note: "bg-brand-carbon/40",
};

export default function DiagnosisTimeline({ filter, onClear }) {
  const [kind, setKind] = useState("diagnosis");
  const [span, setSpan] = useState(4);

  const years = timelineYears.slice(0, span);
  const cards = diagnosisEvents.filter((e) => e.kind === kind && years.includes(e.year));
  const flow = filter ? conditionTimelines[filter] || [] : null;

  if (flow) {
    return (
      <section className="rounded-3xl border border-brand-line2 bg-card p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-lime px-2 py-1 text-[10px] font-bold text-brand-carbon">
              {filter}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-full border border-border px-1.5 py-0.5 text-[9.5px] font-semibold text-brand-subtle hover:text-brand-ink"
            >
              <X className="h-2.5 w-2.5" /> All history
            </button>
          </div>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-brand-subtle">
            Treatment timeline · synthetic
          </p>
        </div>

        <div className="orva-scroll mt-4 flex gap-3 overflow-x-auto pb-2">
          {flow.length === 0 && (
            <p className="py-4 text-[11px] text-brand-subtle">No treatment events recorded for this condition.</p>
          )}
          {flow.map((event, index) => (
            <div key={event.id} className="relative min-w-[118px] flex-1">
              <div className="flex items-center">
                <span
                  className={`h-3 w-3 shrink-0 rounded-full border-2 border-card ${NODE_TONE[event.kind] || "bg-brand-carbon"}`}
                  aria-hidden="true"
                />
                {index < flow.length - 1 && <span className="ml-1 h-px flex-1 bg-brand-ink/15" aria-hidden="true" />}
              </div>
              <p className="mt-2 text-[8.5px] font-bold uppercase tracking-[0.07em] text-brand-subtle">{event.kind}</p>
              <p className="mt-0.5 text-[10.5px] font-semibold leading-snug text-brand-ink">{event.title}</p>
              <p className="mt-0.5 text-[9px] leading-snug text-brand-subtle">{event.meta}</p>
              <p className="tnum mt-1 text-[8.5px] font-semibold text-brand-ink/70">{event.date}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-brand-line2 bg-card p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 rounded-full bg-muted/70 p-1">
          {timelineKinds.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setKind(t.key)}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-colors ${
                kind === t.key ? "bg-brand-lime text-brand-carbon" : "text-brand-subtle hover:text-brand-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-brand-subtle">
          Clinical history · synthetic
        </p>
      </div>

      <div className="orva-scroll mt-3 flex gap-2 overflow-x-auto pb-1">
        {cards.length === 0 && (
          <p className="py-4 text-[11.5px] text-brand-subtle">No {kind} events in this window. Zoom out to widen it.</p>
        )}
        {cards.map((card) => (
          <article
            key={card.id}
            className="min-w-[172px] flex-1 rounded-2xl border border-brand-line2 bg-brand-canvas/70 p-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-card px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.07em] text-brand-subtle">
                {card.kind}
              </span>
              <span className="tnum text-[10px] font-bold text-brand-ink">{card.year}</span>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[11px] font-semibold leading-snug text-brand-ink">{card.title}</p>
            <p className="mt-0.5 line-clamp-1 text-[9.5px] text-brand-subtle">{card.meta}</p>
          </article>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          aria-label="Zoom out timeline"
          onClick={() => setSpan((s) => Math.min(timelineYears.length, s + 1))}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-brand-ink hover:bg-muted"
        >
          <Minus className="h-3 w-3" />
        </button>

        <div className="relative flex-1">
          <span className="absolute left-0 right-0 top-[9px] h-px bg-brand-ink/12" aria-hidden="true" />
          <div className="relative flex items-start justify-between">
            {years.map((y) => {
              const count = diagnosisEvents.filter((e) => e.year === y).length;
              return (
                <div key={y} className="flex flex-col items-center gap-1">
                  <span
                    className={`grid place-items-center rounded-full border-2 border-card ${
                      count ? "h-2.5 w-2.5 bg-brand-carbon" : "h-2 w-2 bg-brand-ink/20"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="tnum text-[9.5px] font-semibold text-brand-subtle">{y}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          aria-label="Zoom in timeline"
          onClick={() => setSpan((s) => Math.max(2, s - 1))}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-brand-ink hover:bg-muted"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </section>
  );
}