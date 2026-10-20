import { ME, type Person } from "./model";

/** "You" for ME, otherwise the saved name. */
export function personName(id: string, people: Person[]): string {
  if (id === ME) return "You";
  return people.find((p) => p.id === id)?.name ?? "Someone";
}

/** ["Sam", "Jo", "Alex"] → "Sam, Jo, and Alex" */
export function listNames(names: string[]): string {
  return new Intl.ListFormat("en-US", { type: "conjunction" }).format(names);
}

/**
 * Whether a name matches what's typed: the start of the name or of any word in it,
 * ignoring case. "jo" finds Jo, Josh and Mary Jones.
 */
export function nameMatches(name: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const lower = name.toLowerCase();
  return lower.startsWith(q) || lower.split(/\s+/).some((word) => word.startsWith(q));
}

/** A to Z by name, ignoring case and accents. */
export function byName<T extends { name: string }>(a: T, b: T): number {
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}
