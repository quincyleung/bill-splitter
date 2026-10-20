import { type AppData, type Bill, ME, type Person, type Share } from "./model";
import { formatMoney } from "./money";
import { listNames, personName } from "./people";

/**
 * The shares that are actually debts: when I paid, everyone else's; when someone
 * else paid, only mine (what others owe them isn't tracked).
 */
export function trackedShares(bill: Bill): Share[] {
  return bill.payerId === ME ? bill.shares.filter((s) => s.personId !== ME) : bill.shares.filter((s) => s.personId === ME);
}

/** Every debt on the bill has been paid back (or there was none). */
export function isSettled(bill: Bill): boolean {
  return trackedShares(bill).every((s) => s.paid || s.amount === 0);
}

/** For lists: "1 of 2 paid", "All paid up", "Not paid back yet" or "Paid back". */
export function paidStatus(bill: Bill): string {
  const shares = trackedShares(bill);
  if (bill.payerId !== ME) return isSettled(bill) ? "Paid back" : "Not paid back yet";
  if (isSettled(bill)) return "All paid up";
  return `${shares.filter((s) => s.paid).length} of ${shares.length} paid`;
}

/** The same bill with one person's share marked paid or unpaid. */
export function withPaid(bill: Bill, personId: string, paid: boolean, now: Date): Bill {
  return {
    ...bill,
    updatedAt: now.toISOString(),
    shares: bill.shares.map((s) => (s.personId === personId ? { ...s, paid } : s)),
  };
}

/** Newest first, by when the bill was added. */
export function newestFirst(bills: Bill[]): Bill[] {
  return [...bills].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** One line about who owes what on a bill: "Josh and Julie owe you $60.00", "All paid up", "You owe Sam $42.00". */
export function billHeadline(bill: Bill, people: Person[]): string {
  const name = (id: string) => personName(id, people);
  const money = (amount: number) => formatMoney(amount, bill.currency);
  if (bill.payerId !== ME) {
    const mine = bill.shares.find((s) => s.personId === ME);
    return mine?.paid ? `You've paid ${name(bill.payerId)} back` : `You owe ${name(bill.payerId)} ${money(mine?.amount ?? 0)}`;
  }
  const owed = trackedShares(bill);
  const unpaid = owed.filter((s) => !s.paid);
  if (owed.length === 0) return "Nobody owes you on this bill";
  if (unpaid.length === 0) return "All paid up";
  const total = unpaid.reduce((sum, s) => sum + s.amount, 0);
  return `${listNames(unpaid.map((s) => name(s.personId)))} ${unpaid.length === 1 ? "owes" : "owe"} you ${money(total)}`;
}

/**
 * The data without this bill. A recurring series with no bills left goes too, so it
 * doesn't linger on Home as "due". Saved people stay.
 */
export function withoutBill(data: AppData, billId: string): AppData {
  const bills = data.bills.filter((b) => b.id !== billId);
  const inUse = new Set(bills.flatMap((b) => (b.kind === "recurring" ? [b.recurringId] : [])));
  return { ...data, bills, recurring: data.recurring.filter((r) => inUse.has(r.id)) };
}
