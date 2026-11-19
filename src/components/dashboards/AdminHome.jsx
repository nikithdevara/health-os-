import { useState } from "react";
import { Building2, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusPill from "@/components/shared/StatusPill";
import { platformMetrics, organisations as seededOrgs, globalAudit } from "@/lib/data/orva";

export default function AdminHome() {
  const [orgs, setOrgs] = useState(seededOrgs);

  function setStatus(id, status) {
    setOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success("Organisation updated", { description: `${orgs.find((o) => o.id === id).name} is now ${status.toLowerCase()}.` });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Platform governance"
        title="Platform overview"
        description="Health of the HealthOS ecosystem: organisations, members, consent volume and access monitoring."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Organisations" value={platformMetrics.organisations} hint="9 awaiting verification" icon={Building2} />
        <StatCard label="Members" value={platformMetrics.members.toLocaleString()} hint={`${platformMetrics.clinicians.toLocaleString()} clinicians`} icon={Users} />
        <StatCard label="Active consents" value={platformMetrics.activeConsents.toLocaleString()} hint="12 expire in 7 days" icon={ShieldCheck} />
        <StatCard label="Emergency sessions" value={platformMetrics.emergencySessions} hint="All within policy duration" icon={ShieldAlert} tone="warn" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="orva-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Organisation directory</h2>
            <span className="text-[11px] text-brand-subtle">{orgs.length} shown</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {["Organisation", "Type", "Members", "Region", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.09em] text-brand-subtle">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orgs.map((o) => (
                  <tr key={o.id} className="border-b border-border/70 last:border-0 hover:bg-brand-mint/30">
                    <td className="px-4 py-2.5 text-[12.5px] font-semibold text-brand-ink">{o.name}</td>
                    <td className="px-4 py-2.5 text-[12px] text-brand-subtle">{o.type}</td>
                    <td className="px-4 py-2.5 text-[12px] tnum text-brand-ink">{o.members.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-[12px] text-brand-subtle">{o.region}</td>
                    <td className="px-4 py-2.5">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {o.status !== "Verified" ? (
                        <button
                          type="button"
                          onClick={() => setStatus(o.id, "Verified")}
                          className="rounded-md border border-border px-2 py-1 text-[10.5px] font-semibold text-brand-ink hover:bg-muted"
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setStatus(o.id, "Under review")}
                          className="rounded-md border border-border px-2 py-1 text-[10.5px] font-semibold text-brand-subtle hover:bg-muted"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Global audit</h2>
            <ul className="mt-2.5 space-y-2">
              {globalAudit.map((a) => (
                <li key={a.id} className="border-b border-border/70 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11.5px] font-semibold text-brand-ink">{a.action}</p>
                    <StatusPill status={a.result} />
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-brand-subtle">
                    {a.target} · {a.at}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">System health</h2>
            <ul className="mt-2.5 space-y-2 text-[11.5px]">
              {[
                ["FHIR gateway", platformMetrics.uptime, "ok"],
                ["Identity service", "99.99%", "ok"],
                ["AI services", "Degraded latency", "warn"],
                ["Audit pipeline", "Operational", "ok"],
              ].map(([label, value, tone]) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="text-brand-subtle">{label}</span>
                  <span className={`font-semibold ${tone === "warn" ? "text-brand-warn" : "text-brand-ink"}`}>{value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10.5px] leading-relaxed text-brand-subtle">
              Demonstration metrics. No live infrastructure is connected in this phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}