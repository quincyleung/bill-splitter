import Link from "next/link";
import type { ComponentProps } from "react";
import { type ButtonVariant, buttonClass } from "./button";

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

/** A link that looks like a Button, for navigation such as "Back to Home". */
export function ButtonLink({ variant = "primary", fullWidth = false, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, fullWidth)} {...props} />;
}
