import { useState } from "react";
import { Brain } from "lucide-react";
import { toast } from "sonner";
import ImagingViewer from "@/components/clinical/ImagingViewer";
import StatusPill from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { fmtDate } from "@/lib/format";

function Panel({ children }) {
  return <div className="rounded-2xl bg-card p-3">{children}</div>;
}

export function NotesPanel({ patient, clinicalNotes }) {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  return (
    <div className="space-y-2">
      <Panel>
        <p className="orva-label mb-1.5">New consultation note</p>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Subjective, objective, assessment, plan…"
          className="w-full resize-none rounded-xl border border-border bg-brand-canvas/60 p-2.5 text-[12px] outline-none focus:border-primary/40"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-[9.5px] text-brand-subtle">Notes are signed and written to the audit trail.</p>
          <Button
            size="sm"
            className="h-7 text-[11px]"
            disabled={!note.trim()}
            onClick={() => {
              setSavedNotes((prev) => [
                { id: `n-${Date.now()}`, date: "Today", author: "Dr. Elias Mensah", title: "Consultation note", text: note },
                ...prev,
              ]);
              setNote("");
              toast.success("Note signed", { description: `${patient.name}'s record now includes this consultation.` });
            }}
          >
            Sign note
          </Button>
        </div>
      </Panel>

      <ul className="space-y-1.5">
        {[...savedNotes, ...clinicalNotes].map((n) => (
          <li key={n.id} className="rounded-2xl bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11.5px] font-semibold text-brand-ink">{n.title}</p>
              <span className="text-[10px] text-brand-subtle">{fmtDate(n.date)}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-brand-subtle">{n.text}</p>
            <p className="mt-1 text-[9.5px] text-brand-subtle/80">Signed by {n.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DocumentsPanel({ timeline, onSelectRecord }) {
  return (
    <Panel>
      <ol className="relative">
        <span className="absolute bottom-2 left-[7px] top-2 w-px bg-border" aria-hidden="true" />
        {timeline.map((e) => (
          <li key={e.id} className="relative flex gap-3 pb-3 last:pb-0">
            <span className="relative z-[1] mt-1.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border-2 border-card bg-brand-carbon">
              <span className="h-1 w-1 rounded-full bg-brand-lime" />
            </span>
            <button
              type="button"
              onClick={() => onSelectRecord({ id: e.recordId })}
              className="min-w-0 flex-1 rounded-xl px-2 py-1 text-left transition-colors hover:bg-brand-canvas/70"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-brand-subtle">{e.type}</span>
                <span className="tnum text-[9.5px] text-brand-subtle">{fmtDate(e.date)}</span>
              </div>
              <p className="text-[12px] font-semibold text-brand-ink">{e.title}</p>
              <p className="text-[10.5px] leading-snug text-brand-subtle">{e.summary}</p>
            </button>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function LabsPanel({ records, onSelectRecord }) {
  return (
    <Panel>
      <div className="divide-y divide-border">
        {records
          .filter((r) => r.markers)
          .map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRecord(r)}
              className="block w-full px-1 py-2.5 text-left first:pt-0 last:pb-0 hover:bg-brand-canvas/60"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-semibold text-brand-ink">{r.title}</p>
                <StatusPill status={r.status} />
              </div>
              <p className="mt-0.5 text-[10.5px] text-brand-subtle">
                {r.org} · {fmtDate(r.date)}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                {r.markers.map((m) => (
                  <span key={m.name} className="text-[10.5px] text-brand-ink/80">
                    {m.name}: <span className="tnum font-semibold">{m.value}</span>
                  </span>
                ))}
              </div>
            </button>
          ))}
      </div>
    </Panel>
  );
}

export function ImagingPanel({ patient }) {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl bg-brand-mint/60 p-3">
        <p className="orva-label flex items-center gap-1.5 text-brand-forest">
          <Brain className="h-3.5 w-3.5" /> Simulated patient summary
        </p>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-brand-forest">
          {patient.name.split(" ")[0]} is {patient.age}, with {patient.condition.toLowerCase()}. Blood pressure{" "}
          {patient.bp}, heart rate {patient.hr} bpm. LDL fell to 2.9 mmol/L on current therapy; the most recent chest
          radiograph is unchanged.
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["3 sources cited", "No urgent flags", "Consent verified"].map((c) => (
            <span key={c} className="rounded-full bg-white/70 px-2 py-0.5 text-[9.5px] font-medium text-brand-forest">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-1.5 text-[9.5px] text-brand-forest/70">Demonstration output — review before acting.</p>
      </div>
      <ImagingViewer />
      {patient.allergies.length > 0 && (
        <div className="rounded-2xl bg-card p-3">
          <p className="orva-label mb-1.5">Allergies & safety</p>
          <ul className="flex flex-wrap gap-1.5">
            {patient.allergies.map((a) => (
              <li
                key={a}
                className="rounded-full border border-brand-crit/25 bg-brand-crit/10 px-2 py-0.5 text-[10px] font-semibold text-brand-crit"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}