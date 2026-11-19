import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileTabs from "./MobileTabs";
import AssistantPanel from "@/components/ai/AssistantPanel";
import { RoleProvider, useRole } from "@/lib/RoleContext";
import { AssistantProvider } from "@/lib/AssistantContext";

function Shell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { config } = useRole();
  const location = useLocation();
  const tabs = config.mobileTabs || [];

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-border lg:block">
        <Sidebar />
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[272px] p-0">
          <Sidebar onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-[248px]">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className={`mx-auto w-full max-w-[1320px] px-4 pt-5 sm:px-6 lg:px-8 ${tabs.length ? "pb-24 lg:pb-12" : "pb-12"}`}>
          {children}
        </main>
      </div>

      <MobileTabs items={tabs} pathname={location.pathname} />

      <AssistantPanel />
    </div>
  );
}

export default function AppShell({ children }) {
  return (
    <RoleProvider>
      <AssistantProvider>
        <Shell>{children}</Shell>
      </AssistantProvider>
    </RoleProvider>
  );
}