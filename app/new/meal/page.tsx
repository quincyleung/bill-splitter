import type { Metadata } from "next";
import { NewBill } from "@/components/bill-form/new-bill";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "Meal" };

export default function NewMealPage() {
  return (
    <>
      <PageTitle>Meal</PageTitle>
      <div className="mt-6">
        <NewBill preset="meal" />
      </div>
    </>
  );
}
