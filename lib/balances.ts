// Who owes whom across all bills. Only debts between me and whoever paid are tracked,
// and amounts in different currencies are kept apart, never added or converted.

import { type AppData, type Bill, ME } from "./model";

export type Balance = {
  /** The other person: who owes me, or whom I owe. */
  personId: string;
  /** One total per currency, largest first. */
  totals: { currency: string; amount: number }[];
  /** The unpaid bills behind it, oldest first. */
  bills: { bill: Bill; amount: number }[];
  /** Date (YYYY-MM-DD) of the oldest unpaid bill. */
  since: string;
};

function collect(entries: { personId: string; bill: Bill; amount: number }[]): Balance[] {
  const byPerson = new Map<string, Balance>();
  for (const { personId, bill, amount } of entries) {
    const balance = byPerson.get(personId) ?? { personId, totals: [], bills: [], since: bill.date };
    balance.bills.push({ bill, amount });
    const total = balance.totals.find((t) => t.currency === bill.currency);
    if (total) total.amount += amount;
    else balance.totals.push({ currency: bill.currency, amount });
    byPerson.set(personId, balance);
  }
  const balances = [...byPerson.values()];
  for (const balance of balances) {
    balance.bills.sort((a, b) => a.bill.date.localeCompare(b.bill.date));
    balance.since = balance.bills[0].bill.date;
    balance.totals.sort((a, b) => b.amount - a.amount);
  }
  return balances;
}

/** Everyone with an unpaid share on a bill I paid, largest amount first. */
export function owedToMe(data: AppData): Balance[] {
  const entries = data.bills.flatMap((bill) =>
    bill.payerId !== ME
      ? []
      : bill.shares
          .filter((s) => s.personId !== ME && !s.paid && s.amount > 0)
          .map((s) => ({ personId: s.personId, bill, amount: s.amount })),
  );
  return collect(entries).sort((a, b) => b.totals[0].amount - a.totals[0].amount);
}

/** Everyone who paid a bill where my share isn't paid back yet, largest amount first. */
export function iOwe(data: AppData): Balance[] {
  const entries = data.bills.flatMap((bill) => {
    const mine = bill.shares.find((s) => s.personId === ME);
    return bill.payerId === ME || !mine || mine.paid || mine.amount === 0
      ? []
      : [{ personId: bill.payerId, bill, amount: mine.amount }];
  });
  return collect(entries).sort((a, b) => b.totals[0].amount - a.totals[0].amount);
}
