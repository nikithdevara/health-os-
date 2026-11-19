import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import PatientCanvas from "@/components/clinical/PatientCanvas";
import { DocumentsPanel, ImagingPanel, LabsPanel, NotesPanel } from "@/components/clinical/PatientPanels";
import RecordDetailDialog from "@/components/member/RecordDetailDialog";
import StatusPill from "@/components/shared/StatusPill";
import { clinicalNotes, doctorAlerts, patients, records, timeline } from "@/lib/data/orva";

export const Route = createFileRoute("/_authed/doctor/patients/$patientId")({
  head: () => ({ meta: [{ title: "HealthOS — Patient workspace" }] }),
  component: PatientWorkspace,
});

export default function PatientWorkspace() {
  const { patientId } = Route.useParams();
  const patient = patients.find((p) => p.id === patientId) || patients[0];
  const [tab, setTab] = useState("overview");
  const [selected, setSelected] = useState(null);
  const alert = doctorAlerts.find((a) => a.patient === patient.name);

  const openRecord = (record) => {
    const found = records.find((r) => r.id === record.id);
    if (found) setSelected(found);
  };

  const panels = {
    notes: <NotesPanel patient={patient} clinicalNotes={clinicalNotes} />,
    documents: <DocumentsPanel timeline={timeline} onSelectRecord={openRecord} />,
    labs: <LabsPanel records={records} onSelectRecord={openRecord} />,
    imaging: <ImagingPanel patient={patient} />,
  };

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/doctor/patients"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-subtle hover:text-brand-ink"
          >
            <ArrowLeft className="h-3 w-3" /> Patient directory
          </Link>
          <span className="text-brand-subtle/40" aria-hidden="true">
            ·
          </span>
          <h1 className="font-heading text-[15px] font-bold tracking-[-0.02em] text-brand-ink">{patient.name}</h1>
          <StatusPill status={patient.risk} />
          <span className="tnum text-[10px] text-brand-subtle">
            {patient.age}y {patient.sex} · {patient.orvaId} · BP {patient.bp} · HR {patient.hr} bpm
          </span>
        </div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-brand-subtle">Synthetic record</p>
      </div>

      {alert && (
        <div className="mb-2.5 flex items-start gap-2 rounded-xl border border-brand-warn/30 bg-brand-warn/10 px-3 py-2">
          <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-warn" />
          <p className="text-[10.5px] leading-relaxed text-brand-ink/80">
            <span className="font-semibold">Needs review: </span>
            {alert.text}
          </p>
        </div>
      )}

      <PatientCanvas
        patient={patient}
        patients={patients}
        tab={tab}
        onTab={setTab}
        panels={panels}
        onLogAccess={() =>
          toast.success("Access logged", {
            description: `A read event was written to ${patient.name}'s audit trail.`,
          })
        }
      />

      <RecordDetailDialog record={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}