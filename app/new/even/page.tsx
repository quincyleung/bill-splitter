import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Even split" };

export default function NewEvenPage() {
  return (
    <PagePlaceholder title="Even split">
      A one-time bill split evenly, like an Uber ride: what it was, the amount, who was there and who paid.
    </PagePlaceholder>
  );
}
