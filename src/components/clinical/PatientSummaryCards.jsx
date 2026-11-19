import { CalendarDays, FlaskConical, Pill, SlidersHorizontal } from "lucide-react";
import { flowTiles } from "@/lib/data/flow";

function Shell({ title, icon: Icon, children }) {
  return (
    <div className="rounded-t-[26px] rounded-b-2xl bg-card px-3 pb-2.5 pt-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.07em] text-brand-subtle">
          <Icon className="h-2.5 w-2.5" /> {title}
        </p>
        <SlidersHorizontal className="h-2.5 w-2.5 text-brand-subtle/70" />
      </div>
      {children}
    </div>
  );
}

export default function PatientSummaryCards() {
  return (
    <div className="mt-2 grid gap-2 md:grid-cols-3">
      <Shell title="Medications" icon={Pill}>
        {flowTiles.medications.map((m) => (
          <div key={m.name} className="flex items-center justify-between gap-1 py-[3px]">
            <p className="truncate text-[9.5px] font-semibold text-brand-ink">
              {m.name} <span className="font-medium text-brand-subtle">{m.dose}</span>
            </p>
            <span className="shrink-0 rounded-full bg-brand-canvas px-1.5 py-[1px] text-[7.5px] font-semibold text-brand-subtle">
              {m.timing}
            </span>
          </div>
        ))}
      </Shell>

      <Shell title="Visits" icon={CalendarDays}>
        <div className="grid grid-cols-2 gap-1">
          {flowTiles.visits.map((v) => (
            <div key={v.title} className="rounded-lg bg-brand-canvas px-1.5 py-1">
              <p className="truncate text-[8.5px] font-semibold text-brand-ink">{v.title}</p>
              <p className="tnum mt-[1px] text-[7.5px] text-brand-subtle">{v.meta}</p>
            </div>
          ))}
        </div>
      </Shell>

      <Shell title="Labs" icon={FlaskConical}>
        <p className="text-[9.5px] font-semibold text-brand-ink">Basic metabolic</p>
        <p className="tnum text-[15px] font-extrabold leading-tight text-brand-ink">
          83 <span className="text-[8.5px] font-medium text-brand-subtle">mg/dL</span>
        </p>
        <div className="mt-1 flex items-center gap-1">
          {[
            { tone: "bg-brand-forest", label: "Na" },
            { tone: "bg-brand-lime", label: "K" },
            { tone: "bg-brand-warn", label: "Cr" },
            { tone: "bg-brand-forest/40", label: "Cl" },
          ].map((d) => (
            <span key={d.label} className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${d.tone}`} />
              <span className="text-[7.5px] font-semibold text-brand-subtle">{d.label}</span>
            </span>
          ))}
        </div>
      </Shell>
    </div>
  );
}