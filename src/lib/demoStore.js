import { useSyncExternalStore } from "react";
import { consentRequests, accessHistory } from "@/lib/data/orva";

/**
 * Small cross-page demonstration store: consent decisions made anywhere in the
 * member workspace immediately appear in consent management and the access
 * audit trail.
 */
let state = {
  consents: consentRequests.map((c) => ({ ...c })),
  audit: accessHistory.map((a) => ({ ...a })),
};

const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDemoState() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function addAuditEvent(event) {
  state = {
    ...state,
    audit: [{ id: `ah-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: "Just now", ...event }, ...state.audit],
  };
  emit();
}

export function decideConsent(id, decision) {
  const request = state.consents.find((c) => c.id === id);
  if (!request) return;
  state = {
    ...state,
    consents: state.consents.map((c) => (c.id === id ? { ...c, status: decision } : c)),
  };
  emit();
  addAuditEvent({
    actor: request.requester,
    org: request.org,
    action: decision === "granted" ? "Access request approved" : "Access request declined",
    scope: request.scopes.map((s) => s.label).join(", "),
    channel: "Consent decision",
    status: decision === "granted" ? "Consented" : "Denied",
  });
}

export function revokeConsent(id) {
  const request = state.consents.find((c) => c.id === id);
  if (!request) return;
  state = {
    ...state,
    consents: state.consents.map((c) => (c.id === id ? { ...c, status: "revoked" } : c)),
  };
  emit();
  addAuditEvent({
    actor: request.requester,
    org: request.org,
    action: "Consent revoked by member",
    scope: request.scopes.map((s) => s.label).join(", "),
    channel: "Consent management",
    status: "Revoked",
  });
}