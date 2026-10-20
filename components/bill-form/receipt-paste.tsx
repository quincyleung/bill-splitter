"use client";

// "Paste receipt text": the phone's own text recognition copies the receipt from a
// photo, and this turns it into items to check and tick. Nothing leaves the phone.

import { type Dispatch, type SetStateAction, useId, useState } from "react";
import { Button } from "@/components/ui/button";
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
  const uid = useId();
  const panelId = `${uid}panel`;
  const boxId = `${uid}receipt`;
  const [open, setOpen] = useState(draft.receiptText !== "");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  function read() {
    if (!draft.receiptText.trim()) {
      setError("Paste the receipt text first, or type the items instead.");
      requestFocus(`[id="${boxId}"]`);
      return;
    }
    const receipt = parseReceipt(draft.receiptText, DEFAULT_CURRENCY);
    if (receipt.items.length === 0) {
      setError("Couldn't find any prices in that text. Check you copied the receipt, or type the items instead.");
      requestFocus(`[id="${boxId}"]`);
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
    requestFocus(`[id="name-${items[0].key}"]`);
  }

  return (
    <div className="mb-4">
      <Button variant="secondary" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        Paste receipt text
      </Button>
      <div id={panelId} hidden={!open} className="mt-3 space-y-3">
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
        <Button variant="secondary" onClick={read}>
          Read receipt
        </Button>
      </div>
      <p role="status" className="type-small mt-2 text-ink-muted">
        {status}
      </p>
    </div>
  );
}
