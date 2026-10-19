// The shape of everything saved on the phone. See flows.md for how each part is used.
// Money is always an integer in the currency's smallest unit (cents; yen has none).

/** The id used for me wherever a person id is expected (payer, shares, items). */
export const ME = "me";

export type Person = {
  id: string;
  name: string;
  /** ISO timestamp, so the picker can list recent people first. */
  lastUsedAt: string;
};

export type Group = {
  id: string;
  name: string;
  personIds: string[];
};

export type Share = {
  personId: string;
  amount: number;
  /** Whether this share has been paid back. Only tracked between me and whoever paid. */
  paid: boolean;
};

export type MealItem = {
  id: string;
  name: string;
  /** Price of the whole line, e.g. 7 × $31.99 is stored as 22393. */
  price: number;
  quantity: number;
  personIds: string[];
};

type BillBase = {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** ISO 4217 code, e.g. "USD". */
  currency: string;
  total: number;
  /** ME or a person id. */
  payerId: string;
  /** One share per person on the bill, including me if I'm on it. */
  shares: Share[];
  createdAt: string;
  updatedAt: string;
};

export type MealBill = BillBase & { kind: "meal"; items: MealItem[] };
export type EvenBill = BillBase & { kind: "even" };
export type RecurringInstance = BillBase & { kind: "recurring"; recurringId: string };
export type Bill = MealBill | EvenBill | RecurringInstance;

export type Frequency = { unit: "week" | "month"; every: number };

/** A recurring series, e.g. Electricity. Each time it's added, a RecurringInstance bill is saved. */
export type RecurringBill = {
  id: string;
  name: string;
  currency: string;
  payerId: string;
  personIds: string[];
  frequency: Frequency;
  createdAt: string;
};

export const SCHEMA_VERSION = 1;

export type AppData = {
  version: typeof SCHEMA_VERSION;
  people: Person[];
  groups: Group[];
  bills: Bill[];
  recurring: RecurringBill[];
};

export function emptyData(): AppData {
  return { version: SCHEMA_VERSION, people: [], groups: [], bills: [], recurring: [] };
}

// Validation for data read back from storage. Anything that fails is treated as
// unreadable rather than half-loaded, so the app never renders a broken record.
// Unknown extra fields are ignored, so new optional fields don't need a version bump.

type Fields = Record<string, unknown>;

const isObject = (value: unknown): value is Fields =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === "string";
const isAmount = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;
const isCount = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 1;
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString);
const isArrayOf = <T>(value: unknown, check: (item: unknown) => item is T): value is T[] =>
  Array.isArray(value) && value.every(check);

function isPerson(value: unknown): value is Person {
  return isObject(value) && isString(value.id) && isString(value.name) && isString(value.lastUsedAt);
}

function isGroup(value: unknown): value is Group {
  return isObject(value) && isString(value.id) && isString(value.name) && isStringArray(value.personIds);
}

function isShare(value: unknown): value is Share {
  return (
    isObject(value) && isString(value.personId) && isAmount(value.amount) && typeof value.paid === "boolean"
  );
}

function isMealItem(value: unknown): value is MealItem {
  return (
    isObject(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isAmount(value.price) &&
    isCount(value.quantity) &&
    isStringArray(value.personIds)
  );
}

function isBill(value: unknown): value is Bill {
  if (
    !isObject(value) ||
    !isString(value.id) ||
    !isString(value.title) ||
    !isString(value.date) ||
    !isString(value.currency) ||
    !isAmount(value.total) ||
    !isString(value.payerId) ||
    !isArrayOf(value.shares, isShare) ||
    !isString(value.createdAt) ||
    !isString(value.updatedAt)
  ) {
    return false;
  }
  switch (value.kind) {
    case "meal":
      return isArrayOf(value.items, isMealItem);
    case "even":
      return true;
    case "recurring":
      return isString(value.recurringId);
    default:
      return false;
  }
}

function isFrequency(value: unknown): value is Frequency {
  return isObject(value) && (value.unit === "week" || value.unit === "month") && isCount(value.every);
}

function isRecurringBill(value: unknown): value is RecurringBill {
  return (
    isObject(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isString(value.currency) &&
    isString(value.payerId) &&
    isStringArray(value.personIds) &&
    isFrequency(value.frequency) &&
    isString(value.createdAt)
  );
}

export function isAppData(value: unknown): value is AppData {
  return (
    isObject(value) &&
    value.version === SCHEMA_VERSION &&
    isArrayOf(value.people, isPerson) &&
    isArrayOf(value.groups, isGroup) &&
    isArrayOf(value.bills, isBill) &&
    isArrayOf(value.recurring, isRecurringBill)
  );
}
