import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  /** Use "section" or "article" when the card has its own heading. */
  as?: "div" | "section" | "article";
};

/**
 * Greek Summer: soft 20px corners and a thin limestone line instead of a shadow.
 * relative, so something can sit in its corner (like an item's ⋯).
 */
export function Card({ children, as: Tag = "div" }: CardProps) {
  return <Tag className="relative rounded-card border border-line bg-surface p-5">{children}</Tag>;
}
