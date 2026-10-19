import type { ReactNode } from "react";

/** The page's one h1. */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-bold text-ink">{children}</h1>;
}
