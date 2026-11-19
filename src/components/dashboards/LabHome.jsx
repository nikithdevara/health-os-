import { useState } from "react";
import { AlertTriangle, Clock, FlaskConical, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusPill from "@/components/shared/StatusPill";
import { labOrders, labMetrics } from "@/lib/data/orva";

const STAGES = ["Awaiting collection", "Sample received", "Processing", "Validated", "Published"];

export default function LabHome() {
  const [orders, setOrders] = useState(labOrders);

  function advance(id, stage) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o)));
    toast.success("Order updated", { description: `${id} is now “${stage}”. The ordering clinician is notified at publication.` });
  }

  const abnormal = orders.filter((o) => o.priority === "Urgent").length;

  return (
    <div>
      <PageHeader
        eyebrow="Diagnostic laboratory"
        title="Meridian Diagnostics"
        description="Sample intake, processing and validation for the orders your connected clinicians have placed."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="In queue" value={labMetrics.inQueue} hint="Across 4 benches" icon={FlaskConical} />
        <StatCard label="Awaiting validation" value={labMetrics.awaitingValidation} hint="2 flagged abnormal" icon={ShieldCheck} tone="warn" />
        <StatCard label="Urgent orders" value={abnormal} hint="Target turnaround 60 min" icon={AlertTriangle} tone="crit" />
        <StatCard label="Avg turnaround" value={labMetrics.avgTurnaround} hint="Last 24 hours" icon={Clock} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="orva-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Test orders</h2>
            <span className="text-[11px] text-brand-subtle">Update a stage to move the order forward</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {["Order", "Patient", "Test", "Priority", "Stage", "TAT"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.09em] text-brand-subtle">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-2.5 text-[11.5px] font-semibold tnum text-brand-ink">{o.id}</td>
                    <td className="px-4 py-2.5 text-[12.5px] text-brand-ink">{o.patient}</td>
                    <td className="px-4 py-2.5 text-[12px] text-brand-subtle">{o.test}</td>
                    <td className="px-4 py-2.5">
                      <StatusPill status={o.priority} />
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        value={o.stage}
                        onChange={(e) => advance(o.id, e.target.value)}
                        className="h-7 rounded-md border border-border bg-card px-1.5 text-[11px] text-brand-ink"
                        aria-label={`Stage for ${o.id}`}
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5 text-[11.5px] tnum text-brand-subtle">{o.tat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Abnormal flags</h2>
            <ul className="mt-2.5 space-y-2">
              <li className="rounded-lg border border-brand-crit/25 bg-brand-crit/5 p-2.5">
                <p className="text-[11.5px] font-semibold text-brand-ink">INR 3.8 · Daniel Ibe</p>
                <p className="text-[10.5px] text-brand-subtle">Above therapeutic range — clinician notified</p>
              </li>
              <li className="rounded-lg border border-brand-warn/25 bg-brand-warn/5 p-2.5">
                <p className="text-[11.5px] font-semibold text-brand-ink">eGFR 58 · Samuel Etim</p>
                <p className="text-[10.5px] text-brand-subtle">Mildly reduced — repeat suggested</p>
              </li>
            </ul>
          </div>
          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Quality control</h2>
            <ul className="mt-2 space-y-1.5 text-[11.5px] text-brand-subtle">
              <li className="flex justify-between">
                <span>Chemistry bench</span>
                <StatusPill status="Validated" />
              </li>
              <li className="flex justify-between">
                <span>Haematology bench</span>
                <StatusPill status="Validated" />
              </li>
              <li className="flex justify-between">
                <span>Coagulation bench</span>
                <StatusPill status="Processing" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}