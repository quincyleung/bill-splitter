import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  /** Use "section" or "article" when the card has its own heading. */
  as?: "div" | "section" | "article";
};

export function Card({ children, as: Tag = "div" }: CardProps) {
  return <Tag className="rounded-2xl border border-line bg-surface p-4">{children}</Tag>;
}
