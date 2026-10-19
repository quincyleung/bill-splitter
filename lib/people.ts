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
