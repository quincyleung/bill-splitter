import type { Metadata } from "next";
import { NewBill } from "@/components/bill-form/new-bill";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "One-time bill" };

export default function NewOneTimePage() {
  return (
    <>
      <PageTitle>One-time bill</PageTitle>
      <div className="mt-6">
        <NewBill preset="one-time" />
      </div>
    </>
  );
}
