"use client";

// The bill page's actions: the ⋯ menu beside the name (with Delete bill), the
// "are you sure" pop-up, and Share summary for the group chat.

import { useRouter } from "next/navigation";
import { type RefObject, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { AlertIcon, MoreIcon } from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { withoutBill } from "@/lib/bills";
import { copyText } from "@/lib/clipboard";
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

/**
 * The "are you sure" pop-up: "Delete Dinner at Aba?", "This can't be undone.", then
 * Cancel and a red Delete bill. Focus starts on Cancel, the safe choice; Escape, Cancel
 * or a tap outside closes it.
 */
export function DeleteDialog({ bill, onCancel }: { bill: Bill; onCancel: () => void }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
    <Dialog
      title={`Delete ${bill.title}?`}
      description="This can't be undone."
      onClose={onCancel}
      actions={(close) => (
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="danger" onClick={remove}>
            Delete bill
          </Button>
        </>
      )}
    >
      {error && (
        <p role="alert" className="type-small flex items-start gap-2 font-semibold text-danger">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </Dialog>
  );
}

/**
 * One message for the whole group: the bill, who paid, and what each person owes
 * (with their items). It copies the text and says "Summary copied." to paste into the
 * group chat. (It used to open the system share sheet, which on a Mac showed a
 * "Plain Text" pop-up with the title and text run together, so it copies instead.)
 */
export function ShareSummaryButton({ bill, people }: { bill: Bill; people: Person[] }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  async function copySummary() {
    const copied = await copyText(groupSummary(bill, people));
    buttonRef.current?.focus({ preventScroll: true });
    showToast(copied ? "Summary copied." : "Couldn't copy. Try again.");
  }
  return (
    <Button ref={buttonRef} variant="secondary" fullWidth onClick={copySummary}>
      Share summary
    </Button>
  );
}
