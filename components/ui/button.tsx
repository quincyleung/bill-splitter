import type { ComponentProps } from "react";

type ButtonProps = Omit<ComponentProps<"button">, "className"> & {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border-2 border-accent bg-surface text-accent hover:bg-accent-soft",
};

/** Defaults to type="button"; pass type="submit" for a form's main action. */
export function Button({ variant = "primary", fullWidth = false, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`} {...props} />
  );
}
