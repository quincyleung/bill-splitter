"use client";

// Home has two faces. A first visit gets just "Split a bill" and the two quick starts.
// Coming back gets a big "Bill Splitter", then, in order of weight: the new-bill cards,
// who still owes me and for how long, whom I owe, recurring bills that are due, and
// the five most recent bills (latest at the top). Saved data decides which, so until
// it's read the page shows the neutral loading shell, never the wrong one.

import { BalanceList } from "@/components/home/balance-list";
import { QuickStarts } from "@/components/home/quick-starts";
import { RecurringList } from "@/components/home/recurring-list";
import { RecentBills } from "@/components/home/recent-bills";
import { LoadingShell } from "@/components/loading-shell";
import { UnreadableNotice } from "@/components/unreadable-notice";
import { PageTitle } from "@/components/ui/page-title";
import { iOwe, owedToMe, totalOf } from "@/lib/balances";
import { newestFirst } from "@/lib/bills";
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
        <HomeTitle />
        <div className="mt-4">
          <UnreadableNotice raw={state.raw} />
        </div>
      </>
    );
  }
  return state.data.bills.length === 0 ? <FirstVisit /> : <Returning data={state.data} />;
}

/** Home's title once there's anything saved: the app's name, big. */
function HomeTitle() {
  return <h1 className="type-display pt-6 text-ink">Bill Splitter</h1>;
}

/**
 * Just "Split a bill" and the two cards: no app name, no illustration, no explanation.
 * Near the middle of the screen but slightly above it (two shares of the space above,
 * three below, so it holds on any phone height), with wider side margins.
 */
function FirstVisit() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col px-4">
      <div aria-hidden="true" className="flex-[2]" />
      <PageTitle>Split a bill</PageTitle>
      <div className="mt-6">
        <QuickStarts />
      </div>
      <div aria-hidden="true" className="flex-[3]" />
    </div>
  );
}

function Returning({ data }: { data: AppData }) {
  const today = todayIso();
  const owed = owedToMe(data);
  const owe = iOwe(data);
  const recurring = recurringStatuses(data, today);
  const due = recurring.filter((r) => r.due).length;
  const recent = newestFirst(data.bills).slice(0, 5);
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
      <HomeTitle />
      <p className="mt-1 text-ink-muted">{summary}</p>
      <div className="mt-6">
        <QuickStarts />
      </div>
      {owed.length > 0 && (
        <BalanceList id="owed-to-me" title="Who owes you" balances={owed} people={data.people} today={today} />
      )}
      {owe.length > 0 && <BalanceList id="i-owe" title="You owe" balances={owe} people={data.people} today={today} />}
      {recurring.length > 0 && <RecurringList statuses={recurring} people={data.people} />}
      <RecentBills bills={recent} people={data.people} total={data.bills.length} />
    </>
  );
}
