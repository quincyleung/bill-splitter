import { type Bill, ME, type Share } from "./model";

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
