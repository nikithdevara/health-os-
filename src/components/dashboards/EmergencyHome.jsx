import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, FileText, Siren, ShieldCheck } from "lucide-react";
import { accessHistory } from "@/lib/data/orva";

export default function EmergencyHome() {
  const emergencyEvents = accessHistory.filter((a) => a.channel === "Emergency access");

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="orva-label">Emergency department · St. Cordelia</p>
          <h1 className="mt-1 font-heading text-[26px] font-bold leading-tight tracking-[-0.03em] text-brand-ink">
            Emergency access
          </h1>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-brand-crit/25 bg-brand-crit/10 px-2.5 py-1 text-[10.5px] font-semibold text-brand-crit">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-crit" /> No active session
        </span>
      </div>

      <Link
        to="/emergency/access"
        className="group relative block overflow-hidden rounded-2xl bg-brand-forest p-6 text-white transition-transform hover:-translate-y-0.5"
      >
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(90%_120%_at_100%_0%,#D6F57B_0%,transparent_55%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
              <Siren className="h-3 w-3" /> Start here
            </span>
            <h2 className="mt-3 font-heading text-[24px] font-bold tracking-[-0.03em]">Request emergency access</h2>
            <p className="mt-1.5 max-w-[52ch] text-[12.5px] leading-relaxed text-white/75">
              Identify the member, state the clinical justification, pick the minimum scopes you need and set an
              expiry. Every step is recorded.
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-brand-forest">
            Begin <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Scoped, never open-ended",
            body: "Choose allergies, medications, conditions or contacts individually. Only what you select is revealed.",
          },
          {
            icon: Clock,
            title: "Time-limited",
            body: "Sessions expire automatically after 15, 30 or 60 minutes. Access stops when the timer ends.",
          },
          {
            icon: FileText,
            title: "Audited and notified",
            body: "The member is notified, and the justification you write is attached to the access event.",
          },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="orva-card p-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-mint text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-2.5 text-[13px] font-bold text-brand-ink">{c.title}</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-brand-subtle">{c.body}</p>
            </div>
          );
        })}
      </div>

      <div className="orva-card mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-heading text-[15px] font-bold text-brand-ink">Recent emergency sessions</h2>
          <span className="text-[11px] text-brand-subtle">Department log</span>
        </div>
        {emergencyEvents.length === 0 ? (
          <p className="px-4 py-8 text-center text-[12px] text-brand-subtle">No emergency sessions recorded yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {emergencyEvents.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="text-[12.5px] font-semibold text-brand-ink">{e.action}</p>
                  <p className="text-[11px] text-brand-subtle">
                    {e.actor} · scope: {e.scope}
                  </p>
                </div>
                <p className="text-[11px] text-brand-subtle">{e.at}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}