"use client";

import { use } from "react";
import { LoadingShell } from "@/components/loading-shell";
import { UnreadableNotice } from "@/components/unreadable-notice";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { showToast } from "@/components/ui/toast";
import { copyText } from "@/lib/clipboard";
import { formatDate } from "@/lib/dates";
import { type Bill, type Frequency, ME, type Person, type RecurringBill } from "@/lib/model";
import { formatMoney } from "@/lib/money";
import { listNames, personName } from "@/lib/people";
import { useAppData } from "@/lib/store";

export function BillView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const state = useAppData();

  if (state.status === "loading") return <LoadingShell />;
  if (state.status === "unreadable") return <UnreadableNotice raw={state.raw} />;

  const bill = state.data.bills.find((b) => b.id === id);
  if (!bill) {
    return (
      <>
        <PageTitle>Bill not found</PageTitle>
        <p className="mt-2 text-base text-ink">This bill isn&apos;t on this phone. It may have been deleted.</p>
        <div className="mt-6">
          <ButtonLink href="/">Back to Home</ButtonLink>
        </div>
      </>
    );
  }

  const series = bill.kind === "recurring" ? state.data.recurring.find((r) => r.id === bill.recurringId) : undefined;
  return <BillDetails bill={bill} people={state.data.people} series={series} />;
}

function frequencyLabel({ unit, every }: Frequency): string {
  if (every === 1) return unit === "week" ? "weekly" : "monthly";
  return `every ${every} ${unit}s`;
}

function BillDetails({ bill, people, series }: { bill: Bill; people: Person[]; series?: RecurringBill }) {
  const name = (id: string) => personName(id, people);
  const money = (amount: number) => formatMoney(amount, bill.currency);
  const youPaid = bill.payerId === ME;
  const myShare = bill.shares.find((s) => s.personId === ME);
  // When I paid, everyone else owes me. When someone else paid, only my share is tracked.
  const owed = youPaid ? bill.shares.filter((s) => s.personId !== ME) : [];
  const owedTotal = owed.reduce((sum, s) => sum + s.amount, 0);
  const othersWithPayer = youPaid ? [] : bill.shares.filter((s) => s.personId !== ME && s.personId !== bill.payerId);

  async function copyAmounts() {
    const amounts = owed.map((s) => `${name(s.personId)} ${money(s.amount)}`).join(", ");
    const copied = await copyText(`I paid for ${bill.title} (${formatDate(bill.date)}). ${amounts}.`);
    showToast(copied ? "Copied. Paste it into your group chat." : "Couldn't copy. Try again.");
  }

  return (
    <>
      <PageTitle>{bill.title}</PageTitle>
      <p className="mt-1 text-base text-ink-muted">
        {formatDate(bill.date)} · {money(bill.total)} · {youPaid ? "You paid" : `${name(bill.payerId)} paid`}
        {series && ` · Repeats ${frequencyLabel(series.frequency)}`}
      </p>

      <div className="mt-6">
        <Card as="section">
          {youPaid ? (
            <>
              <h2 className="text-lg font-bold text-ink">
                {owed.length > 0
                  ? `${listNames(owed.map((s) => name(s.personId)))} ${owed.length === 1 ? "owes" : "owe"} you ${money(owedTotal)}`
                  : "Nobody owes you on this bill"}
              </h2>
              <ul className="mt-2 divide-y divide-line">
                {owed.map((share) => (
                  <li key={share.personId} className="flex justify-between gap-3 py-2 text-base">
                    <span className="text-ink">{name(share.personId)}</span>
                    <span className="font-semibold text-ink">{money(share.amount)}</span>
                  </li>
                ))}
              </ul>
              {myShare && <p className="mt-2 text-base text-ink-muted">Your share {money(myShare.amount)}</p>}
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-ink">
                You owe {name(bill.payerId)} {money(myShare?.amount ?? 0)}
              </h2>
              {othersWithPayer.length > 0 && (
                <p className="mt-2 text-base text-ink-muted">
                  Others&apos; shares, between them and {name(bill.payerId)}:{" "}
                  {othersWithPayer.map((s) => `${name(s.personId)} ${money(s.amount)}`).join(", ")}
                </p>
              )}
            </>
          )}
        </Card>
      </div>

      {owed.length > 0 && (
        <div className="mt-4">
          <Button variant="secondary" onClick={copyAmounts}>
            Copy amounts
          </Button>
        </div>
      )}
    </>
  );
}
