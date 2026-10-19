import type { Bill } from "./model";

export type ItemPart = { name: string; amount: number; sharedBy: number };

/** How one person's share was worked out, for the bill page. */
export type Breakdown =
  /** By item: their part of each item, then their share of tax and tip. */
  | { kind: "items"; items: ItemPart[]; itemsTotal: number; taxAndTip: number; rate: number }
  /** Evenly: the total split between everyone on the bill. */
  | { kind: "even"; total: number; ways: number };

/**
 * Item parts can be fractions of a cent (a $10 item shared by 3); round them only
 * for display. taxAndTip is whatever's left of their saved share after their items,
 * so the lines always add up to the share they owe.
 */
export function breakdownFor(bill: Bill, personId: string): Breakdown {
  if (bill.kind !== "meal") return { kind: "even", total: bill.total, ways: bill.shares.length };

  const onBill = new Set(bill.shares.map((s) => s.personId));
  const subtotal = bill.items.reduce((sum, item) => sum + item.price, 0);
  const items = bill.items
    .filter((item) => item.personIds.includes(personId))
    .map((item) => {
      const sharedBy = item.personIds.filter((id) => onBill.has(id)).length;
      return { name: item.name, amount: item.price / sharedBy, sharedBy };
    });
  const share = bill.shares.find((s) => s.personId === personId)?.amount ?? 0;
  // Never more than the share itself, so tax and tip can't show as a negative cent.
  const itemsTotal = Math.min(Math.round(items.reduce((sum, item) => sum + item.amount, 0)), share);
  return {
    kind: "items",
    items,
    itemsTotal,
    taxAndTip: share - itemsTotal,
    rate: subtotal > 0 ? (bill.total - subtotal) / subtotal : 0,
  };
}
