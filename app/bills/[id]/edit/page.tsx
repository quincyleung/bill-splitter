import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Edit bill" };

export default function EditBillPage() {
  return (
    <PagePlaceholder title="Edit bill">
      The same form the bill was made with, filled in, to fix a mistake.
    </PagePlaceholder>
  );
}
