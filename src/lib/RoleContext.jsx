import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { roleConfig } from "@/lib/roles";

const RoleContext = createContext(null);

const STORAGE_KEY = "orva.role";

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState("member");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setRoleState(stored);
    } catch {
      /* storage unavailable — keep the default workspace */
    }
    setHydrated(true);
  }, []);

  const setRole = useCallback((next) => {
    setRoleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ role, setRole, hydrated, config: roleConfig(role) }),
    [role, setRole, hydrated],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}