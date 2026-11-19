import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmptyState from "./EmptyState";

export default function RecordTable({
  columns = [],
  rows = [],
  searchKeys = [],
  searchPlaceholder = "Search…",
  filters = [],
  onRowClick,
  pageSize = 6,
  emptyTitle = "Nothing here yet",
  emptyBody = "Records will appear here once they are available.",
}) {
  const [query, setQuery] = useState("");
  const [filterState, setFilterState] = useState({});
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let out = rows;
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter((row) =>
        (searchKeys.length ? searchKeys : columns.map((c) => c.key)).some((key) =>
          String(row[key] ?? "").toLowerCase().includes(q),
        ),
      );
    }
    Object.entries(filterState).forEach(([key, value]) => {
      if (value && value !== "all") out = out.filter((row) => String(row[key]) === value);
    });
    if (sort.key) {
      out = [...out].sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av - bv : bv - av;
        return sort.dir === "asc"
          ? String(av ?? "").localeCompare(String(bv ?? ""))
          : String(bv ?? "").localeCompare(String(av ?? ""));
      });
    }
    return out;
  }, [rows, query, filterState, sort, searchKeys, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages - 1);
  const visible = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return (
    <div>
      <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-subtle" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="h-8 rounded-lg border-border bg-muted/50 pl-8 text-[12.5px]"
          />
        </div>
        {filters.map((f) => (
          <Select
            key={f.key}
            value={filterState[f.key] || "all"}
            onValueChange={(v) => {
              setFilterState((s) => ({ ...s, [f.key]: v }));
              setPage(0);
            }}
          >
            <SelectTrigger className="h-8 w-full rounded-lg border-border text-[12px] sm:w-[168px]">
              <span className="flex items-center gap-1.5 truncate">
                <SlidersHorizontal className="h-3 w-3 text-brand-subtle" />
                <SelectValue placeholder={f.label} />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {f.label.toLowerCase()}</SelectItem>
              {f.options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState title={emptyTitle} body={emptyBody} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.09em] text-brand-subtle ${
                      col.sortable ? "cursor-pointer select-none hover:text-brand-ink" : ""
                    } ${col.align === "right" ? "text-right" : ""}`}
                    onClick={() =>
                      col.sortable &&
                      setSort((s) => ({ key: col.key, dir: s.key === col.key && s.dir === "asc" ? "desc" : "asc" }))
                    }
                  >
                    {col.label}
                    {sort.key === col.key && <span className="ml-1">{sort.dir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr
                  key={row.id || i}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-border/70 last:border-0 ${
                    onRowClick ? "cursor-pointer hover:bg-brand-mint/40" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-[12.5px] text-brand-ink ${
                        col.align === "right" ? "text-right" : ""
                      } ${col.className || ""}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11.5px] text-brand-subtle">
        <span>
          {filtered.length === 0
            ? "0 records"
            : `${safePage * pageSize + 1}–${Math.min(filtered.length, (safePage + 1) * pageSize)} of ${filtered.length}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="grid h-7 w-7 place-items-center rounded-md border border-border disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="px-1 tnum">
            {safePage + 1} / {pages}
          </span>
          <button
            type="button"
            disabled={safePage >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="grid h-7 w-7 place-items-center rounded-md border border-border disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}