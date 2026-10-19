// When each recurring bill is next due. Nothing is created automatically:
// Home shows "Add Nov 1" once a bill is due, and I add it when it arrives.

import { addDays, addMonths } from "./dates";
import type { AppData, Bill, Frequency, RecurringBill } from "./model";

export type RecurringStatus = {
  series: RecurringBill;
  /** The most recent bill added for it. */
  last: Bill | undefined;
  /** YYYY-MM-DD */
  nextDue: string;
  due: boolean;
};

/**
 * The next date after `last`. Monthly bills keep the day of the first bill, so one
 * that started on the 31st is due on the 30th in April and back on the 31st in May.
 */
export function nextDate(last: string, frequency: Frequency, firstDay: number): string {
  return frequency.unit === "week" ? addDays(last, 7 * frequency.every) : addMonths(last, frequency.every, firstDay);
}

/** Every recurring bill, due ones first, then by next date. */
export function recurringStatuses(data: AppData, today: string): RecurringStatus[] {
  return data.recurring
    .map((series) => {
      const bills = data.bills
        .filter((b) => b.kind === "recurring" && b.recurringId === series.id)
        .sort((a, b) => a.date.localeCompare(b.date));
      const first = bills[0];
      const last = bills[bills.length - 1];
      const nextDue = last ? nextDate(last.date, series.frequency, Number(first.date.slice(8))) : today;
      return { series, last, nextDue, due: nextDue <= today };
    })
    .sort((a, b) => Number(b.due) - Number(a.due) || a.nextDue.localeCompare(b.nextDue));
}

export function frequencyLabel({ unit, every }: Frequency): string {
  if (every === 1) return unit === "week" ? "weekly" : "monthly";
  return `every ${every} ${unit}s`;
}
