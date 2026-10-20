import type { Metadata } from "next";
import { NewBill } from "@/components/bill-form/new-bill";
import { BackLink } from "@/components/back-link";
import { PageTitle } from "@/components/ui/page-title";

export const metadata: Metadata = { title: "One-time bill" };

export default function NewOneTimePage() {
  return (
    <>
      <BackLink />
      <PageTitle>One-time bill</PageTitle>
      <div className="mt-6">
        <NewBill preset="one-time" />
      </div>
    </>
  );
}
