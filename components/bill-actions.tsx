"use client";

// The bill page's actions: the "are you sure" pop-up behind ⋯ > Delete bill (the menu
// is the shared MoreMenu), and Share summary for the group chat.

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { AlertIcon } from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { withoutBill } from "@/lib/bills";
import { copyText } from "@/lib/clipboard";
import { groupSummary } from "@/lib/messages";
import type { Bill, Person } from "@/lib/model";
import { updateData } from "@/lib/store";

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
