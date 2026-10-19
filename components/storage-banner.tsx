"use client";

import { AlertIcon } from "@/components/ui/icons";
import { useAppData } from "@/lib/store";

/** Shown on every page when this browser won't save (e.g. private browsing). */
export function StorageBanner() {
  const state = useAppData();
  if (state.status !== "ready" || state.persistent) return null;
  return (
    <div className="border-b border-line bg-surface">
      <p className="mx-auto flex max-w-xl gap-2 px-4 py-3 text-sm font-semibold text-danger">
        <AlertIcon className="mt-0.5 size-4 shrink-0" />
        This browser isn&apos;t saving data, so bills will disappear when you close it. Turn off private browsing to keep
        them.
      </p>
    </div>
  );
}
