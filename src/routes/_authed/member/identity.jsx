import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/member/identity")({
  head: () => ({ meta: [{ title: "HealthOS — Your HealthOS ID" }] }),
  component: IdentityPage,
});
import { Copy, Maximize2, ScanLine, ShieldCheck, Siren, Users } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import QrCode from "@/components/identity/QrCode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { member, careTeam } from "@/lib/data/orva";

export default function IdentityPage() {
  const [fullscreen, setFullscreen] = useState(false);

  function copyId() {
    if (navigator.clipboard) navigator.clipboard.writeText(member.orvaId);
    toast.success("HealthOS ID copied", { description: member.orvaId });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Identity"
        title="Your HealthOS ID"
        description="A HealthOS ID identifies you. It never grants access to your medical information — a scoped request and your consent do that."
        actions={
          <Button size="sm" variant="outline" className="h-9 gap-1.5 text-[12.5px]" onClick={() => setFullscreen(true)}>
            <Maximize2 className="h-3.5 w-3.5" /> Present QR
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <article className="relative overflow-hidden rounded-2xl bg-brand-forest p-5 text-white">
          <div className="absolute inset-0 opacity-[0.16] [background:radial-gradient(120%_80%_at_100%_0%,#D6F57B_0%,transparent_60%)]" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/60">HealthOS identity</p>
                <p className="mt-1 font-heading text-[20px] font-extrabold tracking-[-0.03em]">HealthOS</p>
              </div>
              <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em]">
                {member.status}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white/15 font-heading text-[18px] font-bold">
                {member.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-[18px] font-bold leading-tight">{member.name}</p>
                <p className="mt-0.5 text-[11.5px] text-white/70">
                  {member.age} years · {member.sex} · {member.bloodType}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-white p-3">
              <QrCode value={member.orvaId} size={140} />
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">HealthOS ID</p>
                <p className="mt-1 font-heading text-[15px] font-bold tracking-[0.04em] tnum">{member.orvaId}</p>
              </div>
              <button
                type="button"
                onClick={copyId}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white hover:bg-white/25"
                aria-label="Copy HealthOS ID"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-white/50">
              Demonstration identity · this QR resolves to synthetic data only.
            </p>
          </div>
        </article>

        <div className="space-y-4">
          <div className="orva-card p-4 sm:p-5">
            <p className="orva-label mb-2.5 flex items-center gap-1.5">
              <ScanLine className="h-3.5 w-3.5 text-primary" /> What a scan does
            </p>
            <ol className="grid gap-2 sm:grid-cols-2">
              {[
                { step: "1", title: "Identify", body: "A clinician or pharmacy scans your QR to confirm who you are." },
                { step: "2", title: "Request", body: "They choose exactly which scopes they need and why." },
                { step: "3", title: "Consent", body: "You review the request and grant or decline it, per scope." },
                { step: "4", title: "Audit", body: "Every open, grant and denial is written to your access history." },
              ].map((s) => (
                <li key={s.step} className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {s.step}
                    </span>
                    <p className="text-[12.5px] font-semibold text-brand-ink">{s.title}</p>
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-brand-subtle">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="orva-card p-4">
              <p className="orva-label mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Never automatic
              </p>
              <ul className="space-y-1.5 text-[11.5px] leading-relaxed text-brand-subtle">
                <li>· A HealthOS ID does not unlock your records.</li>
                <li>· Requests always state a purpose and an expiry.</li>
                <li>· You can revoke any grant at any time.</li>
              </ul>
            </div>
            <div className="orva-card p-4">
              <p className="orva-label mb-2 flex items-center gap-1.5">
                <Siren className="h-3.5 w-3.5 text-brand-warn" /> Emergency access
              </p>
              <p className="text-[11.5px] leading-relaxed text-brand-subtle">
                In an emergency, a clinician can request a time-limited summary — allergies, medicines, blood type and
                emergency contact. You are notified and it is audited.
              </p>
            </div>
          </div>

          <div className="orva-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="flex items-center gap-1.5 font-heading text-[15px] font-bold text-brand-ink">
                <Users className="h-4 w-4 text-brand-subtle" /> Organisations holding your ID
              </h3>
              <span className="text-[11px] text-brand-subtle">{careTeam.length} connected</span>
            </div>
            <ul className="divide-y divide-border">
              {careTeam.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                  <div>
                    <p className="text-[12.5px] font-semibold text-brand-ink">{c.name}</p>
                    <p className="text-[11px] text-brand-subtle">
                      {c.role} · connected {c.connected}
                    </p>
                  </div>
                  <p className="text-[10.5px] text-brand-subtle">{c.scopes.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-center font-heading text-[18px] font-bold">Present your HealthOS ID</DialogTitle>
            <DialogDescription className="text-center text-[12px]">
              Ask the clinician to scan this code to start an access request.
            </DialogDescription>
          </DialogHeader>
          <div className="mx-auto rounded-2xl border border-border bg-white p-4">
            <QrCode value={member.orvaId} size={248} />
          </div>
          <p className="text-center text-[12px] font-semibold tnum text-brand-ink">{member.orvaId}</p>
          <p className="text-center text-[10.5px] text-brand-subtle">
            Scanning identifies you — it does not share any record.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}