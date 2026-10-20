"use client";

// The bill page's actions: the ⋯ menu beside the name (with Delete bill), the
// "are you sure" question, and Share summary for the group chat.

import { useRouter } from "next/navigation";
import { type RefObject, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertIcon, MoreIcon } from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { withoutBill } from "@/lib/bills";
import { shareText } from "@/lib/clipboard";
import { groupSummary } from "@/lib/messages";
import type { Bill, Person } from "@/lib/model";
import { updateData } from "@/lib/store";

type BillMenuProps = {
  title: string;
  onDelete: () => void;
  /** The ⋯ button, so focus can come back to it after Cancel. */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

/**
 * "More options" (⋯) on the right of the bill's name. A disclosure with one item,
 * Delete bill. It closes on Escape (focus back to ⋯), on tapping outside, or when
 * focus leaves it.
 */
export function BillMenu({ title, onDelete, triggerRef }: BillMenuProps) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstItemRef.current?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, triggerRef]);

  return (
    <div
      ref={wrapRef}
      className="relative shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
        className="press inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-accent-soft"
      >
        <MoreIcon />
        <span className="sr-only">More options for {title}</span>
      </button>
      <div
        id={menuId}
        hidden={!open}
        className="absolute top-full right-0 z-10 mt-1 w-48 overflow-hidden rounded-field border border-field bg-surface"
      >
        <button
          ref={firstItemRef}
          type="button"
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
          className="type-control flex min-h-11 w-full items-center px-4 text-left text-danger hover:bg-accent-soft"
        >
          Delete bill
        </button>
      </div>
    </div>
  );
}

/** "Delete Dinner at Aba? This can't be undone." with a red Delete bill and Cancel. Takes focus when it opens. */
export function DeleteQuestion({ bill, onCancel }: { bill: Bill; onCancel: () => void }) {
  const router = useRouter();
  const questionId = useId();
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function remove() {
    const result = updateData((data) => withoutBill(data, bill.id));
    if (!result.ok) {
      setError("Couldn't delete it. Try again.");
      return;
    }
    showToast(`Deleted ${bill.title}.`);
    router.push("/");
  }

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="group"
      aria-labelledby={questionId}
      className="mt-4 rounded-card border border-danger bg-surface p-5 outline-none"
    >
      <p id={questionId} className="font-semibold text-ink">
        Delete {bill.title}? This can&apos;t be undone.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="danger" onClick={remove}>
          Delete bill
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {error && (
        <p role="alert" className="type-small mt-3 flex items-start gap-2 font-semibold text-danger">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * One message for the whole group: the bill, who paid, and what each person owes
 * (with their items). Opens the phone's share sheet, or copies it where there isn't one.
 */
export function ShareSummaryButton({ bill, people }: { bill: Bill; people: Person[] }) {
  async function share() {
    const result = await shareText(bill.title, groupSummary(bill, people));
    if (result === "copied") showToast("Copied the summary. Paste it into your group chat.");
    if (result === "failed") showToast("Couldn't share or copy. Try again.");
  }
  return (
    <Button variant="secondary" fullWidth onClick={share}>
      Share summary
    </Button>
  );
}
