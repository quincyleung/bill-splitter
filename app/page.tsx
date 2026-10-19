import { ArchArt } from "@/components/home/arch-art";
import { HomeStatus } from "@/components/home/home-status";
import { OwedToMe } from "@/components/home/owed-to-me";
import { QuickStarts } from "@/components/home/quick-starts";
import { SavedBills } from "@/components/home/saved-bills";
import { PageTitle } from "@/components/ui/page-title";

// No title of its own: Home uses the layout's default, "Bill Splitter".
export default function HomePage() {
  return (
    <>
      <ArchArt />
      <div className="mt-6">
        <PageTitle>Split a bill</PageTitle>
      </div>
      <HomeStatus />
      <div className="mt-6">
        <QuickStarts />
      </div>
      <OwedToMe />
      <SavedBills />
    </>
  );
}
