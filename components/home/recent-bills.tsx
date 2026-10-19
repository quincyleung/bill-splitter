import Link from "next/link";
import { BillList } from "@/components/bills/bill-row";
import { SectionLabel } from "@/components/home/section-label";
import type { Bill } from "@/lib/model";

/** The bills after the latest one, newest first, and a way to see them all. */
export function RecentBills({ bills, total }: { bills: Bill[]; total: number }) {
  return (
    <section aria-labelledby="recent-bills" className="mt-8">
      <SectionLabel id="recent-bills">Recent bills</SectionLabel>
      <div className="mt-3">
        <BillList bills={bills} />
      </div>
      {total > bills.length + 1 && (
        <Link
          href="/bills"
          className="type-control mt-3 inline-flex min-h-11 items-center text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
        >
          See all {total} bills
        </Link>
      )}
    </section>
  );
}
