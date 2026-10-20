import type { Metadata } from "next";
import { Suspense } from "react";
import { BackLink } from "@/components/back-link";
import { BillView } from "@/components/bill-view";
import { LoadingShell } from "@/components/loading-shell";

export const metadata: Metadata = { title: "Bill" };

// The id is only known at request time, so the client part waits inside Suspense.
export default function BillPage({ params }: PageProps<"/bills/[id]">) {
  return (
    <>
      <BackLink />
      <Suspense fallback={<LoadingShell />}>
        <BillView params={params} />
      </Suspense>
    </>
  );
}
