import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/member/records")({
  head: () => ({ meta: [{ title: "HealthOS — Medical records" }] }),
  component: RecordsPage,
});
import { Download, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import RecordTable from "@/components/shared/RecordTable";
import StatusPill from "@/components/shared/StatusPill";
import RecordDetailDialog from "@/components/member/RecordDetailDialog";
import { Button } from "@/components/ui/button";
import { records } from "@/lib/data/orva";
import { fmtDate } from "@/lib/format";

const TYPES = Array.from(new Set(records.map((r) => r.type)));

export default function RecordsPage() {
  const [selected, setSelected] = useState(null);

  const columns = useMemo(
    () => [
      {
        key: "title",
        label: "Record",
        sortable: true,
        render: (r) => (
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-mint text-primary">
              <FileText className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-semibold text-brand-ink">{r.title}</p>
              <p className="truncate text-[11px] text-brand-subtle">
                {r.org} · {r.clinician}
              </p>
            </div>
          </div>
        ),
      },
      { key: "type", label: "Type", sortable: true },
      { key: "date", label: "Date", sortable: true, render: (r) => <span className="tnum">{fmtDate(r.date)}</span> },
      { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
    ],
    [],
  );

  function exportRecords() {
    const payload = records.map((r) => ({
      title: r.title,
      type: r.type,
      organisation: r.org,
      clinician: r.clinician,
      date: r.date,
      summary: r.summary,
    }));
    const blob = new Blob([JSON.stringify({ member: "HOS-4H2K-9QX7", exportedAt: new Date().toISOString(), records: payload }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "healthos-records-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export prepared", { description: "6 demonstration records downloaded as JSON." });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Member workspace"
        title="Medical records"
        description="Every document you have chosen to keep in HealthOS, with the organisation and clinician that produced it."
        actions={
          <Button size="sm" variant="outline" className="h-9 gap-1.5 text-[12.5px]" onClick={exportRecords}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        }
      />

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-brand-line bg-brand-mint/50 px-3.5 py-2.5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-[11.5px] leading-relaxed text-brand-forest">
          Records are only shared with organisations you approve in Access &amp; consent. Open a record to see its
          source, results and clinical detail.
        </p>
      </div>

      <div className="orva-card overflow-hidden">
        <RecordTable
          columns={columns}
          rows={records}
          searchKeys={["title", "org", "clinician", "type"]}
          searchPlaceholder="Search records by title, organisation or clinician…"
          filters={[
            { key: "type", label: "Types", options: TYPES },
            { key: "status", label: "Statuses", options: ["Published", "Reviewed", "Signed", "Dispensed", "Recorded"] },
          ]}
          onRowClick={(row) => setSelected(row)}
          emptyTitle="No records match this filter"
          emptyBody="Clear the search or choose a different record type."
        />
      </div>

      <RecordDetailDialog record={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}