"use client";

// Home has two faces. A first visit gets the welcome and the two quick starts.
// Coming back gets "Welcome back": who still owes me and for how long, whom I owe,
// recurring bills that are due, then my bills. Saved data decides which, so until
// it's read the page shows the neutral loading shell, never the wrong one.

import { ArchArt } from "@/components/home/arch-art";
import { BalanceList } from "@/components/home/balance-list";
import { QuickStarts } from "@/components/home/quick-starts";
import { RecurringList } from "@/components/home/recurring-list";
import { SavedBills } from "@/components/home/saved-bills";
import { LoadingShell } from "@/components/loading-shell";
import { UnreadableNotice } from "@/components/unreadable-notice";
import { ButtonLink } from "@/components/ui/button-link";
import { PageTitle } from "@/components/ui/page-title";
import { iOwe, owedToMe, totalOf } from "@/lib/balances";
import { todayIso } from "@/lib/dates";
import type { AppData } from "@/lib/model";
import { formatMoney } from "@/lib/money";
import { recurringStatuses } from "@/lib/recurring";
import { useAppData } from "@/lib/store";

export function HomeView() {
  const state = useAppData();
  if (state.status === "loading") return <LoadingShell />;
  if (state.status === "unreadable") {
    return (
      <>
        <PageTitle>Split a bill</PageTitle>
        <div className="mt-4">
          <UnreadableNotice raw={state.raw} />
        </div>
      </>
    );
  }
  return state.data.bills.length === 0 ? <FirstVisit /> : <Returning data={state.data} />;
}

function FirstVisit() {
  return (
    <>
      <ArchArt />
      <div className="mt-6">
        <PageTitle>Split a bill</PageTitle>
      </div>
      <p className="mt-2 text-ink-muted">
        Pick one to start. Everything stays on this phone, and your friends don&apos;t need the app.
      </p>
      <div className="mt-6">
        <QuickStarts />
      </div>
    </>
  );
}

function Returning({ data }: { data: AppData }) {
  const today = todayIso();
  const owed = owedToMe(data);
  const owe = iOwe(data);
  const recurring = recurringStatuses(data, today);
  const due = recurring.filter((r) => r.due).length;
  const money = (balances: typeof owed) =>
    totalOf(balances)
      .map((t) => formatMoney(t.amount, t.currency))
      .join(" and ");

  const summary = [
    owed.length > 0 && `You're owed ${money(owed)}.`,
    owe.length > 0 && `You owe ${money(owe)}.`,
    owed.length === 0 && owe.length === 0 && "Nobody owes anyone right now.",
    due > 0 && `${due} recurring ${due === 1 ? "bill is" : "bills are"} due.`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <PageTitle>Welcome back</PageTitle>
      <p className="mt-1 text-ink-muted">{summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <ButtonLink href="/new/one-time">New one-time bill</ButtonLink>
        <ButtonLink href="/new/recurring" variant="secondary">
          New recurring bill
        </ButtonLink>
      </div>
      {owed.length > 0 && (
        <BalanceList id="owed-to-me" title="Who owes you" balances={owed} people={data.people} today={today} />
      )}
      {owe.length > 0 && <BalanceList id="i-owe" title="You owe" balances={owe} people={data.people} today={today} />}
      {recurring.length > 0 && <RecurringList statuses={recurring} people={data.people} />}
      <SavedBills />
    </>
  );
}
