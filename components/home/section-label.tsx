import type { ReactNode } from "react";

/**
 * Home's section headings are quiet (small uppercase labels), so the big "Bill Splitter" and the
 * new-bill cards lead, and the lists below read as supporting detail.
 */
export function SectionLabel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="type-label text-ink-muted">
      {children}
    </h2>
  );
}
