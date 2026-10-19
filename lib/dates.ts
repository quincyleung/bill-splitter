// Bill dates are stored as YYYY-MM-DD in the phone's local time.

const pad = (n: number) => String(n).padStart(2, "0");

export function todayIso(now = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/** "2026-10-18" → "Oct 18", with the year only when it isn't this year. */
export function formatDate(iso: string, now = new Date()): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(year !== now.getFullYear() && { year: "numeric" }),
  }).format(new Date(year, month - 1, day));
}

function parse(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, days: number): string {
  const date = parse(iso);
  date.setDate(date.getDate() + days);
  return todayIso(date);
}

/** Months later, on `day` of that month, or its last day if the month is shorter (Jan 31 → Feb 28). */
export function addMonths(iso: string, months: number, day: number): string {
  const date = parse(iso);
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  return todayIso(target);
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((parse(toIso).getTime() - parse(fromIso).getTime()) / 86_400_000);
}

/** How long something has been outstanding: "since today", "for 3 days", "for 2 weeks", "for 2 months". */
export function durationLabel(days: number): string {
  if (days <= 0) return "since today";
  if (days === 1) return "for 1 day";
  if (days < 14) return `for ${days} days`;
  if (days < 60) return `for ${Math.floor(days / 7)} weeks`;
  return `for ${Math.floor(days / 30)} months`;
}
