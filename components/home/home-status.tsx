"use client";

import { UnreadableNotice } from "@/components/unreadable-notice";
import { useAppData } from "@/lib/store";

/** Above the quick starts: a one-line welcome on a first visit, or the unreadable-data notice. */
export function HomeStatus() {
  const state = useAppData();
  if (state.status === "loading") return null;
  if (state.status === "unreadable") {
    return (
      <div className="mt-4">
        <UnreadableNotice raw={state.raw} />
      </div>
    );
  }
  if (state.data.bills.length > 0) return null;
  return (
    <p className="mt-2 text-base text-ink-muted">
      Pick one to start. Everything stays on this phone, and your friends don&apos;t need the app.
    </p>
  );
}
