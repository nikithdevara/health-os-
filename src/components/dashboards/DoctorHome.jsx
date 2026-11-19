import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CalendarClock, Check, Sparkles, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusPill from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { useAssistant } from "@/lib/AssistantContext";
import { doctorSchedule, doctorAlerts, connectionRequests, patients, DATE_LABEL } from "@/lib/data/orva";

export default function DoctorHome() {
  const { openAssistant } = useAssistant();
  const [requests, setRequests] = useState(connectionRequests);

  function resolve(id, decision) {
    const req = requests.find((r) => r.id === id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success(decision === "approve" ? "Connection approved" : "Request declined", {
      description:
        decision === "approve"
          ? `${req.patient} can now share the scopes they choose with you.`
          : `${req.patient} has been notified that you declined.`,
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow={DATE_LABEL}
        title={`Good morning, ${doctorSchedule.length ? "Dr. Mensah" : "Doctor"}`}
        description="Four consultations today. One result needs review and two patients are waiting on a connection decision."
        actions={
          <Button size="sm" className="h-9 gap-1.5 text-[12.5px]" onClick={() => openAssistant()}>
            <Sparkles className="h-3.5 w-3.5" /> Clinical AI review
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's appointments" value={doctorSchedule.length} hint="Next at 09:30 · Amara Okafor" icon={CalendarClock} />
        <StatCard label="Patients under care" value={patients.length + 20} hint="All with active consent" icon={Check} />
        <StatCard label="Results to review" value={3} hint="1 abnormal value flagged" icon={AlertTriangle} tone="warn" />
        <StatCard label="Connection requests" value={requests.length} hint="Awaiting your decision" icon={UserPlus} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="orva-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Today's schedule</h2>
            <Link to="/doctor/patients" className="flex items-center gap-1 text-[11.5px] font-semibold text-primary hover:underline">
              All patients <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {doctorSchedule.map((s) => {
              const patient = patients.find((p) => p.name === s.patient);
              return (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 shrink-0">
                      <p className="text-[12.5px] font-bold tnum text-brand-ink">{s.time}</p>
                      <p className="text-[9.5px] uppercase tracking-[0.08em] text-brand-subtle">today</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-brand-ink">{s.patient}</p>
                      <p className="text-[11px] text-brand-subtle">
                        {s.reason} · {s.mode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={s.status} />
                    {patient ? (
                      <Link
                        to="/doctor/patients/$patientId"
                        params={{ patientId: patient.id }}
                        className="rounded-lg border border-border px-2.5 py-1.5 text-[11.5px] font-semibold text-brand-ink hover:bg-muted"
                      >
                        Open chart
                      </Link>
                    ) : (
                      <span className="rounded-lg border border-dashed border-border px-2.5 py-1.5 text-[11.5px] text-brand-subtle">
                        Awaiting consent
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Alerts requiring review</h2>
            <ul className="mt-3 space-y-2.5">
              {doctorAlerts.map((a) => (
                <li key={a.id} className="rounded-lg border border-border p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-semibold text-brand-ink">{a.patient}</p>
                    <StatusPill status={a.severity === "critical" ? "High" : a.severity === "warning" ? "Moderate" : "Pending"} />
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-brand-subtle">{a.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Connection requests</h2>
            {requests.length === 0 ? (
              <p className="mt-3 text-[11.5px] text-brand-subtle">No open requests. New referrals appear here.</p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {requests.map((r) => (
                  <li key={r.id} className="rounded-lg border border-border p-2.5">
                    <p className="text-[12px] font-semibold text-brand-ink">{r.patient}</p>
                    <p className="mt-0.5 text-[11px] text-brand-subtle">{r.reason}</p>
                    <p className="mt-0.5 text-[10px] text-brand-subtle">
                      {r.requested} · {r.scopes} scopes requested
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => resolve(r.id, "approve")}
                        className="flex flex-1 items-center justify-center gap-1 rounded-md bg-brand px-2 py-1 text-[11px] font-semibold text-white hover:bg-brand-forest"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => resolve(r.id, "decline")}
                        className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-brand-ink hover:bg-muted"
                      >
                        <X className="h-3 w-3" /> Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-primary/20 bg-brand-mint/50 p-4">
        <p className="orva-label flex items-center gap-1.5 text-brand-forest">
          <Sparkles className="h-3.5 w-3.5" /> Simulated clinical summary
        </p>
        <p className="mt-2 max-w-[90ch] text-[12.5px] leading-relaxed text-brand-forest">
          Across today's four consultations, one patient has an INR above the therapeutic range and another has gained
          2.1 kg in five days. Both are flagged in your alerts. The remaining two visits look like routine reviews based
          on the records you are consented to see.
        </p>
        <button
          type="button"
          onClick={() => openAssistant("Prepare a consultation summary")}
          className="mt-2.5 rounded-lg bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-brand-forest hover:bg-white/80"
        >
          Open in assistant
        </button>
      </div>
    </div>
  );
}