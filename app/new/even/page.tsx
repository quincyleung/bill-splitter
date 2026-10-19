import type { Metadata } from "next";
import { NewBill } from "@/components/bill-form/new-bill";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "Uber" };

export default function NewUberPage() {
  return (
    <>
      <PageTitle>Uber</PageTitle>
      <div className="mt-6">
        <NewBill preset="uber" />
      </div>
    </>
  );
}
