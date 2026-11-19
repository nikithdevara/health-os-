const TONES = {
  ok: ["Published", "Verified", "Confirmed", "Active", "Consented", "Dispensed", "Validated", "Signed", "Normal", "Allowed", "Ready to dispense", "Recorded", "Completed", "Granted", "Reviewed"],
  warn: ["Awaiting consent", "Under review", "Verification required", "Processing", "Sample received", "Pending", "Moderate", "Awaiting collection", "Invited", "Expiring", "Routine", "Changed"],
  bad: ["High", "Denied", "Suspended", "Blocked", "Abnormal", "Urgent", "Expired", "Revoked", "Declined"],
};

function toneFor(status) {
  if (!status) return "neutral";
  if (TONES.ok.includes(status)) return "ok";
  if (TONES.warn.includes(status)) return "warn";
  if (TONES.bad.includes(status)) return "bad";
  return "neutral";
}

const CLASSES = {
  ok: "bg-brand-mint text-brand-forest border-brand-mint",
  warn: "bg-brand-warn/10 text-[#8a5f16] border-brand-warn/25",
  bad: "bg-brand-crit/10 text-brand-crit border-brand-crit/25",
  neutral: "bg-muted text-brand-subtle border-border",
};

export default function StatusPill({ status, className = "" }) {
  const tone = toneFor(status);
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${CLASSES[tone]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}