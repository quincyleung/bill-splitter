import { SectionLabel } from "@/components/home/section-label";
import { ButtonLink } from "@/components/ui/button-link";
import { RowList, RowText, rowClass } from "@/components/ui/rows";
import { formatDate } from "@/lib/dates";
import { ME, type Person } from "@/lib/model";
import { personName } from "@/lib/people";
import { frequencyLabel, type RecurringStatus } from "@/lib/recurring";

/** Recurring bills, due ones first, each due one with "Add Nov 1" to add this time's bill. */
export function RecurringList({ statuses, people }: { statuses: RecurringStatus[]; people: Person[] }) {
  return (
    <section aria-labelledby="recurring" className="mt-8">
      <SectionLabel id="recurring">Recurring bills</SectionLabel>
      <div className="mt-3">
        <RowList>
          {statuses.map(({ series, nextDue, due }) => {
            const frequency = frequencyLabel(series.frequency);
            return (
              <li key={series.id} className={`${rowClass} flex-wrap`}>
                <RowText
                  title={series.name}
                  meta={
                    <>
                      {frequency[0].toUpperCase() + frequency.slice(1)} ·{" "}
                      {series.payerId === ME ? "you pay" : `${personName(series.payerId, people)} pays`} ·{" "}
                      {due ? (
                        <span className="font-semibold text-ink">Due {formatDate(nextDue)}</span>
                      ) : (
                        `Next ${formatDate(nextDue)}`
                      )}
                    </>
                  }
                />
                {due && (
                  <ButtonLink variant="secondary" href={`/new/recurring?series=${series.id}`}>
                    Add {formatDate(nextDue)}
                    <span className="sr-only"> for {series.name}</span>
                  </ButtonLink>
                )}
              </li>
            );
          })}
        </RowList>
      </div>
    </section>
  );
}
