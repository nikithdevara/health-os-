import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AssistantContext = createContext(null);

export function AssistantProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState(null);

  const openAssistant = useCallback((prompt) => {
    setSeed(prompt || null);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, openAssistant, seed, setSeed }),
    [open, openAssistant, seed],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) return { open: false, setOpen: () => {}, openAssistant: () => {}, seed: null, setSeed: () => {} };
  return ctx;
}