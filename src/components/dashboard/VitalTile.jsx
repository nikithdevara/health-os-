import Sparkline from "./Sparkline";

function Ring({ progress, size = 28 }) {
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-brand-carbon" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" opacity="0.14" strokeWidth="3" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${c * progress} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export default function VitalTile({ tile, icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-2.5 py-1.5">
      <div className="min-w-0">
        <p className="flex items-center gap-1 text-[10px] font-medium text-brand-subtle">
          {Icon && <Icon className="h-2.5 w-2.5" />}
          {tile.label}
        </p>
        <p className="tnum text-[13px] font-bold leading-tight text-brand-ink">
          {tile.value}
          <span className="ml-0.5 text-[9.5px] font-medium text-brand-subtle">{tile.unit}</span>
        </p>
      </div>
      {tile.kind === "spark" ? (
        <Sparkline values={tile.series} className="h-6 w-[64px] shrink-0" height={24} width={64} />
      ) : (
        <Ring progress={tile.progress} />
      )}
    </div>
  );
}