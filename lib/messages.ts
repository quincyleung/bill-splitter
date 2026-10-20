import { breakdownFor } from "./breakdown";
import { formatDate } from "./dates";
import { type Bill, ME, type Person } from "./model";
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

/**
 * The whole bill for the group chat: the bill, its total and who paid, then each
 * person's share (with their items on a by-item bill), and who has paid.
 *
 *   Dinner at Aba (Oct 5)
 *   Total $78.40, paid by me
 *
 *   Josh: $58.16
 *     Lamb shoulder $38.00, Mezze (shared by 3) $8.00, tax and tip $12.16
 *   Julie: $10.11 (paid)
 *     Mezze (shared by 3) $8.00, tax and tip $2.11
 *   Me: $10.13 (paid the bill)
 *     Mezze (shared by 3) $8.00, tax and tip $2.13
 */
export function groupSummary(bill: Bill, people: Person[]): string {
  const money = (amount: number) => formatMoney(Math.round(amount), bill.currency);
  const name = (id: string) => (id === ME ? "Me" : (people.find((p) => p.id === id)?.name ?? "Someone"));
  const payer = bill.payerId === ME ? "me" : name(bill.payerId);
  const lines = [`${bill.title} (${formatDate(bill.date)})`, `Total ${money(bill.total)}, paid by ${payer}`];
  if (bill.kind !== "meal") lines.push(`Split evenly between ${bill.shares.length}`);
  lines.push("");

  // Everyone else first, me last.
  const shares = [...bill.shares].sort((a, b) => Number(a.personId === ME) - Number(b.personId === ME));
  for (const share of shares) {
    const note = share.personId === bill.payerId ? " (paid the bill)" : share.paid ? " (paid)" : "";
    lines.push(`${name(share.personId)}: ${money(share.amount)}${note}`);
    const breakdown = breakdownFor(bill, share.personId);
    if (breakdown.kind === "items" && breakdown.items.length > 0) {
      const parts = breakdown.items.map(
        (item) => `${item.name}${item.sharedBy > 1 ? ` (shared by ${item.sharedBy})` : ""} ${money(item.amount)}`,
      );
      if (breakdown.taxAndTip > 0) parts.push(`tax and tip ${money(breakdown.taxAndTip)}`);
      lines.push(`  ${parts.join(", ")}`);
    }
  }
  return lines.join("\n");
}
