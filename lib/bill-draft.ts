// Everything about a bill that's still being filled in: its state, validation
// (with the messages from flows.md), the live preview, and turning it into saved data.
// No React here, so it can be tested on its own.

import { isIsoDate } from "./dates";
import { type AppData, type Bill, type Frequency, ME, type Person, type RecurringBill } from "./model";
import { DEFAULT_CURRENCY, formatMoney, parseMoney } from "./money";
import { type ItemSplit, itemTotalsOf, splitByItems, splitEvenly } from "./split";

export type Preset = "dinner" | "uber" | "monthly";
export type SplitMethod = "items" | "even";
export type Repeats = "week" | "two-weeks" | "month" | "custom";

export const PRESETS: Record<Preset, { heading: string; split: SplitMethod; recurring: boolean; fallbackTitle: string }> = {
  dinner: { heading: "Dinner", split: "items", recurring: false, fallbackTitle: "Dinner" },
  uber: { heading: "Uber", split: "even", recurring: false, fallbackTitle: "Uber ride" },
  monthly: { heading: "Monthly bill", split: "even", recurring: true, fallbackTitle: "" },
};

export type DraftItem = { key: string; price: string; name: string; personIds: string[] };
export type DraftPerson = { id: string; name: string };

export type Draft = {
  preset: Preset;
  /** "What was it?" for one-time bills, "Name" for recurring ones. */
  title: string;
  date: string;
  /** People typed in on this form. Saved with the bill, and only if they're ticked. */
  added: DraftPerson[];
  /** Everyone on the bill, including ME. */
  ticked: string[];
  payerId: string;
  split: SplitMethod;
  items: DraftItem[];
  /** Total paid (by item) or the amount (evenly). Kept as typed. */
  total: string;
  repeats: Repeats;
  every: string;
  unit: "week" | "month";
  /** What's in "Add a person" right now. */
  pendingName: string;
};

export function newItem(makeId: () => string): DraftItem {
  return { key: makeId(), price: "", name: "", personIds: [] };
}

export function newDraft(preset: Preset, today: string, makeId: () => string): Draft {
  return {
    preset,
    title: "",
    date: today,
    added: [],
    ticked: [ME],
    payerId: ME,
    split: PRESETS[preset].split,
    items: [newItem(makeId)],
    total: "",
    repeats: "month",
    every: "",
    unit: "month",
    pendingName: "",
  };
}

export function isRecurring(draft: Draft): boolean {
  return PRESETS[draft.preset].recurring;
}

/** Splits by item only on one-time bills; recurring bills are always even. */
export function splitsByItem(draft: Draft): boolean {
  return !isRecurring(draft) && draft.split === "items";
}

/** "Me" for ME, otherwise the person's name. */
export function nameOf(id: string, draft: Draft, people: Person[]): string {
  if (id === ME) return "Me";
  return draft.added.find((p) => p.id === id)?.name ?? people.find((p) => p.id === id)?.name ?? "Someone";
}

/** Chips in "Who was there": Me, then people added on this form, then saved people, most recent first. */
export function pickerIds(draft: Draft, people: Person[]): string[] {
  const saved = [...people].sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt)).map((p) => p.id);
  return [ME, ...draft.added.map((p) => p.id), ...saved];
}

/** Why a name can't be added, or null if it can. */
export function addPersonError(name: string, draft: Draft, people: Person[]): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Type a name, then press Add.";
  if (["me", "you"].includes(trimmed.toLowerCase())) return "You're already on the list as Me.";
  const match = [...draft.added, ...people].find((p) => p.name.toLowerCase() === trimmed.toLowerCase());
  if (match) {
    return draft.ticked.includes(match.id)
      ? `${match.name} is already on this bill.`
      : `${match.name} is already in the list. Tap their name to include them.`;
  }
  return null;
}

function parseItems(draft: Draft) {
  return draft.items.map((item) => ({
    item,
    price: parseMoney(item.price, DEFAULT_CURRENCY),
    personIds: item.personIds.filter((id) => draft.ticked.includes(id)),
  }));
}

export type Preview =
  | { state: "incomplete"; message: string }
  /** By item, before the total is entered: each person's items so far. */
  | { state: "items-only"; itemTotals: Map<string, number> }
  | { state: "ready"; total: number; shares: Map<string, number>; items: ItemSplit | null };

/** What the live summary shows. Uses whatever is valid so far. */
export function previewDraft(draft: Draft): Preview {
  if (draft.ticked.length === 0) return { state: "incomplete", message: "Tick who was there to see each share." };
  const total = parseMoney(draft.total, DEFAULT_CURRENCY);

  if (!splitsByItem(draft)) {
    if (!total) return { state: "incomplete", message: "Enter the amount to see each share." };
    return { state: "ready", total, shares: splitEvenly(total, draft.ticked, draft.payerId), items: null };
  }

  const lines = parseItems(draft)
    .filter(({ price, personIds }) => price && personIds.length > 0)
    .map(({ price, personIds }) => ({ price: price!, personIds }));
  if (lines.length === 0) return { state: "incomplete", message: "Add who was there and what they had." };

  const split = total === null ? null : splitByItems(lines, total, draft.ticked, draft.payerId);
  if (!split) return { state: "items-only", itemTotals: itemTotalsOf(lines, draft.ticked).itemTotals };
  return { state: "ready", total: total!, shares: split.shares, items: split };
}

export type Errors = Record<string, string>;

/** Field keys for errors, in the order the fields appear. */
export const errorKey = {
  price: (key: string) => `price:${key}`,
  who: (key: string) => `who:${key}`,
};

export function checkDraft(draft: Draft, people: Person[]): { errors: Errors; warnings: string[] } {
  const errors: Errors = {};
  const warnings: string[] = [];
  const name = (id: string) => nameOf(id, draft, people);
  const recurring = isRecurring(draft);

  if (recurring && !draft.title.trim()) errors.title = "Name this bill, like Electricity.";
  if (!isIsoDate(draft.date)) errors.date = "Enter the date of the bill.";

  const pending = draft.pendingName.trim();
  const others = draft.ticked.filter((id) => id !== ME);
  if (pending) errors.people = `Press Add to put ${pending} on this bill, or clear the name.`;
  else if (draft.payerId === ME && others.length === 0) errors.people = "Add at least one other person to split with.";

  if (draft.payerId !== ME) {
    if (!draft.ticked.includes(draft.payerId)) {
      errors.payer = `${name(draft.payerId)} paid, so tick ${name(draft.payerId)} under Who was there, or choose who paid.`;
    } else if (!draft.ticked.includes(ME)) {
      errors.payer = "You're not on this bill, so you don't owe anything. Tick Me, or pick yourself as who paid.";
    }
  }

  const total = parseMoney(draft.total, DEFAULT_CURRENCY);
  if (splitsByItem(draft)) {
    const items = parseItems(draft);
    if (items.length === 0) errors.items = "Add at least one item from the receipt.";
    for (const { item, price, personIds } of items) {
      if (price === null) errors[errorKey.price(item.key)] = "Enter a price, like 12.50.";
      else if (price === 0) errors[errorKey.price(item.key)] = "Enter a price above 0.";
      if (personIds.length === 0) errors[errorKey.who(item.key)] = "Choose who had this item.";
    }
    const allPriced = items.length > 0 && items.every(({ price }) => price);
    const subtotal = items.reduce((sum, { price }) => sum + (price ?? 0), 0);

    if (!draft.total.trim()) errors.total = "Enter the total you paid, including tax and tip.";
    else if (total === null) errors.total = "Enter the total as a number, like 102.20.";
    else if (allPriced && total < subtotal) {
      errors.total = `That's less than the items (${formatMoney(subtotal, DEFAULT_CURRENCY)}). Check the total, or remove an item that isn't on the receipt.`;
    }

    if (allPriced) {
      for (const id of draft.ticked) {
        if (items.some(({ personIds }) => personIds.includes(id))) continue;
        warnings.push(
          id === ME
            ? "You aren't on any item, so you owe $0. Tick yourself on an item or untick Me."
            : `${name(id)} isn't on any item, so they owe $0. Tick them on an item or remove them.`,
        );
      }
      if (total !== null && total > subtotal && (total - subtotal) / subtotal > 0.4) {
        warnings.push(`Tax and tip come to ${Math.round(((total - subtotal) / subtotal) * 100)}% of the items. Check the total.`);
      }
    }
  } else if (total === null) errors.total = "Enter the amount, like 24.80.";
  else if (total === 0) errors.total = "Enter an amount above 0.";

  if (recurring && draft.repeats === "custom") {
    const every = Number(draft.every);
    const max = draft.unit === "week" ? 52 : 12;
    if (!/^\d+$/.test(draft.every.trim()) || every < 1 || every > max) {
      errors.every = "Enter how often, like every 3 months.";
    }
  }

  return { errors, warnings };
}

export function frequencyOf(draft: Draft): Frequency {
  switch (draft.repeats) {
    case "week":
      return { unit: "week", every: 1 };
    case "two-weeks":
      return { unit: "week", every: 2 };
    case "month":
      return { unit: "month", every: 1 };
    case "custom":
      return { unit: draft.unit, every: Number(draft.every) };
  }
}

/**
 * Adds the bill (and, for a recurring bill, its series) to the data. People
 * added on this form are saved if they're on the bill; saved people on the bill
 * move to the front of the picker. Call only when checkDraft found no errors.
 */
export function saveDraft(data: AppData, draft: Draft, now: Date, makeId: () => string): { data: AppData; billId: string } {
  const preview = previewDraft(draft);
  if (preview.state !== "ready") throw new Error("saveDraft called on an incomplete draft");

  const stamp = now.toISOString();
  const billId = makeId();
  const title = draft.title.trim() || PRESETS[draft.preset].fallbackTitle;
  const base = {
    id: billId,
    title,
    date: draft.date,
    currency: DEFAULT_CURRENCY,
    total: preview.total,
    payerId: draft.payerId,
    shares: draft.ticked.map((personId) => ({ personId, amount: preview.shares.get(personId) ?? 0, paid: false })),
    createdAt: stamp,
    updatedAt: stamp,
  };

  let bill: Bill;
  let series: RecurringBill | null = null;
  if (isRecurring(draft)) {
    series = {
      id: makeId(),
      name: title,
      currency: DEFAULT_CURRENCY,
      payerId: draft.payerId,
      personIds: draft.ticked,
      frequency: frequencyOf(draft),
      createdAt: stamp,
    };
    bill = { ...base, kind: "recurring", recurringId: series.id };
  } else if (splitsByItem(draft)) {
    const items = parseItems(draft).map(({ item, price, personIds }) => ({
      id: item.key,
      name: item.name.trim(),
      price: price!,
      quantity: 1,
      personIds,
    }));
    bill = { ...base, kind: "meal", items };
  } else {
    bill = { ...base, kind: "even" };
  }

  const people = data.people.map((p) => (draft.ticked.includes(p.id) ? { ...p, lastUsedAt: stamp } : p));
  for (const person of draft.added) {
    if (draft.ticked.includes(person.id)) people.push({ ...person, lastUsedAt: stamp });
  }

  return {
    billId,
    data: {
      ...data,
      people,
      bills: [...data.bills, bill],
      recurring: series ? [...data.recurring, series] : data.recurring,
    },
  };
}
