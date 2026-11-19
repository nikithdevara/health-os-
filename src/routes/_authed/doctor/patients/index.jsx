import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/doctor/patients/")({
  head: () => ({ meta: [{ title: "HealthOS — Patient directory" }] }),
  component: PatientsPage,
});
import { useNavigate } from "@tanstack/react-router";
import PageHeader from "@/components/shared/PageHeader";
import RecordTable from "@/components/shared/RecordTable";
import StatusPill from "@/components/shared/StatusPill";
import { patients } from "@/lib/data/orva";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Patient",
        sortable: true,
        render: (p) => (
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-mint text-[10.5px] font-bold text-brand-forest">
              {p.initials}
            </span>
            <div>
              <p className="text-[12.5px] font-semibold text-brand-ink">{p.name}</p>
              <p className="text-[10.5px] tnum text-brand-subtle">
                {p.orvaId} · {p.age}y {p.sex === "Female" ? "F" : "M"}
              </p>
            </div>
          </div>
        ),
      },
      { key: "condition", label: "Primary condition", sortable: true },
      {
        key: "lastVisit",
        label: "Last seen",
        render: (p) => <span className="text-brand-subtle">{p.lastVisit}</span>,
      },
      {
        key: "risk",
        label: "Risk",
        render: (p) => <StatusPill status={p.risk} />,
      },
      {
        key: "scopes",
        label: "Consented scopes",
        render: (p) => (
          <span className="text-[11px] text-brand-subtle">{p.scopes.length} scopes</span>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Clinical workspace"
        title="Patient directory"
        description="Patients who have consented to a care relationship with you. Opening a record is itself recorded in their audit trail."
        actions={
          <select
            aria-label="Filter by risk"
            className="h-9 rounded-lg border border-border bg-card px-2.5 text-[12px] text-brand-ink"
            onChange={(e) => setSelected(e.target.value || null)}
            defaultValue=""
          >
            <option value="">All risk levels</option>
            <option value="High">High risk</option>
            <option value="Moderate">Moderate risk</option>
          </select>
        }
      />

      <div className="orva-card overflow-hidden">
        <RecordTable
          columns={columns}
          rows={selected ? patients.filter((p) => p.risk === selected) : patients}
          searchKeys={["name", "condition", "orvaId"]}
          searchPlaceholder="Search by name, condition or HealthOS ID…"
          pageSize={8}
          onRowClick={(row) => navigate({ to: "/doctor/patients/$patientId", params: { patientId: row.id } })}
          emptyTitle="No patients match"
          emptyBody="Adjust the search or risk filter to see more of your consented patients."
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-brand-subtle">
        <span className="rounded-full border border-border bg-card px-2.5 py-1">4 consented patients</span>
        <span className="rounded-full border border-border bg-card px-2.5 py-1">2 connection requests awaiting approval</span>
        <span className="rounded-full border border-border bg-card px-2.5 py-1">All records are synthetic</span>
      </div>
    </div>
  );
}