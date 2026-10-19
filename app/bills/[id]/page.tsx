import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Bill" };

export default function BillPage() {
  return (
    <PagePlaceholder title="Bill">
      Who owes whom on this bill, with Mark paid, Copy amounts, Edit and Delete.
    </PagePlaceholder>
  );
}
