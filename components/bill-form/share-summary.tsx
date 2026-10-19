"use client";

// The live "Who owes you" box at the bottom of the form. It updates as you type, so
// you can check it against the receipt before saving.

import { Card } from "@/components/ui/card";
import { AlertIcon } from "@/components/ui/icons";
import { type Draft, nameOf, previewDraft } from "@/lib/bill-draft";
import { ME, type Person } from "@/lib/model";
import { DEFAULT_CURRENCY, formatMoney } from "@/lib/money";

type ShareSummaryProps = { draft: Draft; people: Person[]; warnings: string[] };

export function ShareSummary({ draft, people, warnings }: ShareSummaryProps) {
  const preview = previewDraft(draft);
  const money = (amount: number) => formatMoney(Math.round(amount), DEFAULT_CURRENCY);
  const name = (id: string) => (id === ME ? "You" : nameOf(id, draft, people));
  const youPaid = draft.payerId === ME;
  const others = draft.ticked.filter((id) => id !== ME && id !== draft.payerId);
  const meOnBill = draft.ticked.includes(ME);

  let body;
  if (preview.state === "incomplete") {
    body = <p className="text-ink-muted">{preview.message}</p>;
  } else if (preview.state === "items-only") {
    body = (
      <>
        <ul className="divide-y divide-line">
          {draft.ticked.map((id) => (
            <li key={id} className="flex justify-between gap-3 py-2">
              <span className="text-ink">{id === ME ? "Your items" : name(id)}</span>
              <span className="font-semibold text-ink">{money(preview.itemTotals.get(id) ?? 0)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 type-small text-ink-muted">Plus tax and tip once you enter the total.</p>
      </>
    );
  } else {
    const share = (id: string) => preview.shares.get(id) ?? 0;
    const breakdown = (id: string) => {
      if (!preview.items) return null;
      const items = Math.round(preview.items.itemTotals.get(id) ?? 0);
      return `items ${money(items)} + ${money(share(id) - items)} tax and tip`;
    };
    const rows = youPaid ? draft.ticked.filter((id) => id !== ME) : others;
    body = (
      <>
        {!youPaid && meOnBill && (
          <p className="font-semibold text-ink">
            You owe {name(draft.payerId)} {money(share(ME))}
          </p>
        )}
        {!youPaid && rows.length > 0 && (
          <p className="mt-2 type-small text-ink-muted">Others&apos; shares, between them and {name(draft.payerId)}:</p>
        )}
        {youPaid && rows.length === 0 && (
          <p className="text-ink-muted">Add someone to see what they owe you.</p>
        )}
        <ul className="divide-y divide-line">
          {rows.map((id) => (
            <li key={id} className="flex justify-between gap-3 py-2">
              <span className="text-ink">
                {name(id)}
                {breakdown(id) && <span className="block type-small text-ink-muted">{breakdown(id)}</span>}
              </span>
              <span className="font-semibold text-ink">{money(share(id))}</span>
            </li>
          ))}
        </ul>
        {youPaid && meOnBill && <p className="mt-2 text-ink-muted">Your share {money(share(ME))}</p>}
        {preview.items && (
          <p className="mt-2 type-small text-ink-muted">
            Items {money(preview.items.subtotal)} · tax and tip {money(preview.total - preview.items.subtotal)} (
            {Math.round(((preview.total - preview.items.subtotal) / preview.items.subtotal) * 100)}%)
          </p>
        )}
      </>
    );
  }

  return (
    <Card as="section">
      <h2 className="type-title mb-2 text-ink">{youPaid ? "Who owes you" : `What you owe ${name(draft.payerId)}`}</h2>
      {body}
      {preview.state === "ready" && warnings.length > 0 && (
        <ul className="mt-3 space-y-2">
          {warnings.map((warning) => (
            <li key={warning} className="flex items-start gap-2 type-small font-semibold text-ink">
              <AlertIcon className="mt-0.5 size-4 shrink-0 text-danger" />
              {warning}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
