"use client";

import { useState } from "react";
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
export function NewBill({ preset }: { preset: Preset }) {
  const state = useAppData();
  const [formKey, setFormKey] = useState(0);

  if (state.status === "loading") return <LoadingShell />;
  if (state.status === "unreadable") return <UnreadableNotice raw={state.raw} />;
  return (
    <BillForm
      key={formKey}
      preset={preset}
      people={state.data.people}
      onSaved={() => setFormKey((key) => key + 1)}
    />
  );
}
