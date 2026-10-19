import { PagePlaceholder } from "@/components/page-placeholder";

// No title of its own: Home uses the layout's default, "Bill Splitter".
export default function HomePage() {
  return (
    <PagePlaceholder title="Home">
      Who owes whom, recurring bills that are due, your bills, and the three ways to start one. On a first visit, a
      welcome and the three start buttons.
    </PagePlaceholder>
  );
}
