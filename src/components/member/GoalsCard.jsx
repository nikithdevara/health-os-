import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { healthGoals } from "@/lib/data/orva";

export default function GoalsCard() {
  return (
    <div className="orva-card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-[15px] font-bold text-brand-ink">Health goals</h3>
        <Link to="/member/vitals" className="flex items-center gap-1 text-[11.5px] font-semibold text-primary hover:underline">
          Monitor <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <ul className="mt-3.5 space-y-3.5">
        {healthGoals.map((g) => (
          <li key={g.id}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[12.5px] font-medium text-brand-ink">{g.label}</p>
              <span className="text-[11px] font-semibold tnum text-brand-subtle">{g.progress}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${g.tone === "warn" ? "bg-brand-warn" : "bg-primary"}`}
                style={{ width: `${g.progress}%` }}
              />
            </div>
            <p className="mt-1 text-[10.5px] text-brand-subtle">{g.target}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}