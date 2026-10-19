// Reading and writing AppData in localStorage. These functions never throw:
// every failure comes back as a result the UI can explain.
// Call them only in the browser; lib/store.ts makes sure of that.

import { type AppData, emptyData, isAppData } from "./model";

/** Versioned key. A future schema gets a new key and migrates from this one. */
export const STORAGE_KEY = "bill-splitter/v1";

export type LoadResult =
  /** persistent is false when this browser won't save (e.g. private browsing): data lives in memory only. */
  | { status: "ready"; data: AppData; persistent: boolean }
  /** Saved data exists but can't be read. raw is kept so it can be downloaded; it's never overwritten silently. */
  | { status: "unreadable"; raw: string };

export type SaveResult = { ok: true } | { ok: false; reason: "full" | "unavailable" | "unreadable" };

export function loadData(): LoadResult {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return { status: "ready", data: emptyData(), persistent: false };
  }

  if (raw === null) {
    return { status: "ready", data: emptyData(), persistent: canWrite() };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "unreadable", raw };
  }
  return isAppData(parsed) ? { status: "ready", data: parsed, persistent: true } : { status: "unreadable", raw };
}

export function saveData(data: AppData): SaveResult {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: isQuotaError(error) ? "full" : "unavailable" };
  }
}

/** Removes all saved data. Used by "Start fresh". */
export function clearData(): SaveResult {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

// Some browsers can read storage but refuse writes (older Safari private browsing),
// so a fresh start checks that writing works too.
function canWrite(): boolean {
  const probe = `${STORAGE_KEY}/probe`;
  try {
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function isQuotaError(error: unknown): boolean {
  return error instanceof DOMException && (error.name === "QuotaExceededError" || error.code === 22);
}
