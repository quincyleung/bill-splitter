import type { Metadata } from "next";
import { Suspense } from "react";
import { NewBill } from "@/components/bill-form/new-bill";
import { LoadingShell } from "@/components/loading-shell";
import { BackLink } from "@/components/back-link";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "Recurring bill" };

// "Add Nov 1" on Home links here with ?series=<id>, to fill in last time's details.
// Search params are only known at request time, so that part waits inside Suspense.
export default function NewRecurringPage({ searchParams }: PageProps<"/new/recurring">) {
  return (
    <>
      <BackLink />
      <PageTitle>Recurring bill</PageTitle>
      <div className="mt-6">
        <Suspense fallback={<LoadingShell />}>
          <RecurringForm searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function RecurringForm({ searchParams }: Pick<PageProps<"/new/recurring">, "searchParams">) {
  const { series } = await searchParams;
  return <NewBill preset="recurring" seriesId={typeof series === "string" ? series : undefined} />;
}
