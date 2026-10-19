"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArchMark } from "@/components/arch-mark";
import { useAppData } from "@/lib/store";

/** No bar: the app name sits at the top of the page, on the same background, and goes back to Home. */
export function HeaderBar() {
  return (
    <header className="mx-auto w-full max-w-xl px-4 pt-5">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-ink hover:text-accent">
        <ArchMark />
        <span className="type-title">Bill Splitter</span>
        <span className="sr-only">, home</span>
      </Link>
    </header>
  );
}

/**
 * The first-visit Home is just "Split a bill" and the two cards, so it has no app
 * name above it. Home stays bare until saved data is read, then shows the name only
 * if there are bills. Every other page always has it.
 * Must sit inside <Suspense>: with Cache Components, usePathname suspends on pages with an unknown id.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const state = useAppData();
  const firstVisitHome =
    pathname === "/" && (state.status === "loading" || (state.status === "ready" && state.data.bills.length === 0));
  return firstVisitHome ? null : <HeaderBar />;
}
