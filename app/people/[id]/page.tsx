import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Person" };

export default function PersonPage() {
  return (
    <PagePlaceholder title="Person">
      Every open bill between you and this person in both directions, the net balance, and Settle up.
    </PagePlaceholder>
  );
}
