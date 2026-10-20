"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useId, useRef, useState } from "react";
import { LoadingShell } from "@/components/loading-shell";
import { UnreadableNotice } from "@/components/unreadable-notice";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertIcon } from "@/components/ui/icons";
import { PageTitle } from "@/components/ui/page-title";
import { showToast } from "@/components/ui/toast";
import { billHeadline, trackedShares, withoutBill, withPaid } from "@/lib/bills";
import { breakdownFor } from "@/lib/breakdown";
import { copyText } from "@/lib/clipboard";
import { formatDate } from "@/lib/dates";
import { type Bill, ME, type Person, type RecurringBill, type Share } from "@/lib/model";
import { shareMessage } from "@/lib/messages";
import { formatMoney } from "@/lib/money";
import { personName } from "@/lib/people";
import { frequencyLabel } from "@/lib/recurring";
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
        <p className="mt-2 text-ink">This bill isn&apos;t on this phone. It may have been deleted.</p>
        <div className="mt-6">
          <ButtonLink href="/">Back to Home</ButtonLink>
        </div>
      </>
    );
  }

  const series = bill.kind === "recurring" ? state.data.recurring.find((r) => r.id === bill.recurringId) : undefined;
  return <BillDetails bill={bill} people={state.data.people} series={series} />;
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

  /** Marks a share paid back (or not). If saving fails, the box stays as it was. */
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

  async function copyMessage(share: Share) {
    const copied = await copyText(shareMessage(bill, share.personId));
    showToast(copied ? `Copied a message for ${name(share.personId)}.` : "Couldn't copy. Try again.");
  }

  const headline = billHeadline(bill, people);

  return (
    <>
      <PageTitle>{bill.title}</PageTitle>
      <p className="mt-1 text-ink-muted">
        {formatDate(bill.date)} · {money(bill.total)} · {youPaid ? "You paid" : `${name(bill.payerId)} paid`}
        {series && ` · Repeats ${frequencyLabel(series.frequency)}`}
      </p>

      <p className="type-lead mt-6 text-ink">{headline}</p>
      {owed.length > 0 && (
        <p className="type-small mt-1 text-ink-muted">
          {owed.length - unpaid.length} of {owed.length} paid
        </p>
      )}
      {saveError && (
        <p role="alert" className="type-small mt-3 flex items-start gap-2 font-semibold text-danger">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {saveError}
        </p>
      )}

      <div className="mt-5 space-y-4">
        {owed.map((share) => (
          <ShareCard
            key={share.personId}
            bill={bill}
            share={share}
            title={name(share.personId)}
            status={share.paid ? "Paid you back" : "Owes you"}
            onPaid={(paid) => setPaid(share.personId, paid)}
            onCopy={() => copyMessage(share)}
          />
        ))}
        {myShare &&
          (youPaid ? (
            <ShareCard bill={bill} share={myShare} title="Your share" />
          ) : (
            <ShareCard
              bill={bill}
              share={myShare}
              title="Your share"
              status={myShare.paid ? `Paid ${name(bill.payerId)} back` : `You owe ${name(bill.payerId)}`}
              onPaid={(paid) => setPaid(ME, paid)}
            />
          ))}
      </div>

      {othersWithPayer.length > 0 && (
        <p className="type-small mt-4 text-ink-muted">
          Others&apos; shares, between them and {name(bill.payerId)}:{" "}
          {othersWithPayer.map((s) => `${name(s.personId)} ${money(s.amount)}`).join(", ")}
        </p>
      )}

      <DeleteBill bill={bill} />
    </>
  );
}

/**
 * "Delete bill", then an inline "Delete Dinner at Aba? This can't be undone." with a red
 * Delete bill and Cancel. Deleting goes back to Home. Focus moves into the question when
 * it opens, and back to "Delete bill" on Cancel.
 */
function DeleteBill({ bill }: { bill: Bill }) {
  const router = useRouter();
  const questionId = useId();
  const [confirming, setConfirming] = useState(false);
  const [focusTarget, setFocusTarget] = useState<"question" | "trigger" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusTarget === "question") questionRef.current?.focus();
    if (focusTarget === "trigger") triggerRef.current?.focus();
  }, [focusTarget, confirming]);

  function remove() {
    const result = updateData((data) => withoutBill(data, bill.id));
    if (!result.ok) {
      setError("Couldn't delete it. Try again.");
      return;
    }
    showToast(`Deleted ${bill.title}.`);
    router.push("/");
  }

  return (
    <div className="mt-10">
      {confirming ? (
        <div
          ref={questionRef}
          tabIndex={-1}
          role="group"
          aria-labelledby={questionId}
          className="rounded-card border border-danger bg-surface p-5 outline-none"
        >
          <p id={questionId} className="font-semibold text-ink">
            Delete {bill.title}? This can&apos;t be undone.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="danger" onClick={remove}>
              Delete bill
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirming(false);
                setError(null);
                setFocusTarget("trigger");
              }}
            >
              Cancel
            </Button>
          </div>
          {error && (
            <p role="alert" className="type-small mt-3 flex items-start gap-2 font-semibold text-danger">
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}
        </div>
      ) : (
        <Button
          ref={triggerRef}
          variant="secondary"
          onClick={() => {
            setConfirming(true);
            setFocusTarget("question");
          }}
        >
          Delete bill
        </Button>
      )}
    </div>
  );
}

type ShareCardProps = {
  bill: Bill;
  share: Share;
  title: string;
  status?: string;
  /** Present when this share can be marked paid. */
  onPaid?: (paid: boolean) => void;
  onCopy?: () => void;
};

/** One person's share and how it was worked out, with Mark paid and Copy message. */
function ShareCard({ bill, share, title, status, onPaid, onCopy }: ShareCardProps) {
  const money = (amount: number) => formatMoney(Math.round(amount), bill.currency);
  const breakdown = breakdownFor(bill, share.personId);
  const settled = Boolean(onPaid) && share.paid;

  return (
    <Card as="section">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="type-title text-ink">{title}</h2>
        <p className={`type-lead ${settled ? "text-ink-muted line-through" : "text-ink"}`}>{money(share.amount)}</p>
      </div>
      {status && <p className="type-small text-ink-muted">{status}</p>}

      <ul className="type-small mt-3 space-y-1 text-ink-muted" aria-label={`How ${title === "Your share" ? "your share" : `${title}'s share`} was worked out`}>
        {breakdown.kind === "items" ? (
          <>
            {breakdown.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-3">
                <span>
                  {item.name}
                  {item.sharedBy > 1 && `, shared by ${item.sharedBy}`}
                </span>
                <span>{money(item.amount)}</span>
              </li>
            ))}
            {breakdown.items.length === 0 && <li>No items</li>}
            <li className="flex justify-between gap-3 border-t border-line pt-1 text-ink">
              <span>Items</span>
              <span>{money(breakdown.itemsTotal)}</span>
            </li>
            <li className="flex justify-between gap-3 text-ink">
              <span>Tax and tip ({Math.round(breakdown.rate * 100)}% of items)</span>
              <span>+{money(breakdown.taxAndTip)}</span>
            </li>
          </>
        ) : (
          <li>
            {breakdown.ways === 1
              ? "The whole bill"
              : `${money(breakdown.total)} split ${breakdown.ways} ways`}
          </li>
        )}
      </ul>

      {onPaid && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <Checkbox
            label={
              <>
                Mark paid<span className="sr-only"> for {title === "Your share" ? "your share" : title}</span>
              </>
            }
            checked={share.paid}
            onChange={onPaid}
          />
          {onCopy && !share.paid && (
            <Button variant="secondary" onClick={onCopy}>
              Copy message<span className="sr-only"> for {title}</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
