import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, LogOut, Menu, Search, ShieldCheck, Sparkles, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useRole } from "@/lib/RoleContext";
import { useAssistant } from "@/lib/AssistantContext";
import { notifications } from "@/lib/data/orva";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Topbar({ onOpenMenu }) {
  const { config, role } = useRole();
  const { openAssistant } = useAssistant();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);

  const currentLabel = useMemo(() => {
    const items = config.nav.flatMap((g) => g.items);
    const match = items
      .filter((i) => !i.soon)
      .sort((a, b) => b.to.length - a.to.length)
      .find((i) => (i.exact ? location.pathname === i.to : location.pathname.startsWith(i.to)));
    return match?.label || "Overview";
  }, [config, location.pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = config.nav.flatMap((g) => g.items).filter((i) => !i.soon);
    return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  }, [query, config]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-brand-ink lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-[12.5px] sm:flex">
          <span className="text-brand-subtle">{config.label}</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-brand-subtle/60" />
          <span className="truncate font-semibold text-brand-ink">{currentLabel}</span>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[12.5px] text-brand-subtle transition-colors hover:border-brand-line hover:text-brand-ink md:flex"
          >
            <Search className="h-3.5 w-3.5" />
            Search
            <kbd className="ml-4 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-brand-subtle">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-brand-ink md:hidden"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <Button
            size="sm"
            onClick={() => openAssistant()}
            className="h-9 gap-1.5 rounded-lg px-2.5 text-[12.5px] font-semibold sm:px-3"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask HealthOS</span>
          </Button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setBellOpen((v) => !v)}
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-brand-ink"
              aria-label="Notifications"
              aria-expanded={bellOpen}
            >
              <Bell className="h-4 w-4" strokeWidth={1.8} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
            </button>
            {bellOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[320px] rounded-xl border border-border bg-card p-3 shadow-[0_24px_60px_-30px_rgba(7,94,71,0.4)]">
                <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-brand-subtle">
                  Notifications
                </p>
                <ul className="space-y-1">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="rounded-lg px-2 py-2 hover:bg-muted"
                    >
                      <p className="text-[12.5px] font-semibold leading-snug text-brand-ink">{n.title}</p>
                      <p className="mt-0.5 text-[11px] text-brand-subtle">{n.meta}</p>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setBellOpen(false);
                    openAssistant();
                  }}
                  className="mt-2 w-full rounded-lg bg-brand-mint px-3 py-2 text-[12px] font-semibold text-brand-forest hover:bg-brand-mint/70"
                >
                  Review with HealthOS assistant
                </button>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-0.5 grid h-9 w-9 place-items-center rounded-full bg-brand-forest text-[11.5px] font-bold text-white"
                aria-label="Account menu"
              >
                {config.initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[248px]">
              <DropdownMenuLabel className="font-normal">
                <p className="text-[13px] font-semibold text-brand-ink">{config.name}</p>
                <p className="text-[11px] text-brand-subtle">{user?.email || "Signed in · demonstration"}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="cursor-pointer gap-2">
                  <User className="h-4 w-4" /> Overview
                </Link>
              </DropdownMenuItem>
              {role === "member" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/member/identity" className="cursor-pointer gap-2">
                      <ShieldCheck className="h-4 w-4" /> HealthOS ID & privacy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/member/consent" className="cursor-pointer gap-2">
                      <ShieldCheck className="h-4 w-4" /> Access & consent
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => logout()}>
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-[12%] max-w-[520px] translate-y-0 gap-0 p-0">
          <DialogTitle className="sr-only">Search HealthOS</DialogTitle>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-brand-subtle" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search records, people, actions…"
              className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="max-h-[320px] overflow-y-auto p-2">
            {results.length === 0 && (
              <p className="px-3 py-6 text-center text-[12.5px] text-brand-subtle">
                Nothing matches “{query}”. Try a different term.
              </p>
            )}
            {results.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                    navigate({ to: item.to });
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] text-brand-ink hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-brand-subtle" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}