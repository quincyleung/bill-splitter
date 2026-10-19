// Splitting money in whole units (cents). Every split adds up to the exact total.

/**
 * Rounds each exact share down, then gives the leftover units to the payer if
 * they're in the split, so a friend is never overcharged. If the payer isn't in
 * the split, the leftover goes one unit at a time to the largest remainders.
 */
function allocate(exact: Map<string, number>, total: number, payerId: string): Map<string, number> {
  const shares = new Map<string, number>();
  let leftover = total;
  for (const [id, value] of exact) {
    const whole = Math.max(0, Math.floor(value + 1e-6));
    shares.set(id, whole);
    leftover -= whole;
  }
  if (leftover === 0 || shares.size === 0) return shares;

  if (shares.has(payerId) && leftover > 0) {
    shares.set(payerId, shares.get(payerId)! + leftover);
    return shares;
  }

  const order = [...exact.entries()].sort(([, a], [, b]) => (b % 1) - (a % 1)).map(([id]) => id);
  const step = leftover > 0 ? 1 : -1;
  for (let i = 0; leftover !== 0; i = (i + 1) % order.length) {
    shares.set(order[i], shares.get(order[i])! + step);
    leftover -= step;
  }
  return shares;
}

export function splitEvenly(total: number, personIds: string[], payerId: string): Map<string, number> {
  const exact = new Map(personIds.map((id) => [id, total / personIds.length]));
  return allocate(exact, total, payerId);
}

export type ItemLine = { price: number; personIds: string[] };

export type ItemSplit = {
  shares: Map<string, number>;
  /** Each person's part of the items before tax and tip (not rounded). */
  itemTotals: Map<string, number>;
  subtotal: number;
};

/** Each item is shared evenly by the people who had it. Items nobody in personIds had are left out. */
export function itemTotalsOf(items: ItemLine[], personIds: string[]): { itemTotals: Map<string, number>; subtotal: number } {
  const itemTotals = new Map(personIds.map((id) => [id, 0]));
  let subtotal = 0;
  for (const item of items) {
    const sharers = item.personIds.filter((id) => itemTotals.has(id));
    if (sharers.length === 0) continue;
    subtotal += item.price;
    for (const id of sharers) itemTotals.set(id, itemTotals.get(id)! + item.price / sharers.length);
  }
  return { itemTotals, subtotal };
}

/**
 * Tax and tip (total paid minus the items) are shared in proportion to each
 * person's items. People with no items owe nothing. Returns null if the total
 * is less than the items.
 */
export function splitByItems(items: ItemLine[], total: number, personIds: string[], payerId: string): ItemSplit | null {
  const { itemTotals, subtotal } = itemTotalsOf(items, personIds);
  if (subtotal === 0 || total < subtotal) return null;

  const extra = total - subtotal;
  const exact = new Map([...itemTotals].map(([id, part]) => [id, part + (extra * part) / subtotal]));
  return { shares: allocate(exact, total, payerId), itemTotals, subtotal };
}
