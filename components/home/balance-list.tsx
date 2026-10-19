import Link from "next/link";
import { SectionLabel } from "@/components/home/section-label";
import type { Balance } from "@/lib/balances";
import { daysBetween, durationLabel, formatDate } from "@/lib/dates";
import type { Person } from "@/lib/model";
import { formatMoney } from "@/lib/money";
import { personName } from "@/lib/people";

type BalanceListProps = { id: string; title: string; balances: Balance[]; people: Person[]; today: string };

/** One row per person: how much, how long it's been unpaid, and the bills it's for. */
export function BalanceList({ id, title, balances, people, today }: BalanceListProps) {
  return (
    <section aria-labelledby={id} className="mt-8">
      <SectionLabel id={id}>{title}</SectionLabel>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
        {balances.map((balance) => {
          const days = daysBetween(balance.since, today);
          return (
            <li key={balance.personId} className="px-5 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-ink">{personName(balance.personId, people)}</span>
                <span className="font-semibold text-ink">
                  {balance.totals.map((t) => formatMoney(t.amount, t.currency)).join(" · ")}
                </span>
              </div>
              <p className="type-small text-ink-muted">
                <span className={days >= 30 ? "font-semibold text-ink" : undefined}>Unpaid {durationLabel(days)}</span>
                {" · For "}
                {balance.bills.map(({ bill, amount }, index) => (
                  <span key={bill.id}>
                    {index > 0 && ", "}
                    <Link
                      href={`/bills/${bill.id}`}
                      className="text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
                    >
                      {bill.title}
                    </Link>{" "}
                    ({formatDate(bill.date)}, {formatMoney(amount, bill.currency)})
                  </span>
                ))}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
