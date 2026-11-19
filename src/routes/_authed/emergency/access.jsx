import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/emergency/access")({
  head: () => ({ meta: [{ title: "HealthOS — Emergency access" }] }),
  component: EmergencyAccessPage,
});
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Clock, Fingerprint, ShieldCheck, Siren } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StatusPill from "@/components/shared/StatusPill";
import { addAuditEvent } from "@/lib/demoStore";
import { emergencySummary } from "@/lib/data/orva";

const SCOPES = [
  { key: "allergies", label: "Allergies", detail: "Known reactions and severity" },
  { key: "medications", label: "Current medications", detail: "Active medicines and doses" },
  { key: "conditions", label: "Active conditions", detail: "Diagnoses relevant to treatment" },
  { key: "contacts", label: "Emergency contact", detail: "Name and phone number" },
];

const REASONS = ["Cardiac emergency", "Trauma / accident", "Loss of consciousness", "Acute allergic reaction", "Other"];

export default function EmergencyAccessPage() {
  const [step, setStep] = useState(1);
  const [orvaId, setOrvaId] = useState("");
  const [error, setError] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [justification, setJustification] = useState("");
  const [scopes, setScopes] = useState(["allergies", "medications", "contacts"]);
  const [duration, setDuration] = useState(30);
  const [verified, setVerified] = useState({ photo: false, countersign: false });
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [sessionLog, setSessionLog] = useState([]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (step !== 4 || closed) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [step, closed]);

  const timer = useMemo(() => {
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const s = String(secondsLeft % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [secondsLeft]);

  function log(text) {
    setSessionLog((prev) => [...prev, { text, at: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }]);
  }

  function identify(e) {
    e.preventDefault();
    if (!/^(?:HOS|ORVA)-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(orvaId.trim())) {
      setError("Enter a valid HealthOS ID, for example HOS-4H2K-9QX7");
      return;
    }
    setError("");
    setStep(2);
    log(`Identity located for ${orvaId.trim()}`);
  }

  function submitJustification(e) {
    e.preventDefault();
    if (justification.trim().length < 20) {
      setError("Describe the clinical situation in at least 20 characters");
      return;
    }
    if (scopes.length === 0) {
      setError("Select at least one scope");
      return;
    }
    setError("");
    setStep(3);
    log(`Access requested · ${reason} · ${duration} min · ${scopes.length} scopes`);
  }

  function verify() {
    if (!verified.photo || !verified.countersign) {
      setError("Both verification steps are required");
      return;
    }
    setError("");
    setStep(4);
    setSecondsLeft(duration * 60);
    log("Verification complete · access opened");
    addAuditEvent({
      actor: "Emergency — St. Cordelia",
      org: "St. Cordelia Hospital",
      action: "Emergency access opened",
      scope: scopes.join(", "),
      channel: "Emergency access",
      status: "Consented",
    });
    toast.success("Emergency access opened", { description: `${duration} minutes · ${scopes.length} scopes · member notified.` });
  }

  function closeSession() {
    setClosed(true);
    log("Session closed by clinician");
    addAuditEvent({
      actor: "Emergency — St. Cordelia",
      org: "St. Cordelia Hospital",
      action: "Emergency session closed",
      scope: scopes.join(", "),
      channel: "Emergency access",
      status: "Expired",
    });
    toast.success("Session closed", { description: "Access ended and the closure was written to the audit trail." });
  }

  const visibleScope = (key) => scopes.includes(key);

  return (
    <div className="mx-auto max-w-[880px]">
      <Link
        to="/"
        className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-subtle hover:text-brand-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Emergency overview
      </Link>

      <div className="orva-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-brand-forest px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15">
              <Siren className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13.5px] font-bold leading-tight">Emergency access request</p>
              <p className="text-[10.5px] text-white/70">Scoped · time-limited · audited</p>
            </div>
          </div>
          <ol className="flex items-center gap-1.5 text-[10.5px] font-semibold">
            {["Identify", "Justify", "Verify", "Access", "Close"].map((label, i) => (
              <li key={label} className="flex items-center gap-1.5">
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full ${
                    step > i ? "bg-white text-brand-forest" : step === i + 1 ? "bg-brand-lime text-brand-forest" : "bg-white/20 text-white/70"
                  }`}
                >
                  {step > i ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={`hidden sm:inline ${step === i + 1 ? "text-white" : "text-white/60"}`}>{label}</span>
              </li>
            ))}
          </ol>
        </div>

        {step === 1 && (
          <form onSubmit={identify} className="p-5">
            <p className="orva-label mb-1">Step 1</p>
            <h1 className="font-heading text-[21px] font-bold tracking-[-0.02em] text-brand-ink">Identify the member</h1>
            <p className="mt-1 text-[12.5px] leading-relaxed text-brand-subtle">
              Scan the member's HealthOS QR or enter their HealthOS ID. Identification alone does not reveal any record.
            </p>
            <div className="mt-4 max-w-[360px]">
              <Label htmlFor="orva" className="text-[11.5px] font-semibold">
                HealthOS ID
              </Label>
              <Input
                id="orva"
                value={orvaId}
                onChange={(e) => setOrvaId(e.target.value.toUpperCase())}
                placeholder="HOS-XXXX-XXXX"
                className={`mt-1 h-10 text-[14px] tracking-[0.06em] tnum ${error ? "border-brand-crit" : ""}`}
              />
              {error && <p className="mt-1 text-[11px] text-brand-crit">{error}</p>}
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-ink">
                <Fingerprint className="h-3.5 w-3.5 text-primary" /> Demonstration identity
              </p>
              <button
                type="button"
                onClick={() => setOrvaId(emergencySummary.orvaId)}
                className="mt-1 text-[11.5px] font-semibold text-primary hover:underline"
              >
                Use {emergencySummary.orvaId}
              </button>
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit" size="sm" className="h-9 gap-1.5 text-[12.5px]">
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submitJustification} className="p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="orva-label mb-1">Step 2</p>
                <h1 className="font-heading text-[21px] font-bold tracking-[-0.02em] text-brand-ink">Justify the request</h1>
              </div>
              <span className="rounded-full border border-brand-line bg-muted px-2.5 py-1 text-[10.5px] font-semibold tnum text-brand-subtle">
                {orvaId}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-[11.5px] font-semibold">Clinical reason</Label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-[12.5px]"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-[11.5px] font-semibold">Session duration</Label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-[12.5px]"
                >
                  {[15, 30, 60].map((d) => (
                    <option key={d} value={d}>
                      {d} minutes
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3">
              <Label className="text-[11.5px] font-semibold">Justification</Label>
              <Textarea
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Describe the clinical situation and why records are needed now."
                className={`mt-1 text-[13px] ${error && justification.trim().length < 20 ? "border-brand-crit" : ""}`}
              />
            </div>

            <p className="orva-label mb-1.5 mt-4">Scopes required</p>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {SCOPES.map((s) => {
                const on = scopes.includes(s.key);
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => setScopes((prev) => (on ? prev.filter((k) => k !== s.key) : [...prev, s.key]))}
                      className={`flex w-full items-start gap-2 rounded-lg border px-2.5 py-2 text-left ${
                        on ? "border-primary/35 bg-brand-mint/50" : "border-border"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${
                          on ? "border-primary bg-primary text-white" : "border-brand-line"
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

            {error && <p className="mt-2 text-[11px] text-brand-crit">{error}</p>}

            <div className="mt-5 flex justify-between">
              <Button type="button" size="sm" variant="outline" className="h-9 text-[12.5px]" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" size="sm" className="h-9 gap-1.5 text-[12.5px]">
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="p-5">
            <p className="orva-label mb-1">Step 3</p>
            <h1 className="font-heading text-[21px] font-bold tracking-[-0.02em] text-brand-ink">Verify the emergency</h1>
            <p className="mt-1 text-[12.5px] text-brand-subtle">
              Both steps are simulated in this phase. In production they require an authenticated emergency clinician.
            </p>

            <ul className="mt-4 space-y-2">
              {[
                { key: "photo", title: "Photo identification checked", detail: "Confirm the member's identity document" },
                { key: "countersign", title: "Countersigned by attending clinician", detail: "A second clinician confirms the emergency" },
              ].map((v) => (
                <li key={v.key}>
                  <button
                    type="button"
                    onClick={() => setVerified((prev) => ({ ...prev, [v.key]: !prev[v.key] }))}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${
                      verified[v.key] ? "border-primary/35 bg-brand-mint/50" : "border-border"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        verified[v.key] ? "border-primary bg-primary text-white" : "border-brand-line"
                      }`}
                    >
                      {verified[v.key] && <Check className="h-3 w-3" />}
                    </span>
                    <span>
                      <span className="block text-[12.5px] font-semibold text-brand-ink">{v.title}</span>
                      <span className="block text-[11px] text-brand-subtle">{v.detail}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-3 rounded-xl border border-brand-warn/25 bg-brand-warn/10 px-3 py-2.5">
              <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[#8a5f16]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Emergency access is for immediate care only. The member is notified and every scope opened is recorded.
              </p>
            </div>

            {error && <p className="mt-2 text-[11px] text-brand-crit">{error}</p>}

            <div className="mt-5 flex justify-between">
              <Button type="button" size="sm" variant="outline" className="h-9 text-[12.5px]" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="button" size="sm" className="h-9 gap-1.5 text-[12.5px]" onClick={verify}>
                <ShieldCheck className="h-3.5 w-3.5" /> Open access
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="orva-label mb-1">Step 4</p>
                <h1 className="font-heading text-[21px] font-bold tracking-[-0.02em] text-brand-ink">
                  {closed ? "Session closed" : "Emergency summary"}
                </h1>
              </div>
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 ${
                  closed || secondsLeft === 0 ? "border-border bg-muted text-brand-subtle" : "border-brand-crit/25 bg-brand-crit/10 text-brand-crit"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-[16px] font-bold tnum">{closed ? "00:00" : timer}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">{closed ? "closed" : "remaining"}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2">
              <p className="text-[12.5px] font-bold text-brand-ink">{emergencySummary.name}</p>
              <span className="text-[11px] tnum text-brand-subtle">{emergencySummary.orvaId}</span>
              <span className="text-[11px] text-brand-subtle">
                {emergencySummary.age}y · {emergencySummary.sex} · {emergencySummary.bloodType}
              </span>
              <StatusPill status={closed ? "Expired" : "Consented"} />
            </div>

            <p className="mt-2 text-[11px] text-brand-subtle">
              Reason: {reason} · {justification.trim() || "No justification recorded"} · scope: {scopes.join(", ")}
            </p>

            <div className={`mt-4 grid gap-2 sm:grid-cols-2 ${closed ? "opacity-50" : ""}`}>
              {visibleScope("allergies") && (
                <div className="rounded-xl border border-brand-crit/25 bg-brand-crit/5 p-3">
                  <p className="orva-label text-brand-crit">Allergies</p>
                  <ul className="mt-1.5 space-y-0.5 text-[12px] text-brand-ink">
                    {emergencySummary.allergies.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {visibleScope("medications") && (
                <div className="rounded-xl border border-border p-3">
                  <p className="orva-label">Current medications</p>
                  <ul className="mt-1.5 space-y-0.5 text-[12px] text-brand-ink">
                    {emergencySummary.medications.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
              {visibleScope("conditions") && (
                <div className="rounded-xl border border-border p-3">
                  <p className="orva-label">Active conditions</p>
                  <ul className="mt-1.5 space-y-0.5 text-[12px] text-brand-ink">
                    {emergencySummary.conditions.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {visibleScope("contacts") && (
                <div className="rounded-xl border border-border p-3">
                  <p className="orva-label">Emergency contact</p>
                  <p className="mt-1.5 text-[12px] text-brand-ink">{emergencySummary.contact}</p>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-border p-3">
              <p className="orva-label mb-1.5">Session audit trail</p>
              <ol className="space-y-1">
                {sessionLog.map((l, i) => (
                  <li key={`${l.text}-${i}`} className="flex justify-between text-[11px]">
                    <span className="text-brand-ink">{l.text}</span>
                    <span className="tnum text-brand-subtle">{l.at}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 flex flex-wrap justify-between gap-2">
              <Button type="button" size="sm" variant="outline" className="h-9 text-[12.5px]" onClick={() => setStep(2)} disabled={closed}>
                Adjust scope
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9 text-[12.5px]"
                  onClick={() => toast.success("Handover prepared", { description: "A scoped handover summary was generated for the receiving team." })}
                  disabled={closed}
                >
                  Prepare handover
                </Button>
                <Button type="button" size="sm" className="h-9 text-[12.5px]" onClick={closeSession} disabled={closed}>
                  Close session
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && closed && (
          <div className="border-t border-border bg-muted/40 px-5 py-3">
            <p className="text-[11.5px] text-brand-subtle">
              This session is closed. The member and the platform audit log both hold a record of what was opened, by
              whom, and why.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}