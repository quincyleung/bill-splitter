// A round 44px button showing just an icon, like ⋯ or the trash can. Its name is
// still real text (visually hidden), e.g. "Delete item 2", so screen readers say what
// it does. The icon itself is decorative.

import type { ComponentProps, ReactNode } from "react";

type IconButtonProps = Omit<ComponentProps<"button">, "className" | "children"> & {
  /** What it does, read by screen readers, e.g. "Delete item 2". */
  label: string;
  icon: ReactNode;
};

export function IconButton({ label, icon, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className="press inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-accent-soft"
      {...props}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}
