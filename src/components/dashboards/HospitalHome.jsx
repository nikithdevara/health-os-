import { useState } from "react";
import { Building2, ShieldCheck, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusPill from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { organisation, hospitalMetrics, hospitalStaff, globalAudit } from "@/lib/data/orva";

export default function HospitalHome() {
  const [staff, setStaff] = useState(hospitalStaff);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Clinical");
  const [error, setError] = useState("");

  function invite(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid work email address");
      return;
    }
    setStaff((prev) => [
      ...prev,
      { id: `st-${Date.now()}`, name: email.split("@")[0].replace(/\./g, " "), role: "Invited staff", dept: "Pending", status: "Invited", access: role },
    ]);
    setInviteOpen(false);
    setEmail("");
    setError("");
    toast.success("Invitation sent", { description: `${email} was invited with ${role.toLowerCase()} access.` });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Organisation operations"
        title={organisation.name}
        description={`${organisation.type} · ${organisation.branches} branches · ${organisation.beds} beds · ${organisation.location}`}
        actions={
          <Button size="sm" className="h-9 gap-1.5 text-[12.5px]" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" /> Invite staff
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current admissions" value={hospitalMetrics.admissions} hint="21 discharges today" icon={Building2} />
        <StatCard label="Bed occupancy" value={`${hospitalMetrics.occupancy}%`} hint="202 of 260 beds in use" icon={Users} />
        <StatCard label="Staff on shift" value={hospitalMetrics.staffOnShift} hint={`${organisation.staff} total staff`} icon={Users} />
        <StatCard label="Pending consents" value={hospitalMetrics.pendingConsents} hint="Requests awaiting member review" icon={ShieldCheck} tone="warn" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="orva-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Staff directory</h2>
            <span className="text-[11px] text-brand-subtle">{staff.length} people</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Role", "Department", "Access", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.09em] text-brand-subtle">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="border-b border-border/70 last:border-0 hover:bg-brand-mint/30">
                    <td className="px-4 py-2.5 text-[12.5px] font-semibold text-brand-ink">{s.name}</td>
                    <td className="px-4 py-2.5 text-[12px] text-brand-ink">{s.role}</td>
                    <td className="px-4 py-2.5 text-[12px] text-brand-subtle">{s.dept}</td>
                    <td className="px-4 py-2.5 text-[12px] text-brand-subtle">{s.access}</td>
                    <td className="px-4 py-2.5">
                      <StatusPill status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Access governance</h2>
            <ul className="mt-3 space-y-3">
              {[
                { label: "Active member consents", value: 1824, tone: "bg-primary" },
                { label: "Requests awaiting review", value: 12, tone: "bg-brand-warn" },
                { label: "Denied in the last 7 days", value: 3, tone: "bg-brand-crit" },
              ].map((row) => (
                <li key={row.label}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-brand-ink">{row.label}</span>
                    <span className="tnum font-semibold text-brand-ink">{row.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${row.tone}`} style={{ width: `${Math.min(100, row.value / 20)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10.5px] leading-relaxed text-brand-subtle">
              Staff can only open records a member has consented to share with this organisation.
            </p>
          </div>

          <div className="orva-card p-4">
            <h2 className="font-heading text-[15px] font-bold text-brand-ink">Recent audit events</h2>
            <ul className="mt-2.5 space-y-2">
              {globalAudit.slice(0, 3).map((a) => (
                <li key={a.id} className="border-b border-border/70 pb-2 last:border-0 last:pb-0">
                  <p className="text-[11.5px] font-semibold text-brand-ink">{a.action}</p>
                  <p className="text-[10.5px] text-brand-subtle">
                    {a.actor} · {a.at}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-[19px] font-bold">Invite a staff member</DialogTitle>
            <DialogDescription className="text-[12.5px]">
              They receive an invitation to join {organisation.name} with the access level you choose.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={invite} className="space-y-3">
            <div>
              <Label className="text-[11.5px] font-semibold">Work email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hospital.org"
                className={`mt-1 h-9 text-[13px] ${error ? "border-brand-crit" : ""}`}
              />
              {error && <p className="mt-1 text-[10.5px] text-brand-crit">{error}</p>}
            </div>
            <div>
              <Label className="text-[11.5px] font-semibold">Access level</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1 h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clinical">Clinical</SelectItem>
                  <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="Administrative">Administrative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Send invitation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}