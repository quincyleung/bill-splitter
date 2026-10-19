"use client";

// Home has two faces. A first visit gets the welcome and the two quick starts.
// Coming back gets "Welcome back", then, in order of weight: the big new-bill cards,
// the latest bill, who still owes me and for how long, whom I owe, recurring bills
// that are due, and the next few recent bills. Saved data decides which, so until
// it's read the page shows the neutral loading shell, never the wrong one.

import { ArchArt } from "@/components/home/arch-art";
import { BalanceList } from "@/components/home/balance-list";
import { QuickStarts } from "@/components/home/quick-starts";
import { RecurringList } from "@/components/home/recurring-list";
import { LatestBill } from "@/components/home/latest-bill";
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
  const [latest, ...older] = newestFirst(data.bills);
  const recent = older.slice(0, 4);
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
      <div className="mt-6">
        <QuickStarts />
      </div>
      {latest && <LatestBill bill={latest} people={data.people} />}
      {owed.length > 0 && (
        <BalanceList id="owed-to-me" title="Who owes you" balances={owed} people={data.people} today={today} />
      )}
      {owe.length > 0 && <BalanceList id="i-owe" title="You owe" balances={owe} people={data.people} today={today} />}
      {recurring.length > 0 && <RecurringList statuses={recurring} people={data.people} />}
      {recent.length > 0 && <RecentBills bills={recent} total={data.bills.length} />}
    </>
  );
}
