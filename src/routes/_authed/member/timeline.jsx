import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/member/timeline")({
  head: () => ({ meta: [{ title: "HealthOS — Health timeline" }] }),
  component: TimelinePage,
});
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Layers, Sparkles } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatusPill from "@/components/shared/StatusPill";
import AnatomyMap from "@/components/medical/AnatomyMap";
import RecordDetailDialog from "@/components/member/RecordDetailDialog";
import { records, timeline } from "@/lib/data/orva";
import { fmtDate } from "@/lib/format";

const FILTERS = ["All", "Visit", "Lab", "Imaging", "Medication", "Prescription", "Immunisation"];

const TYPE_TONE = {
  Visit: "bg-brand-mint text-brand-forest",
  Lab: "bg-[#E9F1FB] text-[#2B5C93]",
  Imaging: "bg-[#F3EEFB] text-[#5B4593]",
  Medication: "bg-[#FDF3E4] text-[#8A5F16]",
  Prescription: "bg-[#FDF3E4] text-[#8A5F16]",
  Immunisation: "bg-[#EDF7E6] text-[#3F6B2A]",
};

export default function TimelinePage() {
  const [filter, setFilter] = useState("All");
  const [region, setRegion] = useState(null);
  const [selected, setSelected] = useState(null);

  const events = useMemo(() => {
    let list = filter === "All" ? timeline : timeline.filter((t) => t.type === filter);
    if (region) list = list.filter((t) => t.bodyRegion === region);
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [filter, region]);

  const grouped = useMemo(() => {
    const map = new Map();
    events.forEach((e) => {
      const key = new Date(`${e.date}T00:00:00Z`).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    });
    return Array.from(map.entries());
  }, [events]);

  return (
    <div>
      <PageHeader
        eyebrow="Member workspace"
        title="Health timeline"
        description="Visits, results, prescriptions and personal health events in one continuous record — click any event to read its source document."
        actions={
          <Link
            to="/member/assistant"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-[12.5px] font-semibold text-brand-ink hover:bg-muted"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Summarise timeline
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
              filter === f
                ? "border-primary bg-primary text-white"
                : "border-border bg-card text-brand-subtle hover:text-brand-ink"
            }`}
          >
            {f}
          </button>
        ))}
        {region && (
          <button
            type="button"
            onClick={() => setRegion(null)}
            className="rounded-full border border-dashed border-primary/40 bg-brand-mint/50 px-3 py-1.5 text-[11.5px] font-semibold text-brand-forest"
          >
            Region filter active · clear
          </button>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="orva-card overflow-hidden">
          {grouped.length === 0 && (
            <div className="px-5 py-14 text-center">
              <p className="text-[13.5px] font-semibold text-brand-ink">No events in this view</p>
              <p className="mt-1 text-[12.5px] text-brand-subtle">Try a different event type or clear the region filter.</p>
            </div>
          )}
          {grouped.map(([month, items]) => (
            <section key={month} className="border-b border-border last:border-0">
              <div className="flex items-center gap-2 bg-muted/50 px-5 py-2">
                <Layers className="h-3.5 w-3.5 text-brand-subtle" />
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.11em] text-brand-subtle">{month}</p>
                <span className="text-[10.5px] text-brand-subtle/80">{items.length} events</span>
              </div>
              <ol className="relative px-5 py-4">
                <span className="absolute bottom-5 left-[34px] top-6 w-px bg-border" aria-hidden="true" />
                {items.map((e) => {
                  const record = records.find((r) => r.id === e.recordId);
                  return (
                    <li key={e.id} className="relative flex gap-3.5 pb-4 last:pb-0">
                      <span className="relative z-[1] mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-background bg-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                      <button
                        type="button"
                        onClick={() => record && setSelected(record)}
                        className="group min-w-0 flex-1 rounded-xl border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border hover:bg-muted/40"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_TONE[e.type] || "bg-muted text-brand-subtle"}`}>
                            {e.type}
                          </span>
                          <span className="text-[10.5px] font-medium tnum text-brand-subtle">{fmtDate(e.date)}</span>
                        </div>
                        <p className="mt-1 text-[13px] font-semibold text-brand-ink">{e.title}</p>
                        <p className="mt-0.5 text-[11.5px] leading-snug text-brand-subtle">
                          {e.org} · {e.summary}
                        </p>
                        {record && (
                          <span className="mt-1 inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            Open record <ArrowUpRight className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>

        <div className="space-y-4">
          <AnatomyMap active={region} onSelect={(r) => setRegion((cur) => (cur === r ? null : r))} />
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="orva-label mb-2">About this view</p>
            <p className="text-[11.5px] leading-relaxed text-brand-subtle">
              The body map is a navigational aid for finding records by region. It does not interpret symptoms or
              suggest a diagnosis.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-brand-subtle">
              <StatusPill status="Verified" /> sources are signed by the issuing organisation
            </div>
          </div>
        </div>
      </div>

      <RecordDetailDialog record={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}