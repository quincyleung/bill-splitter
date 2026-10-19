import Link from "next/link";
import { paidStatus } from "@/lib/bills";
import { formatDate } from "@/lib/dates";
import type { Bill } from "@/lib/model";
import { formatMoney } from "@/lib/money";

/** A bill in a list: name, date and status, and the total. Links to the bill. */
export function BillRow({ bill }: { bill: Bill }) {
  return (
    <Link href={`/bills/${bill.id}`} className="flex min-h-11 items-center justify-between gap-3 px-5 py-3 hover:bg-accent-soft">
      <span>
        <span className="block font-semibold text-ink">{bill.title}</span>
        <span className="type-small block text-ink-muted">
          {formatDate(bill.date)} · {paidStatus(bill)}
        </span>
      </span>
      <span className="type-money text-ink">{formatMoney(bill.total, bill.currency)}</span>
    </Link>
  );
}

/** A Greek Summer list card of bills. */
export function BillList({ bills }: { bills: Bill[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
      {bills.map((bill) => (
        <li key={bill.id}>
          <BillRow bill={bill} />
        </li>
      ))}
    </ul>
  );
}
