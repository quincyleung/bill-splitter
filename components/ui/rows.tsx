import type { ReactNode } from "react";

// The one look for every list on the app (who owes you, recurring bills, recent bills,
// all bills): a limestone card of rows, each with a name, a small grey second line,
// and an amount or action on the right.

export function RowList({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">{children}</ul>;
}

/** Padding and layout for a row's contents, whether it's a link, or plain with an action. */
export const rowClass = "flex min-h-11 items-center justify-between gap-3 px-5 py-3";

export function RowText({ title, meta }: { title: ReactNode; meta: ReactNode }) {
  return (
    <span className="min-w-0">
      <span className="type-row block text-ink">{title}</span>
      <span className="type-small block text-ink-muted">{meta}</span>
    </span>
  );
}

export function RowValue({ children }: { children: ReactNode }) {
  return <span className="type-row shrink-0 text-ink">{children}</span>;
}
