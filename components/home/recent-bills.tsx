import Link from "next/link";
import { BillList } from "@/components/bills/bill-row";
import { SectionLabel } from "@/components/home/section-label";
import { Card } from "@/components/ui/card";
import type { Bill, Person } from "@/lib/model";

/** The newest bills, latest at the top, and a way to see them all. With none (all deleted), a short note. */
export function RecentBills({ bills, people, total }: { bills: Bill[]; people: Person[]; total: number }) {
  return (
    <section aria-labelledby="recent-bills" className="mt-8">
      <SectionLabel id="recent-bills">Recent bills</SectionLabel>
      <div className="mt-3">
        {bills.length === 0 ? (
          <Card>
            <p className="text-ink-muted">No bills right now.</p>
          </Card>
        ) : (
          <BillList bills={bills} people={people} />
        )}
      </div>
      {total > bills.length && (
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
