import type { Metadata } from "next";
import { AllBills } from "@/components/bills/all-bills";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "All bills" };

export default function AllBillsPage() {
  return (
    <>
      <PageTitle>All bills</PageTitle>
      <div className="mt-6">
        <AllBills />
      </div>
    </>
  );
}
