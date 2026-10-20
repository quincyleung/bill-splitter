"use client";

// "Paste receipt text": the phone's own text recognition copies the receipt from a
// photo, and this turns it into items to check and tick. Nothing leaves the phone.
// The box and Read receipt are in a pop-up; reading closes it and the items appear.

import { type Dispatch, type SetStateAction, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextArea } from "@/components/ui/text-area";
import type { Draft, DraftItem } from "@/lib/bill-draft";
import { createId } from "@/lib/id";
import { DEFAULT_CURRENCY, formatMoney, toInputAmount } from "@/lib/money";
import { parseReceipt } from "@/lib/receipt";

type ReceiptPasteProps = {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
  requestFocus: (selector: string) => void;
};

const isBlank = (item: DraftItem) => !item.name.trim() && !item.price.trim() && item.personIds.length === 0;

export function ReceiptPaste({ draft, setDraft, requestFocus }: ReceiptPasteProps) {
  const boxId = `${useId()}receipt`;
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState<string | null>(null);
  // Problems are read out inside the pop-up (the page behind it is out of reach).
  const [problem, setProblem] = useState("");
  const [status, setStatus] = useState("");

  function showProblem(message: string) {
    setError(message);
    // A trailing space alternates so the same problem is read out again.
    setProblem((previous) => (previous === message ? message + " " : message));
    document.getElementById(boxId)?.focus();
  }

  function read(close: () => void) {
    if (!draft.receiptText.trim()) {
      showProblem("Paste the receipt text first, or close this and type the items instead.");
      return;
    }
    const receipt = parseReceipt(draft.receiptText, DEFAULT_CURRENCY);
    if (receipt.items.length === 0) {
      showProblem("Couldn't find any prices in that text. Check you copied the receipt, or close this and type the items instead.");
      return;
    }
    const items: DraftItem[] = receipt.items.map((item) => ({
      key: createId(),
      name: item.name,
      price: toInputAmount(item.price, DEFAULT_CURRENCY),
      personIds: [],
      quantity: item.quantity,
    }));
    // Read items go below any already there; an untouched blank first item is replaced.
    setDraft((current) => ({
      ...current,
      items: [...current.items.filter((item) => !isBlank(item)), ...items],
      receipt: { subtotal: receipt.subtotal, total: receipt.total },
    }));
    setError(null);
    const subtotal = receipt.subtotal !== undefined ? `, subtotal ${formatMoney(receipt.subtotal, DEFAULT_CURRENCY)}` : "";
    setStatus(`Found ${items.length} ${items.length === 1 ? "item" : "items"}${subtotal}. Check them, then tick who had each one.`);
    close();
    requestFocus(`[id="name-${items[0].key}"]`);
  }

  return (
    <div className="mb-4">
      <Button ref={openerRef} variant="secondary" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        Paste receipt text
      </Button>
      <p role="status" className="type-small mt-2 text-ink-muted">
        {status}
      </p>
      {open && (
        <Dialog
          title="Paste receipt text"
          onClose={() => {
            setOpen(false);
            setError(null);
            openerRef.current?.focus();
          }}
          actions={(close) => (
            <>
              <Button variant="secondary" onClick={close}>
                Close
              </Button>
              <Button onClick={() => read(close)}>Read receipt</Button>
            </>
          )}
        >
          <TextArea
            id={boxId}
            label="Receipt text"
            hint="On iPhone, open the receipt photo, press and hold the text, tap Select All, then Copy. On Android, use Google Lens to copy the text."
            value={draft.receiptText}
            onChange={(event) => {
              setDraft((current) => ({ ...current, receiptText: event.target.value }));
              setError(null);
            }}
            error={error ?? undefined}
          />
          <p role="status" className="sr-only">
            {problem}
          </p>
        </Dialog>
      )}
    </div>
  );
}
