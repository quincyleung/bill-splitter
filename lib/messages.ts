import { breakdownFor } from "./breakdown";
import { formatDate } from "./dates";
import type { Bill } from "./model";
import { formatMoney } from "./money";

/**
 * The text "Copy message" puts on the clipboard for one person: the bill's name and
 * date, what they had and what each part came to, then their total. Friendlier to
 * send than "you owe me $X", and it matches the breakdown on their card.
 *
 *   Dinner at Aba (Oct 5)
 *   Lamb shoulder: $38.00
 *   Mezze (shared by 3): $8.00
 *   Tax and tip: $12.16
 *   Your total: $58.16
 */
export function shareMessage(bill: Bill, personId: string): string {
  const money = (amount: number) => formatMoney(Math.round(amount), bill.currency);
  const share = bill.shares.find((s) => s.personId === personId)?.amount ?? 0;
  const breakdown = breakdownFor(bill, personId);
  const lines = [`${bill.title} (${formatDate(bill.date)})`];
  if (breakdown.kind === "items") {
    for (const item of breakdown.items) {
      lines.push(`${item.name}${item.sharedBy > 1 ? ` (shared by ${item.sharedBy})` : ""}: ${money(item.amount)}`);
    }
    if (breakdown.taxAndTip > 0) lines.push(`Tax and tip: ${money(breakdown.taxAndTip)}`);
  } else if (breakdown.ways > 1) {
    lines.push(`${money(breakdown.total)} split ${breakdown.ways} ways`);
  }
  lines.push(`Your total: ${money(share)}`);
  return lines.join("\n");
}
