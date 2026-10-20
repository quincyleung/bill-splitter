// Turning pasted receipt text into items. The text comes from the phone's own text
// recognition (Live Text on iPhone, Google Lens on Android), so it may arrive as one
// long line with no line breaks, in two languages, with header noise and suggested
// tips after the total. See "Reading a receipt" in flows.md.

import { parseMoney } from "./money";

export type ReceiptItem = { name: string; quantity: number; price: number };

export type Receipt = {
  items: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  /** Tip, gratuity or service charge printed on the receipt. */
  tip?: number;
  /** The printed total. Often before any tip, so it's offered, never filled in. */
  total?: number;
};

/** A price: two decimals, an optional currency sign, e.g. "$5.00", "1,234.50", "223.93". */
const PRICE = String.raw`[$€£¥]?\s?(\d{1,6}(?:,\d{3})*\.\d{2})(?!\d)`;

/** Labels that start the summary, each followed closely by a price (a percent may sit in between). */
const SUMMARY_LABEL = String.raw`\b(?:sub[\s-]?total|tax|gst|hst|pst|vat|tips?|gratuity|service charge|(?:bill |grand )?total|amount due|balance due)\b`;
const BETWEEN = String.raw`\s*[:.]?\s*(?:\(?\d{1,2}(?:\.\d+)?\s?%\)?\s*[:.]?\s*)?`;

function amountAfter(label: string, text: string, currency: string): number | undefined {
  const match = new RegExp(label + BETWEEN + PRICE, "i").exec(text);
  return match ? (parseMoney(match[1], currency) ?? undefined) : undefined;
}

function cleanName(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N})]+$/gu, "")
    .slice(0, 40)
    .trim();
}

export function parseReceipt(text: string, currency: string): Receipt {
  // Items end where the summary starts (Subtotal, Tax, Total…). Reading stops there, so
  // lines after it, like "Suggested tip 18% $61.41", are never read as dishes.
  const summaryStart = new RegExp(SUMMARY_LABEL + BETWEEN + PRICE, "i").exec(text);
  const itemsText = summaryStart ? text.slice(0, summaryStart.index) : text;
  const summary = summaryStart ? text.slice(summaryStart.index) : "";

  const items: ReceiptItem[] = [];
  let lastEnd = 0;
  for (const match of itemsText.matchAll(new RegExp(PRICE, "g"))) {
    const segment = itemsText.slice(lastEnd, match.index);
    lastEnd = match.index + match[0].length;
    const price = parseMoney(match[1], currency);
    if (!price) continue; // skip $0.00 modifier lines

    // A number just before a name is the quantity: "7 Deluxe Ayce Adult", "2 x Beer".
    const quantityMatch = [...segment.matchAll(/(?:^|\s)(\d{1,2})\s*[x×]?\s+(?=\p{L})/gu)].pop();
    const rawName =
      quantityMatch !== undefined
        ? segment.slice(quantityMatch.index + quantityMatch[0].length)
        : (segment.split("\n").filter((line) => line.trim()).pop() ?? "");
    items.push({
      name: cleanName(rawName) || `Item ${items.length + 1}`,
      quantity: quantityMatch ? Math.max(1, Number(quantityMatch[1])) : 1,
      price,
    });
  }

  return {
    items,
    subtotal: amountAfter(String.raw`\bsub[\s-]?total\b`, summary, currency),
    tax: amountAfter(String.raw`\b(?:tax|gst|hst|pst|vat)\b`, summary, currency),
    tip: amountAfter(String.raw`\b(?:tips?|gratuity|service charge)\b`, summary, currency),
    // "Subtotal" also contains "total", so take it out before looking for the total.
    total: amountAfter(String.raw`\b(?:bill |grand )?total\b`, summary.replace(/sub[\s-]?total/gi, ""), currency),
  };
}
