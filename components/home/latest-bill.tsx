import Link from "next/link";
import { SectionLabel } from "@/components/home/section-label";
import { billHeadline } from "@/lib/bills";
import { formatDate } from "@/lib/dates";
import type { Bill, Person } from "@/lib/model";
import { formatMoney } from "@/lib/money";

/** The most recent bill, as a compact row with who still owes on it, so it doesn't compete with the new-bill cards. */
export function LatestBill({ bill, people }: { bill: Bill; people: Person[] }) {
  return (
    <section aria-labelledby="latest-bill" className="mt-8">
      <SectionLabel id="latest-bill">Latest bill</SectionLabel>
      <Link
        href={`/bills/${bill.id}`}
        className="press mt-3 flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-5 py-3 hover:border-field hover:bg-accent-soft"
      >
        <span>
          <span className="block font-semibold text-ink">{bill.title}</span>
          <span className="type-small block text-ink-muted">
            {formatDate(bill.date)} · {billHeadline(bill, people)}
          </span>
        </span>
        <span className="type-money text-ink">{formatMoney(bill.total, bill.currency)}</span>
      </Link>
    </section>
  );
}
