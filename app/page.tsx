import { HomeStatus } from "@/components/home/home-status";
import { QuickStarts } from "@/components/home/quick-starts";
import { SavedBills } from "@/components/home/saved-bills";
import { PageTitle } from "@/components/ui/page-title";

// No title of its own: Home uses the layout's default, "Bill Splitter".
export default function HomePage() {
  return (
    <>
      <PageTitle>Split a bill</PageTitle>
      <HomeStatus />
      <div className="mt-6">
        <QuickStarts />
      </div>
      <SavedBills />
    </>
  );
}
