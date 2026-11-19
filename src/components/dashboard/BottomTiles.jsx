import { Link } from "@tanstack/react-router";
import { Sun, Moon, ArrowUpRight, CalendarDays, FlaskConical, Pill } from "lucide-react";
import { medications } from "@/lib/data/orva";
import { dashboardLabs, dashboardVisits } from "@/lib/data/clinical";

function Tile({ title, icon: Icon, to, children }) {
  return (
    <section className="rounded-3xl border border-brand-line2 bg-card p-3.5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-subtle">
          <Icon className="h-3 w-3" /> {title}
        </p>
        <Link
          to={to}
          aria-label={`Open ${title}`}
          className="grid h-6 w-6 place-items-center rounded-full border border-border text-brand-subtle transition-colors hover:text-brand-ink"
        >
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-2.5 space-y-1.5">{children}</div>
    </section>
  );
}

export default function BottomTiles() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Tile title="Medications" icon={Pill} to="/member/medications">
        {medications.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-2.5 py-1.5">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-brand-ink">
                {m.name} <span className="font-medium text-brand-subtle">× 1 · {m.dose}</span>
              </p>
              <p className="text-[9.5px] text-brand-subtle">{m.schedule}</p>
            </div>
            <span className="text-brand-subtle" aria-hidden="true">
              {m.schedule.includes("evening") ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
            </span>
          </div>
        ))}
      </Tile>

      <Tile title="Visits" icon={CalendarDays} to="/member/appointments">
        {dashboardVisits.map((v) => (
          <div key={v.id} className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-2.5 py-1.5">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-brand-ink">{v.title}</p>
              <p className="truncate text-[9.5px] text-brand-subtle">{v.meta}</p>
            </div>
            <span className="tnum shrink-0 text-[9.5px] font-semibold text-brand-subtle">{v.when}</span>
          </div>
        ))}
      </Tile>

      <Tile title="Labs" icon={FlaskConical} to="/member/records">
        {dashboardLabs.map((l) => (
          <div key={l.id} className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-2.5 py-1.5">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-brand-ink">{l.title}</p>
              <p className="truncate text-[9.5px] text-brand-subtle">{l.label}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="tnum text-[11px] font-bold text-brand-ink">
                {l.value}
                <span className="ml-0.5 text-[8.5px] font-medium text-brand-subtle">{l.unit}</span>
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-lime" aria-hidden="true" />
            </div>
          </div>
        ))}
      </Tile>
    </div>
  );
}