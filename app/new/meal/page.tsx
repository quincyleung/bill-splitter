import type { Metadata } from "next";
import { NewBill } from "@/components/bill-form/new-bill";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "Dinner" };

export default function NewDinnerPage() {
  return (
    <>
      <PageTitle>Dinner</PageTitle>
      <div className="mt-6">
        <NewBill preset="dinner" />
      </div>
    </>
  );
}
