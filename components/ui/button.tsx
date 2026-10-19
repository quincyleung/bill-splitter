import type { ComponentProps } from "react";

export type ButtonVariant = "primary" | "secondary";

type ButtonProps = Omit<ComponentProps<"button">, "className"> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border-2 border-accent bg-surface text-accent hover:bg-accent-soft",
};

/** Shared with ButtonLink so links that act like buttons look the same. */
export function buttonClass(variant: ButtonVariant, fullWidth = false) {
  return `${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`;
}

/** Defaults to type="button"; pass type="submit" for a form's main action. */
export function Button({ variant = "primary", fullWidth = false, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, fullWidth)} {...props} />;
}
