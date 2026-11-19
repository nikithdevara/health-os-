import { Link } from "@tanstack/react-router";

export default function MobileTabs({ items = [], pathname = "" }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border bg-card/95 py-2 backdrop-blur lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
