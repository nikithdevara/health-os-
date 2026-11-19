import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/member/vitals")({
  head: () => ({ meta: [{ title: "HealthOS — Vitals & measurements" }] }),
  component: VitalsPage,
});
import { CalendarRange, FilePlus2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import HealthTrends from "@/components/member/HealthTrends";
import LogReadingDialog from "@/components/member/LogReadingDialog";
import { vitalsSeries, todayMetrics, healthGoals } from "@/lib/data/orva";

export default function VitalsPage() {
  const [readings, setReadings] = useState(vitalsSeries);
  const [open, setOpen] = useState(false);
  const latest = readings[readings.length - 1];

  const kpis = [
    { label: "Blood pressure", value: `${latest.systolic}/${latest.diastolic}`, unit: "mmHg", note: "Within target under 130/80" },
    { label: "Resting heart rate", value: latest.restingHr, unit: "bpm", note: "6-day average 66 bpm" },
    { label: "Oxygen saturation", value: `${latest.spo2}%`, unit: "SpO₂", note: "Steady across the week" },
    { label: "Weight", value: latest.weight.toFixed(1), unit: "kg", note: "Down 0.5 kg since Monday" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Daily health monitor"
        title="Vitals & measurements"
        description="Self-reported readings and connected device values, kept together so trends are easy to read."
        actions={
          <Button size="sm" className="h-9 gap-1.5 text-[12.5px]" onClick={() => setOpen(true)}>
            <FilePlus2 className="h-3.5 w-3.5" /> Log reading
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="orva-card p-4">
            <p className="orva-label">{k.label}</p>
            <p className="mt-2.5 font-heading text-[26px] font-bold leading-none tracking-[-0.03em] tnum text-brand-ink">
              {k.value}
              <span className="ml-1 text-[11.5px] font-medium tracking-normal text-brand-subtle">{k.unit}</span>
            </p>
            <p className="mt-2 text-[11px] leading-snug text-brand-subtle">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <HealthTrends />
        </div>
        <div className="space-y-4">
          <div className="orva-card p-4">
            <p className="orva-label mb-2.5">Today at a glance</p>
            <ul className="space-y-2 text-[12px] text-brand-ink">
              <li className="flex justify-between">
                <span className="text-brand-subtle">Steps</span>
                <span className="tnum font-semibold">{todayMetrics.steps.toLocaleString()} / 10,000</span>
              </li>
              <li className="flex justify-between">
                <span className="text-brand-subtle">Hydration</span>
                <span className="tnum font-semibold">1,350 / 2,000 ml</span>
              </li>
              <li className="flex justify-between">
                <span className="text-brand-subtle">Sleep</span>
                <span className="tnum font-semibold">{todayMetrics.sleepHours} h</span>
              </li>
              <li className="flex justify-between">
                <span className="text-brand-subtle">Active minutes</span>
                <span className="tnum font-semibold">{todayMetrics.activeMinutes} / 60</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="orva-card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-heading text-[15px] font-bold text-brand-ink">Logged readings</h3>
            <span className="flex items-center gap-1.5 text-[11px] text-brand-subtle">
              <CalendarRange className="h-3.5 w-3.5" /> Last six days
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {["Day", "Blood pressure", "Resting HR", "SpO₂", "Weight"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.09em] text-brand-subtle">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...readings].reverse().map((r, i) => (
                  <tr key={`${r.day}-${i}`} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-2.5 text-[12.5px] font-semibold text-brand-ink">{r.day}</td>
                    <td className="px-4 py-2.5 text-[12.5px] tnum text-brand-ink">
                      {r.systolic}/{r.diastolic} mmHg
                    </td>
                    <td className="px-4 py-2.5 text-[12.5px] tnum text-brand-ink">{r.restingHr} bpm</td>
                    <td className="px-4 py-2.5 text-[12.5px] tnum text-brand-ink">{r.spo2}%</td>
                    <td className="px-4 py-2.5 text-[12.5px] tnum text-brand-ink">{r.weight.toFixed(1)} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="orva-card p-4">
          <p className="orva-label mb-3">Goals in progress</p>
          <ul className="space-y-3">
            {healthGoals.slice(0, 3).map((g) => (
              <li key={g.id}>
                <div className="flex justify-between text-[12px]">
                  <span className="text-brand-ink">{g.label}</span>
                  <span className="tnum text-brand-subtle">{g.progress}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${g.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-[11px] leading-relaxed text-brand-subtle">
            Readings you enter yourself are marked as self-reported. Devices connect only with your permission.
          </p>
        </div>
      </div>

      <LogReadingDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(reading) =>
          setReadings((prev) => [...prev, { day: "Today", ...reading, weight: reading.weight }])
        }
      />
    </div>
  );
}