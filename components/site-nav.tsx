"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  /** Pages that count as this item's section, e.g. a bill page is part of Home. */
  inSection: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Home",
    inSection: (pathname) => pathname === "/" || pathname.startsWith("/bills/") || pathname.startsWith("/people/"),
  },
  { href: "/new/meal", label: "Meal", inSection: (pathname) => pathname === "/new/meal" },
  { href: "/new/even", label: "Even split", inSection: (pathname) => pathname === "/new/even" },
  { href: "/new/recurring", label: "Recurring", inSection: (pathname) => pathname === "/new/recurring" },
];

/**
 * The current page gets aria-current="page". A page inside a section (a bill or a
 * person, under Home) marks that section with aria-current="true". With pathname
 * null, nothing is marked: that's the fallback while a page with an id in its URL
 * is prerendered.
 */
export function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Main">
      <ul className="grid grid-cols-4 gap-1">
        {NAV_ITEMS.map((item) => {
          const current = pathname !== null && item.inSection(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : current ? "true" : undefined}
                className={`flex min-h-11 items-center justify-center rounded-lg px-1 py-1 text-center text-sm font-semibold ${
                  current ? "bg-accent text-on-accent" : "text-ink hover:bg-accent-soft"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Must sit inside <Suspense>: with Cache Components, usePathname suspends on pages with an unknown id. */
export function SiteNav() {
  const pathname = usePathname();
  return <NavLinks pathname={pathname} />;
}
