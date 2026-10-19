// The app's saved data as a React store.
//
// The server and the first (hydration) render always see { status: "loading" },
// so the HTML matches and there are no hydration errors. localStorage is read
// only in the browser, after hydration, via useSyncExternalStore.

import { useSyncExternalStore } from "react";
import { type AppData, emptyData } from "./model";
import { clearData, type LoadResult, loadData, type SaveResult, saveData } from "./storage";

export type StoreState = { status: "loading" } | LoadResult;

const LOADING: StoreState = { status: "loading" };

let current: LoadResult | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): StoreState {
  current ??= loadData();
  return current;
}

function getServerSnapshot(): StoreState {
  return LOADING;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(next: LoadResult) {
  current = next;
  for (const listener of listeners) listener();
}

export function useAppData(): StoreState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Applies a change and saves it. If saving fails, nothing changes in memory
 * either, so the screen always shows what's really saved and the form keeps
 * what was typed.
 */
export function updateData(change: (data: AppData) => AppData): SaveResult {
  const state = getSnapshot();
  if (state.status !== "ready") return { ok: false, reason: "unreadable" };

  const data = change(state.data);
  if (state.persistent) {
    const result = saveData(data);
    if (!result.ok) return result;
  }
  commit({ status: "ready", data, persistent: state.persistent });
  return { ok: true };
}

/** "Start fresh": deletes saved data, including unreadable data. */
export function resetData(): SaveResult {
  const result = clearData();
  if (result.ok) commit({ status: "ready", data: emptyData(), persistent: true });
  return result;
}
