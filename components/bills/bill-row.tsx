import Link from "next/link";
import { RowList, RowText, RowValue, rowClass } from "@/components/ui/rows";
import { billHeadline } from "@/lib/bills";
import { formatDate } from "@/lib/dates";
import type { Bill, Person } from "@/lib/model";
import { formatMoney } from "@/lib/money";

/** A bill in a list: its name, the date and who still owes, and the total. Links to the bill. */
export function BillRow({ bill, people }: { bill: Bill; people: Person[] }) {
  return (
    <Link href={`/bills/${bill.id}`} className={`${rowClass} hover:bg-accent-soft`}>
      <RowText title={bill.title} meta={`${formatDate(bill.date)} · ${billHeadline(bill, people)}`} />
      <RowValue>{formatMoney(bill.total, bill.currency)}</RowValue>
    </Link>
  );
}

export function BillList({ bills, people }: { bills: Bill[]; people: Person[] }) {
  return (
    <RowList>
      {bills.map((bill) => (
        <li key={bill.id}>
          <BillRow bill={bill} people={people} />
        </li>
      ))}
    </RowList>
  );
}
