import Link from "next/link";

/** "← Home" at the top of every page except Home, the way back now that there's no header. */
export function BackLink() {
  return (
    <Link href="/" className="type-control -ml-1 inline-flex min-h-11 items-center gap-1 px-1 text-ink-muted hover:text-ink">
      <span aria-hidden="true">←</span> Home
    </Link>
  );
}
