export function fmtNum(n) {
  return Number(n || 0).toLocaleString("en-US");
}

export function fmtDate(iso, opts = {}) {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
    ...opts,
  });
}

export function fmtDateShort(iso) {
  return fmtDate(iso, { year: undefined });
}

export function daysFromToday(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.round((d - today) / 86400000);
}

export function relativeLabel(iso) {
  const diff = daysFromToday(iso);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < 0) return `${Math.abs(diff)} days ago`;
  return `In ${diff} days`;
}