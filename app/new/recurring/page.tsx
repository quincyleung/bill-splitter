import type { Metadata } from "next";
import { NewBill } from "@/components/bill-form/new-bill";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "Monthly bill" };

export default function NewMonthlyBillPage() {
  return (
    <>
      <PageTitle>Monthly bill</PageTitle>
      <div className="mt-6">
        <NewBill preset="monthly" />
      </div>
    </>
  );
}
