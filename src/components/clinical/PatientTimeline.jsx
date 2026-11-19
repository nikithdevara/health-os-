import { Minus, Plus } from "lucide-react";
import { flowYears } from "@/lib/data/flow";

export default function PatientTimeline({ fromYear, onFromYear, span, onSpan }) {
  const years = flowYears.slice(Math.max(0, flowYears.length - span));
  const visible = years.map((y) => y.year);
  const firstIndex = Math.max(0, visible.indexOf(fromYear));
  const bandLeft = (firstIndex / visible.length) * 100;
  const bandWidth = 100 - bandLeft;

  return (
    <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-card/60 px-3 py-2">
      <div className="relative flex-1">
        <div className="relative flex items-start justify-between">
          <span
            className="absolute -top-1 h-[26px] rounded-lg bg-brand-lime/60"
            style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
            aria-hidden="true"
          />
          {years.map((y) => {
            const inWindow = y.year >= fromYear;
            return (
              <button
                key={y.year}
                type="button"
                onClick={() => onFromYear(y.year)}
                aria-label={`Focus ${y.year}`}
                className="relative z-[1] flex flex-col items-center gap-1"
              >
                <span className="flex h-3 items-end gap-[2px]">
                  {Array.from({ length: Math.min(4, Math.max(1, Math.round(y.count / 2))) }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-[2.5px] rounded-full ${inWindow ? "bg-brand-carbon/70" : "bg-brand-ink/20"}`}
                      style={{ height: `${4 + i * 3}px` }}
                    />
                  ))}
                </span>
                <span className={`tnum text-[8px] font-semibold ${inWindow ? "text-brand-ink" : "text-brand-subtle"}`}>
                  {y.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label="Zoom out timeline"
          onClick={() => onSpan(Math.min(flowYears.length, span + 1))}
          className="grid h-5 w-5 place-items-center rounded-full bg-brand-canvas text-brand-ink hover:bg-muted"
        >
          <Minus className="h-2.5 w-2.5" />
        </button>
        <button
          type="button"
          aria-label="Zoom in timeline"
          onClick={() => onSpan(Math.max(3, span - 1))}
          className="grid h-5 w-5 place-items-center rounded-full bg-brand-canvas text-brand-ink hover:bg-muted"
        >
          <Plus className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}