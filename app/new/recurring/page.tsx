import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Recurring bill" };

export default function NewRecurringPage() {
  return (
    <PagePlaceholder title="Recurring bill">
      A bill that repeats, like Electricity: the amount, your roommates, who paid and how often it repeats. Split
      evenly.
    </PagePlaceholder>
  );
}
