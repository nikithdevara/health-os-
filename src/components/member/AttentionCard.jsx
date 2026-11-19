import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Pill, ShieldAlert, Check } from "lucide-react";
import { toast } from "sonner";
import { useDemoState, decideConsent } from "@/lib/demoStore";
import { medications, appointments } from "@/lib/data/orva";
import { relativeLabel } from "@/lib/format";

export default function AttentionCard() {
  const { consents } = useDemoState();
  const pending = consents.find((c) => c.status === "pending");
  const nextAppointment = appointments.find((a) => a.status === "Confirmed");
  const dueMedication = medications[0];

  return (
    <div className="orva-card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-[15px] font-bold text-brand-ink">Needs your attention</h3>
        <span className="rounded-full bg-brand-warn/10 px-2 py-0.5 text-[10.5px] font-semibold text-[#8a5f16]">
          {pending ? "1 access request" : "All clear"}
        </span>
      </div>

      <ul className="mt-3 divide-y divide-border">
        {pending && (
          <li className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-warn/10 text-brand-warn">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-brand-ink">
                  {pending.requester} requests access
                </p>
                <p className="mt-0.5 max-w-[52ch] text-[11.5px] leading-snug text-brand-subtle">
                  {pending.scopes.map((s) => s.label).join(" · ")} · {pending.duration}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-1.5 pl-11 sm:pl-0">
              <button
                type="button"
                onClick={() => {
                  decideConsent(pending.id, "granted");
                  toast.success("Access granted", { description: `${pending.requester} can now view the scopes you approved.` });
                }}
                className="rounded-lg bg-brand px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-brand-forest"
              >
                Grant
              </button>
              <Link
                to="/member/consent"
                className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11.5px] font-semibold text-brand-ink hover:bg-muted"
              >
                Review <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </li>
        )}

        <li className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-mint text-primary">
              <Pill className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-brand-ink">
                {dueMedication.name} {dueMedication.dose}
              </p>
              <p className="mt-0.5 text-[11.5px] text-brand-subtle">
                {dueMedication.schedule} · last taken {dueMedication.lastTaken.toLowerCase()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.success("Dose recorded", { description: `${dueMedication.name} ${dueMedication.dose} logged just now.` })
            }
            className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11.5px] font-semibold text-brand-ink hover:bg-muted"
          >
            <Check className="h-3 w-3 text-primary" /> Taken
          </button>
        </li>

        {nextAppointment && (
          <li className="flex items-center justify-between gap-3 py-3 last:pb-0">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-brand-ink">
                <CalendarDays className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-brand-ink">
                  {nextAppointment.clinician} · {nextAppointment.speciality}
                </p>
                <p className="mt-0.5 text-[11.5px] text-brand-subtle">
                  {relativeLabel(nextAppointment.date)} · {nextAppointment.time} · {nextAppointment.mode}
                </p>
              </div>
            </div>
            <Link
              to="/member/appointments"
              className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11.5px] font-semibold text-brand-ink hover:bg-muted"
            >
              View <ArrowRight className="h-3 w-3" />
            </Link>
          </li>
        )}
      </ul>

      {pending && (
        <p className="mt-1 text-[10.5px] text-brand-subtle">
          Requested {pending.requested} · access would expire after {pending.duration}
        </p>
      )}
    </div>
  );
}