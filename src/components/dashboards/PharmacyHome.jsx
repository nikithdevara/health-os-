import { useState } from "react";
import { AlertTriangle, Package, Pill, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusPill from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { pharmacyQueue, inventory } from "@/lib/data/orva";

export default function PharmacyHome() {
  const [queue, setQueue] = useState(pharmacyQueue);

  function dispense(id) {
    const item = queue.find((q) => q.id === id);
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: "Dispensed" } : q)));
    toast.success("Medication dispensed", { description: `${item.medicine} · ${item.qty} recorded for ${item.patient}.` });
  }

  const ready = queue.filter((q) => q.status === "Ready to dispense").length;
  const lowStock = inventory.filter((i) => i.stock < i.reorder);

  return (
    <div>
      <PageHeader
        eyebrow="Medication services"
        title="CarePoint Pharmacy"
        description="Verify prescriptions, check interactions and dispense against the member's consented medication record."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Prescriptions in queue" value={queue.length} hint="Across today's shift" icon={Pill} />
        <StatCard label="Ready to dispense" value={ready} hint="Verified by a pharmacist" icon={ShieldCheck} />
        <StatCard label="Interaction alerts" value={queue.filter((q) => q.interaction).length} hint="Require a second check" icon={AlertTriangle} tone="warn" />
        <StatCard label="Low stock lines" value={lowStock.length} hint="Below reorder level" icon={Package} tone="crit" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="orva-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Prescription queue</h2>
            <span className="text-[11px] text-brand-subtle">{queue.length} today</span>
          </div>
          <ul className="divide-y divide-border">
            {queue.map((q) => (
              <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-semibold text-brand-ink">{q.medicine}</p>
                    <span className="text-[10.5px] tnum text-brand-subtle">{q.id}</span>
                    {q.interaction && (
                      <span className="flex items-center gap-1 rounded-full bg-brand-crit/10 px-1.5 py-0.5 text-[9.5px] font-semibold text-brand-crit">
                        <AlertTriangle className="h-2.5 w-2.5" /> Interaction
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-brand-subtle">
                    {q.patient} · {q.qty} · {q.prescriber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={q.status} />
                  {q.status !== "Dispensed" && (
                    <Button
                      size="sm"
                      className="h-7 text-[11px]"
                      disabled={q.status === "Verification required"}
                      onClick={() => dispense(q.id)}
                    >
                      Dispense
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-border px-4 py-2.5 text-[10.5px] text-brand-subtle">
            Prescriptions marked “Verification required” need a pharmacist's second check before dispensing.
          </p>
        </div>

        <div className="space-y-4">
          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Stock watch</h2>
            <ul className="mt-2.5 space-y-2.5">
              {inventory.map((i) => (
                <li key={i.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[11.5px] font-medium text-brand-ink">{i.medicine}</p>
                    <span className={`text-[11px] tnum font-semibold ${i.stock < i.reorder ? "text-brand-crit" : "text-brand-subtle"}`}>
                      {i.stock}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${i.stock < i.reorder ? "bg-brand-crit" : "bg-primary"}`}
                      style={{ width: `${Math.min(100, (i.stock / (i.reorder * 3)) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-brand-subtle">
                    Batch {i.batch} · expires {i.expiry}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Clarification requests</h2>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-brand-subtle">
              1 prescription is waiting on the prescriber: Furosemide 40 mg dose frequency for Samuel Etim.
            </p>
            <button
              type="button"
              onClick={() => toast.success("Reminder sent", { description: "Dr. Mensah was asked to confirm the dosing frequency." })}
              className="mt-2 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-brand-ink hover:bg-muted"
            >
              Send reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}