import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/member/consent")({
  head: () => ({ meta: [{ title: "HealthOS — Access & consent" }] }),
  component: ConsentPage,
});
import { Check, Clock, FileSearch, ShieldCheck, ShieldX, X } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import StatusPill from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { useDemoState, decideConsent, revokeConsent } from "@/lib/demoStore";

export default function ConsentPage() {
  const { consents, audit } = useDemoState();
  const [tab, setTab] = useState("requests");
  const [selectedScopes, setSelectedScopes] = useState({});

  const pending = consents.filter((c) => c.status === "pending");
  const active = consents.filter((c) => c.status === "granted");
  const auditRows = useMemo(() => audit, [audit]);

  function scopesFor(id, request) {
    return selectedScopes[id] ?? request.scopes.map((s) => s.key);
  }

  function toggle(id, request, key) {
    const current = scopesFor(id, request);
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    setSelectedScopes((prev) => ({ ...prev, [id]: next }));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Trust & identity"
        title="Access & consent"
        description="Identify → request → review → consent → access → audit. Every request states its purpose, scope and expiry before anything opens."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
          {[
            { key: "requests", label: `Requests${pending.length ? ` (${pending.length})` : ""}` },
            { key: "active", label: `Active${active.length ? ` (${active.length})` : ""}` },
            { key: "history", label: "Access history" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                tab === t.key ? "bg-brand-mint text-brand-forest" : "text-brand-subtle hover:text-brand-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="flex items-center gap-1.5 text-[11.5px] text-brand-subtle">
          <Clock className="h-3.5 w-3.5" /> Grants expire automatically
        </p>
      </div>

      {tab === "requests" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {pending.length === 0 && (
            <div className="orva-card col-span-full px-6 py-14 text-center">
              <ShieldCheck className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-[13.5px] font-semibold text-brand-ink">No open requests</p>
              <p className="mx-auto mt-1 max-w-[44ch] text-[12.5px] text-brand-subtle">
                When a clinician, laboratory or pharmacy asks for access, it will appear here for your review.
              </p>
            </div>
          )}
          {pending.map((req) => {
            const chosen = scopesFor(req.id, req);
            return (
              <article key={req.id} className="orva-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13.5px] font-bold text-brand-ink">{req.requester}</p>
                    <p className="text-[11.5px] text-brand-subtle">
                      {req.role} · {req.org}
                    </p>
                  </div>
                  <StatusPill status="Pending" />
                </div>

                <p className="mt-2.5 rounded-lg bg-muted/60 px-3 py-2 text-[11.5px] leading-relaxed text-brand-ink">
                  “{req.purpose}”
                </p>

                <p className="orva-label mt-3 mb-1.5">Requested scopes</p>
                <ul className="space-y-1.5">
                  {req.scopes.map((s) => {
                    const on = chosen.includes(s.key);
                    return (
                      <li key={s.key}>
                        <button
                          type="button"
                          onClick={() => toggle(req.id, req, s.key)}
                          className={`flex w-full items-start gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                            on ? "border-primary/35 bg-brand-mint/50" : "border-border bg-card"
                          }`}
                        >
                          <span
                            className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${
                              on ? "border-primary bg-primary text-white" : "border-brand-line bg-card"
                            }`}
                          >
                            {on && <Check className="h-2.5 w-2.5" />}
                          </span>
                          <span>
                            <span className="block text-[12px] font-semibold text-brand-ink">{s.label}</span>
                            <span className="block text-[10.5px] text-brand-subtle">{s.detail}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-2 text-[10.5px] text-brand-subtle">
                  Requested {req.requested} · access would expire after {req.duration}
                </p>

                <div className="mt-3 flex gap-1.5">
                  <Button
                    size="sm"
                    className="h-8 flex-1 gap-1 text-[11.5px]"
                    disabled={chosen.length === 0}
                    onClick={() => {
                      decideConsent(req.id, "granted");
                      toast.success("Consent granted", {
                        description: `${req.requester} can view ${chosen.length} scope${chosen.length > 1 ? "s" : ""} for ${req.duration}.`,
                      });
                    }}
                  >
                    <Check className="h-3.5 w-3.5" /> Grant access
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 flex-1 gap-1 text-[11.5px]"
                    onClick={() => {
                      decideConsent(req.id, "denied");
                      toast.success("Request declined", { description: `${req.requester} has been notified. No records were shared.` });
                    }}
                  >
                    <X className="h-3.5 w-3.5" /> Decline
                  </Button>
                </div>
                {chosen.length === 0 && (
                  <p className="mt-1.5 text-[10.5px] text-brand-warn">Select at least one scope to grant access.</p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {tab === "active" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {active.length === 0 && (
            <div className="orva-card col-span-full px-6 py-14 text-center">
              <p className="text-[13.5px] font-semibold text-brand-ink">No active grants</p>
              <p className="mt-1 text-[12.5px] text-brand-subtle">Approved requests appear here with their expiry.</p>
            </div>
          )}
          {active.map((c) => (
            <article key={c.id} className="orva-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-bold text-brand-ink">{c.requester}</p>
                  <p className="text-[11.5px] text-brand-subtle">{c.org}</p>
                </div>
                <StatusPill status="Consented" />
              </div>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {c.scopes.map((s) => (
                  <li key={s.key} className="rounded-full bg-brand-mint px-2 py-0.5 text-[10.5px] font-medium text-brand-forest">
                    {s.label}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-brand-subtle">Expires after {c.duration}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 h-8 gap-1 text-[11.5px]"
                onClick={() => {
                  revokeConsent(c.id);
                  toast.success("Access revoked", { description: `${c.requester} can no longer open these records.` });
                }}
              >
                <ShieldX className="h-3.5 w-3.5" /> Revoke access
              </Button>
            </article>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className="orva-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="flex items-center gap-1.5 font-heading text-[15px] font-bold text-brand-ink">
              <FileSearch className="h-4 w-4 text-brand-subtle" /> Access history
            </h3>
            <span className="text-[11px] text-brand-subtle">{auditRows.length} events</span>
          </div>
          <ol className="relative px-4 py-4">
            <span className="absolute bottom-6 left-[27px] top-6 w-px bg-border" aria-hidden="true" />
            {auditRows.map((a) => (
              <li key={a.id} className="relative flex gap-3.5 pb-4 last:pb-0">
                <span
                  className={`relative z-[1] mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-background ${
                    a.status === "Denied" || a.status === "Revoked"
                      ? "bg-brand-crit"
                      : a.status === "Expired"
                        ? "bg-brand-warn"
                        : "bg-primary"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <div className="min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[12.5px] font-semibold text-brand-ink">{a.action}</p>
                    <StatusPill status={a.status} />
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-brand-subtle">
                    {a.actor} · {a.org}
                  </p>
                  <p className="mt-1 text-[11px] text-brand-subtle">
                    Scope: {a.scope} · {a.channel} · {a.at}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}