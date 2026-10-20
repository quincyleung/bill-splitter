// Everything about a bill that's still being filled in: its state, validation
// (with the messages from flows.md), the live preview, and turning it into saved data.
// No React here, so it can be tested on its own.

import { isIsoDate } from "./dates";
import { type AppData, type Bill, type Frequency, ME, type Person, type RecurringBill } from "./model";
import { DEFAULT_CURRENCY, formatMoney, parseMoney } from "./money";
import { nameMatches } from "./people";
import { type ItemSplit, itemTotalsOf, splitByItems, splitEvenly } from "./split";

export type Preset = "one-time" | "recurring";
export type SplitMethod = "items" | "even";
export type Repeats = "week" | "two-weeks" | "month" | "custom";

/** What each quick start preselects. One-time starts on Evenly, the shortest form; By item is one tap away. */
export const PRESETS: Record<Preset, { split: SplitMethod; recurring: boolean }> = {
  "one-time": { split: "even", recurring: false },
  recurring: { split: "even", recurring: true },
};

export type DraftItem = {
  key: string;
  price: string;
  name: string;
  personIds: string[];
  /** From a pasted receipt: "7 Deluxe Ayce Adult" is one line for 7 people. */
  quantity?: number;
};
export type DraftPerson = { id: string; name: string };

export type Draft = {
  preset: Preset;
  /** The bill's name, e.g. "Dinner at Aba". Required. */
  title: string;
  date: string;
  /** People typed in on this form. Saved with the bill, and only if they're ticked. */
  added: DraftPerson[];
  /** Everyone on the bill, including ME. */
  ticked: string[];
  /**
   * People given a chip on this form beyond Me and the recent ones: found, added, or
   * ticked from Show all or Same people as. Only ever grows, so chips never jump around.
   */
  shown: string[];
  /**
   * How many of the most recent people get a chip: as many as fit in two rows on this
   * screen. The form measures it; RECENT_CHIPS until then.
   */
  recentChips: number;
  payerId: string;
  split: SplitMethod;
  items: DraftItem[];
  /** Total paid (by item) or the amount (evenly). Kept as typed. */
  total: string;
  repeats: Repeats;
  every: string;
  unit: "week" | "month";
  /** What's typed next to "Add person" right now. */
  pendingName: string;
  /** Set when this is the next bill of an existing recurring series ("Add Nov 1"). */
  seriesId?: string;
  /** What's in the "Paste receipt text" box, kept as pasted. */
  receiptText: string;
  /** What the pasted receipt said, to check the items and offer its total. */
  receipt?: { subtotal?: number; total?: number };
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
    shown: [],
    recentChips: RECENT_CHIPS,
    payerId: ME,
    split: PRESETS[preset].split,
    items: [newItem(makeId)],
    total: "",
    repeats: "month",
    every: "",
    unit: "month",
    pendingName: "",
    receiptText: "",
  };
}

/**
 * The next bill of a recurring series: same name, people, payer and frequency, dated
 * when it's due. The amount stays blank, because it changes every time.
 */
export function draftFromSeries(series: RecurringBill, dueDate: string, people: Person[], makeId: () => string): Draft {
  const { unit, every } = series.frequency;
  const repeats: Repeats =
    unit === "week" && every === 1 ? "week" : unit === "week" && every === 2 ? "two-weeks" : unit === "month" && every === 1 ? "month" : "custom";
  const known = (id: string) => id === ME || people.some((p) => p.id === id);
  return {
    ...newDraft("recurring", dueDate, makeId),
    seriesId: series.id,
    title: series.name,
    ticked: series.personIds.filter(known),
    shown: series.personIds.filter((id) => id !== ME && known(id)),
    payerId: known(series.payerId) ? series.payerId : ME,
    repeats,
    every: repeats === "custom" ? String(every) : "",
    unit,
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

/** Recent people with a chip before the form has measured how many fit in two rows. */
export const RECENT_CHIPS = 6;

/** Saved people, the ones used most recently first. */
export function byRecent(people: Person[]): Person[] {
  return [...people].sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt));
}

/**
 * Chips in "Who was there": Me and the most recent people (two rows' worth), then anyone
 * else put on this form (found, added, or from Show all or Same people as) in the order
 * they came. Anyone on the bill always has a chip.
 */
export function pickerIds(draft: Draft, people: Person[]): string[] {
  const recent = byRecent(people)
    .slice(0, draft.recentChips)
    .map((p) => p.id);
  return [...new Set([ME, ...recent, ...draft.shown, ...draft.ticked])];
}

/** Everyone who can be picked: Me, people added on this form, and every saved person. */
export function everyoneIds(draft: Draft, people: Person[]): string[] {
  return [ME, ...draft.added.map((p) => p.id), ...people.map((p) => p.id)];
}

/** Ticked ids in chip order (anyone without a chip, which shouldn't happen, goes last). */
function inChipOrder(draft: Draft, people: Person[], ticked: Set<string>): string[] {
  const chips = pickerIds(draft, people);
  return [...chips.filter((id) => ticked.has(id)), ...[...ticked].filter((id) => !chips.includes(id))];
}

/** Puts people on the bill, giving anyone without a chip one after the chips already there. */
export function tickPeople(draft: Draft, people: Person[], ids: string[]): Draft {
  const chips = pickerIds(draft, people);
  const next = { ...draft, shown: [...draft.shown, ...ids.filter((id) => !chips.includes(id))] };
  return { ...next, ticked: inChipOrder(next, people, new Set([...draft.ticked, ...ids])) };
}

/** Takes people off the bill, and off every item. Their chips stay, unticked. */
export function untickPeople(draft: Draft, people: Person[], ids: string[]): Draft {
  // Someone whose chip was only there because they were ticked keeps it.
  const chipsAnyway = pickerIds({ ...draft, ticked: [] }, people);
  const kept = { ...draft, shown: [...draft.shown, ...ids.filter((id) => draft.ticked.includes(id) && !chipsAnyway.includes(id))] };
  return {
    ...kept,
    ticked: inChipOrder(kept, people, new Set(draft.ticked.filter((t) => !ids.includes(t)))),
    items: draft.items.map((item) => ({ ...item, personIds: item.personIds.filter((p) => !ids.includes(p)) })),
  };
}

/** The suggestion that adds what's typed as someone new. */
export const NEW_PERSON = "new";

/** How many people "Find or add a person" suggests at once. */
export const MAX_MATCHES = 5;

/**
 * Suggestions while typing in "Find or add a person": people not on the bill whose name
 * matches (an exact match first, then the most recent), ending with "Add “Jo” as someone
 * new" unless that exact name is already saved. Empty when nobody matches: Enter then
 * adds the name as someone new.
 */
export function findPeople(query: string, draft: Draft, people: Person[]): { id: string; label: string }[] {
  const typed = query.trim();
  if (!typed) return [];
  const lower = typed.toLowerCase();
  const candidates = [...[...draft.added].reverse(), ...byRecent(people)];
  const matches = candidates
    .filter((p) => !draft.ticked.includes(p.id) && nameMatches(p.name, typed))
    .sort((a, b) => Number(b.name.toLowerCase() === lower) - Number(a.name.toLowerCase() === lower))
    .slice(0, MAX_MATCHES)
    .map((p) => ({ id: p.id, label: p.name }));
  if (matches.length === 0) return [];
  const taken = ["me", "you"].includes(lower) || candidates.some((p) => p.name.toLowerCase() === lower);
  return taken ? matches : [...matches, { id: NEW_PERSON, label: `Add “${typed}” as someone new` }];
}

export type RecentGroup = { id: string; title: string; date: string; ids: string[] };

/**
 * Show groups: the people on the newest bills ("Fam Dinner": Huddy and Chloe), up to 8
 * different groups, each with at least two people besides me who are still saved. A
 * group that's on several bills is listed once, under its newest bill.
 */
export function recentGroups(data: AppData, limit = 8): RecentGroup[] {
  const saved = new Set(data.people.map((p) => p.id));
  const seen = new Set<string>();
  const groups: RecentGroup[] = [];
  for (const bill of [...data.bills].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
    const ids = bill.shares.map((s) => s.personId).filter((id) => id !== ME && saved.has(id));
    const key = [...ids].sort().join(",");
    if (ids.length < 2 || seen.has(key)) continue;
    seen.add(key);
    groups.push({ id: bill.id, title: bill.title, date: bill.date, ids });
    if (groups.length === limit) break;
  }
  return groups;
}

/** Someone already saved (or added on this form) with exactly this name, who isn't on the bill yet. */
export function savedPersonNamed(name: string, draft: Draft, people: Person[]): string | null {
  const lower = name.trim().toLowerCase();
  const match = [...draft.added, ...people].find((p) => p.name.toLowerCase() === lower);
  return match && !draft.ticked.includes(match.id) ? match.id : null;
}

/** Why a name can't be added, or null if it can. (Check savedPersonNamed first: that person is put on the bill instead.) */
export function addPersonError(name: string, draft: Draft, people: Person[]): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Type a name, then press Add person.";
  if (["me", "you"].includes(trimmed.toLowerCase())) return "You're already on the list as Me.";
  const match = [...draft.added, ...people].find((p) => p.name.toLowerCase() === trimmed.toLowerCase());
  if (match && draft.ticked.includes(match.id)) return `${match.name} is already on this bill.`;
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
  name: (key: string) => `name:${key}`,
  price: (key: string) => `price:${key}`,
  who: (key: string) => `who:${key}`,
};

export function checkDraft(draft: Draft, people: Person[]): { errors: Errors; warnings: string[] } {
  const errors: Errors = {};
  const warnings: string[] = [];
  const name = (id: string) => nameOf(id, draft, people);
  const recurring = isRecurring(draft);

  if (!draft.title.trim()) errors.title = recurring ? "Name this bill, like Netflix." : "Name this bill, like Dinner at Aba.";
  if (!isIsoDate(draft.date)) errors.date = "Enter the date of the bill.";

  const pending = draft.pendingName.trim();
  const others = draft.ticked.filter((id) => id !== ME);
  if (pending) errors.people = `Press Add person to put ${pending} on this bill, or clear the name.`;
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
      if (!item.name.trim()) errors[errorKey.name(item.key)] = "Name this item, like Burger.";
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
      for (const { item, personIds } of items) {
        if (item.quantity && item.quantity > 1 && personIds.length > 0 && personIds.length !== item.quantity) {
          warnings.push(`${item.name.trim() || "This line"} is for ${item.quantity} people. You've ticked ${personIds.length}.`);
        }
      }
      if (draft.receipt?.subtotal !== undefined && subtotal !== draft.receipt.subtotal) {
        warnings.push(
          `Items add up to ${formatMoney(subtotal, DEFAULT_CURRENCY)}, but the receipt subtotal is ${formatMoney(draft.receipt.subtotal, DEFAULT_CURRENCY)}. A line may be missing.`,
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
      errors.every = draft.unit === "week" ? "Enter how often, from 1 to 52 weeks." : "Enter how often, from 1 to 12 months.";
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
  const title = draft.title.trim();
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
    // Adding the next bill of a series keeps the series, updated to how it's set now.
    const existing = data.recurring.find((r) => r.id === draft.seriesId);
    series = {
      id: existing?.id ?? makeId(),
      name: title,
      currency: existing?.currency ?? DEFAULT_CURRENCY,
      payerId: draft.payerId,
      personIds: draft.ticked,
      frequency: frequencyOf(draft),
      createdAt: existing?.createdAt ?? stamp,
    };
    bill = { ...base, kind: "recurring", recurringId: series.id };
  } else if (splitsByItem(draft)) {
    const items = parseItems(draft).map(({ item, price, personIds }) => ({
      id: item.key,
      name: item.name.trim(),
      price: price!,
      quantity: item.quantity ?? 1,
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
      recurring: !series
        ? data.recurring
        : data.recurring.some((r) => r.id === series.id)
          ? data.recurring.map((r) => (r.id === series.id ? series : r))
          : [...data.recurring, series],
    },
  };
}
