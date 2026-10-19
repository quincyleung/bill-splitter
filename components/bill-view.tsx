"use client";

import { use, useState } from "react";
import { LoadingShell } from "@/components/loading-shell";
import { UnreadableNotice } from "@/components/unreadable-notice";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { CheckRow } from "@/components/ui/check-row";
import { AlertIcon } from "@/components/ui/icons";
import { PageTitle } from "@/components/ui/page-title";
import { showToast } from "@/components/ui/toast";
import { trackedShares, withPaid } from "@/lib/bills";
import { copyText } from "@/lib/clipboard";
import { formatDate } from "@/lib/dates";
import { type Bill, type Frequency, ME, type Person, type RecurringBill } from "@/lib/model";
import { formatMoney } from "@/lib/money";
import { listNames, personName } from "@/lib/people";
import { updateData, useAppData } from "@/lib/store";

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const name = (id: string) => personName(id, people);
  const money = (amount: number) => formatMoney(amount, bill.currency);
  const youPaid = bill.payerId === ME;
  const myShare = bill.shares.find((s) => s.personId === ME);
  // When I paid, everyone else owes me. When someone else paid, only my share is tracked.
  const owed = youPaid ? trackedShares(bill) : [];
  const unpaid = owed.filter((s) => !s.paid);
  const othersWithPayer = youPaid ? [] : bill.shares.filter((s) => s.personId !== ME && s.personId !== bill.payerId);

  /** Ticks a share off as paid back (or unticks it). If saving fails, the tick stays as it was. */
  function setPaid(personId: string, paid: boolean) {
    const result = updateData((data) => ({
      ...data,
      bills: data.bills.map((b) => (b.id === bill.id ? withPaid(b, personId, paid, new Date()) : b)),
    }));
    if (!result.ok) {
      setSaveError("Couldn't save that. Try again.");
      return;
    }
    setSaveError(null);
    if (paid && youPaid && unpaid.every((s) => s.personId === personId)) showToast("Everyone's paid you back.");
  }

  async function copyAmounts() {
    const amounts = unpaid.map((s) => `${name(s.personId)} ${money(s.amount)}`).join(", ");
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
                {owed.length === 0
                  ? "Nobody owes you on this bill"
                  : unpaid.length === 0
                    ? "All paid up"
                    : `${listNames(unpaid.map((s) => name(s.personId)))} ${unpaid.length === 1 ? "owes" : "owe"} you ${money(unpaid.reduce((sum, s) => sum + s.amount, 0))}`}
              </h2>
              {owed.length > 0 && (
                <p className="mt-1 text-sm text-ink-muted">
                  {owed.length - unpaid.length} of {owed.length} paid. Tick each person when they pay you back.
                </p>
              )}
              <ul className="-mx-3 mt-2">
                {owed.map((share) => (
                  <li key={share.personId}>
                    <CheckRow
                      label={name(share.personId)}
                      detail={share.paid ? "Paid you back" : "Owes you"}
                      value={money(share.amount)}
                      checked={share.paid}
                      onChange={(paid) => setPaid(share.personId, paid)}
                    />
                  </li>
                ))}
              </ul>
              {myShare && <p className="mt-2 text-base text-ink-muted">Your share {money(myShare.amount)}</p>}
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-ink">
                {myShare?.paid
                  ? `You've paid ${name(bill.payerId)} back`
                  : `You owe ${name(bill.payerId)} ${money(myShare?.amount ?? 0)}`}
              </h2>
              {myShare && (
                <div className="-mx-3 mt-2">
                  <CheckRow
                    label={`I paid ${name(bill.payerId)} back`}
                    detail={myShare.paid ? "Paid back" : "Not paid back yet"}
                    value={money(myShare.amount)}
                    checked={myShare.paid}
                    onChange={(paid) => setPaid(ME, paid)}
                  />
                </div>
              )}
              {othersWithPayer.length > 0 && (
                <p className="mt-2 text-base text-ink-muted">
                  Others&apos; shares, between them and {name(bill.payerId)}:{" "}
                  {othersWithPayer.map((s) => `${name(s.personId)} ${money(s.amount)}`).join(", ")}
                </p>
              )}
            </>
          )}
          {saveError && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-sm font-semibold text-danger">
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              {saveError}
            </p>
          )}
        </Card>
      </div>

      {unpaid.length > 0 && (
        <div className="mt-4">
          <Button variant="secondary" onClick={copyAmounts}>
            Copy amounts
          </Button>
        </div>
      )}
    </>
  );
}
