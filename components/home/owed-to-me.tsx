"use client";

import Link from "next/link";
import { owedToMe } from "@/lib/balances";
import { formatMoney } from "@/lib/money";
import { personName } from "@/lib/people";
import { useAppData } from "@/lib/store";

/** Who owes me what across all bills: one row per person, with the bills it's for. */
export function OwedToMe() {
  const state = useAppData();
  if (state.status !== "ready") return null;
  const balances = owedToMe(state.data);
  if (balances.length === 0) return null;

  return (
    <section aria-labelledby="owed-to-me" className="mt-8">
      <h2 id="owed-to-me" className="type-title text-ink">
        Who owes you
      </h2>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
        {balances.map((balance) => (
          <li key={balance.personId} className="px-5 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold text-ink">{personName(balance.personId, state.data.people)}</span>
              <span className="font-semibold text-ink">
                {balance.totals.map((t) => formatMoney(t.amount, t.currency)).join(" · ")}
              </span>
            </div>
            <p className="type-small text-ink-muted">
              For{" "}
              {balance.bills.map(({ bill, amount }, index) => (
                <span key={bill.id}>
                  {index > 0 && ", "}
                  <Link href={`/bills/${bill.id}`} className="text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink">
                    {bill.title}
                  </Link>{" "}
                  ({formatMoney(amount, bill.currency)})
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
