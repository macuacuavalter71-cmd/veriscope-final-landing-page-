/**
 * Anonymous visitor session.
 *
 * A random UUID stored in localStorage under "veriscope_session_id".
 * It is attached to every order so the funnel can tell which purchases belong
 * to the same person — no e-mail, no name, no personal data.
 */
export const SESSION_STORAGE_KEY = "veriscope_session_id";

function randomUuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Returns the visitor session id, creating and persisting it on first visit. */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const created = randomUuid();
    window.localStorage.setItem(SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    // Storage unavailable: fall back to a per-page-load id so nothing crashes.
    return randomUuid();
  }
}
