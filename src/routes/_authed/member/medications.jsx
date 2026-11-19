import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/member/medications")({
  head: () => ({ meta: [{ title: "HealthOS — Medications" }] }),
  component: MedicationsPage,
});
import { Check, Clock, PackageCheck, Pill, RefreshCw, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { medications } from "@/lib/data/orva";

export default function MedicationsPage() {
  const [taken, setTaken] = useState(() => new Set(["med-1", "med-3"]));
  const [refillRequested, setRefillRequested] = useState(() => new Set());

  const active = medications.length;
  const adherence = Math.round(medications.reduce((a, m) => a + m.adherence, 0) / medications.length);

  return (
    <div>
      <PageHeader
        eyebrow="Member workspace"
        title="Medications"
        description="Active medicines, daily reminders and refill status. Every change here is recorded in your access history."
        actions={
          <Button
            size="sm"
            variant="outline"
            className="h-9 gap-1.5 text-[12.5px]"
            onClick={() =>
              toast.success("Refill requested", {
                description: "Your prescriber will review the request. You will be notified when it is sent to the pharmacy.",
              })
            }
          >
            <RefreshCw className="h-3.5 w-3.5" /> Request refill
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Active medications", value: active, hint: "All reviewed in the last 6 months" },
          { label: "Adherence (90 days)", value: `${adherence}%`, hint: "Doses recorded on time" },
          { label: "Refills remaining", value: medications.reduce((a, m) => a + m.refills, 0), hint: "Across active prescriptions" },
        ].map((s) => (
          <div key={s.label} className="orva-card p-4">
            <p className="orva-label">{s.label}</p>
            <p className="mt-2.5 font-heading text-[26px] font-bold leading-none tracking-[-0.03em] tnum text-brand-ink">
              {s.value}
            </p>
            <p className="mt-2 text-[11px] text-brand-subtle">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          {medications.map((m) => {
            const isTaken = taken.has(m.id);
            return (
              <article key={m.id} className="orva-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-mint text-primary">
                      <Pill className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-brand-ink">
                        {m.name} <span className="font-semibold text-brand-subtle">{m.dose}</span>
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-brand-subtle">
                        {m.schedule} · for {m.purpose.toLowerCase()}
                      </p>
                      <p className="mt-1 text-[11px] text-brand-subtle">
                        Prescribed by {m.prescriber} · {m.refills} refills remaining
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant={isTaken ? "secondary" : "default"}
                      className={`h-8 gap-1 text-[11.5px] ${isTaken ? "bg-brand-mint text-brand-forest hover:bg-brand-mint" : ""}`}
                      onClick={() => {
                        setTaken((prev) => {
                          const next = new Set(prev);
                          if (next.has(m.id)) next.delete(m.id);
                          else next.add(m.id);
                          return next;
                        });
                        toast.success(isTaken ? "Dose unmarked" : "Dose recorded", {
                          description: `${m.name} ${m.dose} · ${isTaken ? "removed from today" : "logged just now"}`,
                        });
                      }}
                    >
                      <Check className="h-3.5 w-3.5" /> {isTaken ? "Taken today" : "Mark as taken"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 text-[11.5px]"
                      onClick={() => {
                        setRefillRequested((prev) => new Set(prev).add(m.id));
                        toast.success("Refill requested", { description: `${m.name} ${m.dose} sent to ${m.prescriber} for review.` });
                      }}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      {refillRequested.has(m.id) ? "Requested" : "Refill"}
                    </Button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <div className="flex items-center justify-between text-[10.5px] text-brand-subtle">
                      <span>90-day adherence</span>
                      <span className="tnum font-semibold">{m.adherence}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${m.adherence}%` }} />
                    </div>
                  </div>
                  <p className="flex items-center gap-1.5 text-[10.5px] text-brand-subtle">
                    <Clock className="h-3 w-3" /> Last taken {m.lastTaken.toLowerCase()}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="orva-card p-4">
            <p className="orva-label mb-2 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-brand-warn" /> Interaction check
            </p>
            <p className="text-[12px] leading-relaxed text-brand-ink">
              No known interactions between your current medicines. The pharmacy re-checks every dispense against
              your active list.
            </p>
            <p className="mt-2 text-[10.5px] leading-relaxed text-brand-subtle">
              Demonstration output — not clinical advice.
            </p>
          </div>
          <div className="orva-card p-4">
            <p className="orva-label mb-2 flex items-center gap-1.5">
              <PackageCheck className="h-3.5 w-3.5 text-primary" /> Pharmacy
            </p>
            <p className="text-[12px] text-brand-ink">CarePoint Pharmacy</p>
            <p className="mt-0.5 text-[11px] text-brand-subtle">Connected · can see prescriptions only</p>
            <p className="mt-2 text-[12px] text-brand-ink">Amlodipine 5 mg</p>
            <p className="text-[11px] text-brand-subtle">30-day supply dispensed yesterday · ready for collection</p>
          </div>
        </div>
      </div>
    </div>
  );
}