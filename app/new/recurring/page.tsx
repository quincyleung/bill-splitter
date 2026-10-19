import type { Metadata } from "next";
import { NewBill } from "@/components/bill-form/new-bill";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "Recurring" };

export default function NewRecurringPage() {
  return (
    <>
      <PageTitle>Recurring</PageTitle>
      <div className="mt-6">
        <NewBill preset="recurring" />
      </div>
    </>
  );
}
