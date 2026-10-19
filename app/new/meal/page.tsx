import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Split a meal by item" };

export default function NewMealPage() {
  return (
    <PagePlaceholder title="Split a meal by item">
      Who was there, who paid, the items (pasted from a receipt or typed in) and who had each one, then the total paid
      including tax and tip.
    </PagePlaceholder>
  );
}
