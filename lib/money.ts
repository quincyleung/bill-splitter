// Money helpers. Amounts are integers in the currency's smallest unit.
// A fixed locale keeps server and browser output identical (no hydration mismatch).

const LOCALE = "en-US";

/** Until the currency picker exists, every bill is in US dollars. */
export const DEFAULT_CURRENCY = "USD";

/** Decimal places for a currency: 2 for USD, 0 for JPY. */
export function minorDigits(currency: string): number {
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

/** 4025 USD → "$40.25" */
export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(
    amount / 10 ** minorDigits(currency),
  );
}

/** "USD" → "$" */
export function currencySymbol(currency: string): string {
  const parts = new Intl.NumberFormat(LOCALE, { style: "currency", currency, currencyDisplay: "narrowSymbol" })
    .formatToParts(0);
  return parts.find((part) => part.type === "currency")?.value ?? currency;
}

/** "USD" → "US Dollar" */
export function currencyName(currency: string): string {
  return new Intl.DisplayNames(LOCALE, { type: "currency" }).of(currency) ?? currency;
}

/**
 * Reads what someone typed into a money field. Accepts "12", "12.5", "$12.50"
 * and "1,234.50". Returns the amount in the smallest unit, or null if it isn't
 * a valid amount for this currency. Checking for zero is up to the form.
 */
export function parseMoney(input: string, currency: string): number | null {
  if (input.includes("-")) return null;

  // Drop a currency symbol or code before or after the number, and spaces.
  const text = input.replace(/\s/g, "").replace(/^[^\d.]+/, "").replace(/[^\d.]+$/, "");
  const match = /^(\d{1,3}(?:,\d{3})+|\d*)(?:\.(\d*))?$/.exec(text);
  if (!match || text === "" || text === ".") return null;

  const whole = match[1].replace(/,/g, "") || "0";
  const fraction = match[2] ?? "";
  const digits = minorDigits(currency);
  if (fraction.length > digits) return null;

  const amount = Number(whole) * 10 ** digits + Number(fraction.padEnd(digits, "0") || "0");
  return Number.isSafeInteger(amount) ? amount : null;
}

/** An amount as it would be typed into a money field: 3193 USD → "31.93", 2400 JPY → "2400". */
export function toInputAmount(amount: number, currency: string): string {
  const digits = minorDigits(currency);
  return (amount / 10 ** digits).toFixed(digits);
}
