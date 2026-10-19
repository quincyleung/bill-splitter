import { ButtonLink } from "@/components/ui/button-link";
import { formatDate } from "@/lib/dates";
import { ME, type Person } from "@/lib/model";
import { personName } from "@/lib/people";
import { frequencyLabel, type RecurringStatus } from "@/lib/recurring";

/** Recurring bills, due ones first, each due one with "Add Nov 1" to add this time's bill. */
export function RecurringList({ statuses, people }: { statuses: RecurringStatus[]; people: Person[] }) {
  return (
    <section aria-labelledby="recurring" className="mt-8">
      <h2 id="recurring" className="type-title text-ink">
        Recurring bills
      </h2>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
        {statuses.map(({ series, nextDue, due }) => {
          const frequency = frequencyLabel(series.frequency);
          return (
            <li key={series.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <span>
                <span className="block font-semibold text-ink">{series.name}</span>
                <span className="type-small block text-ink-muted">
                  {frequency[0].toUpperCase() + frequency.slice(1)} ·{" "}
                  {series.payerId === ME ? "you pay" : `${personName(series.payerId, people)} pays`} ·{" "}
                  {due ? (
                    <span className="font-semibold text-ink">Due {formatDate(nextDue)}</span>
                  ) : (
                    `Next ${formatDate(nextDue)}`
                  )}
                </span>
              </span>
              {due && (
                <ButtonLink variant="secondary" href={`/new/recurring?series=${series.id}`}>
                  Add {formatDate(nextDue)}
                  <span className="sr-only"> for {series.name}</span>
                </ButtonLink>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
