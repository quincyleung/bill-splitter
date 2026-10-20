import Link from "next/link";
import { SectionLabel } from "@/components/home/section-label";
import { RowList, RowText, RowValue, rowClass } from "@/components/ui/rows";
import type { Balance } from "@/lib/balances";
import { daysBetween, durationLabel, formatDate } from "@/lib/dates";
import type { Person } from "@/lib/model";
import { formatMoney } from "@/lib/money";
import { personName } from "@/lib/people";

type BalanceListProps = { id: string; title: string; balances: Balance[]; people: Person[]; today: string };

/**
 * One row per person: how much (on the right), then how long it's been unpaid and the
 * bills it's for, with their dates. Amounts aren't repeated under the name.
 */
export function BalanceList({ id, title, balances, people, today }: BalanceListProps) {
  return (
    <section aria-labelledby={id} className="mt-8">
      <SectionLabel id={id}>{title}</SectionLabel>
      <div className="mt-3">
        <RowList>
          {balances.map((balance) => {
            const days = daysBetween(balance.since, today);
            return (
              <li key={balance.personId} className={rowClass}>
                <RowText
                  title={personName(balance.personId, people)}
                  meta={
                    <>
                      <span className={days >= 30 ? "font-semibold text-ink" : undefined}>
                        Unpaid {durationLabel(days)}
                      </span>
                      {" · For "}
                      {balance.bills.map(({ bill }, index) => (
                        <span key={bill.id}>
                          {index > 0 && ", "}
                          <Link
                            href={`/bills/${bill.id}`}
                            className="text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
                          >
                            {bill.title}
                          </Link>{" "}
                          ({formatDate(bill.date)})
                        </span>
                      ))}
                    </>
                  }
                />
                <RowValue>{balance.totals.map((t) => formatMoney(t.amount, t.currency)).join(" · ")}</RowValue>
              </li>
            );
          })}
        </RowList>
      </div>
    </section>
  );
}
