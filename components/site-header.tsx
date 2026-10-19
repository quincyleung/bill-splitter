"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** No bar: the app name sits at the top of the page, on the same background, and goes back to Home. */
export function HeaderBar() {
  return (
    <header className="mx-auto w-full max-w-xl px-4 pt-5">
      <Link href="/" className="type-title inline-flex min-h-11 items-center text-ink hover:text-accent">
        Bill Splitter<span className="sr-only">, home</span>
      </Link>
    </header>
  );
}

/**
 * Every page except Home has the app name at the top as the way back. Home doesn't:
 * a first visit is just "Split a bill", and coming back, "Bill Splitter" is Home's
 * own big title.
 * Must sit inside <Suspense>: with Cache Components, usePathname suspends on pages with an unknown id.
 */
export function SiteHeader() {
  return usePathname() === "/" ? null : <HeaderBar />;
}
