import Link from "next/link";
import { SectionLabel } from "@/components/home/section-label";
import { billHeadline } from "@/lib/bills";
import { formatDate } from "@/lib/dates";
import type { Bill, Person } from "@/lib/model";
import { formatMoney } from "@/lib/money";

/** The most recent bill, up top, with who still owes on it. The whole card opens the bill. */
export function LatestBill({ bill, people }: { bill: Bill; people: Person[] }) {
  return (
    <section aria-labelledby="latest-bill" className="mt-8">
      <SectionLabel id="latest-bill">Latest bill</SectionLabel>
      <Link
        href={`/bills/${bill.id}`}
        className="press mt-3 block rounded-card border border-line bg-surface p-5 hover:border-field hover:bg-accent-soft"
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="type-title text-ink">{bill.title}</span>
          <span className="type-title text-ink">{formatMoney(bill.total, bill.currency)}</span>
        </span>
        <span className="type-small block text-ink-muted">{formatDate(bill.date)}</span>
        <span className="mt-2 block font-semibold text-ink">{billHeadline(bill, people)}</span>
      </Link>
    </section>
  );
}
