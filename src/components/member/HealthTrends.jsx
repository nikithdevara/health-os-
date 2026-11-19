import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { vitalsSeries } from "@/lib/data/orva";

const METRICS = [
  { key: "systolic", label: "Systolic BP", unit: "mmHg", domain: [100, 150] },
  { key: "restingHr", label: "Resting HR", unit: "bpm", domain: [50, 90] },
  { key: "weight", label: "Weight", unit: "kg", domain: [66, 72] },
];

export default function HealthTrends({ compact = false }) {
  const [metric, setMetric] = useState(METRICS[0]);
  const latest = vitalsSeries[vitalsSeries.length - 1];
  const first = vitalsSeries[0];
  const delta = (latest[metric.key] - first[metric.key]).toFixed(1);

  return (
    <div className="orva-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-[15px] font-bold text-brand-ink">Health trends</h3>
          <p className="mt-0.5 text-[11.5px] text-brand-subtle">Last six logged days</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-0.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMetric(m)}
              className={`rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
                metric.key === m.key ? "bg-card text-brand-ink shadow-sm" : "text-brand-subtle hover:text-brand-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-heading text-[26px] font-bold leading-none tracking-[-0.03em] tnum text-brand-ink">
          {latest[metric.key]}
        </span>
        <span className="text-[11.5px] font-medium text-brand-subtle">{metric.unit}</span>
        <span
          className={`ml-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold ${
            Number(delta) <= 0 ? "bg-brand-mint text-brand-forest" : "bg-brand-warn/10 text-[#8a5f16]"
          }`}
        >
          {Number(delta) > 0 ? "+" : ""}
          {delta} over 6 days
        </span>
      </div>

      <div className={`mt-3 w-full ${compact ? "h-[140px]" : "h-[176px]"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={vitalsSeries} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="orvaTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#087F5B" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#087F5B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#EEF3F0" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10.5, fill: "#73817B" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={metric.domain}
              tick={{ fontSize: 10.5, fill: "#73817B" }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E5EBE7",
                fontSize: 12,
                boxShadow: "0 12px 30px -20px rgba(7,94,71,.5)",
              }}
              formatter={(v) => [`${v} ${metric.unit}`, metric.label]}
            />
            <Area
              type="monotone"
              dataKey={metric.key}
              stroke="#087F5B"
              strokeWidth={2}
              fill="url(#orvaTrend)"
              dot={{ r: 2.5, fill: "#087F5B", strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}