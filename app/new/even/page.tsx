import type { Metadata } from "next";
import { NewBill } from "@/components/bill-form/new-bill";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "Even split" };

export default function NewEvenSplitPage() {
  return (
    <>
      <PageTitle>Even split</PageTitle>
      <div className="mt-6">
        <NewBill preset="even" />
      </div>
    </>
  );
}
