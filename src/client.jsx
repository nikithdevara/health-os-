import { StrictMode, startTransition } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

// Ensure errors are visibly logged
if (typeof window !== "undefined") {
  window.__HEALTHOS_CLIENT_MOUNTED__ = true;
}

startTransition(() => {
  try {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>
    );
  } catch (err) {
    console.warn("Hydration failed, falling back to client render:", err);
    try {
      const root = createRoot(document);
      root.render(
        <StrictMode>
          <StartClient />
        </StrictMode>
      );
    } catch (renderErr) {
      console.error("Client render also failed:", renderErr);
    }
  }
});
