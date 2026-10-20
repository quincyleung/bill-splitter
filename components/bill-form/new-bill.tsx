"use client";

import { useCallback, useState } from "react";
import { LoadingShell } from "@/components/loading-shell";
import { UnreadableNotice } from "@/components/unreadable-notice";
import type { Preset } from "@/lib/bill-draft";
import { useAppData } from "@/lib/store";
import { BillForm } from "./bill-form";

/**
 * Waits for saved data (so today's date and saved people are only read in the
 * browser), then shows the form. After a save, a new key gives a fresh form:
 * Next keeps visited pages alive in the background, so without it the old
 * entries would still be there next time.
 */
export function NewBill({ preset, seriesId }: { preset: Preset; seriesId?: string }) {
  const state = useAppData();
  const [formKey, setFormKey] = useState(0);
  // Stable, so the form's "reset me once I'm hidden" effect doesn't fire on every render.
  const resetForm = useCallback(() => setFormKey((key) => key + 1), []);

  if (state.status === "loading") return <LoadingShell />;
  if (state.status === "unreadable") return <UnreadableNotice raw={state.raw} />;
  return (
    <BillForm
      // A different series (or none) is a different form, even if this page was kept alive.
      key={`${formKey}-${seriesId ?? ""}`}
      preset={preset}
      data={state.data}
      seriesId={seriesId}
      onSaved={resetForm}
    />
  );
}
