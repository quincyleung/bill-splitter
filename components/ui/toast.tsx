"use client";

// Short confirmations like "Saved". Call showToast() from anywhere; <Toaster /> sits in
// the root layout. The live region is always in the page, so screen readers announce
// each new message. The Dismiss button sits outside it, so it isn't read out as part
// of the message. The timer pauses while the toast is hovered or focused.

import { useEffect, useState, useSyncExternalStore } from "react";

type Toast = { id: number; message: string };

let current: Toast | null = null;
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function showToast(message: string) {
  current = { id: nextId++, message };
  emit();
}

function dismissToast(id: number) {
  if (current?.id !== id) return;
  current = null;
  emit();
}

const VISIBLE_MS = 6000;

export function Toaster() {
  const toast = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
  // Paused for one toast id only, so a new toast never inherits a stuck pause.
  const [pausedId, setPausedId] = useState<number | null>(null);
  const paused = toast !== null && pausedId === toast.id;

  useEffect(() => {
    if (!toast || paused) return;
    const timer = setTimeout(() => dismissToast(toast.id), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [toast, paused]);

  const pause = () => setPausedId(toast?.id ?? null);
  const resume = () => setPausedId(null);

  // The status region stays in the page even when empty (never display:none),
  // otherwise some screen readers miss the first message.
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        className={
          toast
            ? "pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl bg-ink py-2 pr-2 pl-4 text-canvas shadow-lg"
            : ""
        }
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
      >
        <div role="status" className="flex-1 text-base">
          {toast?.message}
        </div>
        {toast && (
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="min-h-11 rounded-lg px-3 font-semibold underline focus-visible:outline-canvas"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
