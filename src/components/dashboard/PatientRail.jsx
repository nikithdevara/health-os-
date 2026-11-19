import { Link } from "@tanstack/react-router";
import { Activity, Wind, Droplets, Maximize2, Plus, Watch, Cigarette, Wine } from "lucide-react";
import VitalTile from "./VitalTile";
import { member, careTeam } from "@/lib/data/orva";
import { vitalTiles } from "@/lib/data/clinical";

const ICONS = { hr: Watch, bp: Activity, temp: Droplets, spo2: Droplets, rr: Wind };

export default function PatientRail() {
  return (
    <div className="flex flex-col gap-3">
      <section className="orva-card p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {careTeam.slice(0, 4).map((c) => (
              <span
                key={c.id}
                className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-secondary text-[9.5px] font-bold text-secondary-foreground"
                title={c.name}
              >
                {c.initials}
              </span>
            ))}
          </div>
          <Link
            to="/member/consent"
            aria-label="Manage care team access"
            className="grid h-7 w-7 place-items-center rounded-full border border-border text-brand-ink transition-colors hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-3 flex items-start gap-2.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-lime font-heading text-[13px] font-extrabold text-brand-carbon">
            {member.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-heading text-[14px] font-extrabold leading-tight tracking-[-0.02em] text-brand-ink">
              {member.name}
            </p>
            <p className="mt-0.5 text-[10.5px] text-brand-subtle">
              {member.sex}, {member.age} · {member.bloodType} · {member.height.replace(" cm", "")} /{" "}
              {member.weight.replace(" kg", "")}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-lime/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-brand-carbon">
              Demo record
            </p>
          </div>
        </div>
      </section>

      <section className="orva-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="orva-label">Vitals</p>
          <Link to="/member/vitals" aria-label="Open vitals" className="text-brand-subtle hover:text-brand-ink">
            <Maximize2 className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-1.5">
          {vitalTiles.map((t) => (
            <VitalTile key={t.key} tile={t} icon={ICONS[t.key]} />
          ))}
        </div>
      </section>

      <section className="orva-card space-y-2.5 p-3">
        <div>
          <p className="orva-label">Allergies</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {member.allergies.map((a) => (
              <span
                key={a.substance}
                className="rounded-full border border-brand-crit/25 bg-brand-crit/10 px-2 py-0.5 text-[10px] font-semibold text-brand-crit"
              >
                {a.substance}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-border pt-2.5">
          <p className="orva-label">Implants</p>
          <p className="mt-1 text-[11px] text-brand-ink">None recorded</p>
        </div>
        <div className="border-t border-border pt-2.5">
          <p className="orva-label">Social</p>
          <div className="mt-1.5 flex items-center gap-3 text-[10.5px] text-brand-ink">
            <span className="flex items-center gap-1">
              <Cigarette className="h-3 w-3 text-brand-subtle" /> Non-smoker
            </span>
            <span className="flex items-center gap-1">
              <Wine className="h-3 w-3 text-brand-subtle" /> Occasional
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}