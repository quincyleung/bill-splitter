"use client";

import { BillList } from "@/components/bills/bill-row";
import { LoadingShell } from "@/components/loading-shell";
import { UnreadableNotice } from "@/components/unreadable-notice";
import { ButtonLink } from "@/components/ui/button-link";
import { newestFirst } from "@/lib/bills";
import type { Bill } from "@/lib/model";
import { useAppData } from "@/lib/store";

/** Every bill, newest first, grouped by the month of the bill. */
export function AllBills() {
  const state = useAppData();
  if (state.status === "loading") return <LoadingShell />;
  if (state.status === "unreadable") return <UnreadableNotice raw={state.raw} />;
  if (state.data.bills.length === 0) {
    return (
      <>
        <p className="text-ink">No bills yet.</p>
        <div className="mt-4">
          <ButtonLink href="/">Split a bill</ButtonLink>
        </div>
      </>
    );
  }

  const months = new Map<string, Bill[]>();
  for (const bill of newestFirst(state.data.bills)) {
    const month = bill.date.slice(0, 7);
    months.set(month, [...(months.get(month) ?? []), bill]);
  }
  const monthName = (month: string) =>
    new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(`${month}-15T12:00:00`));

  return (
    <div className="space-y-8">
      {[...months].map(([month, bills]) => (
        <section key={month} aria-labelledby={`month-${month}`}>
          <h2 id={`month-${month}`} className="type-label text-ink-muted">
            {monthName(month)}
          </h2>
          <div className="mt-3">
            <BillList bills={bills} />
          </div>
        </section>
      ))}
    </div>
  );
}
