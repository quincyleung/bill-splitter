import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

/** Stand-in for a screen that a later step builds. Says what will go there, per flows.md. */
export function PagePlaceholder({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <div className="mt-4">
        <Card>
          <p className="text-base text-ink">{children}</p>
          <p className="mt-2 text-sm text-ink-muted">Placeholder: this screen is built in a later step.</p>
        </Card>
      </div>
    </>
  );
}
