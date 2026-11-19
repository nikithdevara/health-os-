import { useEffect, useState } from "react";
import { X, Mic, Pencil, Check } from "lucide-react";

const PHRASE = "Reschedule my cardiology review to Monday afternoon";
const BARS = [10, 18, 26, 14, 30, 22, 12, 34, 20, 28, 16, 24, 32, 18, 26, 12, 30, 20, 24, 14, 28, 18, 22, 32, 16, 26, 12, 20];

function clock(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VoiceOverlay({ open, onClose, onDone }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    setElapsed(0);
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  const revealed = PHRASE.slice(0, Math.min(PHRASE.length, 10 + elapsed * 8));
  const pending = PHRASE.slice(revealed.length, revealed.length + PHRASE.slice(revealed.length).indexOf(" "));

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-background/70 backdrop-blur-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="HealthOS AI voice input"
      onClick={onClose}
    >
      <div className="w-full max-w-[430px] px-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold text-brand-ink shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-crit" />
            Listening
            <span className="tnum ml-1 text-brand-subtle">{clock(elapsed)}</span>
          </span>
        </div>

        <div className="relative mx-auto mt-10 grid h-[136px] w-[136px] place-items-center">
          <span className="absolute h-[136px] w-[136px] animate-ping rounded-full bg-brand-carbon/10 [animation-duration:3.2s]" />
          <span className="absolute h-[108px] w-[108px] animate-ping rounded-full bg-brand-carbon/10 [animation-delay:600ms] [animation-duration:3.2s]" />
          <span className="absolute h-[84px] w-[84px] animate-ping rounded-full bg-brand-carbon/15 [animation-delay:1200ms] [animation-duration:3.2s]" />
          <span className="relative grid h-[76px] w-[76px] place-items-center rounded-full bg-brand-carbon text-brand-lime shadow-[0_18px_44px_rgba(23,43,36,0.28)]">
            <Mic className="h-7 w-7" />
          </span>
        </div>

        <div className="mt-9 flex h-10 items-center justify-center gap-[3px]" aria-hidden="true">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="w-[3px] origin-center rounded-full bg-brand-carbon/70 animate-wave"
              style={{ height: `${h}px`, animationDelay: `${(i % 7) * 90}ms` }}
            />
          ))}
        </div>

        <p className="mt-7 min-h-[56px] text-center font-heading text-[19px] font-bold leading-snug tracking-[-0.02em] text-brand-ink">
          {revealed}
          <span className="text-brand-subtle/50">{pending}</span>
        </p>

        <div className="mt-8 flex items-start justify-center gap-10">
          <button type="button" onClick={onClose} className="flex flex-col items-center gap-1.5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-card text-brand-ink shadow-sm">
              <X className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-medium text-brand-subtle">Cancel</span>
          </button>

          <button type="button" onClick={() => onDone(PHRASE)} className="flex flex-col items-center gap-1.5">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-carbon text-brand-carbon shadow-[0_12px_28px_rgba(23,43,36,0.22)]">
              <span className="h-4 w-4 rounded-full bg-brand-lime" />
            </span>
            <span className="text-[10px] font-semibold text-brand-ink">Done</span>
          </button>

          <button
            type="button"
            onClick={() => onDone(revealed)}
            className="flex flex-col items-center gap-1.5"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-card text-brand-ink shadow-sm">
              <Pencil className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-medium text-brand-subtle">Type instead</span>
          </button>
        </div>

        <p className="mt-9 flex items-center justify-center gap-1.5 text-center text-[10.5px] leading-relaxed text-brand-subtle">
          <Check className="h-3 w-3 text-brand-forest" />
          Speak naturally — “show my lipids”, “book a review”, “summarise my week”.
        </p>
      </div>
    </div>
  );
}