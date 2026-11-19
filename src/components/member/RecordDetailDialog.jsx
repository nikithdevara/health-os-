import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, FileText } from "lucide-react";
import StatusPill from "@/components/shared/StatusPill";
import { fmtDate } from "@/lib/format";

export default function RecordDetailDialog({ record, open, onOpenChange }) {
  if (!record) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-[640px] overflow-y-auto orva-scroll">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-mint text-primary">
              <FileText className="h-4 w-4" />
            </span>
            <span className="orva-label">{record.type}</span>
          </div>
          <DialogTitle className="mt-1 text-left font-heading text-[21px] font-bold leading-tight tracking-[-0.02em]">
            {record.title}
          </DialogTitle>
          <DialogDescription className="text-left text-[12.5px]">
            {record.org} · {record.clinician} · {fmtDate(record.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <StatusPill status={record.status} />
          <span className="flex items-center gap-1 rounded-full border border-brand-line bg-muted px-2 py-0.5 text-[10.5px] font-medium text-brand-subtle">
            <ShieldCheck className="h-3 w-3 text-primary" /> Source verified
          </span>
        </div>

        <section>
          <p className="orva-label mb-1.5">Summary</p>
          <p className="text-[13px] leading-relaxed text-brand-ink">{record.summary}</p>
        </section>

        {record.markers && (
          <section>
            <p className="orva-label mb-2">Results</p>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full border-collapse">
                <thead className="bg-muted/60">
                  <tr>
                    {["Marker", "Value", "Reference"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-subtle"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {record.markers.map((m) => (
                    <tr key={m.name} className="border-t border-border">
                      <td className="px-3 py-2 text-[12.5px] text-brand-ink">{m.name}</td>
                      <td className="px-3 py-2 text-[12.5px] font-semibold tnum text-brand-ink">{m.value}</td>
                      <td className="px-3 py-2 text-[12px] tnum text-brand-subtle">{m.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="space-y-2">
          <p className="orva-label">Clinical detail</p>
          {record.body.map((p) => (
            <p key={p} className="text-[12.8px] leading-relaxed text-brand-ink/85">
              {p}
            </p>
          ))}
        </section>

        <p className="rounded-lg border border-brand-line bg-muted/50 px-3 py-2 text-[11px] leading-relaxed text-brand-subtle">
          Demonstration record. No real patient information is stored in this environment.
        </p>
      </DialogContent>
    </Dialog>
  );
}