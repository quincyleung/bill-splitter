import type { ReactNode } from "react";

/** The page's one h1, in Marcellus. */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="type-heading text-ink">{children}</h1>;
}
