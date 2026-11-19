import { useState } from "react";

const REGIONS = [
  { key: "head", label: "Head & neuro", count: 0 },
  { key: "chest", label: "Chest & heart", count: 4 },
  { key: "abdomen", label: "Abdomen", count: 1 },
  { key: "arm", label: "Arms", count: 1 },
  { key: "leg", label: "Legs", count: 0 },
];

export default function AnatomyMap({ active, onSelect }) {
  const [hover, setHover] = useState(null);
  const current = hover || active;
  const fill = (key) => (current === key ? "#087F5B" : "#DCEBE4");
  const stroke = (key) => (current === key ? "#075E47" : "#BFD5CA");

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-[15px] font-bold text-brand-ink">Body map</h3>
          <p className="mt-0.5 text-[11px] text-brand-subtle">Navigate your records by region</p>
        </div>
        <span className="rounded-full border border-brand-line bg-muted px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-brand-subtle">
          Navigational only
        </span>
      </div>

      <div className="mt-2 flex justify-center">
        <svg viewBox="0 0 200 320" className="h-[238px] w-auto" role="group" aria-label="Body map">
          <circle cx="100" cy="42" r="23" fill={fill("head")} stroke={stroke("head")} strokeWidth="1.5"
            onClick={() => onSelect?.("head")} onMouseEnter={() => setHover("head")} onMouseLeave={() => setHover(null)}
            className="cursor-pointer transition-colors" />
          <rect x="88" y="62" width="24" height="14" rx="6" fill={fill("head")} stroke={stroke("head")} strokeWidth="1.5" />
          <path d="M72 82c8-5 48-5 56 0l6 62c0 10-68 10-68 0z" fill={fill("chest")} stroke={stroke("chest")} strokeWidth="1.5"
            onClick={() => onSelect?.("chest")} onMouseEnter={() => setHover("chest")} onMouseLeave={() => setHover(null)}
            className="cursor-pointer transition-colors" />
          <path d="M66 148h68l-4 62c0 9-60 9-60 0z" fill={fill("abdomen")} stroke={stroke("abdomen")} strokeWidth="1.5"
            onClick={() => onSelect?.("abdomen")} onMouseEnter={() => setHover("abdomen")} onMouseLeave={() => setHover(null)}
            className="cursor-pointer transition-colors" />
          <rect x="42" y="84" width="18" height="104" rx="9" fill={fill("arm")} stroke={stroke("arm")} strokeWidth="1.5"
            onClick={() => onSelect?.("arm")} onMouseEnter={() => setHover("arm")} onMouseLeave={() => setHover(null)}
            className="cursor-pointer transition-colors" />
          <rect x="140" y="84" width="18" height="104" rx="9" fill={fill("arm")} stroke={stroke("arm")} strokeWidth="1.5"
            onClick={() => onSelect?.("arm")} onMouseEnter={() => setHover("arm")} onMouseLeave={() => setHover(null)}
            className="cursor-pointer transition-colors" />
          <rect x="74" y="204" width="21" height="96" rx="10" fill={fill("leg")} stroke={stroke("leg")} strokeWidth="1.5"
            onClick={() => onSelect?.("leg")} onMouseEnter={() => setHover("leg")} onMouseLeave={() => setHover(null)}
            className="cursor-pointer transition-colors" />
          <rect x="105" y="204" width="21" height="96" rx="10" fill={fill("leg")} stroke={stroke("leg")} strokeWidth="1.5"
            onClick={() => onSelect?.("leg")} onMouseEnter={() => setHover("leg")} onMouseLeave={() => setHover(null)}
            className="cursor-pointer transition-colors" />
          <circle cx="88" cy="110" r="4" fill="#D6F57B" stroke="#075E47" strokeWidth="1" />
        </svg>
      </div>

      <ul className="mt-1 space-y-1">
        {REGIONS.map((r) => (
          <li key={r.key}>
            <button
              type="button"
              onClick={() => onSelect?.(r.key)}
              onMouseEnter={() => setHover(r.key)}
              onMouseLeave={() => setHover(null)}
              className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[12px] transition-colors ${
                active === r.key ? "bg-brand-mint text-brand-forest font-semibold" : "text-brand-ink hover:bg-muted"
              }`}
            >
              {r.label}
              <span className="text-[10.5px] text-brand-subtle">{r.count} records</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}