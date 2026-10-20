// Splitting money in whole units (cents). Every split adds up to the exact total.

/**
 * Rounds each exact share to the nearest unit (cent), half a cent and up rounding up.
 * Rounding can leave the total a unit or two over or under, so whoever paid takes the
 * difference and the shares add up exactly. If the payer isn't in the split (or would
 * go below zero), the difference is spread one unit at a time over the people whose
 * rounding moved them furthest the other way.
 */
function allocate(exact: Map<string, number>, total: number, payerId: string): Map<string, number> {
  const shares = new Map<string, number>();
  let leftover = total;
  for (const [id, value] of exact) {
    // The tiny nudge keeps a true half (2777.5) from landing at 2777.4999… after division.
    const rounded = Math.max(0, Math.round(value + 1e-6));
    shares.set(id, rounded);
    leftover -= rounded;
  }
  if (leftover === 0 || shares.size === 0) return shares;

  const payerShare = shares.get(payerId);
  if (payerShare !== undefined && payerShare + leftover >= 0) {
    shares.set(payerId, payerShare + leftover);
    return shares;
  }

  // Short: add to whoever was rounded down most. Over: take from whoever was rounded up most.
  const step = leftover > 0 ? 1 : -1;
  const moved = (id: string) => exact.get(id)! - shares.get(id)!;
  const order = [...exact.keys()]
    .filter((id) => step > 0 || shares.get(id)! > 0)
    .sort((a, b) => (step > 0 ? moved(b) - moved(a) : moved(a) - moved(b)));
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
