"use client";

// Saved data exists but can't be read. Nothing is wiped silently: download a copy,
// or start fresh after confirming.

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { showToast } from "@/components/ui/toast";
import { todayIso } from "@/lib/dates";
import { resetData } from "@/lib/store";

export function UnreadableNotice({ raw }: { raw: string }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const startFreshRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  function download() {
    const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `bill-splitter-data-${todayIso()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function startFresh() {
    const result = resetData();
    if (result.ok) showToast("Started fresh.");
    else setError("Couldn't delete the saved data. Try again.");
  }

  function cancel() {
    setConfirming(false);
    startFreshRef.current?.focus();
  }

  return (
    <Card as="section">
      <h2 className="text-lg font-bold text-ink">Couldn&apos;t read your saved bills</h2>
      <p className="mt-2 text-base text-ink">
        They may be damaged, or saved by a newer version of this app. Nothing has been deleted. Download a copy to keep
        it, or start fresh.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={download}>
          Download my data
        </Button>
        <Button ref={startFreshRef} variant="secondary" onClick={() => setConfirming(true)}>
          Start fresh
        </Button>
      </div>
      {confirming && (
        <div ref={confirmRef} tabIndex={-1} className="mt-4 rounded-xl border-2 border-danger p-4 outline-none">
          <p className="font-semibold text-ink">
            Delete everything saved on this phone and start fresh? This can&apos;t be undone.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={startFresh}>Delete and start fresh</Button>
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 font-semibold text-danger">
          {error}
        </p>
      )}
    </Card>
  );
}
