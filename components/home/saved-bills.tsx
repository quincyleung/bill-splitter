"use client";

import Link from "next/link";
import { paidStatus } from "@/lib/bills";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { useAppData } from "@/lib/store";

/** A plain list of saved bills, newest first, until the dashboard is built. */
export function SavedBills() {
  const state = useAppData();
  if (state.status !== "ready" || state.data.bills.length === 0) return null;
  const bills = [...state.data.bills].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <section aria-labelledby="saved-bills" className="mt-8">
      <h2 id="saved-bills" className="type-title text-ink">
        Your bills
      </h2>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
        {bills.map((bill) => (
          <li key={bill.id}>
            <Link href={`/bills/${bill.id}`} className="flex min-h-11 items-center justify-between gap-3 px-5 py-3 hover:bg-accent-soft">
              <span>
                <span className="block font-semibold text-ink">{bill.title}</span>
                <span className="type-small block text-ink-muted">
                  {formatDate(bill.date)} · {paidStatus(bill)}
                </span>
              </span>
              <span className="font-semibold text-ink">{formatMoney(bill.total, bill.currency)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
