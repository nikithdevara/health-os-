import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole } from "@/lib/RoleContext";
import { ROLE_OPTIONS } from "@/lib/roles";

export function OrvaMark({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-[11px] bg-brand text-white shadow-[0_6px_16px_-8px_rgba(7,94,71,0.8)]">
        <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" aria-hidden="true">
          <path
            d="M12 3.2c2.6 0 4.2 1.7 4.2 4.1 0 2.5-1.7 4.2-4.2 4.2S7.8 9.8 7.8 7.3C7.8 4.9 9.4 3.2 12 3.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M4.6 20.4c0-3.4 3.3-5.6 7.4-5.6s7.4 2.2 7.4 5.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="7.3" r="1.5" fill="currentColor" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-heading text-[19px] font-extrabold tracking-[-0.04em] text-brand-ink">
            HealthOS
          </span>
          <span className="mt-1 block text-[9.5px] font-semibold uppercase tracking-[0.16em] text-brand-subtle">
            Health, connected
          </span>
        </span>
      )}
    </div>
  );
}

export const HealthOSMark = OrvaMark;

export default function Sidebar({ onNavigate }) {
  const { role, setRole, config } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="px-5 pb-4 pt-5">
        <Link to="/" onClick={onNavigate} aria-label="HealthOS home">
          <HealthOSMark />
        </Link>
      </div>

      <div className="px-3 pb-4">
        <Select
          value={role}
          onValueChange={(next) => {
            setRole(next);
            onNavigate?.();
            navigate({ to: "/" });
          }}
        >
          <SelectTrigger className="h-auto w-full gap-2 rounded-xl border-border bg-muted/60 px-3 py-2 text-left hover:bg-muted focus:ring-1">
            <div className="min-w-0">
              <span className="block text-[9.5px] font-semibold uppercase tracking-[0.14em] text-brand-subtle">
                Workspace
              </span>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent align="start" className="w-[236px]">
            {ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.id} value={opt.id} className="cursor-pointer">
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="flex flex-col">
                    <span className="text-[13px] font-semibold">{opt.label}</span>
                    <span className="text-[11px] text-muted-foreground">{opt.workspace}</span>
                  </span>
                  {role === opt.id && <Check className="h-3.5 w-3.5 text-primary" />}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <nav className="orva-scroll flex-1 overflow-y-auto px-3 pb-4">
        {config.nav.map((group) => (
          <div key={group.group} className="mb-5">
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-brand-subtle/80">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                if (item.soon) {
                  return (
                    <li key={item.to}>
                      <span className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-brand-subtle/70">
                        <Icon className="h-4 w-4" strokeWidth={1.7} />
                        <span className="flex-1">{item.label}</span>
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand-subtle">
                          Soon
                        </span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                        active
                          ? "bg-brand-mint text-brand-forest"
                          : "text-brand-ink/75 hover:bg-muted hover:text-brand-ink"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${active ? "text-primary" : "text-brand-subtle"}`}
                        strokeWidth={1.7}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-forest text-[11px] font-bold text-white">
            {config.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-brand-ink">{config.name}</p>
            <p className="truncate text-[11px] text-brand-subtle">{config.workspace}</p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[10px] leading-tight text-brand-subtle">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-lime" />
          Demonstration environment · synthetic data
        </p>
      </div>
    </div>
  );
}